(async () => {
  const { 
    loadScript,
    loadStyle
  } = await import(window.theme.modules.utils);

  const baseComponent = await import(window.theme.modules.baseComponent);

  const isChromeForIOs145 = () => {
    const userAgent = window.navigator.userAgent;
    const isChromeForIOs = /CriOS/i.test(userAgent);
    if (isChromeForIOs) {
      const iOsMatch = userAgent.match(
        /(.+)(iPhone|iPad|iPod)(.+)OS[\s|\_](\d+)\_?(\d+)?[\_]?(\d+)?.+/i
      );
      if (iOsMatch && iOsMatch.length >= 6) {
        const iOsVersionMajor = parseInt(iOsMatch[4], 10);
        const iOsVersionMinor = parseInt(iOsMatch[5], 10);
        if (iOsVersionMajor >= 14 && iOsVersionMinor >= 6) {
          return true;
        }
      }
    }
    return false;
  }

  customElements.define('custom-tabs', class extends baseComponent.default {
    async render() {
      let navButtons = this.querySelectorAll('.custom-tabs-section-nav-button');
      let contentItems = this.querySelectorAll('.custom-tabs-section-body-item');
      navButtons.forEach(function(item){
        item.addEventListener("click", function(e) {
          navButtons.forEach(function(el){
            el.classList.remove('active');
          });
          var itemId = item.getAttribute('data-id');
          item.classList.add('active');

          contentItems.forEach(function(element){
            element.classList.remove('active');
            if (element.getAttribute('data-id') == itemId) {
              element.classList.add('active');
            }
          });
        }, false);
      })
    }
  });
})();