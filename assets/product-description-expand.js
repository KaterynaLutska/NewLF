const NAMESPACE = 'product-description-expand';

(async () => {
    const { 
        showElement,
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define(NAMESPACE, class extends baseComponent.default {
        elements = {
            content: '[data-content]',
            link: '[data-expand-link]'
        }

        expandThreshold = 100; 

        render() {
            const contentHeight = this.$content.offsetHeight;
            if(contentHeight > this.expandThreshold * 1.25) {
                this.style.setProperty(`--${NAMESPACE}-height`, `${this.expandThreshold}px`);
                showElement(this.$link);
                this.$link.addEventListener('click', () => {
                    this.toggleAttribute('expanded');
                })
            }
        }
    });
})();