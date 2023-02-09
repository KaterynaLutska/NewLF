(async () => {
  const {
    updateURLParams,
    historyPush
  } = await import(window.theme.modules.utils);

  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('collection-filters-form', class extends baseComponent.default {
    elements = {
        form: 'form'
    };
    
    render() {
      this.listenTo('filterChange', (e, data) => {
        if (data.src !== 'filters') {
          this._renderFilters(data.html)
        }
      })
      this.$form.addEventListener('change', this._onSubmitHandler.bind(this))
    };

    _onSubmitHandler(e) {
      e.preventDefault();
      this.trigger('filterUpadting')
      const { queryURL, currentURL } = updateURLParams(
        new FormData(this.$form),
        this.sectionId
      );
      this._fetchChanges(queryURL);
      historyPush(currentURL); 
    };
    
    _fetchChanges(url) {
      fetch(url)
        .then(response => response.text())
        .then(responseText => {
          const html = responseText;
          this._renderFilters(html);
          this.forwardEvent('filterChange', {
            html: html,
            src: 'filters'
          });
        });
    };

    _renderFilters(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      Array.from(this.querySelectorAll('[data-contents]')).map(contentsItem => {
        const contentTarget = parsedHTML.querySelector(`[data-contents="${contentsItem.dataset.contents}"]`);
        contentsItem.replaceWith(contentTarget);
      });
    };
  });
})();
