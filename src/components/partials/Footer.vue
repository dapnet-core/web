<template>
	<v-card
		flat
		tile
		widht="100%"
		class="text-center"
	>
		<v-card-text>
			<v-layout>
				<v-flex>
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
				<v-flex>
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
					{{ $t('footer.frontendcodedby') }}: {{ author }}
				</v-flex>
				<v-spacer></v-spacer>

				<v-flex>
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
	<!--
	<div class="container">

			<div class="row">
				<div class="col-lg-12">
					<p><b>{{ $t('footer.support.title') }}:</b></p>
					<ul class="list-unstyled">
						<li><a href="https://github.com/DecentralizedAmateurPagingNetwork" target="_blank">{{ $t('footer.support.github') }}</a></li>
						<li><a href="https://www.afu.rwth-aachen.de" target="_blank">{{ $t('footer.support.rwth-amateur-radio') }}</a></li>
					</ul>
					<p><b>{{ $t('footer.contact.title') }}:</b></p>
					<ul class="list-unstyled">
						<li><a href="https://twitter.com/RWTHAmateurfunk" target="_blank">{{ $t('footer.contact.twitter') }}</a></li>
						<li><a href="https://www.facebook.com/DL0UA" target="_blank">{{ $t('footer.contact.facebook') }}</a></li>
						<li><a href="https://www.afu.rwth-aachen.de/ueber-uns/kontakt">{{ $t('footer.contact.contact') }}</a></li>
						<li>
							<router-link to="/impress">{{ $t('footer.contact.impress') }}</router-link>
						</li>
						<li>
							<router-link to="/privacy">{{ $t('footer.contact.privacy') }}</router-link>
						</li>
					</ul>
					<p><b>{{ $t('footer.versions.title') }}:</b> Web: {{ version.web }} / <router-link to="/version">{{ $t('footer.versions.check') }}</router-link></p>
				</div>
			</div>
			<cookie-law theme="dark-lime" :button-text="$t('footer.cookieconsent.button')">
				<div slot="message" v-html="$t('footer.cookieconsent.text')"></div>
			</cookie-law>

	</div>
-->
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
		methods: {
		    CheckVersion() {
		        var latest = require('github-latest-release')
				latest('dapnet-core', 'web')
				.then(response => {
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
