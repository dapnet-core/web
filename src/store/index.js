import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import axios from 'axios';

Vue.use(Vuex);

let defaultUrls = require('./config/defaultUrls.json');
let defaultText = require('./config/defaultText.json');
let defaultMap = require('./config/defaultMap.json');

export default new Vuex.Store({
	state: {
		url: defaultUrls,
		user: null,
		auth: null,
		permissions: [],
		language: 'en',
		customText: defaultText,
		map: defaultMap
	},
	getters: {
		url: state => {
			return state.url;
		},
		user: state => {
			return state.user;
		},
		username: state => {
			return state.user ? state.user._id : 'Guest';
		},
		auth: state => {
			return state.auth;
		},
		permissions: state => {
			return state.permissions;
		},
		permission: (state, getters) => (name) => {
			return state.permissions[name];
		},
		isUserLoggedIn: state => {
			return (state.user !== null && state.user.auth !== null);
		},
		language: state => {
			return state.language;
		},
		languageFlag: state => {
			if (state.language === 'en') return 'gb';
			return state.language;
		},
		customText: state => {
			return state.customText;
		},
		map: state => {
			return state.map;
		}
	},
	mutations: {
		login(state, payload) {
			state.user = payload.user;
			state.auth = payload.auth;
			state.permissions = payload.permissions;

			axios.defaults.headers.common['Authorization'] = 'Basic ' + payload.auth;
		},
		logout(state) {
			state.user = null;
			state.auth = null;
			state.permissions = [];

			axios.defaults.headers.common['Authorization'] = '';
		},
		changeLanguage(state, payload) {
			state.language = payload.language;
		}
	},
	plugins: [
		VuexPersistedState({
			key: 'dapnet-web',
			paths: [
				'user',
				'auth',
				'permissions',
				'language'
			]
		})
	]
});
