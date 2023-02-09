(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('hero-video', class extends baseComponent.default {
        render() {
            this.on('popupOpened', () => {
                this.trigger('stopVideoBg');
            });
            this.on('popupClosed', () => {
                this.trigger('playVideoBg');
            })
        }
    })
})();