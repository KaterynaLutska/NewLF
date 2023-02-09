(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-option-picker', class extends baseComponent.default {
    elements = {
      variantsJSON: '[data-variants-json]',
      optionsJSON: '[data-options-with-values]',
      value: '[data-swatch-value]'
    };
    
    render() {
      this.isProductPage = this.getAttribute('page-type') === 'product';
      this.variantsData = JSON.parse(this.$variantsJSON.textContent);
      this.optionsWithValues = JSON.parse(this.$optionsJSON.textContent);
      this._getDefaultVariant();
      this._checkUnavailable();
      this.addEventListener('change', this._variantChangeHandler);
    };

    _getDefaultVariant() {
      this.variant = this.variantsData.find(v => v.id === +this.getAttribute('current-variant'));
    };

    _checkUnavailable() {
      this.optionsWithValues.map((option, i) => {
        let variantOptionsCase = [...this.variant.options];
        option.values.map(optionValue => {
          variantOptionsCase[i] = optionValue;
          const match = this.variantsData.find(variant => variant.options.toString() === variantOptionsCase.toString());
          this._toggleOption(optionValue, i, !match);   
        })
      })
    };

    _toggleOption(option, i, disable) {
      const elToDisable = document.querySelector(`[data-option-value="${option}"][data-option-position="${i+1}"]`);
      const inputToDisable = elToDisable.querySelector('input');
      elToDisable.style.outline = disable ? '2px solid red' : '';
      disable ? inputToDisable.setAttribute('data-unavailable', '') : inputToDisable.removeAttribute('data-unavailable', '');
    };

    _variantChangeHandler(e) {
      if (e.target.hasAttribute('data-unavailable')) 
        this._findAvailableVariant(e.target);
      this._updateSwatchLable(e.target);
      // this.variant = this.variantsData.find(variant => variant.options.includes(e.target.value));
      this._updateURL();
      this._checkUnavailable();
      this._fetchPageWithVariant(html => {
        this.forwardEvent('variantChange', {
          html: html,
          variant: this.variant
        })
      });  
    };

    _findVariantByOptions() {
      this.variant = this.variantsData.find(variant =>
        variant.options.every((option, i) => option === this.options[i])
      );
    };

    _findAvailableVariant(target) {
      const index = target.dataset.optionsPosition - 1;
      const value = target.value;
      this.variant = this.variantsData.find(variant => variant.options[index] === value);
      this._selectCurrentVariant()
    };

    _selectCurrentVariant() {
      this.variant.options.map((option, i) => {
        const input = document.querySelector(`[value="${option}"][data-options-position="${i+1}"]`);
        // const input = document.querySelector(`[value="${option}"][name="${this.variant.options[i].name}"]`);
        input.checked = true;
        this._updateSwatchLable(input)
      }) 
    };

    _updateSwatchLable(swatchInput) {
      swatchInput.closest('product-variant-swatch').querySelector('[data-swatch-value]').textContent = swatchInput.value;
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

    _fetchPageWithVariant(onResponse) {
      return fetch(`${this.getAttribute('url')}?variant=${this.variant.id}&section_id=${this.getAttribute('section-id')}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        onResponse(html);
      });
    };
    
  });

})();