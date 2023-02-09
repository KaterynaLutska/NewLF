(async () => {
    const {
      updateURLParams,
      historyPush,
      parseHTML,
      getParentSection
    } = await import(window.theme.modules.utils);
    
    const isEqual = (arr1, arr2) => arr1.toString() === arr2.toString();
    const strEsc = (str) => str.replace(/["\\]/g, '\\$&');
    const parseJSON = (el) => JSON.parse(el.textContent)
    const baseComponent = await import(window.theme.modules.baseComponent);
  
    customElements.define('product-variant-selector', class extends baseComponent.default {
      elements = {
        variantsJSON: '[data-variants-json]',
        optionsJSON: '[data-options-with-values]'
      };
      
      render() {
        this.cache = {};
        this.optionsMap = {};
        this.isProductPage = this.hasAttribute('product-page');
        this.variantsData = parseJSON(this.$variantsJSON);
        this.optionsData = parseJSON(this.$optionsJSON);       
        this._getDefaultVariant();
        this._linkOptionSelectors();
        this._checkUnavailable();
        this.addEventListener('change', this._variantChangeHandler.bind(this));
        this.on('qtyStatusUpdate', (e, data) => {
          this.cache[+data.variantId] = data.html.outerHTML
        }, false)
        this._setInititalCache(); 
            
      };
 
 
        // Required functionality from depricated options_selection.js
        _arrayIncludes(e, t) {
          for (var n = 0; n < e.length; n++)
            if (e[n] == t) return !0;
          return !1
        } 
        _uniq(e) {
          for (var t = [], n = 0; n < e.length; n++) this._arrayIncludes(t, e[n]) || t.push(e[n]);
          return t
        }
 
      _linkOptionSelectors() {
        // Building our mapping object.
        
        for (var i=0; i< this.variantsData.length; i++) {
          var variant = this.variantsData[i];
          if (variant.available) {
            // Gathering values for the 1st drop-down.
            this.optionsMap['root'] = this.optionsMap['root'] || [];
            this.optionsMap['root'].push(variant.option1);
            this.optionsMap['root'] = this._uniq(this.optionsMap['root']);
            // Gathering values for the 2nd drop-down.
            if (this.optionsData.length > 1) {
              var key = variant.option1;
              this.optionsMap[key] = this.optionsMap[key] || [];
              this.optionsMap[key].push(variant.option2);
              this.optionsMap[key] = this._uniq(this.optionsMap[key]);
            }
            // Gathering values for the 3rd drop-down.
            if ( this.optionsData.length === 3) {
              var key = variant.option1 + ' / ' + variant.option2;
              this.optionsMap[key] = this.optionsMap[key] || [];
              this.optionsMap[key].push(variant.option3);
              this.optionsMap[key] = this._uniq(this.optionsMap[key]);
            }
          }
        }
      };
  
      _getDefaultVariant() {
        this.variant = this.variantsData.find(v => v.id === +this.getAttribute('current-variant-id'));
      };
 
      _setInititalCache() {
        const parentSection = this.getParentSection();
        this.cache[this.variant.id] = parentSection.outerHTML;
      };
  
      _checkUnavailable(valueIndex) {
        this.optionsData.map((option, i) => {
 
          let optionsToCheck = [...this.variant.options];
          let needed_array = [];
          
          if(i==0){
            needed_array = this.optionsMap['root'];
          }else if(i==1){
            const options_string = optionsToCheck[0];
            needed_array = this.optionsMap[options_string];
          }else if(i==2){
            const options_string = optionsToCheck[0] + " / " +optionsToCheck[1];
            needed_array = this.optionsMap[options_string];
          }
         
            option.values.map(optionValue => {
            optionsToCheck[i] = optionValue;
 
              const match = this._findVariantByOptions(optionsToCheck);
              this._toggleOption(option.name, optionValue, !match);   
              if(typeof needed_array != "undefined"){
               const matchLinked = needed_array.indexOf(optionValue) + 1;
              this._toggleOptionHide(option.name, optionValue, !matchLinked);   
              }else{
               this._toggleOptionHide(option.name, optionValue, true);   
              }
              
            
          })        
        })
      };
  
      _toggleOption(name, value, disable) {
        const targetInput = this.querySelector(`[name="${strEsc(name)}"][value="${strEsc(value)}"`);
        disable
          ? targetInput.setAttribute('data-unavailable', '')
          : targetInput.removeAttribute('data-unavailable');
      };
 
	  _toggleOptionHide(name, value, disable) {
        const targetInput = this.querySelector(`[name="${strEsc(name)}"][value="${strEsc(value)}"`);
        if(targetInput){
        disable
          ? targetInput.closest("[data-swatch-field]").setAttribute('data-soldout', '')
          : targetInput.closest("[data-swatch-field]").removeAttribute('data-soldout');
        }
      };	
  
      _variantChangeHandler(e) {
        if (!e.detail?.synthetic) {
            this._selectVariantByOption(e.target);
            const sectionId = this.isProductPage ? this.sectionId : null;
            const { queryURL, currentURL } = updateURLParams({ 'variant': this.variant.id }, sectionId, window.location.origin + this.getAttribute('product-url'));
            if (this.isProductPage) historyPush(currentURL);
            let valueIndex = this.optionsData.findIndex(option => option.name === e.target.name);    
            this._checkUnavailable(valueIndex);
 
            const cached = this.cache[this.variant.id];
            // console.log(cached);
            // console.log(this.cache);
 
            if (cached) {
              this.forwardEvent('variantChange', {
                  html: parseHTML(cached),
                  variant: this.variant
              })
            } else {
              this._fetchPageWithVariant(queryURL, (html) => {
                this.cache[this.variant.id] = html;
                this.forwardEvent('variantChange', {
                        html: parseHTML(html),
                        variant: this.variant
                    })
                });
            }
            
        }  
      };
  
      _selectVariantByOption(target) {
        let valueIndex = this.optionsData.findIndex(option => option.name === target.name);
      //  debugger;
        if (target.hasAttribute('data-unavailable')) {
          this.variant = this.variantsData.find(variant => variant.options[valueIndex] === target.value);
          this._toogleInputs(target)
        } else {
          let optionsToFind = [...this.variant.options];
          optionsToFind[valueIndex] = target.value;
          this.variant = this._findVariantByOptions(optionsToFind);
        }

         this.variant.options.map((option, i) => {
            const input = this.querySelector(`input[value="${strEsc(option)}"][name="${strEsc(this.optionsData[i].name)}"]`);
            if(input.checked == false){
            input.checked = true;
            input.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { synthetic: true } }));
            }
        })
        
        
      };
  
      _toogleInputs(target) {
        this.variant.options.map((option, i) => {
          if(option !== target.value) {
            const input = this.querySelector(`input[value="${strEsc(option)}"][name="${strEsc(this.optionsData[i].name)}"]`);
            input.checked = true;
            input.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { synthetic: true } }));
          }
        }) 
      };
  
      _findVariantByOptions(options) {
        return this.variantsData.find(variant => isEqual(variant.options, options));
      };
  
      _updateSwatchLable(swatchInput) {
        swatchInput.closest('product-variant-swatch').querySelector('[data-swatch-value]').textContent = swatchInput.value;
      };
  
      _fetchPageWithVariant(url, onResponse) {
        this.forwardEvent('variantLoading');
        return fetch(url)
        .then(response => response.text())
        .then(responseText => {
          onResponse(responseText);
        });
      };    
    });
 
    customElements.define('product-option-picker', class extends baseComponent.default {
        elements = {
            value: '[data-option-value]'
        }
        render() {
            this.addEventListener('change', e => {
                if(this.$value) {
                    this.$value.innerText = e.target.value;
                }
            })
        }
    })
  })();