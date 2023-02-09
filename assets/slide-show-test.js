(async () => {
    const { 
      loadScript,
      loadStyle
    } = await import(window.theme.modules.utils);
  
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('slide-show-test', class extends baseComponent.default {
      elements = {
        sliderContainer: '[data-slider-container]',
        thumbnails: 'slideshow-test-thumbnails'
      }
  
      async render() {
        await this._initSwiper();  
        this.swiper = new window.Swiper(this.$sliderContainer);
        this.$thumbnails.onSliderLoad(this);
      };
  
      async _initSwiper() {
        if (!window.Swiper) {
          await loadScript(window.theme.scripts.Swiper);
        }
        loadStyle(window.theme.styles.Swiper);
      };

      slideTo(index) {
        this.swiper.slideTo(index);
      }

      getCurrentSlideIndex() {
        return this.swiper.activeIndex;
      }
    });


    customElements.define('slideshow-test-thumbnails', class extends baseComponent.default {
        elements = {
            items: '*[data-item]'
        }
        onSliderLoad(slider) {
            this.slider = slider;
            this._setActive(this.slider.swiper.activeIndex);
            this.$items.map((item, i) => {
                item.addEventListener('click', () => {
                    this.slider.slideTo(i);
                });
            })
            this.slider.swiper.on('slideChange', () => {
                this._setActive(this.slider.swiper.activeIndex);
            })
        }
        _setActive(index) {
            if(this.active) {
                this.active.classList.remove('!active');
            }

            this.active = this.$items[index];
            this.active.classList.add('!active');
            if(this.hasAttribute('horizontal')) {
                this.active.parentNode.scrollLeft = this.active.offsetLeft - 200;
            } else {
                this.active.parentNode.scrollTop = this.active.offsetTop - 200;
            }
        }
    })
  })();