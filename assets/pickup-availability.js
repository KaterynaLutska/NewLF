(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('pickup-availability', class extends baseComponent.default {

      render() {
        this.listenTo('variantChange', (e, data) => {
          this._update(data.html);
        })
      };
      _update(html) {
        const source = html.querySelector('pickup-availability');
        this.replaceChildren(...source.cloneNode(true).childNodes);
      };

  });
})();
