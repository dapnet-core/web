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

Vue.use(globalMethods);

Vue.use(axios);
Vue.use(VueClipboard);

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
