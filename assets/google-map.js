(async () => {
    const { 
        loadScript,
        loadStyle,
        hideElement
    } = await import(window.theme.modules.utils);

    const baseComponent = await import(window.theme.modules.baseComponent);

    customElements.define('google-map', class extends baseComponent.default {
        elements = {
            styleJSON: '[data-style-json]'
        }

        willLoad = true;

        render() {
            this.mapStyle = JSON.parse(this.$styleJSON.textContent);
        }

        onAuthError() {
            this.willLoad = false;
            hideElement(this);
        }

        async onIntersect(isIntersecting) {
            if(isIntersecting && !this.map && this.willLoad) {
                await this._initMap();
            }
        }

        async _initMap() {
            if(!window.google?.maps?.Map) {
                await loadScript(`https://maps.googleapis.com/maps/api/js?key=${this.getAttribute('api-key')}`);
            }
            this.geo = new window.google.maps.Geocoder();
            this.geo.geocode({ 
                address: this.getAttribute('address')
            }, (res, status) => {
                console.log(status);
                if (status !== window.google.maps.GeocoderStatus.OK) {
                    console.error(status);
                    return;
                }
                const loc = res[0].geometry.location;
                this._renderMap(loc.lat(), loc.lng());
            });
        }
        _renderMap(lat, lng) {
            this.map = new window.google.maps.Map(this, {
                center: { lat, lng },
                zoom: 12,
                disableDefaultUI: true,
                styles: this.mapStyle
            });
            window.google.maps.event.addListenerOnce(this.map, 'idle', () => {
                this.setAttribute('loaded', '');
            });
            this._setMarker();
        }
        _setMarker() {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 384 512"><path fill="${this.getAttribute('marker-color')}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`;
            const marker = new window.google.maps.Marker({
                position: this.map.getCenter(),
                map: this.map,
                icon: { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new window.google.maps.Size(30, 30) }
            });
            marker.addListener('click', () => {
                if (this.hasAttribute('directions-url')) {
                    window.open(this.getAttribute('directions-url'), '_blank');
                }
            })
        }
    })
})();