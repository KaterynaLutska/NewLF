(async () => {

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('main-header-sticky', class extends baseComponent.default {
        onIntersect(intersecting) {
            this.trigger('stickyMainHeader', {
                sticky: !intersecting
            })
        }
    })
})();