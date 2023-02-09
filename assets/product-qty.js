(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-qty', class extends baseComponent.default {
    
    render() {
      this.currentVariant = +this.getAttribute('variant-id');
      this.listenTo('variantChange', (e, data) => {
        this.currentVariant = data.variant.id;

        this._rerender(data)
      })
      this.listenTo('qtyStatusUpdate', (e, data) => {
        if (this.currentVariant === +data.variantId) {
          this._rerender(data)
        }
      }, false)
    };

    _rerender(data) {
      const source = data.html.querySelector('product-qty');
      const selectedOption = this.querySelector('select')?.value;
      if (selectedOption) {
        const optionToSelect = source.querySelector(`option[value="${selectedOption}"]`);
        optionToSelect && optionToSelect.setAttribute('selected', true);
      }
      this.replaceChildren(...source.cloneNode(true).childNodes);
    }
    
  });
})();