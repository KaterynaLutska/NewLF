(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('product-price', class extends baseComponent.default {
        
    render() {
      this.listenTo('variantChange', (e, data) => {
        this._update(data.html);
        this.style.display = 'block'  
      })
      this.listenTo('sellingPlanChange', (e, data) => {
        this._update(data.html);
      })
    };
    _update(html) {
      const source = html.querySelector('product-price');
      // console.log(source.innerHTML);
      // this.innerHTML = source.innerHTML;
      this.replaceChildren(...source.cloneNode(true).childNodes);
    };
  });
})();