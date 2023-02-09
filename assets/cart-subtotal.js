(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('subtotal-price', class extends baseComponent.default {
    render() {
      this.listenTo('cartChange', (e, data) => {
        const source = data.html.querySelector('subtotal-price');
        this.replaceChildren(...source.childNodes);
      })
    };
  });
})();