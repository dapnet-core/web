<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('navigation.transmitters.all') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- Add Transmitter Button -->
						<v-fab-transition v-if="this.$store.getters.permission('transmitter.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									dark
									icon
									to="/transmitters/new"
									slot="activator"
								>
										<v-icon>add</v-icon>
								</v-btn>
								<span>{{ $t('transmitters.overview.newtransmitter') }}</span>
							</v-tooltip>
						</v-fab-transition>
					</v-card-title>
					<v-data-table
						:headers="getHeaders"
						:items="transmitterrows"
						:pagination.sync="pagination"
						:total-items="total_rows"
						:loading="isLoadingData"
						:rows-per-page-items="[10, 25, 50, 100]"
						must-sort
						class="elevation-1"
						:search="search"
					>
						<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
						<template slot="items" slot-scope="props">
							<!-- ID column -->
							<td class="text-xs-right">
								{{ props.item._id }}
							</td>

							<!-- Status column -->
							<td class="text-xs-right">
								<v-icon v-if="props.item.status.online" color="green">cloud_done</v-icon>
								<v-icon v-else color ="red">cloud_off</v-icon>
							</td>

							<!-- OnAir column -->
							<td class="text-xs-right">
								<v-icon v-if="props.item.status.onair" color="green">signal_wifi_4_bar</v-icon>
								<v-icon v-else color ="red">signal_wifi_off</v-icon>
							</td>

							<!-- Messages column -->
							<td class="text-xs-right">
								<div v-if="props.item.status.online" class="chartContainer">
									<chart-message-queue
										:chartData="chartDataMessageQueue(props.index)"
										style="width: 100px; height: 70px;"
									>
									</chart-message-queue>
								</div>
							</td>

							<!-- Node column -->
							<td class="text-xs-center">
								<div v-if="props.item.status.node">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ props.item.status.node }}
									</v-chip>
								</div>
								<div v-else>---</div>
							</td>

							<!-- Software column -->
							<td class="text-xs-center">
								<div v-if="props.item.status.software">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ props.item.status.software.name }} - {{ props.item.status.software.version }}
									</v-chip>
								</div>
								<div v-else>---</div>
							</td>

							<!-- Usage column -->
							<td class="text-xs-center">
								<img v-bind:src="`${props.item.usage.image}`" v-bind:alt="`${props.item.usage.text}`">
							</td>

							<!-- owner column -->
							<td class="text-xs-center">
								<span v-for="(owner, index) in props.item.owners" v-bind:key="`owner-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ owner }}
									</v-chip>
								</span>
							</td>

							<!-- Transmitter Groups column -->
							<td class="text-xs-left">
								<span v-for="(group, index) in props.item.groups" v-bind:key="`group-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ group }}
									</v-chip>
								</span>
							</td>

							<!-- Last-seen column -->
							<td class="text-xs-center">
								{{ props.item.status.last_seen_localized }}
							</td>

							<!-- Emergency Power column -->
							<td class="text-xs-center">
								<v-icon
									v-if="props.item.emergency_power && props.item.emergency_power.available"
									color="green"
								>
									battery_charging_full
								</v-icon>
								<v-icon v-else color ="red">settings_input_hdmi</v-icon>
							</td>

							<!-- Enabled column -->
							<td class="text-xs-center">
								<v-icon v-if="props.item.enabled" color="green">toggle_on</v-icon>
								<v-icon v-else color ="red">toggle_off</v-icon>
							</td>

							<!-- Action Buttons -->
							<td class="text-xs-center" v-if="displayActionsColumn">
								<!-- Edit -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('transmitter.update') === 'all'"
											flat
											icon
											small
											fab
											color="blue"
											v-on:click="editElement(props.item)"
											slot="activator"
									>
										<v-icon>edit</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.edit') }}</span>
								</v-tooltip>
								<!-- Delete -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('transmitter.delete') === 'all'"
											flat
											icon
											small
											fab
											color="pink"
											v-on:click="deleteElement(props.item)"
											slot="activator"
									>
										<v-icon>delete</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.delete') }}</span>
								</v-tooltip>
								<!-- Send Email -->
								<v-tooltip bottom class="action-buttons">
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('transmitter.update') === 'all'"
											flat
											icon
											small
											fab
											color="grey"
											v-on:click="mailToOwner(props.item)"
											slot="activator"
									>
										<v-icon>contact_mail</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.email') }}</span>
								</v-tooltip>
							</td>
						</template>
						<v-alert slot="no-results" :value="true" color="error" icon="warning">
							Your search for "{{ search }}" found no results.
						</v-alert>
					</v-data-table>
				</v-card>
			</v-flex>
		</v-layout>
		<!--
		<v-layout>
			<v-flex xs4>
				<v-btn
					@click="btnclick"
				>button</v-btn>
			</v-flex>
			<v-flex xs4>
				<chart-message-queue :chartData="chartDataMessageQueue(2)"></chart-message-queue>
			</v-flex>
		</v-layout>
		-->
	</v-container>
