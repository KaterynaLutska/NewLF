(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('product-meta-loading', class extends baseComponent.default {
      
      render() {
        this.listenTo('variantLoading', () => {
            // console.log('loading');
            this.setAttribute('active', '');
        });
        this.listenTo('variantChange', () => {
            // console.log('variant loaded');
            this.removeAttribute('active');
        })
      }
    });
  })();