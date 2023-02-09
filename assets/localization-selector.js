const closeSelector = selector => selector.removeAttribute('open');

(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('localization-selector', class extends baseComponent.default {
        elements = {
            trigger: '[data-trigger]',
            form: 'form'
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
            this.$form.submit();
        }

        _closeForeignSelector(selector) {
            if(selector !== this)
                closeSelector(selector)
        }
    })
})();

document.addEventListener('click', e => {
    document.querySelectorAll('localization-selector')
        .forEach(closeSelector)
});
