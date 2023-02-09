(async () => {
  const baseComponent = await import(window.theme.modules.baseComponent);

  customElements.define('currency-selector', class extends baseComponent.default {
      elements = {
        form: 'form',
      }

      render() {
        this.$form.addEventListener('change', (e) => e.target.form.submit())
      };
  });
})();