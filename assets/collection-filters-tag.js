(async () => {
    const {
        updateURLParams,
        historyPush
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('collection-filters-tag', class extends baseComponent.default {
        elements = {
            link: '[data-link] > a'
        }
        render() {
            this.url = this.$link.href;
            console.log(this.url);
            
            this.addEventListener('click', e => {
                e.preventDefault();
                // this.$input.checked = !this.$input.checked;
                this._changeHandler();
            })
            // this.$input.addEventListener('change', this._changeHandler.bind(this));
        }
        _changeHandler() {
            this.trigger('collectionTagFilterUpdate', {
                url: this.url
            });
        }
    })

    customElements.define('collection-filters-tag-wrapper', class extends baseComponent.default {
        render() {
            this.on('collectionTagFilterUpdate', (e, data) => {
                this.trigger('filterUpadting');
                this._fetchChanges(data.url);
                historyPush(data.url);
            })
            this.on('filterChange', (e, data) => {
                const parsedHTML = new DOMParser().parseFromString(data.html, 'text/html')
                const activeFacetsElement = parsedHTML.querySelector('collection-filters-tag-wrapper');
                this.replaceChildren(...activeFacetsElement.childNodes);
            })
        }
        _fetchChanges(url) {
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    this.trigger('filterChange', {
                        html: text,
                        src: 'tag-filters'
                    })
                })
        }
    })
})();