(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('stock-alert', class extends baseComponent.default {
    
    render() {
      this.listenTo('variantChange', (e, data) => {
        if (!data.variant) {
          this.style.display = 'none'  
          return
        }
        this._update(data.html);
        // this.updateInnerHTML(data.html);
      })
    };

    _update(html) {
      // console.log(html);
      const source = html.querySelector('stock-alert');
      this.replaceChildren(...source.cloneNode(true).childNodes);
    };
  });
})();