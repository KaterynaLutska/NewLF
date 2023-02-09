(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('search-grid', class extends baseComponent.default {
  
      render() {
        this.listenTo('filterChange', (e, data) => {
          this._update(data.html)
        });
        
        this.listenTo('sortChange', (e, data) => {
          this._update(data.html)
        });
        
      };
  
      _update(html) {
        const productGridSource = new DOMParser().parseFromString(html, 'text/html').getElementById('SearchGrid');
        this.replaceChildren(...productGridSource.childNodes);
      };
  
    });
  })();