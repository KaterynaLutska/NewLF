(async () => {
  const {
    updateURLParams,
    historyPush,
    parseHTML
  } = await import(window.theme.modules.utils);
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-form', class extends baseComponent.default {
    elements = {
      form: 'form',
      addButton: '[data-add-button]',
      buyButton: '[data-buy-button]',
      content: '[data-content]',
      input: '[data-variant-id-input]',
      sellingPlanInput: 'input[name="selling_plan"]'
    };
    async render() {
      this._enableInput();
      this.cartSection = document.querySelector('main-cart');
      this.isProductPage = this.getAttribute('page-type') === 'product';
      this.listenTo('variantChange', (e, data) => {
        this._rerender(data);
        if (data.variant) {
          this._rerenderVariantInput(data)
        }
      });
      this.on('cartChange', (e, data) => {
        this._updateQtyStatus(data.variantId)
      }, false)
      if (this.hasAttribute('cart-popup'))
        this.$form.addEventListener('submit', this._handleSubmit.bind(this));
      
      if (this.$sellingPlanInput && this.hasAttribute('selling-plan-enable')) {
        this.currentSellingPlanId = this.querySelector('input[name="selling_plan"]').value;
        const {observeInputValueChange} = await import(window.theme.modules.sellingPlanUtil);
        observeInputValueChange(this.$sellingPlanInput, this._handleSellingPlanChange.bind(this));
      }
    };
    
    _handleSellingPlanChange(newSellingPlanId) {
      if (newSellingPlanId === this.currentSellingPlanId) 
        return;      
      this.currentSellingPlanId = newSellingPlanId;
      const { queryURL, currentURL } = updateURLParams({ 'selling_plan': this.currentSellingPlanId, 'variant': this.getAttribute('current-variant') }, this.sectionId);
      if (this.isProductPage)
        historyPush(currentURL);
      this._fetchPageWithVariant(queryURL, html => {
        this.forwardEvent('sellingPlanChange', {
          html: html
        })
      }); 
    };

    _enableInput() {
      this.$input.disabled = false;
    }
    
    _fetchPageWithVariant(url, onResponse) {
      return fetch(url)
      .then(response => response.text())
      .then(responseText => {
        const html = parseHTML(responseText)
        onResponse(html);
      });
    };

    _rerender(data) {
      const source = data.html.querySelector(`#${this.getAttribute('form-id')} [data-content]`);
      this.$content.replaceChildren(...source.cloneNode(true).childNodes);
      this._rerenderPaymentButton();
    };
    _rerenderVariantInput(data) {
      this.setAttribute('current-variant', `${data.variant.id}`);
      const value = data.html.querySelector(this.elements.input).value;
      this.$input.value = value;
    };
    _rerenderPaymentButton() {
      if (window.Shopify?.PaymentButton?.init) {
        window.Shopify.PaymentButton.init();
      }
    };
    _handleSubmit(e) {
      e.preventDefault();
      this.formData = new FormData(e.target);
      this._addToCartRequest();
    };

    _addToCartRequest() {
      this._setLoading(true);
      fetch(`${window.routes.cart_add_url}.js`, {
        method: 'POST',
        headers: {
          "Accept": "application/javascript"
        },
        body: this.formData
      })
      .then(res => {
        return res.json();
      })
      .then(() => {
        this.trigger('updateCart', {
          callback: () => {
            this._setLoading(false);
            this._updateQtyStatus(this.formData.get('id'));
            if(this.cartSection) {
              this.cartSection.update();
            } else {
              this.trigger('openPopup', { target: 'CART' });
            }
          }
        })
      })
      .catch(error => {
        this._setLoading(false);
        console.log(error);
      });
      if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function'){
  setTimeout(function(){
        BOLD.common.eventEmitter.emit('BOLD_COMMON_cart_loaded');
  },500);
}
    };

    _updateQtyStatus(variantId) {
      const url = `${this.getAttribute('product-url')}?variant=${variantId}&section_id=${this.getAttribute('section-id')}`;
      this._fetchPageWithVariant(url, html => {
        this.trigger('qtyStatusUpdate', {html: html, variantId: variantId})
        this._rerender({html: html})
      })
    };
    
    _setLoading(status) {
      status 
        ? this.$addButton.setAttribute('loading', '')
        : this.$addButton.removeAttribute('loading');
      // status ? this.$addButton.setAttribute('disabled', true) :
      //   this.$addButton.removeAttribute('disabled');
      // this.$addButton.textContent = status ? window.theme.i18n.loading : window.theme.i18n.addToCart;
    };
  });
})();