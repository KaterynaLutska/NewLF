(async () => {
  const { showElement, hideElement } = await import(window.theme.modules.utils);
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('announcement-bar', class extends baseComponent.default {
    elements = {
      buttonClose: '[data-dismiss]',
    }

    render() {
      if (this.hasAttribute('dismissible')) {
        this._useDismiss();
      }
    };

    _useDismiss() {
      this.$buttonClose.addEventListener('click', this._closeBar.bind(this), { once: true });
      const isHidden = window.sessionStorage.getItem('hideAnnouncement');
      if (!isHidden) showElement(this);
    };

    _closeBar() {
      window.sessionStorage.setItem('hideAnnouncement', 'true');
      hideElement(this)
    }
  });
})();