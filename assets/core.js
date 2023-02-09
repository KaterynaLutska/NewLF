/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
    window.Shopify = {};
  }
  
  Shopify.bind = function(fn, scope) {
    return function() {
      return fn.apply(scope, arguments);
    }
  };
  
  Shopify.setSelectorByValue = function(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
      var option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  };
  
  Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
  };
  
  Shopify.postLink = function(path, options) {
    options = options || {};
    var method = options['method'] || 'post';
    var params = options['parameters'] || {};
  
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
  
    for(var key in params) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  
  Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl         = document.getElementById(country_domid);
    this.provinceEl        = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
  
    Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));
  
    this.initCountry();
    this.initProvince();
  };
  
  Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
      var value = this.countryEl.getAttribute('data-default');
      Shopify.setSelectorByValue(this.countryEl, value);
      this.countryHandler();
    },
  
    initProvince: function() {
      var value = this.provinceEl.getAttribute('data-default');
      if (value && this.provinceEl.options.length > 0) {
        Shopify.setSelectorByValue(this.provinceEl, value);
      }
    },
  
    countryHandler: function(e) {
      var opt       = this.countryEl.options[this.countryEl.selectedIndex];
      var raw       = opt.getAttribute('data-provinces');
      var provinces = JSON.parse(raw);
  
      this.clearOptions(this.provinceEl);
      if (provinces && provinces.length == 0) {
        this.provinceContainer.style.display = 'none';
      } else {
        for (var i = 0; i < provinces.length; i++) {
          var opt = document.createElement('option');
          opt.value = provinces[i][0];
          opt.innerHTML = provinces[i][1];
          this.provinceEl.appendChild(opt);
        }
  
        this.provinceContainer.style.display = "";
      }
    },
  
    clearOptions: function(selector) {
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
    },
  
    setOptions: function(selector, values) {
      for (var i = 0, count = values.length; i < values.length; i++) {
        var opt = document.createElement('option');
        opt.value = values[i];
        opt.innerHTML = values[i];
        selector.appendChild(opt);
      }
    }
  };


  if ((typeof window.Theme) == 'undefined') {
    window.Theme = {};
    window.Theme.utils = {};
  }

  class BaseElement extends HTMLElement {
	constructor() {
    super();
    if (typeof this.onClick === 'function') { 
      this.addEventListener('click', this.onClick)
		}
    this.sectionId = this.getAttribute('section-id');
  }
  listenTo(event, fn, sameCtx = true) {
  	window.addEventListener(event, (e) => {
    	if(e.detail.sectionId === this.sectionId && sameCtx || !sameCtx) {
      	fn.bind(this)(e, e.detail);
      }
    });
  }
  forwardEvent(eventName, data = {}) {
		let event = new CustomEvent(eventName, {
    	bubbles: true,
      composed: true,
      detail: {
      	sectionId: this.sectionId,
        ...data
      }
    })
    this.dispatchEvent(event);
  }
  getSectionContainer() {
    if (!this.sectionId) return null;
    const sectionContainerId = `shopify-section-${this.sectionId}`;
    return document.getElementById(sectionContainerId);
  }
  connectedCallback() {
    if (this.elements) {
      for (const [key, value] of Object.entries(this.elements)) {
        this[`$${key}`] = value[0] === "*" ? Array.from(this.querySelectorAll(value.substring(1)))
          : this.querySelector(value);
      }
    }
    this.render();
  }
}

const moneyFormat = '${{amount}}';

function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || moneyFormat;
  function formatWithDelimiters(
    number,
    precision = 2,
    thousands = ',',
    decimal = '.'
  ) {
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100.0).toFixed(precision);
    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    );
    const centsAmount = parts[1] ? decimal + parts[1] : '';
    return dollarsAmount + centsAmount;
  }
  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }
  return formatString.replace(placeholderRegex, value);
}

window.Theme.utils.formatMoney = formatMoney;

window.Theme.BaseElement = BaseElement;

window.gm_authFailure = () => {
  document.querySelectorAll('google-map').forEach(map => {
    if(map.onAuthError) map.onAuthError();
  })
}