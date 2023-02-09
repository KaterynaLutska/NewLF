(async () => {
    const { 
        loadScript,
        loadStyle
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('video-bg', class extends baseComponent.default {
        elements = {
            player: '[data-player]'
        }

        playerInited = false;

        async render() {
            const obs = new IntersectionObserver((entries) => {
                this._onIntersect(entries[0].isIntersecting);
            })
            obs.observe(this);

            this.on('stopVideoBg', () => {
                if(this.player) {
                    this.player.pause();
                }
            })
            this.on('playVideoBg', () => {
                if(this.player) {
                    this.player.play();
                }
            })
        }

        async _onIntersect(isIntersecting) {
            if (isIntersecting) {
                if(!this.player) {
                    this.setAttribute('loading', '');
                    await this.initPlayer();
                } else {
                    this.player.play();
                }
            }
            if(!isIntersecting && this.player) {
                this.player.pause();
            }
        }

        async initPlayer() {
            loadStyle('https://cdn.plyr.io/3.6.8/plyr.css');
            if(!window.Plyr) {
                await loadScript(window.theme.scripts.Plyr);
            }
            this.playerInited = true;
            this.player = new window.Plyr(this.$player, {
                muted: true
            });
            this.player.on('ended', () => {
                this.player.restart();
            })
            this.player.on('ready', () => {
                this.player.play();
                this.player.decreaseVolume(100);
            })

            this.player.on('playing', () => {
                this.removeAttribute('loading');
            })

            // this.player.on('pause', () => {
            //     this.removeAttribute('playing');
            // })
        }

    });
})();