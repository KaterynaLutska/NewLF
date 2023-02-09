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

  const ICONS_URL = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/";
  const ICON_PREFIX = 'icon-';
  const CN_ICON = '#icon';

  customElements.define('load-icon', class extends baseComponent.default {

      async render() {
          if (this.localIcon || await this._loadIcon()) {
              this._displayIcon() 
              this._setIconProps()
              return
          } 
          this._removeContainer();
      }

      async _loadIcon() {
          try {
              const res = await fetch(`${ICONS_URL}/${this.iconName}.svg`);
              if (!res.ok) throw new Error(res.status);
              const svg = await res.text();
              this.localIcon = svg;
              return svg;
          } catch (error) {
              console.error(error.message);
              return null;
          }
      }

      _displayIcon() {
          this.innerHTML = this.localIcon;
      }
      
      _setIconProps() {
          const $icon = this.querySelector('svg');
          $icon.classList.add(CN_ICON);
          $icon.style.setProperty('--size', this.getAttribute('size'));
      }

      _removeContainer() {
          this.remove();
      }

      get localIcon() {
          return localStorage.getItem(this.localIconName)
      }

      set localIcon(svg) {
          return localStorage.setItem(this.localIconName, svg)
      }
      
      get iconName() {
          return this.getAttribute('name')
      }

      get localIconName() {
          return `${ICON_PREFIX}${this.iconName}`
      }
  })
})();