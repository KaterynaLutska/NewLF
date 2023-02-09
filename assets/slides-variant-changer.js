(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('slides-variant-changer', class extends baseComponent.default {
    elements = {
      slideShow: 'slide-show'
    }

    render() {
      if (!this.$slideShow) return;
      this.listenTo('variantChange', (e, data) => {
          if (!data.variant.featured_media) return;
          this.$slideShow.slideTo(data.variant.featured_media.position-1);
      })
    }

  });
})();