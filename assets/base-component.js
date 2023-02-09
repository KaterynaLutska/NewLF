class BaseElement extends HTMLElement {
	constructor() {
    super();
    if (typeof this.onClick === 'function') { 
      this.addEventListener('click', this.onClick)
		}
    this.sectionId = this.getAttribute('section-id');
    this.__init = false;
  }
  listenTo(event, fn, sameCtx = true) {
  	document.addEventListener(event, (e) => {
    	if(e.detail?.sectionId === this.sectionId && sameCtx || !sameCtx) {
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
  connectedCallback() {
    if(!this.__init) {
      this.on = this.listenTo;
      this.trigger = this.forwardEvent;
      if (typeof this.onIntersect == 'function') {
        this.observer = new IntersectionObserver((entries) => {
          this.onIntersect(entries[0].isIntersecting);
        })
        this.observer.observe(this);
      }
      if (this.elements) {
        for (const [key, value] of Object.entries(this.elements)) {
          this[`$${key}`] = value[0] === "*" ? Array.from(this.querySelectorAll(value.substring(1)))
            : this.querySelector(value);
        }
      }

      if (typeof this.render == 'function') {
        this.render();
      }
      this.__init = true;
    }
    if(typeof this.reRender == 'function') {
      this.reRender();
    }
  }
  updateHTML(html) {
    const id = this.hasAttribute('id') ? this.getAttribute('id') : null;
    const source = id ? html.getElementById(id) : html.querySelector(this.tagName);
    source && this.replaceChildren(...source.childNodes);
  }
  getParentSection() {
    return document.getElementById(`shopify-section-${this.sectionId}`)
  }
}

export default BaseElement;