(async () => {

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('main-nav', class extends baseComponent.default {
        elements = {
            dropdowns: '*[data-dropdown]'
        };

        modalInit = false;

        render() {
            this.$dropdowns.filter(drop => drop.hasAttribute('data-offset-drop')).map(dropdown => {
                const clientRect = dropdown.getBoundingClientRect();
                if (document.documentElement.clientWidth - clientRect.x + clientRect.width < 600) {
                    dropdown.classList.add('@drop-reverse');
                }
            })
        }

        reRender() {
            if(this.closest('modal-popup') && !this.modalInit) {
                this.modalInit = true;
                this.$dropdowns.map(dropdown => {
                    dropdown.addEventListener('click', (e) => {
                        e.preventDefault();
                        const dropId = e.currentTarget.dataset.dropdown;
                        const dropTarget = this.querySelector(`[data-dropby="${dropId}"]`);
                        dropTarget.classList.toggle('!active');
                    })
                })
            }
        }
    })
})();