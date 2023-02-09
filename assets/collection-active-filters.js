(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('collection-active-filters', class extends baseComponent.default { 
    render() {
      this.listenTo('filterChange', (e, data) => {
        this._update(data.html)
      })
    };

    _update(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html')
      const activeFacetsElement = parsedHTML.querySelector('collection-active-filters');
      if (!activeFacetsElement) return;
      this.replaceChildren(...activeFacetsElement.childNodes);
    };
  });
})();