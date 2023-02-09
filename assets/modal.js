(async () => {
  var setInnerHTML = function(elm, html) {
    elm.appendChild(html);
    Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  const baseComponent = await import(window.theme.modules.baseComponent);
  const {
    hideElement,
    showElement,
    parseHTML
  } = await import(window.theme.modules.utils);

  customElements.define('modal-close', class extends baseComponent.default  {
    render() {
        this.addEventListener('click', (e) => {
        e.preventDefault();
        this.trigger('closePopup');
      })
    }
  })

  customElements.define('modal-trigger', class extends baseComponent.default {
      render() {
      this.addEventListener('click', (e) => {
        e.preventDefault();
        this.forwardEvent('openPopup', {
          target: this.getAttribute('target'),
          url: this.getAttribute('url'),
          layout: this.getAttribute('layout'),
          hiddenClose: this.hasAttribute('hidden-close')
        })
      });
      };
    });


  customElements.define('modal-popup', class extends baseComponent.default {
    elements = {
      content: '[data-content]',
      overlay: '[data-overlay]',
      close: '[data-close]',
      layout: '[data-layout]'
    };

    animationTimeout = 300;
    html = document.querySelector('html');
    defaultLayoutClass = 'default';

    render() {
      if(this.hasAttribute('enable-cart')) {
        this._initCart();
      }

      [ this.$overlay, this.$close ].map(this._closeOnClick.bind(this));
      this.setAttribute('style', `--transition: ${this.animationTimeout}ms;`);

      this.listenTo('openPopup', (e, data) => {

        

        this.target = data.target;
        if(data.target === 'CART') {
          if(!this.cartContent) return;
          this.layout = 'sidebar';
          this.$content.replaceChildren(this.cartContent);
          this._setLayout();
          this._openModal();
          return;
        }
        this.triggerSectionId = e.detail.sectionId;
        this.layout = data.layout || 'default';
        this._setLayout();
        if(data.hiddenClose) {
          hideElement(this.$close);
        }
        this._openModal();
        if (data.url) {
          this.setAttribute('loading', '');
          fetch(data.url)
            .then(res => res.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const target = doc.querySelector(data.target);
              this.removeAttribute('loading');
              setInnerHTML(this.$content, target);
            })
            .catch(err => console.error(err))
        } else {
          this.contentWrapper = document.querySelector(data.target);
          // this.isTemplate = this.contentWrapper.content;
          this.contentWrapper.content
            ? this.$content.replaceChildren(...this.contentWrapper.content.cloneNode(true).childNodes)
            : this.$content.replaceChildren(...this.contentWrapper.childNodes)
          // if(this.isTemplate) {
          //   this.$content.appendChild(template.content.cloneNode(true));
          // } else {
          //   this.$content.appendChild(template.cloneNode(true));
          // }
          
        }
      }, false);
      this.on('closePopup', this._closeModal.bind(this), false);
      this.trigger('modalReady');
      window.theme.modalReady = true;
    }

    _closeOnClick(el) {
      el.addEventListener('click', this._closeModal.bind(this));
    }

    _closeModal() {
      // console.log('start animation');
      //   this.setAttribute('animating', '');
      //   setTimeout(() => {
      //     this.removeAttribute('animating');
      //     console.log('end animation');
      //   }, this.animationTimeout);

      this.removeAttribute('opened');
      this.setAttribute('closing', '');

      setTimeout(() => {
        if(this.contentWrapper && !this.contentWrapper.content) {
          this.contentWrapper.replaceChildren(...this.$content.childNodes);
        } else {
          this.$content.replaceChildren()
        }
        // this.$layout.classList.remove(this.layout);
        this._resetLayout();
        showElement(this.$close);
        this.removeAttribute('closing');
      }, this.animationTimeout);
      this.html.classList.remove('overflow-hidden');
      this.trigger('popupClosed', {
        sectionId: this.triggerSectionId
      });
    }
    
    _openModal() {
      
      // setTimeout(() => { this.setAttribute('opened', ''); }, 100);

      this.setAttribute('opened', '')
      // if (this.layout) {
      //   this.classList
      // }
      // this.$layout.classList.add(this.layout);

      // this.setAttribute('opened', '');
      
      this.html.classList.add('overflow-hidden');
      this.trigger('popupOpened', {
        sectionId: this.triggerSectionId
      })
    }

    _setLayout() {
      if(this.layout) {
        // this.classList.remove(`@layout:${this.defaultLayoutClass}`);
        this.classList.add(`@layout:${this.layout}`);
      }
    }

    _resetLayout() {
      if(this.layout) {
        this.classList.remove(`@layout:${this.layout}`);
        // this.classList.add(`@layout:${this.defaultLayoutClass}`);
      }
    }

    _initCart() {
      const cartURL = this.getAttribute('cart-url');
      const cartTarget = this.getAttribute('cart-target');
      if(cartURL && cartTarget) {
        const fetchCart = (callback) => {
          fetch(cartURL)
            .then(res => res.text())
            .then(html => {
              const content = parseHTML(html).querySelector(cartTarget);
              this.cartContent = content;
              document.body.appendChild(this.cartContent);
              document.body.removeChild(this.cartContent);
            })
        }
  
        fetchCart();
  
        this.on('updateCart', (e, { callback }) => {
          this.cartContent.update(callback);
        }, false)
      }
    }
  });
  

})();