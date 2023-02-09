(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);
  // const Swiper = await import(window.theme.modules.swiper);

  customElements.define('slideshow-gallery', class extends baseComponent.default {
    elements = {
      sliderContainer: '[data-slider-container]',
      nextButton: '[data-slider-button-next]',
      prevButton: '[data-slider-button-prev]',
      pagination: '[data-slider-pagination]'
    };

    render() {
      const navType = this.getAttribute('navigation-type');
      const delay = this.getAttribute('autoplay-delay') * 1000;
      const autoplay = this.hasAttribute('use-autoplay') && {delay};
      const usePagination = navType === 'pagination' || navType === 'pagination_buttons';
      const pagination = usePagination && {el: this.$pagination};
      const useButtons = navType === 'buttons' || navType === 'pagination_buttons';
      const navigation = useButtons && {
        nextEl: this.$nextButton,
        prevEl: this.$prevButton
      };
      
      this.swiper = new window.Swiper(this.$sliderContainer, {
        delay,
        autoplay,
        pagination,
        navigation
      });
    }

  });
})();