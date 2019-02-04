import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router/index';

// import i18n, router and store (including their configuration)
import i18n from './i18n';

// Vuetify
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Sidebar from './components/partials/Sidebar';
import store from './store';
import VueClipboard from 'vue-clipboard2';
import globalMethods from './global';
import swal from 'sweetalert2';
import { L, LMap, LTileLayer, LMarker, LIcon, LPopup, LTooltip } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen';

import 'material-design-icons-iconfont/dist/material-design-icons.css';

// import 'material-design-icons/iconfont/material-icons.css';
// import 'typeface-roboto/index.css';

// import partials for rendering
// import ActionButtons from '@/components/partials/ActionButtons';
import AppFooter from '@/components/partials/Footer';

Vue.use(globalMethods);

Vue.use(VueAxios, axios);

Vue.use(VueClipboard);

// Leaflet
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-icon', LIcon);
Vue.component('l-popup', LPopup);
Vue.component('l-tooltip', LTooltip);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Vue Resource
Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

const swalPlugin = {};
swalPlugin.install = function(Vue) {
	Vue.prototype.$swal = swal;
};
Vue.use(swalPlugin);

// set initial locale
i18n.locale = store.getters.language;

Vue.use(Vuetify, {
	lang: {
		t: (key, ...params) => i18n.t(key, params)
	}
});

// add partials for rendering
// Vue.component('action-buttons', ActionButtons);

Vue.component('app-footer', AppFooter);

// Change Document title according to router target
router.afterEach((to, from) => {
	// use current view as title-source
	document.title = i18n.t(to.meta.titleTranslationKey) + ' | DAPNET Web';
});

axios.defaults.baseURL = store.getters.url.api;
axios.defaults.timeout = 30000;
if (store.getters.auth) {
	axios.defaults.headers.common['Authorization'] = 'Basic ' + store.getters.auth;
}
axios.defaults.headers.common['Content-Type'] = 'application/json, text/plain, */*';
// delete axios['Content-Type'];

// output version and links onto console
const pkg = require('../package.json');
console.log('%c DAPNET Web v' + pkg.version + ' ', 'background: #112a2d; color: #bada55; font-size: large;');
// console.log('Latest commit:    https://github.com/DecentralizedAmateurPagingNetwork/Web/commit/' + process.env.GITCOMMITHASH);
// console.log('More information: https://github.com/DecentralizedAmateurPagingNetwork/Web');

new Vue({
	render: h => h(App),
	i18n,
	store,
	router,
	components: { Sidebar }
}).$mount('#app');
