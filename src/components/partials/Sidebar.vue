<template>
	<div>
<!--        <div>
			<clock></clock>
			<status></status>
		</div>
-->

		<v-list>
			<!-- Home -->
			<v-list-tile exact to="/">
				<v-list-tile-action>
					<v-icon>home</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.home') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!-- Calls group -->
			<v-list-group
				prepend-icon="message"
				value="true"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<!-- Calls Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.calls.title') }}</v-list-tile-title>
				</v-list-tile>
				<!-- if permission read === all, link to table -->
				<v-list-tile
					exact to="/calls/new"
				>
					<v-list-tile-action>
						<v-icon>message</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.calls.new') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile
					exact to="/calls"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.calls"
						>
							<span slot="badge">{{ count_total.calls }}</span>
							<v-icon>message</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.calls.all') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

			</v-list-group>

			<!-- Users -->
			<v-list-tile
				v-if="this.$store.getters.isUserLoggedIn && this.$store.getters.permission('user.read') === 'all'"
				exact to="/users"
			>
				<v-list-tile-action>
					<v-badge
						right
						overlap
						v-model="isReadyLoadingData.total.users"
					>
						<span slot="badge">{{ count_total.users }}</span>
						<v-icon>account_box</v-icon>
					</v-badge>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.users') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<v-list-tile
				v-if="this.$store.getters.isUserLoggedIn && (!(this.$store.getters.permission('user.read') === 'all'))"
				exact to="/usersonlynames"
			>
				<v-list-tile-action>
					<v-badge
						right
						overlap
						v-model="isReadyLoadingData.total.users"
					>
						<span slot="badge">{{ count_total.users }}</span>
						<v-icon>account_box</v-icon>
					</v-badge>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.users') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!-- Subscribers group -->
			<v-list-group
				prepend-icon="cast"
				value="true"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<!-- subscribers Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.subscribers.title') }}</v-list-tile-title>
				</v-list-tile>
				<!-- if permission read === all, link to table -->
				<v-list-tile
					v-if="(this.$store.getters.permission('subscriber.read') === 'all')"
					exact to="/subscribers"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.subscribers"
						>
							<span slot="badge">{{ count_total.subscribers }}</span>
							<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.all') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- if !(permission read === all), link to overview -->
				<v-list-tile
					v-if="!(this.$store.getters.permission('subscriber.read') === 'all')"
					exact to="/subscribersoverview"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.subscribers"
						>
							<span slot="badge">{{ count_total.subscribers }}</span>
							<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<!-- Show my subscribers -->
				<v-list-tile
					exact to="/mysubscribers"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.my.subscribers"
						>
							<span slot="badge">{{ count_my.subscribers }}</span>
								<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.my') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list-group>

			<!-- Transmitters group -->
			<v-list-group
				prepend-icon="wifi"
				value="true"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<!-- Transmitters Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.transmitters.title') }}</v-list-tile-title>
				</v-list-tile>
				<!-- if permission read === all, link to table -->
				<v-list-tile
					v-if="(this.$store.getters.permission('transmitter.read') === 'all')"
					exact to="/transmitters"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.transmitters"
						>
							<span slot="badge">{{ count_total.transmitters }}</span>
							<v-icon>wifi</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.all') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- if !(permission read === all), link to overview -->
				<v-list-tile
					v-if="!(this.$store.getters.permission('transmitter.read') === 'all')"
					exact to="/transmittersoverview"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.transmitters"
						>
							<span slot="badge">{{ count_total.transmitters }}</span>
							<v-icon>wifi</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.alltransmitters.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- Show my transmitters-->
				<v-list-tile
					exact to="/mytransmitters"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.my.transmitters"
						>
							<span slot="badge">{{ count_my.transmitters }}</span>
							<v-icon>wifi</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.my') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list-group>

			<!-- Rubrics group -->
			<v-list-group
				prepend-icon="message"
				value="true"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<!-- Rubrics Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.rubrics.title') }}</v-list-tile-title>
				</v-list-tile>
				<!-- if permission read === all, link to table -->
				<v-list-tile
					v-if="(this.$store.getters.permission('rubric.read') === 'all')"
					exact to="/rubrics"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.rubrics"
						>
							<span slot="badge">{{ count_total.rubrics }}</span>
							<v-icon>message</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.rubrics.all') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- if !(permission read === all), link to overview -->
				<v-list-tile
					v-if="!(this.$store.getters.permission('rubric.read') === 'all')"
					exact to="/rubricssoverview"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.rubrics"
						>
							<span slot="badge">{{ count_total.rubrics }}</span>
							<v-icon>message</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.allrubrics.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- Show my rubrics-->
				<v-list-tile
					exact to="/myrubrics"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.my.rubrics"
						>
							<span slot="badge">{{ count_my.rubrics }}</span>
							<v-icon>message</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.rubrics.my') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list-group>

		</v-list>

