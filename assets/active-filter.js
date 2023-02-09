(async () => {
  const {
      updateURLParams,
      historyPush
  } = await import(window.theme.modules.utils);

  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('active-filter', class extends baseComponent.default {

    render() {
      this.addEventListener('click', e => {
        e.preventDefault();
        // this.style.display = 'none';
        this._onActiveFilterClick(e);
      })
    };

    _onActiveFilterClick(e) {
      e.preventDefault();
      this.trigger('filterUpadting');
      if(this.hasAttribute('price')) {
        this.trigger('resetPriceFilter');
      }
      const url = window.location.origin + this.getAttribute('url');
      const { queryURL } = updateURLParams({}, this.sectionId, url);
      this._fetchChanges(queryURL);
      historyPush(url);
    };

    _fetchChanges(url) {
      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          const html = responseText;
          this.forwardEvent('filterChange', {
            html: html,
            src: 'active-filters'
          });
        });
    };
  });
})();
