// (async () => {
//     const baseComponent = await import(window.theme.modules.baseComponent);

//     customElements.define('video-bg', class extends baseComponent.default {
//         render() {
//             window.Shopify.loadFeatures([
//                 {
//                     name: 'model-viewer-ui',
//                     version: '1.0',
//                     onLoad: this._setupViewer.bind(this),
//                 },
//             ])
//         }
//         _setupViewer() {
//             this.modelViewer = new Shopify.ModelViewerUI;
//             console.log(this.modelViewer);   
//         }
//     }
// })();