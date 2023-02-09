(async () => {
    const { debounce, parseHTML } = await import(window.theme.modules.utils);
    const baseComponent = await import(window.theme.modules.baseComponent);
    customElements.define('predictive-search-input', class extends baseComponent.default {
        elements = {
            input: 'input[name="q"]',
            results: '[data-results]'
        }

        minChars = 3;
        
        render() {
            this.sources = this.getAttribute('sources').split(',').filter(Boolean);
            this.$input.setAttribute('autocomplete', 'off');
            this.$input.focus();
            this.$input.addEventListener('input', debounce(this._inputHandler.bind(this), 300).bind(this));
        }

        _inputHandler(e) {
            this.searchQuery = this.$input.value.trim();

            this.searchQuery.length >= this.minChars
                ? this._getSearchResults()
                : this._cleanResults();
        }   

        _getSearchResults() {
            const query   = `q=${window.encodeURIComponent(this.searchQuery)}`;
            const type    = `${window.encodeURIComponent('resources[type]')}=${this.sources.join(',')}${this.hasAttribute('only-stock-products') ? `resources[options][unavailable_products]=hide` : ''}`;
            const limit   = `${window.encodeURIComponent('resources[limit]')}=${this.getAttribute('results-limit')}`;
            const section = 'section_id=predictive-search';

            fetch(`${window.theme.routes.predictiveSearch}?${[query, type, limit, section].join('&')}`)
                .then(res => {
                    if(res.ok) {
                        return res.text();
                    }
                })
                .then(text => {
                    const resultsMarkup = parseHTML(text).querySelector('#shopify-section-predictive-search');
                    if (resultsMarkup) {
                        this.$results.replaceChildren(resultsMarkup);
                    } else {
                        this._cleanResults();
                    }
                })
        }
        _cleanResults() {
            this.$results.replaceChildren();
        }
    });
})()