</template>

<script>
	import moment from 'moment';
	import ChartMessageQueue from '@/components/charts/MessageQueue';
	export default {
		components: {
			ChartMessageQueue
		},
		created() {
			moment.locale(this.$root.$i18n.locale);
			// Not needed, as called by pagination watcher
			// this.loadData();
		},
		watch: {
			pagination: {
				handler() {
					this.loadData();
				},
				deep: true
			}
		},
		data() {
			return {
				search: '',
				total_rows: 0,
				transmitterrows: [],
				isLoadingData: true,
				pagination: {
					sortBy: 'doc._id',
					descending: true,
					rowsPerPage: 10,
					page: 1
				},
				wsHandler: []
			};
		},
		computed: {
			getHeaders() {
				let answer = [
					{
						text: this.$i18n.t('general.name'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('transmitters.status.connected'),
						sortable: true,
						align: 'center',
						value: 'status.online'
					},
					{
						text: this.$i18n.t('transmitters.status.onair'),
						sortable: false,
						align: 'center',
						value: 'status.onair'
					},
					{
						text: this.$i18n.t('transmitters.status.messagequeue'),
						sortable: false,
						align: 'center',
						value: 'status.messages.sent'
					},
					{
						text: this.$i18n.t('transmitters.status.node'),
						sortable: true,
						align: 'center',
						value: 'status.node'
					},
					{
						text: this.$i18n.t('transmitters.status.software'),
						sortable: true,
						align: 'center',
						value: 'status.software'
					},
					{
						text: this.$i18n.t('transmitters.usage.title'),
						sortable: true,
						align: 'center',
						value: 'usage'
					},
					{
						text: this.$i18n.t('general.owner'),
						align: 'center',
						value: 'owners'
					},
					{
						text: this.$i18n.t('general.transmitter_groups'),
						align: 'center',
						value: 'groups',
						sortable: true
					},
					{
						text: this.$i18n.t('transmitters.status.lastseen'),
						align: 'center',
						value: 'status.lastseen'
					},
					{
						text: this.$i18n.t('transmitters.emergency_power.title'),
						align: 'center',
						value: 'emergency_power.available'
					},
					{
						text: this.$i18n.t('general.enabled'),
						align: 'center',
						value: 'enabled'
					}
				];
				if (this.displayActionsColumn()) {
					let actions = {
						text: this.$i18n.t('general.actions'),
						align: 'center',
						sortable: false
					};
					answer.push(actions);
				}
				return answer;
			}
		},
		mounted() {
			this.$root.$on('LanguageChanged', () => {
				this.rerender_localized();
			});
		},
		methods: {
			chartDataMessageQueue(transmitterindex) {
				if (this.transmitterrows[transmitterindex] &&
					'status' in this.transmitterrows[transmitterindex] &&
					'messages' in this.transmitterrows[transmitterindex].status &&
					'queued' in this.transmitterrows[transmitterindex].status.messages) {
						return {
							labels: ['L', '', 'M', '', 'H'],
							datasets: [{
								backgroundColor: ['#469408', '#e0d32b', '#e08b27', '#e04530', '#d9230f'],
								data: this.transmitterrows[transmitterindex].status.messages.queued
							}]
						};
				} else {
					return {
						labels: ['E', 'M', 'P', 'T', 'Y'],
						datasets: [{
							backgroundColor: ['#469408', '#e0d32b', '#e08b27', '#e04530', '#d9230f'],
							data: [0, 0, 0, 0, 0]
						}]
					};
				}
			},
			getQueueColor(length) {
				if (length < 10) {
					return 'green';
				} else if (length < 20) {
					return 'yellow';
				} else {
					return 'red';
				}
			},
			updateTableRows(data, transmittername) {
				// Find corresponding transmitter object
				let transmitterIndex = -1;
				for (let i = 0; i < this.transmitterrows.length; i++) {
					if (this.transmitterrows[i]._id === transmittername) {
						transmitterIndex = i;
						break;
					}
				}
				if (transmitterIndex === -1) {
					return;
				}
				// console.log('UpdateTableRow txindex: ' + transmitterIndex.toString() + ' TXname ' + transmittername + ' received data:');
				// console.log(data);
				// Update transmitter data from websocket
				if ('config' in data && 'timeslots' in data.config) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.timeslots = data.config.timeslots;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('config' in data && 'software' in data.config && 'name' in data.config.software) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.software.name = data.config.software.name;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('config' in data && 'software' in data.config && 'version' in data.config.software) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.software.version = data.config.software.version;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('node' in data && 'connected' in data.node) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.online = data.node.connected;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('node' in data && 'connected_since' in data.node) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.connected_since = data.node.connected_since;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}

				let object2update = this.transmitterrows[transmitterIndex];
				object2update.status.last_seen = moment();
				object2update.status.last_seen_localized = moment().fromNow();
				this.transmitterrows.splice(transmitterIndex, 1, object2update);

				if ('node' in data && 'name' in data.node) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.node = data.node.name;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('ntp' in data) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.ntp = data.ntp;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('messages' in data) {
					data.messages.sent.splice(6, 4);
					data.messages.sent.splice(0, 1);

					data.messages.queued.splice(6, 4);
					data.messages.queued.splice(0, 1);
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.messages = data.messages;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
				if ('onair' in data) {
					let object2update = this.transmitterrows[transmitterIndex];
					object2update.status.onair = data.onair;
					this.transmitterrows.splice(transmitterIndex, 1, object2update);
				}
			},
			handleWebsocketConnetions() {
				console.log('Starting setting up WS handler');
				console.log(this.transmitterrows);
				if (this.wsHandler.length !== 0) {
					// Close active handlers
				}
				// Start WS connections
				for (let i = 0; i < this.transmitterrows.length; i++) {
					let transmittername = this.transmitterrows[i]._id;
					this.wsHandler[i] = new WebSocket(this.$store.getters.url.telemetry + '/telemetry/transmitters/' + transmittername);
					this.wsHandler[i].addEventListener('message', e => {
						let data = JSON.parse(e.data);
						if (!this.$helpers.isEmpty(data)) {
							this.updateTableRows(data, transmittername);
						} else {
							let object2update = this.transmitterrows[i];
							object2update.status.online = false;
							this.transmitterrows.splice(i, 1, object2update);
						}
					});
				}
			},
			rerender_localized() {
				this.transmitterrows.forEach(transmitter => {
					// Render last seen as prosa text
					if (transmitter.status.last_seen) {
						transmitter.status.last_seen_localized = moment(transmitter.status.last_seen).fromNow();
					} else {
						transmitter.status.last_seen_localized = '---';
					}
				});
			},
			displayActionsColumn() {
				return ((this.$store.getters.permission('transmitter.update') === 'all') ||
					(this.$store.getters.permission('transmitter.delete') === 'all'));
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				console.log('Starting loading data');
				this.isLoadingData = true;
				this.$axios.get('transmitters', {
					params: {
						descending: !!this.pagination.descending,
						limit: this.pagination.rowsPerPage,
						skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
						startswith: '"' + this.search + '"'
					}
				}).then(response => {
					// success --> save new data

					// save total rows
					if (response.data.total_rows) {
						this.total_rows = response.data.total_rows;
					}

					// save rows
					if (response.data.rows) {
						response.data.rows.forEach(transmitter => {
							// Render Widerange / Personal in a beautiful way
							let usageRendered = [];
							if (transmitter.usage === 'widerange') {
								usageRendered.image = './img/icons/transmitter_widerange.png';
								usageRendered.text = 'Widerange';
							} else if (transmitter.usage === 'personal') {
								usageRendered.image = './img/icons/transmitter_personal.png';
								usageRendered.text = 'Personal';
							}
							transmitter.usage = usageRendered;

							// Render last seen as prosa text
							if (transmitter.status.last_seen) {
								transmitter.status.last_seen_localized = moment(transmitter.status.last_seen).fromNow();
							} else {
								transmitter.status.last_seen_localized = '---';
							}
						});

						this.transmitterrows = response.data.rows;
					}
					this.isLoadingData = false;
					this.handleWebsocketConnetions();
				}).catch(e => {
					this.isLoadingData = false;
					this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.transmitters.list.title'), e);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.email + '?subject=DAPNET%20Transmitter%3A%20' + element._id;
			},
			editElement(element) {
				this.$router.push({ name: 'Edit Transmitter', params: { id: element._id } });
			},
			deleteElement(element) {
				this.$helpers.swalDeleteConfirm(
					this,
					this.$i18n.t('alerts.delete.transmitter.title', { fieldname: element._id }),
					this.$i18n.t('alerts.delete.transmitter.confirm', { fieldname: element._id })
				).then(swalresult => {
					if (swalresult) {
						console.log('Deleting Transmitter ' + element._id);
						this.axios.delete('transmitters/' + element._id + '?revision=' + element._rev, {
							// before(request) {
							//	request.headers.delete('Content-Type');
							// }
						}).then(response => {
							// success --> reload data
							this.loadData();
							this.$root.$emit('ReloadSidebarIcons');
							this.$helpers.swalDeleteSuccess(
								this,
								this.$i18n.t('alerts.delete.transmitter.success', { fieldname: element._id })
							);
						}).catch(e => {
							this.$helpers.swalDeleteFail(
								this,
								this.$i18n.t('alerts.delete.transmitter.error', { fieldname: element._id }),
								e
							);
						});
					}
				});
			}
		}
	};
	// TODO: Make headers instant i18n updateable
</script>

<style scoped>
	.action-buttons {
		padding: 1px;
		margin: 0px;
		display: inline-block;
	}
	.chartContainer {
		border: 1px solid lightgrey;
		box-sizing: border-box;
	}
</style>
