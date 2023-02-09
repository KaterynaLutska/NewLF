(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('test-component', class extends baseComponent.default {
    elements = {
      buttons: '*[data-index]'
    };
    render() {
      console.log(this.$buttons);
      this.$buttons.map(button => button.addEventListener('click', () => console.log(button.dataset.index)))
    }
  });
})();