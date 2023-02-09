customElements.define('page-header', class extends Theme.BaseElement {
    render() {
        if (this.hasAttribute('overlap')) {
            const mainContainer = document.getElementById('MainContent');
            if (mainContainer.firstElementChild === this.getSectionContainer()) {
                const mainHeader = document.getElementById('MainHeader');
                mainHeader.classList.add('@overlap');
                this.classList.add('@overlap');
            }
         }
    };
  });