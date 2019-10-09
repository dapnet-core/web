<template>
	<v-app id="app">
<!--		<v-navigation-drawer
			v-model="drawer"
			fixed
			app
		>-->
		<v-navigation-drawer
				app
				persistent
				clipped
				clipped-left
				enable-resize-watcher
				v-model="drawer"
		>
			<Sidebar></Sidebar>

		</v-navigation-drawer>
		<v-toolbar color="indigo" dark fixed app>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title>
				<router-link to="/">
					<img v-if="$vuetify.breakpoint.smAndUp" src="./assets/img/dapnet-logo.png" alt="DAPNET-Logo" height="50">
				</router-link>
			</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-menu offset-y>
					<v-btn
						slot="activator"
						flat
					>
						<span :class="['flag-icon', `flag-icon-${this.$store.getters.languageFlag}`]"></span> {{ this.$store.getters.language }}
					</v-btn>
					<v-list>
						<v-list-tile
							v-for="(item, index) in languages"
							:key="index"
							@click="changeLanguage(item.value)"
					>
							<v-list-tile-title>
								<span :class="['flag-icon', `flag-icon-${item.icon.toLowerCase()}`]"></span> {{ item.text }}
							</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>

				<v-spacer></v-spacer>

				<v-btn
					v-if="!this.$store.getters.isUserLoggedIn"
					flat
					to="/login"
				>
					{{ $t('navigation.login') }}
				</v-btn>

				<v-menu
					v-if="this.$store.getters.isUserLoggedIn"
					offset-y
				>
					<v-btn
						slot="activator"
						flat
					>
						<v-avatar
							v-if="this.$store.getters.hasAvatar"
							size="40"
						>
							<img v-bind:src="AvatarImageComputed" />
							<!--
							also working, but current user image is already stored
							<img v-auth-image="'/users/' + this.$store.getters.username + '/avatar.jpg'">
							-->
						</v-avatar>
						<span>{{ this.$store.getters.username }}</span>
					</v-btn>

					<v-list>
						<v-list-tile>
							<v-list-tile-avatar>
								<v-icon>settings</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-title>
								<router-link :to="{ name: 'Edit User', params: { id: this.$store.getters.username }}">
									{{ $t('navigation.settings') }}
								</router-link>
							</v-list-tile-title>
						</v-list-tile>
						<v-list-tile>
							<v-list-tile-avatar>
								<v-icon>account_box</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-title>
								<router-link to="/logout">{{ $t('navigation.logout') }}</router-link>
							</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>
			</v-toolbar-items>
		</v-toolbar>
		<main>
			<v-content>
				<router-view :key="$route.fullPath"></router-view>
					<app-footer></app-footer>
			</v-content>
		</main>
	</v-app>
</template>

<script>
	import 'flag-icon-css/css/flag-icon.min.css';
	import Sidebar from './components/partials/Sidebar';
	import moment from 'moment';

	export default {
		name: 'app',
		components: { Sidebar },
		created() {
			this.selectedLanguage = this.$root.$i18n.locale;
		},
		data() {
			return {
				drawer: null,
				languages: [
					{
						text: this.$i18n.t('footer.language.de'),
						value: 'de',
						icon: 'de'
					},
					{
						text: this.$i18n.t('footer.language.en'),
						value: 'en',
						icon: 'gb'
					},
					{
						text: this.$i18n.t('footer.language.es'),
						value: 'es',
						icon: 'es'
					},
					{
						text: this.$i18n.t('footer.language.nl'),
						value: 'nl',
						icon: 'nl'
					},
					{
						text: this.$i18n.t('footer.language.fr'),
						value: 'fr',
						icon: 'fr'
					},
					{
						text: this.$i18n.t('footer.language.it'),
						value: 'it',
						icon: 'it'
					},
					{
						text: this.$i18n.t('footer.language.pl'),
						value: 'pl',
						icon: 'pl'
					},
					{
						text: this.$i18n.t('footer.language.se'),
						value: 'se',
						icon: 'se'
					}
				],
				selectedLanguage: 'en'
			};
		},
		props: {
			source: String
		},
		computed: {
			AvatarImageComputed() {
				return this.$store.getters.avatarImage;
			}
		},
		methods: {
			changeLanguage(lang) {
				this.$root.$i18n.locale = lang;
				// Whatever may be right here?
				this.$root.$forceUpdate();
				this.$forceUpdate();
				this.$vuetify.lang.current = lang;
				this.$store.commit('changeLanguage', {
					language: lang
				});
				document.title = this.$root.$i18n.t(this.$route.meta.titleTranslationKey) + ' | DAPNET Web';
				this.languages[0].text = this.$i18n.t('footer.language.de');
				this.languages[1].text = this.$i18n.t('footer.language.en');
				this.languages[2].text = this.$i18n.t('footer.language.es');
				this.languages[3].text = this.$i18n.t('footer.language.nl');
				this.languages[4].text = this.$i18n.t('footer.language.fr');
				this.languages[5].text = this.$i18n.t('footer.language.it');
				this.languages[6].text = this.$i18n.t('footer.language.pl');
				this.languages[7].text = this.$i18n.t('footer.language.se');

				moment.locale(lang);
				// Trigger Change of Language
				this.$root.$emit('LanguageChanged');
			},
			getLanguage() {
				return this.$root.$i18n.locale;
			}
		}
	};
</script>
