(async () => {
  const { 
    loadScript,
    loadStyle
  } = await import(window.theme.modules.utils);

  const baseComponent = await import(window.theme.modules.baseComponent);

  const isChromeForIOs145 = () => {
    const userAgent = window.navigator.userAgent;
    const isChromeForIOs = /CriOS/i.test(userAgent);
    if (isChromeForIOs) {
      const iOsMatch = userAgent.match(
        /(.+)(iPhone|iPad|iPod)(.+)OS[\s|\_](\d+)\_?(\d+)?[\_]?(\d+)?.+/i
      );
      if (iOsMatch && iOsMatch.length >= 6) {
        const iOsVersionMajor = parseInt(iOsMatch[4], 10);
        const iOsVersionMinor = parseInt(iOsMatch[5], 10);
        if (iOsVersionMajor >= 14 && iOsVersionMinor >= 6) {
          return true;
        }
      }
    }
    return false;
  }

  customElements.define('slide-show', class extends baseComponent.default {
    elements = {
      sliderContainer: '[data-slider-container]',
      slides: '*[data-slide-variants]',
      nextButton: '[data-slider-button-next]',
      prevButton: '[data-slider-button-prev]',
      pagination: '[data-slider-pagination]',
      thumbnails: 'slideshow-thumbnails'
    }


    async render() {
      await this._initSwiper();
      const delay = this.getAttribute('autoplay-delay') * 1000;
      const autoplay = this.hasAttribute('use-autoplay') && {delay};
      const navType = this.getAttribute('navigation-type');
      const usePagination = navType === 'pagination' || navType === 'pagination_buttons';
      const useButtons = navType === 'buttons' || navType === 'pagination_buttons';
      const swiperParams = {
        delay,
        autoplay,
        pagination: usePagination && {el: this.$pagination, clickable: true},
        navigation: useButtons && {
          nextEl: this.$nextButton,
          prevEl: this.$prevButton
        },
        zoom: this.hasAttribute('zoom'),
        breakpoints: this.hasAttribute('desktop-no-swipe') && {
          992: {
            allowTouchMove: false
          }
        },
        cssMode: isChromeForIOs145()
      }

      if (this.hasAttribute('sync-slider')) {
        this.syncSlider = document.getElementById(this.getAttribute('sync-slider'));
        swiperParams.initialSlide = this.syncSlider.getCurrentSlide();
      }

      this.swiper = new window.Swiper(this.$sliderContainer, swiperParams);

      if (this.hasAttribute('observe-slide-type')) {
        this._setMediaType(this.swiper.activeIndex);
        this.swiper.on('slideChange', ({ activeIndex }) => {
          this._setMediaType(activeIndex);
        })
      }

      if(this.hasAttribute('zoom')) {
        this.swiper.on('zoomChange', (_, scale) => {
          scale === 1 ? this.removeAttribute('zoomed') : this.setAttribute('zoomed', '');
        })
      }

      if (this.hasAttribute('thumbnails') && this.$thumbnails) {
        this.$thumbnails.onSliderLoad(this);
      }

      if (this.syncSlider) {
        this.swiper.on('slideChange', () => {
          this.syncSlider.slideTo(this.getCurrentSlide());
        })
      }

      if (this.hasAttribute('initial-slide')) {
        this.slideTo(+this.getAttribute('initial-slide'))
      }
    };

    async _initSwiper() {
      await loadScript(window.theme.scripts.Swiper, 'swiper');
      loadStyle(window.theme.styles.Swiper);
    };

    getCurrentSlide() {
      return this.swiper.activeIndex;
    }

    slideTo(index) {
      this.swiper.slideTo(index);
    }

    _setMediaType(slideIndex) {
      this.dataset.slideMediaType = this.swiper.slides[slideIndex].dataset.mediaType;
    }

  });
})();