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
import { L, LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.use(globalMethods);

Vue.use(VueAxios, axios);

Vue.use(VueClipboard);

// Leaflet
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

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

new Vue({
	render: h => h(App),
	i18n,
	store,
	router,
	components: { Sidebar }
}).$mount('#app');
