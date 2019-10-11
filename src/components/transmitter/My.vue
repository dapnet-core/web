<template>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>{{ $t('pagetitle.transmitter.my') }}</v-toolbar-title>
				</v-toolbar>

				<v-list three-line>
					<template>
						<div
							v-for="(mytransmitter, index) in mytransmitters.rows"
							:key="mytransmitter._id"
							>
							<v-divider
								v-if="index != 0"
							></v-divider>
							<v-list-tile>
								<v-list-tile-avatar>
									<v-icon v-if="mytransmitter.status.online" color="green">cloud_done</v-icon>
									<v-icon v-else color ="red">cloud_off</v-icon>
									<v-icon v-if="mytransmitter.status.onair" color="green">signal_wifi_4_bar</v-icon>
									<v-icon v-else color ="red">signal_wifi_off</v-icon>
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>{{ mytransmitter._id }}: {{ mytransmitter.status.software.name }} - {{ mytransmitter.status.software.version }}</v-list-tile-title>
									<v-list-tile-sub-title>
										{{ mytransmitter.usage }} {{ mytransmitter.status.node }} {{ mytransmitter.status.last_seen_localized }}
									</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-avatar
									size="88"
									v-if="mytransmitter.status.online"
								>
									<!--div -->
									<!--<span v-for="(prio, index) in props.item.status.messages.queued" v-bind:key="`prio-${index}`">-->
									<chart-message-queue
										:chartData="chartDataMessageQueue(index)"
										style="width: 100px; height: 88px;"
									>
										<!--style="width: 100px; height: 70px;"-->
									</chart-message-queue>
									<!--/div-->
								</v-list-tile-avatar>
								<v-list-tile-action>
									<!-- Edit -->
									<v-tooltip bottom>
										<v-btn class="action-buttons"
											flat
											icon
											small
											fab
											color="blue"
											v-on:click="editElement(mytransmitter)"
											slot="activator"
										>
											<v-icon>edit</v-icon>
										</v-btn>
										<span>{{ $t('table.actionbuttons.edit') }}</span>
									</v-tooltip>
									<!-- Delete -->
									<v-tooltip bottom>
										<v-btn class="action-buttons"
											flat
											icon
											small
											fab
											color="pink"
											v-on:click="deleteElement(mytransmitter)"
											slot="activator"
										>
											<v-icon>delete</v-icon>
										</v-btn>
										<span>{{ $t('table.actionbuttons.delete') }}</span>
									</v-tooltip>
								</v-list-tile-action>
							</v-list-tile>
						</div>
					</template>
				</v-list>
			</v-card>
		</v-flex>
	</v-layout>
</template>
<script>
	import ChartMessageQueue from '@/components/charts/MessageQueue';
	import moment from 'moment';

	export default {
		components: {
			ChartMessageQueue
		},
		created() {
			this.loadData();
		},
		beforeDestroy() {
			if (this.wsHandler != null) {
				this.wsHandler.close();
			}
		},
		data() {
			return {
				isLoadingData: {
					general: true
				},
				mytransmitters: [],
				mytransmitternames: [],
				wsHandler: null
			};
		},
		methods: {
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
			},
			chartDataMessageQueue(transmitterindex) {
				if (this.mytransmitters.rows[transmitterindex] &&
					'status' in this.mytransmitters.rows[transmitterindex] &&
					'messages' in this.mytransmitters.rows[transmitterindex].status &&
					'queued' in this.mytransmitters.rows[transmitterindex].status.messages) {
					return {
						labels: ['L', '', 'M', '', 'H'],
						datasets: [{
							backgroundColor: ['#469408', '#e0d32b', '#e08b27', '#e04530', '#d9230f'],
							data: this.mytransmitters.rows[transmitterindex].status.messages.queued
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
			updateTableRows(data, transmittername) {
				// Find corresponding transmitter object
				let transmitterIndex = -1;
				for (let i = 0; i < this.mytransmitters.rows.length; i++) {
					if (this.mytransmitters.rows[i]._id === transmittername) {
						transmitterIndex = i;
						break;
					}
				}
				if (transmitterIndex === -1) {
					return;
				}
				// Update transmitter data from websocket
				if ('config' in data && 'timeslots' in data.config) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.timeslots = data.config.timeslots;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('config' in data && 'software' in data.config && 'name' in data.config.software) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.software.name = data.config.software.name;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('config' in data && 'software' in data.config && 'version' in data.config.software) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.software.version = data.config.software.version;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('node' in data && 'connected' in data.node) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.online = data.node.connected;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('node' in data && 'connected_since' in data.node) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.connected_since = data.node.connected_since;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}

				let object2update = this.mytransmitters.rows[transmitterIndex];
				object2update.status.last_seen = moment();
				object2update.status.last_seen_localized = moment().fromNow();
				this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);

				if ('node' in data && 'name' in data.node) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.node = data.node.name;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('ntp' in data) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.ntp = data.ntp;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('messages' in data) {
					data.messages.sent.splice(6, 4);
					data.messages.sent.splice(0, 1);

					data.messages.queued.splice(6, 4);
					data.messages.queued.splice(0, 1);
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.messages = data.messages;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
				if ('onair' in data) {
					let object2update = this.mytransmitters.rows[transmitterIndex];
					object2update.status.onair = data.onair;
					this.mytransmitters.rows.splice(transmitterIndex, 1, object2update);
				}
			},

			setupWShandler() {
				// UPDATE: Only one WS Handler is used for all transmitters by a subscribe/unsubscrive procedure
				console.log('Setting up single WS Handler');
				this.wsHandler = new WebSocket(this.$store.getters.url.telemetry + '/telemetry/');
				// Add incoming handler
				this.wsHandler.addEventListener('message', e => {
					let data = JSON.parse(e.data);
					if (!this.$helpers.isEmpty(data)) {
						if ('_type' in data) {
							// Process data according to type
							if (data._type === 'transmitter') {
								this.updateTableRows(data, data._id);
							}
						}
					}
				});
				this.wsHandler.addEventListener('open', e => {
					this.wsHandler.send(JSON.stringify({
						subscribe_transmitters: this.mytransmitternames
					}));
				});
			},
			loadData() {
				// load data of given id
				this.isLoadingData.general = true;
				this.$axios.get('transmitters/_my')
					.then(response => {
						console.log(response.data);
						this.mytransmitters = response.data;
						for (let i = 0; i < this.mytransmitters.rows.length; i++) {
							// Store transmitter name into array
							this.mytransmitternames.push(this.mytransmitters.rows[i]._id);

							// Make default data structure
							if (!('status' in this.mytransmitters.rows[i])) {
								this.mytransmitters.rows[i].status = {};
							}
							if (!('software' in this.mytransmitters.rows[i].status)) {
								this.mytransmitters.rows[i].status.software = {};
							}
							if (!('messages' in this.mytransmitters.rows[i].status)) {
								this.mytransmitters.rows[i].status.messages = {};
							}
						}
						console.log('End of loadData');
						console.log(this.mytransmitters.rows);
						this.isLoadingData.general = false;
						this.setupWShandler();
					}).catch(e => {
						console.log('Error getting my transmitters\'s details with axios or any exception in the get handler.');
						console.log(e);
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.transmitters.my.title'), e);
					});
			}
		}
	};
</script>

<style scoped>
	.chartContainer {
		border: 1px solid lightgrey;
		box-sizing: border-box;
	}
</style>
