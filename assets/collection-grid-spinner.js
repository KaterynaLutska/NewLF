(async () => {
    const { 
        setActive,
        unsetActive
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('collection-grid-spinner', class extends baseComponent.default {
        render() {
            this.on('filterUpadting', () => setActive(this));
            this.on('filterChange', () => unsetActive(this));
            this.on('sortChange', () => unsetActive(this));
        }
    })
})();