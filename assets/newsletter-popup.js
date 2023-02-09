(async () => {

  const addMSDays = (date, days) =>  {
    let ms = days * 86400000;
    return date + ms
  }

  const modalReady = () => new Promise(resolve => {
    if (window.theme.modalReady) {
      resolve()
    }
    document.addEventListener('modalReady', resolve, {
      once: true
    })
  });

  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('main-newsletter-popup', class extends baseComponent.default {
    
    async render() {
      await modalReady();
      this._initPopup();
    };

    _initPopup() {
      this.daysToReAppear = this.getAttribute('days-to-re-appear');
      this.displayDelay = +this.getAttribute('display-delay');

      this.lastViewed = window.localStorage.getItem('newsletterLastViewed')
      if (this.lastViewed === null) {
        this._setLastViewed();
        this._showPopup();
      }

      if (Date.now() >= addMSDays(this.lastViewed, this.daysToReAppear)) {
        this._showPopup();
      }
      // this.listenTo('popupClosed', (e, data) => { NOTE: waiting for modal imps
      //   console.log('close', data.target);
      //   if (data.target !== '#newsletterPopup') return;
      //   this._setLastViewed();
      // }, false)
    };

    _setLastViewed() {
      this.lastViewed = Date.now();
      window.localStorage.setItem('newsletterLastViewed', this.lastViewed)
    };

    _showPopup() {
      this.displayDelay === 0 ? this._trigerModal() : setTimeout(this._trigerModal.bind(this), this.displayDelay*1000);
    };

    _trigerModal() {
      this.trigger('openPopup', {
        target: '#newsletterPopup'
      })
    };

  });
})();