<!--        <div class="version">Version {{version}}</div>-->
	</div>
</template>

<style scoped>
	.version {
		text-align: center;
		padding: 5px 0;
		font-size: 13px;
		opacity: .54;
	}
</style>

<script>
	import axios from 'axios';

	export default {
		name: 'Sidebar',
		created() {
			this.loadAllSidebarIndicatiors();
		},
		data() {
			return {
				isReadyLoadingData: {
					my: {
						subscribers: false,
						rubrics: false,
						transmitters: false,
						nodes: false
					},
					total: {
						subscribers: false,
						rubrics: false,
						transmitters: false,
						nodes: false,
						users: false,
						calls: false
					}
				},
				count_my: {
					subscribers: 0,
					rubrics: 0,
					transmitters: 0,
					nodes: 0
				},
				count_total: {
					subscribers: 0,
					rubrics: 0,
					transmitters: 0,
					nodes: 0,
					users: 0,
					calls: 0
				}
			};
		},
		computed: {
		},
		mounted() {
			this.$root.$on('ReloadSidebarIcons', () => {
				console.log('Received ReloadSidebarIcons event');
				this.loadAllSidebarIndicatiors();
			});
		},
		methods: {
			loadAllSidebarIndicatiors() {
				this.loadMySubscribers();
				this.loadMyTransmitters();
				this.loadMyRubrics();
				this.loadTotalSubscribers();
				this.loadTotalTransmitters();
				this.loadTotalUsers();
				this.loadTotalRubrics();
				this.loadTotalCalls();
			},
			loadTotalCalls() {
				this.isReadyLoadingData.total.calls = false;
				axios.get('/calls').then(response => {
					// success --> save new data
					if (response.data) {
						this.count_total.calls = response.data.length;
					}
					console.log('Total Calls ' + this.count_total.calls);
					this.isReadyLoadingData.total.calls = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalRubrics() {
				this.isReadyLoadingData.total.rubrics = false;
				axios.get('rubrics/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.rubrics = response.data.count;
					}
					console.log('Total Rubrics ' + this.count_total.rubrics);
					this.isReadyLoadingData.total.rubrics = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalUsers() {
				this.isReadyLoadingData.total.users = false;
				axios.get('users/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.users = response.data.count;
					}
					console.log('Total Users: ' + this.count_total.users);
					this.isReadyLoadingData.total.users = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalSubscribers() {
				this.isReadyLoadingData.total.subscribers = false;
				axios.get('subscribers/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.subscribers = response.data.count;
					}
					console.log('Total Subscribers: ' + this.count_total.subscribers);
					this.isReadyLoadingData.total.subscribers = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalTransmitters() {
				this.isReadyLoadingData.total.transmitters = false;
				axios.get('transmitters/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.transmitters = response.data.count;
					}
					console.log('Total Transmitters: ' + this.count_total.transmitters);
					this.isReadyLoadingData.total.transmitters = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadMySubscribers() {
				this.isReadyLoadingData.my.subscribers = false;
				axios.get('subscribers/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.subscribers = response.data.count;
					}
					console.log('mySubscribers: ' + this.count_my.subscribers);
					this.isReadyLoadingData.my.subscribers = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadMyTransmitters() {
				this.isReadyLoadingData.my.transmitters = false;
				axios.get('transmitters/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.transmitters = response.data.count;
					}
					console.log('myTransmitters: ' + this.count_my.transmitters);
					this.isReadyLoadingData.my.transmitters = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadMyRubrics() {
				this.isReadyLoadingData.my.rubrics = false;
				axios.get('rubrics/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.rubrics = response.data.count;
					}
					console.log('myRubrics: ' + this.count_my.rubrics);
					this.isReadyLoadingData.my.rubrics = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
</script>
