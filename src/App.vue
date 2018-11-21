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
			<v-toolbar-title>DAPNET</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-menu offset-y>
					<v-btn
						slot="activator"
						color="primary"
						dark
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

				<!-- Replaced by v-menu
				<v-select
						:items="languages"
						v-model="selectedLanguage"
						@change="changeLanguage"
						placeholder="Language Selector"
						dense
				>
					<template slot="selection" slot-scope="data">
						<span :class="['flag-icon', `flag-icon-${data.item.icon.toLowerCase()}`]"></span> {{ data.item.text }}
					</template>
					<template slot="item" slot-scope="data">
						<span :class="['flag-icon', `flag-icon-${data.item.icon.toLowerCase()}`]"></span> {{ data.item.text }}
					</template>
				</v-select>
-->
				<v-btn
					v-if="!this.$store.getters.isUserLoggedIn"
					flat
				>
					<router-link to="/login">{{ $t('navigation.login') }}</router-link>
				</v-btn>

				<v-menu
					v-if="this.$store.getters.isUserLoggedIn"
					offset-y
				>
					<v-btn
						slot="activator"
						color="primary"
						dark
					>
						<v-avatar
							v-if="this.$store.getters.avatar"
							size="40"
						>
							<img v-bind:src="AvatarImageComputed" />
							<!--<img v-auth-image="'/users/' + this.$store.getters.username + '/avatar.jpg'">-->
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
			</v-content>
		</main>
		<v-footer color="indigo" app>
			<span class="white--text">&copy; 2018</span>
		</v-footer>
	</v-app>
</template>

<script>
	import 'flag-icon-css/css/flag-icon.min.css';
	import Sidebar from './components/partials/Sidebar';

	export default {
		name: 'app',
		components: {Sidebar},
		created() {
			this.selectedLanguage = this.$root.$i18n.locale;
			if (this.$store.getters.avatar) {
				this.loadAvatar();
			}
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
				selectedLanguage: 'en',
				avatarImage: ''
			};
		},
		props: {
			source: String
		},
		computed:{
			AvatarImageComputed() {
				return this.$store.getters.avatarImage;

			}
		},
		methods: {
			loadAvatar() {
				console.log('Loading avatar');
				console.log('Path: ' + '/users/' + this.$store.getters.username + '/avatar.jpg');
				this.$axios.get('/users/' + this.$store.getters.username + '/avatar.jpg', {
					responseType: 'arraybuffer'
				})
					.then(response => {
						let arrayBuffer =  response.data;
						let u8 = new Uint8Array(arrayBuffer)
						let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
						let mimetype="image/jpeg"
						this.avatarImage = "data:"+mimetype+";base64,"+b64encoded;
						//this.$refs.avatarImage.src = this.avatarImage;
						this.$store.commit('changeAvatar', {
							avatarImage: this.avatarImage
						});

						console.log('toDataURL');
					}).catch(e => {
					console.log('Error getting avatar in app.vue');
					console.log(e);
				});
			},
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
			},
			getLanguage() {
				return this.$root.$i18n.locale;
			}
		}
	};
</script>
