(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('main-header', class extends baseComponent.default {
    elements = {
      logo: '[data-logo]',
      nav: 'main-nav'
    };
    
    render() {
      this.setOverlap();
      this.on('stickyMainHeader', (e, { sticky }) => {
        if(sticky) {
          this.classList.add('@sticky');
          document.body.style.setProperty('--sticky-header-offset', `${this.$nav.offsetHeight}px`);
        } else {
          this.classList.remove('@sticky');
          document.body.style.setProperty('--sticky-header-offset', '0');
        }
      })
    };

    setOverlap() {
      this.style.setProperty('--nav-height', `${this.$nav.offsetHeight}px`);
      if(this.hasAttribute('overlap')) {
        const mainContent = document.getElementById('MainContent');
        const firstSection = mainContent.firstElementChild;
        const overlapElement = firstSection.querySelector('[data-main-header-overlap]');
        if(overlapElement) {
          overlapElement.classList.add('@main-header-overlap');
          this.classList.add('@overlap');
        } else {
          this.classList.remove('@overlap');
        }
      }
    };
  });
})();