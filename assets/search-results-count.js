(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('search-results-count', class extends  baseComponent.default {
      render() {
        this.listenTo('filterChange', (e, data) => {
          this._update(data.html)
        })
      };
  
      _update(html) {
        const searchResultSource = new DOMParser().parseFromString(html, 'text/html').querySelector('search-results-count');
        this.replaceChildren(...searchResultSource.childNodes);
      };
  
    });
  })();