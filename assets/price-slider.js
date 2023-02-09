(async () => {
    const { 
        loadScript,
        loadStyle,
        updateURLParams,
        historyPush
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('price-slider', class extends baseComponent.default {
        elements = {
            slider: '[data-slider]',
            min: '[data-min]',
            max: '[data-max]',
            inputMin: '[data-input-min]',
            inputMax: '[data-input-max]'
        }

        async render() {
            await this._initSlider();
            this.slider.on('change', ([min, max]) => {
                const { queryURL, currentURL } = updateURLParams({
                    'filter.v.price.gte': Math.round(min),
                    'filter.v.price.lte': Math.round(max)
                }, this.sectionId);
                this.trigger('filterUpadting');
                this._fetchChanges(queryURL);
                historyPush(currentURL);
            })
            this.slider.on('set', ([min, max]) => {
                this.$inputMin.value = Math.round(min);
                this.$inputMax.value = Math.round(max);
            })
            this.on('resetPriceFilter', this._reset.bind(this));
        }

        async _initSlider() {
            loadStyle('https://cdn.jsdelivr.net/npm/nouislider@15.4.0/dist/nouislider.min.css');
            if(!window.noUiSlider) {
                await loadScript('https://cdn.jsdelivr.net/npm/nouislider@15.4.0/dist/nouislider.min.js');
            }
            this.slider = window.noUiSlider.create(this.$slider, {
                start: [+this.getAttribute('current-min'), +this.getAttribute('current-max')],
                connect: true,
                range: {
                    min: +this.getAttribute('min'),
                    max: +this.getAttribute('max')
                }
            })
        }

        _fetchChanges(url) {
            fetch(url)
                .then(response => response.text())
                .then((responseText) => {
                        const html = responseText;
                        this._updatePrices(html);
                        this.forwardEvent('filterChange', {
                            html: html,
                            src: 'price'
                    });
                });
        }
        _updatePrices(html) {
            const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
            const min = parsedHTML.querySelector(this.elements.min);
            const max = parsedHTML.querySelector(this.elements.max);
            this.$min.replaceChildren(...min.childNodes);
            this.$max.replaceChildren(...max.childNodes);
        }
        _reset() {
            this.slider.set([+this.getAttribute('min'), +this.getAttribute('max')]);
            this._setDefault(this.$min);
            this._setDefault(this.$max);
        }
        _setDefault(el) {
            el.innerText = el.dataset.defaultValue;
        }
    })
})();
