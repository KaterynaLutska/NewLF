(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('cart-item', class extends baseComponent.default {
    elements = {
      plusButton: '[data-inc]',
      minusButton: '[data-dec]',
      removeButton: '[data-remove]',
      qtyInput: '[data-input]',
      linePrice: '[data-total]'
    }

    render() {
      this.sectionId = this.getAttribute('section-id');
      this.lineIndex = this.getAttribute('line-item-index');
      this.variantId = this.getAttribute('cart-item-variant-id');
      this.qtyValue = +this.$qtyInput.value;
      this.variantQtyLimit = +this.$qtyInput.max;
      this._handleInteractions();
    };

    _handleInteractions() {
      this.$plusButton.addEventListener('click', () => this._validateInput(1));
      this.$minusButton.addEventListener('click', () => this._validateInput(-1));
      this.$qtyInput.addEventListener('change', () => this._validateInput());
      this.$removeButton.addEventListener('click', this._removeItem.bind(this));
    };

    _validateInput(input) {
      const value = input ? this.qtyValue + input : +this.$qtyInput.value;
      if (value < 1 || value > this.variantQtyLimit) {
        // alert('Incorrect quantity!')
        this.$qtyInput.value = this.qtyValue;
        return
      }
      this.qtyValue = value;
      this._updateUI();
      this._updateCartRequest(value);
    };

    _removeItem(e) {
      e.preventDefault();
      this._updateCartRequest(0);
    };

    _updateUI() {
      this._updateInputValue();
      this._updateButtons();
    };
    
    _updateInputValue() {
      this.$qtyInput.value = this.qtyValue;
    };

    _updateButtons() {
      this.$plusButton.disabled = this.qtyValue === this.variantQtyLimit;
      this.$minusButton.disabled = this.qtyValue === 1;
    };

    _updateCartRequest (qty) {
      const body = JSON.stringify({
        id: this.variantId,
        quantity: qty,
        sections: this.sectionId,
        sections_url: window.location.pathname
      });
      const fetchConfig = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': `application/json` }
      };
      fetch(`${routes.cart_change_url}`, {...fetchConfig, ...{ body }})
        .then((response) => {
          return response.json();
        })
        .then((state) => {
          const html = state.sections[this.sectionId];
          const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
          this._acceptChanges(parsedHtml, qty);
        })
        .catch((e) => { console.error(e)});
    };

    _acceptChanges(html, qty) {
      this.forwardEvent('cartChange', {
        html: html,
        remove: qty === 0
      });
      if (qty === 0) {
        this.remove();
        return;
      }
      this._updateLinePrice(html);
    };

    _updateLinePrice(html) {
      const source = html.querySelector(`[data-total="${this.variantId}"]`);
      this.$linePrice.replaceChildren(...source.childNodes);
    };
  });
})();