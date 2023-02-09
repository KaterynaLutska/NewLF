(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);
    const { debounce, parseHTML } = await import(window.theme.modules.utils);

    customElements.define('search-popup', class extends baseComponent.default {
        elements = {
            input: '[data-input]',
            results: '[data-results]'
        }
        
        render() {
            this.$input.focus();
            this.$input.addEventListener('input', debounce(this._inputHandler.bind(this), 300).bind(this));
        }

        _inputHandler(e) {
            this.searchQuery = this.$input.value.trim();
            this._getSearchResults();
        }   

        _getSearchResults() {
            const query   = `q=${window.encodeURIComponent(this.searchQuery)}`;
            const type    = `${window.encodeURIComponent('resources[type]')}=product`;
            const limit   = `${window.encodeURIComponent('resources[limit]')}=4`;
            const section = 'section_id=predictive-search';

            fetch(`${window.theme.routes.predictiveSearch}?${[query, type, limit, section].join('&')}`)
                .then(res => {
                    if(res.ok) {
                        return res.text();
                    }
                    console.error(res.status);
                })
                .then(text => {
                    const resultsMarkup = parseHTML(text).querySelector('#shopify-section-predictive-search');
                    console.log(resultsMarkup);
                    if (resultsMarkup) {
                        this.$results.replaceChildren(resultsMarkup);
                    } else {
                        this.$results.replaceChildren();
                    }
                })
        }
    })
})();