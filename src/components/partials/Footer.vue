<template>
	<v-card
		flat
		tile
		widht="100%"
		class="text-center"
	>
		<v-card-text>
			<v-layout row wrap>
				<v-flex xs6 sm6 md3 lg3 xl2>
					{{ $t('footer.support.title') }}:
					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-btn
								v-on="on"
								icon
								href="https://github.com/dapnet-core"
								target="_blank"
							>
								<v-icon>mdi-github-box</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('footer.support.github') }}</span>
					</v-tooltip>

					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-btn
								v-on="on"
								icon
								href="https://www.afu.rwth-aachen.de"
								target="_blank"
							>
								<v-icon>mdi-web</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('footer.support.rwth-amateur-radio') }}</span>
					</v-tooltip>
				</v-flex>
				<v-flex xs6 sm6 md2 lg2 xl1>
					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-btn
								v-on="on"
								icon
								href="https://twitter.com/RWTHAmateurfunk"
								target="_blank"
							>
								<v-icon>mdi-twitter</v-icon>
							</v-btn>
						</template>
						<span>Twitter</span>
					</v-tooltip>

					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-btn
								v-on="on"
								icon
								href="https://www.facebook.com/DL0UA"
								target="_blank"
							>
								<v-icon>mdi-facebook</v-icon>
							</v-btn>
						</template>
						<span>Facebook</span>
					</v-tooltip>
				</v-flex>
				<v-flex xs6 sm6 md3 lg3 xl2>
					<v-btn
						exact to="/impress"
						flat
					>
						{{ $t('footer.contact.impress') }}
					</v-btn>
					<v-btn
						exact to="/privacy"
						flat
					>
						{{ $t('footer.contact.privacy') }}
					</v-btn>
				</v-flex>
				<!--<v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>-->
				<v-spacer></v-spacer>
				<v-flex xs6 sm6 md3 lg3 xl2>
					{{ $t('footer.versions.title') }}: {{ version.web }}
					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-btn
								v-on="on"
								icon
								@click="CheckVersion"
							>
								<v-icon>mdi-help-circle</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('footer.versions.check') }}</span>
					</v-tooltip>
				</v-flex>
			</v-layout>
		</v-card-text>
		<div>
			<cookie-law theme="dark-lime" :button-text="$t('footer.cookieconsent.button')">
				<div slot="message" v-html="$t('footer.cookieconsent.text')"></div>
			</cookie-law>
		</div>
	</v-card>
</template>

<script>
	import CookieLaw from 'vue-cookie-law';

	export default {
		components: {
			CookieLaw
		},
		created() {
			// get web version
			const pkg = require('../../../package.json');
			this.version.web = pkg.version;
			this.author = pkg.author;
		},
		mounted() {
			console.log(this.$vuetify.breakpoint.name);
		},
		methods: {
			CheckVersion() {
				var latest = require('github-latest-release');
				latest('dapnet-core', 'web')
					.then(response => {
						const semver = require('semver');
						if (semver.gt(response.tag_name, this.version.web)) {
							// Latest release on Github is newer
							console.log('newer version');
							this.$helpers.swalWarning(this, this.$i18n.t('alerts.versioncheck.outdated'), response.tag_name);
						} else {
							// Running version is newer or equal to latest github release
							this.$helpers.swalVersionUpToDate(this, this.$i18n.t('alerts.versioncheck.uptodate'));
						}
						console.log(response.tag_name);
					})
					.catch(e => {
						this.$helpers.swalError(this, this.$i18n.t('alerts.noGitHubConnection'), e);
					});
			}
		},
		data() {
			return {
				version: {
					web: 'Unknown'
				},
				author: '',
				webCommit: ''
			};
		}
	};
</script>

<style scoped>
	div.Cookie__content > div > a {
		color: #8bc34a;
	}

	@media (min-width: 768px) {
		footer {
			margin: 2em 0;
		}

		footer li {
			float: left;
			margin: 0 1.5em 1.5em 0;
		}

		footer p {
			clear: left;
			margin-bottom: 0;
		}
	}
</style>
