(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-variant-swatch', class extends baseComponent.default {
    elements = {
      productJSON: '[data-product-json]',
      value: '[data-swatch-value]',
      group: '[data-swatch-group]'
    }

    render() {
      this.isProductPage = this.getAttribute('page-type') === 'product';
      this.productData = JSON.parse(this.$productJSON.textContent);
      this._getDefaultVariant();
      this.options = [].concat(this.variant.options);
      this.$group.addEventListener('change', this._variantChangeHandler.bind(this))
    };
    
    _getDefaultVariant() {
      this.variant = this.productData.variants.find(v => v.id === +this.getAttribute('current-variant'));
    };

    _variantChangeHandler(e) {
      this._updateUi(e)
      this._updateOptions(e.target);    
      this._findVariantByOptions();
      this._updateURL();
      this.forwardEvent('variantChange', this.variant)
    };

    _updateUi(e) {
      this.$value.textContent = e.target.value;
    };

    _updateOptions(option) {
      this.options[this.getAttribute('option-position') - 1] = option.value;
    };

    _findVariantByOptions() {
      this.variant = this.productData.variants.find(variant => 
        variant.options.every((option, i) => option === this.options[i])  
      );    
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
  });
})();