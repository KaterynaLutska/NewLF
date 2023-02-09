(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-variant-picker', class extends baseComponent.default {
    elements = {
        select: '[data-select]',
        productJSON: '[data-product-json]'
    };
    
    render() {
      this.isProductPage = this.getAttribute('page-type') === 'product';
      this.productData = JSON.parse(this.$productJSON.textContent);
      this.addEventListener('change', (e) => {
        this.variant = this.productData.variants.find(variant => variant.id === +e.target.value);
        this._updateURL();
        if (this.variant) {
          this._fetch();
        }
        
        this.forwardEvent('variantChange', this.variant);
      })
      
    };
    _updateURL() {
      if (!this.isProductPage) return;
      this._updateUrlParam();
    };
    _updateUrlParam() {
      if (this.variant?.id) {
        this._handleUrlParams('has') ? this._handleUrlParams('set', this.variant.id) : this._handleUrlParams('append', this.variant.id);
      } else {
        this._handleUrlParams('delete');
      }
    };
    _handleUrlParams = (fn, value) => {
      let url = new URL(window.location.href);
      if (fn === 'has')
        return url.searchParams[fn]('variant');
      url.searchParams[fn]('variant', value);
      window.history.pushState('', '', url.toString());
    };
    _fetch() {
      this.forwardEvent('variantLoading');
      fetch(`${this.getAttribute('url')}?variant=${this.variant.id}&section_id=${this.getAttribute('section-id')}`)
      .then((response) => response.text())
      .then((responseText) => {
        this.html = new DOMParser().parseFromString(responseText, 'text/html')
        this.forwardEvent('variantChangeHtml', {
          html: this.html
        });
      });
    }
  });
})();