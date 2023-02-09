(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('column-slider', class extends baseComponent.default {
    elements = {
      slides: '*[data-slide]',
      bgImages: '*[data-bg-image]'
    };
    render() {
      this.$slides.forEach((slide) => slide.addEventListener('mouseover', this.onMouseOver.bind(this)))
      this.active = this.$bgImages[0];
    }
    onMouseOver(evt) {
        this.active.classList.remove('@active');
        const targetEL = this.$bgImages[evt.currentTarget.dataset.slide];
        targetEL.classList.add('@active');
        this.active = targetEL;
      }
  });

  customElements.define('columns-slider-mobile', class extends baseComponent.default {
    elements = {
      slides: '*[data-mobile-slide]',
      paginationItems: '*[data-mobile-pagination-item]'
    }

    render() {
      const ob = new IntersectionObserver(this._obCallback.bind(this), {
        root: this,
        threshold: .8,
      });
      this.$slides.map(slide => ob.observe(slide));
    }

    _obCallback([ entry ]) {
      const prev = this.$paginationItems.find(el => el.classList.contains('active'));
      const next = this.$paginationItems.find(el => el.dataset.index === entry.target.dataset.index);
      if(next == prev) {
        return;
      }
      prev.classList.remove('active');
      next.classList.add('active');
    }
  });
})();
