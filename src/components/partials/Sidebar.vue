<template>
	<div>
		<v-list>
			<!--Home-->
			<v-list-tile exact to="/">
				<v-list-tile-action>
					<v-icon>home</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.home') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!--Send call-->
			<v-list-tile
				exact to="/calls/new"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<v-list-tile-action>
					<v-icon>email</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.calls.new') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!--Send call-->
			<v-list-tile
				exact to="/transmitters/map"
				v-if="this.$store.getters.isUserLoggedIn"
			>
				<v-list-tile-action>
					<v-icon>map</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.transmitters.map') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!--My entities-->
			<v-list-group
				value="true"
				v-if="this.$store.getters.isUserLoggedIn && (
					(count_my.subscribers > 0) ||
					(count_my.rubrics >0 ) ||
					(count_my.transmitters > 0))"
			>
				<!-- My entities Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.myentities') }}</v-list-tile-title>
				</v-list-tile>

				<!--My subscribers-->
				<v-list-tile
					v-if="count_my.subscribers > 0"
					exact to="/mysubscribers"
				>
					<v-list-tile-action>
						<v-icon>cast</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.my') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_my.subscribers }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--My transmitters-->
				<v-list-tile
					v-if="count_my.transmitters > 0"
					exact to="/mytransmitters"
				>
					<v-list-tile-action>
						<v-icon>wifi</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.my') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_my.transmitters }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--My rubrics-->
				<v-list-tile
					v-if="count_my.rubrics > 0"
					exact to="/myrubrics"
				>
					<v-list-tile-action>
						<v-icon>message</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.rubrics.my') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_my.rubrics }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--My nodes-->
				<v-list-tile
					v-if="count_my.nodes > 0"
					exact to="/mynodes"
				>
					<v-list-tile-action>
						<v-icon>cloud</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.nodes.my') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_my.nodes }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

			</v-list-group>

			<!--All entities-->
			<v-list-group
				value="true"
				v-if="this.$store.getters.isUserLoggedIn && (
					(count_total.subscribers > 0) ||
					(count_total.rubrics >0 ) ||
					(count_total.transmitters > 0))"
			>
				<!-- All entities Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.allentities') }}</v-list-tile-title>
				</v-list-tile>

				<!--All calls-->
				<v-list-tile
					exact to="/calls"
				>
					<v-list-tile-action>
						<v-icon>email</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.calls.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.calls }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All subscribers, read === 'all'-->
				<v-list-tile
					v-if="(this.$store.getters.permission('subscriber.read') === 'all')"
					exact to="/subscribers"
				>
					<v-list-tile-action>
						<v-icon>cast</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.subscribers }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All subscribers, read !== 'all'-->
				<v-list-tile
					v-else
					exact to="/subscribersonlynames"
				>
					<v-list-tile-action>
						<v-icon>cast</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.subscribers.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.subscribers }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--All transmitters, read === 'all'-->
				<v-list-tile
					v-if="(this.$store.getters.permission('transmitter.read') === 'all')"
					exact to="/transmitters"
				>
					<v-list-tile-action>
						<v-icon>wifi</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.transmitters }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--All transmitters, read !== 'all'-->
				<v-list-tile
					v-else
					exact to="/transmitterssonlynames"
				>
					<v-list-tile-action>
						<v-icon>wifi</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.transmitters }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--All rubrics, read === 'all'-->
				<v-list-tile
					v-if="(this.$store.getters.permission('rubric.read') === 'all')"
					exact to="/rubrics"
				>
					<v-list-tile-action>
						<v-icon>message</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.rubrics.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.rubrics }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All rubrics, read !== 'all'-->
				<v-list-tile
					v-else
					exact to="/rubricsonlynames"
				>
					<v-list-tile-action>
						<v-icon>wifi</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.transmitters.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.rubrics }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>

				<!--All users, read === 'all'-->
				<v-list-tile
					v-if="(this.$store.getters.permission('user.read') === 'all')"
					exact to="/users"
				>
					<v-list-tile-action>
						<v-icon>account_box</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.users.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.users }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All users, read !== 'all'-->
				<v-list-tile
					v-else
					exact to="/usersonlynames"
				>
					<v-list-tile-action>
						<v-icon>account_box</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.users.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.users }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All nodes, read === 'all'-->
				<v-list-tile
					v-if="(this.$store.getters.permission('node.read') === 'all')"
					exact to="/nodes"
				>
					<v-list-tile-action>
						<v-icon>cloud</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.nodes.all') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.nodes }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
				<!--All nodes, read !== 'all'-->
				<v-list-tile
					v-else
					exact to="/nodesonlynames"
				>
					<v-list-tile-action>
						<v-icon>account_box</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.nodes.onlynames') }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-chip>
							{{ count_total.nodes }}
						</v-chip>
					</v-list-tile-action>
				</v-list-tile>
			</v-list-group>
			<!--Help-->
			<v-list-group>
				<!-- Help Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.help.title') }}</v-list-tile-title>
				</v-list-tile>

				<!--Wiki external link-->
				<v-list-tile
					href="https://hampager.de/dokuwiki/doku.php"
					target="_blank"
				>
					<v-list-tile-action>
						<v-icon>info</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.help.wiki') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<!--Ticket external link-->
				<v-list-tile
					href="https://support.hampager.de/"
					target="_blank"
				>
					<v-list-tile-action>
						<v-icon>live_help</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.help.support') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

			</v-list-group>
		</v-list>
	</div>
</template>

<style scoped>
</style>

<script>
	import axios from 'axios';

	export default {
		name: 'Sidebar',
		components: { },
		created() {
			if (this.$store.getters.isUserLoggedIn) {
				this.loadAllSidebarIndicatiors();
			}
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
				this.loadMyNodes();
				this.loadTotalSubscribers();
				this.loadTotalTransmitters();
				this.loadTotalUsers();
				this.loadTotalRubrics();
				this.loadTotalCalls();
				this.loadTotalNodes();
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.my.subscribers'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
				});
			},
			loadTotalNodes() {
				this.isReadyLoadingData.total.nodes = false;
				axios.get('nodes/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.nodes = response.data.count;
					}
					console.log('Total Nodes ' + this.count_total.nodes);
					this.isReadyLoadingData.total.nodes = true;
				}, response => {
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.total.nodes'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.total.rubrics'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.total.users'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.total.subscribers'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.total.transmitters'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.my.subscribers'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
				});
			},
			loadMyNodes() {
				this.isReadyLoadingData.my.nodes = false;
				axios.get('nodes/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.nodes = response.data.count;
					}
					console.log('myNodes: ' + this.count_my.nodes);
					this.isReadyLoadingData.my.nodes = true;
				}, response => {
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.my.nodes'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.my.transmitters'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
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
					// error --> show error message in snackbar
					this.$snackbar.show(this.$i18n.t('sidebar.errorLoading.my.rubrics'), {
						closeable: false,
						actions: [{
							caption: this.$i18n.t('general.confirm'),
							handler(snackbar, options) {
								snackbar.close();
							}
						}]
					});
				});
			}
		}
	};
</script>
