const closeSelector = selector => selector.removeAttribute('open');

(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('form-custom-select', class extends baseComponent.default {
        elements = {
            trigger: '[data-trigger]',
            tritterText: '[data-trigger-text]'
        }

        render() {
            this.$trigger.addEventListener('click', this._handleTriggerClick.bind(this));
            this.addEventListener('change', this._handleInputChange.bind(this));
        }

        _handleTriggerClick(e) {
            e.stopPropagation();
            this.toggleAttribute('open');
            document.querySelectorAll(this.tagName)
                .forEach(this._closeForeignSelector.bind(this))
        }

        _handleInputChange(e) {
            this.$tritterText.innerText = e.target.value; 
        }

        _closeForeignSelector(selector) {
            if(selector !== this)
                closeSelector(selector)
        }
    })
})();

document.addEventListener('click', e => {
    document.querySelectorAll('form-custom-select')
        .forEach(closeSelector)
});
