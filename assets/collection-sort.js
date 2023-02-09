(async () => {
  const {
    updateURLParams,
    historyPush
  } = await import(window.theme.modules.utils);

  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('collection-sort', class extends baseComponent.default {
    elements = {
      select: 'select'
    };

    render() {
      this.$select.addEventListener('change', this._onChangeHandler.bind(this));
    };

    _onChangeHandler() {
      const { queryURL, currentURL } = updateURLParams(
        {
          sort_by: this.$select.value
        },
        // Object.fromEntries(new FormData(this.$select.form)), 
        this.getAttribute('section-id')
      );
      this.trigger('filterUpadting');
      this._fetchChanges(queryURL);
      historyPush(currentURL);
    }; 
    
    _fetchChanges(url) {
      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          this.forwardEvent('sortChange', {
            html: responseText
          });
        });
    };

    _updateURL(searchParams) {
      window.history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }

  });
})();