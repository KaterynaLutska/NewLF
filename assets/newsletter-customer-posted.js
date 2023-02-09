(async () => {
  
    const modalReady = () => new Promise(resolve => {
      if (window.theme.modalReady) {
        resolve()
      }
      document.addEventListener('modalReady', resolve, {
        once: true
      })
    });
  
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('posted-popup', class extends baseComponent.default {
      
        async render() {
            if (window.location.search.includes('?customer_posted=true')) {
                await modalReady();
                this._trigerModal();
            } 
        };
  
        _trigerModal() {
            this.trigger('openPopup', {
              target: '#postedPopup',
              layout: 'small'
            })
        };
  
    });
})();