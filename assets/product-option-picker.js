(async () => {
  const {
    updateURLParams,
    historyPush,
    parseHTML
  } = await import(window.theme.modules.utils);
  
  const isEqual = (arr1, arr2) => arr1.toString() === arr2.toString();
  const parseJSON = (el) => JSON.parse(el.textContent)
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-option-picker', class extends baseComponent.default {
    elements = {
      variantsJSON: '[data-variants-json]',
      optionsJSON: '[data-options-with-values]'
    };
    
    render() {
      console.log('options');
      this.isProductPage = this.getAttribute('page-type') === 'product';
      this.variantsData = parseJSON(this.$variantsJSON);
      this.optionsData = parseJSON(this.$optionsJSON);
      this._getDefaultVariant();
      this._checkUnavailable();
      this.addEventListener('change', this._variantChangeHandler);
    };

    _getDefaultVariant() {
      this.variant = this.variantsData.find(v => v.id === +this.getAttribute('current-variant'));
    };

    _checkUnavailable() {
      this.optionsData.map((option, i) => {
        let optionsToCheck = [...this.variant.options];
        option.values.map(optionValue => {
          optionsToCheck[i] = optionValue;
          const match = this._findVariantByOptions(optionsToCheck);
          this._toggleOption(option.name, optionValue, !match);   
        })
      })
    };

    _toggleOption(name, value, disable) {
      const targetInput = this.querySelector(`[name="${name}"][value="${value}"`);
      // if (disable) {
      //   targetInput.labels[0].style.outline = '2px solid red';
      //   targetInput.setAttribute('data-unavailable', '');
      //   return;
      // }
      // targetInput.labels[0].style.outline = '';
      // targetInput.removeAttribute('data-unavailable');
      disable
        ? targetInput.setAttribute('data-unavailable', '')
        : targetInput.removeAttribute('data-unavailable');
    };

    _variantChangeHandler(e) {
      this._selectVariantByOption(e.target);
      const { queryURL, currentURL } = updateURLParams({ 'variant': this.variant.id }, this.sectionId);
      if (this.isProductPage) historyPush(currentURL);
      this._checkUnavailable();
      this._fetchPageWithVariant(queryURL, (html) => {
        this.forwardEvent('variantChange', {
          html: html,
          variant: this.variant
        })
      });  
    };

    _selectVariantByOption(target) {
      let valueIndex = this.optionsData.findIndex(option => option.name === target.name);
      if (target.hasAttribute('data-unavailable')) {
        this.variant = this.variantsData.find(variant => variant.options[valueIndex] === target.value);
        this._toogleInputs(target)
      } else {
        let optionsToFind = [...this.variant.options];
        optionsToFind[valueIndex] = target.value;
        this.variant = this._findVariantByOptions(optionsToFind);
        this._updateSwatchLable(target)
      }
    };

    _toogleInputs() {
      this.variant.options.map((option, i) => {
        const input = this.querySelector(`input[value="${option}"][name="${this.optionsData[i].name}"]`);
        input.checked = true;
        this._updateSwatchLable(input)
      }) 
    };

    _findVariantByOptions(options) {
      return this.variantsData.find(variant => isEqual(variant.options, options));
    };

    _updateSwatchLable(swatchInput) {
      swatchInput.closest('product-variant-swatch').querySelector('[data-swatch-value]').textContent = swatchInput.value;
    };

    _updateURL() {
      if (!this.isProductPage) return;
      const { currentURL } = updateURLParams({ 'variant': this.variant.id });
      historyPush(currentURL);
    };

    _fetchPageWithVariant(url, onResponse) {
      console.log('fetching variant');
      this.forwardEvent('variantLoading');
      return fetch(url)
      .then(response => response.text())
      .then(responseText => {
        const html = parseHTML(responseText)
        onResponse(html);
      });
    };    
  });
})();