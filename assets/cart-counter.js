(async () => {
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('cart-counter', class extends baseComponent.default {
          
      render() {
        this.on('updateCart', this._fetchCart.bind(this), false);
        this.on('cartChange', this._fetchCart.bind(this), false);
      };

      _fetchCart(data) {
        fetch(`${this.getAttribute('cart-url')}.js`)
        .then(res => res.json())
        .then(this._update.bind(this))
        .catch(e => console.error(e))
      };

      _update(cartData) {
        this.textContent = cartData.item_count
        if (+cartData.item_count === 0) {
          this.setAttribute('empty', 'true');
          return
        } 
        if (this.hasAttribute('empty') && +cartData.item_count !== 0)
          this.removeAttribute('empty');
      };
      
    });
  })();