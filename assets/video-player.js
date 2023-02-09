(async () => {
    const { 
        loadScript,
        loadStyle
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('video-player', class extends baseComponent.default {
        elements = {
            player: '[data-player]',
            HTMLPlayer: 'video'
        }

        async onIntersect(isIntersecting) {
            if(isIntersecting && !this.player) {
                await this._initPlayer();
            }
            if(!isIntersecting && this.player && this.player.playing) {
                this.player.pause();
            }
        }

        async _initPlayer() {
            loadStyle('https://cdn.plyr.io/3.6.8/plyr.css');
            if(!window.Plyr) {
                await loadScript(window.theme.scripts.Plyr);
            }
            this.player = new window.Plyr(this.hasAttribute('internal') ? this.$HTMLPlayer : this.$player);
        }
    })
})();