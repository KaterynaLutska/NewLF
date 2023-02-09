(async () => {
    
    const {
        // updateURLParams,
        historyPush
    } = await import(window.theme.modules.utils);

    
  
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('active-tag-filter', class extends baseComponent.default {
      elements = {
        link: 'a'
      }

      render() {
        this.url = this.$link.href;
        this.addEventListener('click', e => {
          e.preventDefault();
          this._onActiveFilterClick();
        })
      };
  
      _onActiveFilterClick() {        
        this.trigger('filterUpadting');
        historyPush(this.url);
        this._fetchChanges(this.url);
      };
  
      _fetchChanges(url) {
        fetch(url)
          .then(res => res.text())
          .then((text) => {
            const html = text;
            this.forwardEvent('filterChange', {
              html: html,
              src: 'active-filters'
            });
          })
          .catch(e => console.error(e));
      };
    });
  })();
  