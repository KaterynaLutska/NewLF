(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('collection-grid-count', class extends  baseComponent.default {
    render() {
      this.listenTo('filterChange', (e, data) => {
        this._update(data.html)
      })
    };

    _update(html) {
      const productGridSource = new DOMParser().parseFromString(html, 'text/html').querySelector('collection-grid-count');
      this.replaceChildren(...productGridSource.childNodes);
    };

  });
})();