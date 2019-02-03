<template>
	<v-container fluid fill-height>
		<v-card class="elevation-12" min-width="95%">
			<v-card-title>
				<span class="headline">{{ $t('transmitters.map.title') }}</span>
			</v-card-title>
			<!--OSM Map-->
			<v-card-media>
				<l-map
					ref="map"
					:zoom="map.zoom"
					:center="map.center"
					style="height: 700px;"
				>
					<l-tile-layer
						:url="map.url"
						:attribution="map.attribution"
					>
					</l-tile-layer>
					<l-marker
						v-for="(item, markerindex) in map.markers"
						:key="item.name"
						:lat-lng="item.coordinates"
						:icon="item.icon"
						@click="loadCoverage(item.id)"
					>
						<l-popup v-if="item.details !== undefined">
							{{ item.details.changed_on }}
							asas
						</l-popup>
						<l-tooltip
							v-if="item.details"
							style="width: 400px;"
						>
							<v-layout fluid>
								<v-card flat color="green">
									<v-card-title class="headline">
										<v-layout align-center justify-space-between row>
											<v-flex xs2>{{ item.id }}</v-flex>
											<v-spacer></v-spacer>
											<v-flex xs3>
												<span class="align-end">
													<!--
													<div v-if="item.details.status.online" class="chartContainer">

														<chart-message-queue
															:chartData="chartDataMessageQueue(item.name)"
															style="width: 100px; height: 70px;"
														>
														</chart-message-queue>
													</div>
													-->
												</span>
											</v-flex>
										</v-layout>
									</v-card-title>
									<v-card-text>
										<div style="width: 350px;">
										<v-layout row wrap>
											<v-flex xs5>{{ $t('general.transmitter_groups') }}</v-flex>
											<v-flex xs7>
												<v-chip
													v-for="(group, groupindex) in item.details.groups"
													:key="groupindex"
													small
													label
													color="primary"
												>
													{{ group }}
												</v-chip>
											</v-flex>
										</v-layout>
										<v-layout wrap>
											<v-flex xs5>{{ $t('general.owners') }}</v-flex>
											<v-flex xs7>
												<v-chip
													v-for="(owner, ownerindex) in item.details.owners"
													:key="ownerindex"
													small
													label
													color="primary"
												>
													{{ owner }}
												</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.new.aprs_broadcast.title') }}</v-flex>
											<v-flex xs7>
												<v-chip v-if="item.details.aprs_broadcast" color="green" small>YES</v-chip>
												<v-chip v-else color="red" small>NO</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.new.emergency.available.title') }}</v-flex>
											<v-flex xs7>
												<v-chip v-if="item.details.emergency_power && item.details.emergency_power.available" color="green" small>YES</v-chip>
												<v-chip v-else color="red" small>NO</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.usage.title') }}</v-flex>
											<v-flex xs7>
												<v-chip v-if="item.details.usage === 'widerange'" color="primary" small label>Widerange</v-chip>
												<v-chip v-else color="red" small label>personal</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.power') }}</v-flex>
											<v-flex xs7>{{ item.details.power }} W</v-flex>
											<v-flex xs5>{{ $t('general.created_on') }}</v-flex>
											<v-flex xs7>{{ getTimestampFormated(item.details.created_on) }}
												{{ $t('general.byUser') }} {{ item.details.created_by }}
											</v-flex>
											<v-flex xs5>{{ $t('general.changed_on') }}</v-flex>
											<v-flex xs7>{{ getTimestampFormated(item.details.changed_on) }}
												{{ $t('general.byUser') }} {{ item.details.changed_by }}
											</v-flex>
										</v-layout></div>
									</v-card-text>
								</v-card>
							</v-layout>
						</l-tooltip>
					</l-marker>
				</l-map>
			</v-card-media>
			<v-card-text>
				<v-layout wrap row>
					<v-flex xs3>
						<v-checkbox
							v-model="checkbox.pttstatus"
							:label="$t('transmitters.map.checkbox.showpttstatus')"
						>
						</v-checkbox>
					</v-flex>
					<v-flex xs3>
						<v-checkbox
							v-model="checkbox.onlineonly"
							:label="$t('transmitters.map.checkbox.showonlineonly')"
						>
						</v-checkbox>
					</v-flex>
					<v-flex xs3>
						<v-checkbox
							v-model="checkbox.widerangeonly"
							:label="$t('transmitters.map.checkbox.showwiderangeonly')"
						>
						</v-checkbox>
					</v-flex>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'Map',
		components: {
		},
		created() {
			this.createIcons();
			this.loadTransmitterLocations();
			this.loadNodes();
		},
		mounted() {
			// Handler for Map Moved
			this.$refs.map.mapObject.on('moveend', () => {
				this.centerLatLong = this.$refs.map.mapObject.getCenter();
				this.map.bounds = this.$refs.map.mapObject.getBounds();
				console.log('map was moved');
				this.loadMissingTransmitterDetailsInBound();
				this.updateWSConnections();
				this.updateMarkersOnMapafterMove();
			});
			// Initialize zoom
			this.map.zoom = this.$store.getters.map.zoom;
		},

		/*
		watch: {
			'isLoadingData.transmitters'() {
				if (!this.isLoadingData.transmitters) {
					this.updateMapContent();
				}
			}

			,
			'isLoadingData.nodes'() {
				if (!this.isLoadingData.nodes) {
					this.updateMapContent();
				}
			}

		},
*/
		data() {
			return {
				checkbox: {
					pttstatus: false,
					onlineonly: false,
					widerangeonly: false
				},
				centerLatLong: null,
				isLoadingData: {
					transmitters: true,
					nodes: true,
					transmitterdetails: false
				},
				map: {
					zoom: 1,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
					url: this.$store.getters.url.map,
					markers: [],
					lines: [],
					coverageLayers: [],
					center: [50, 6],
					bounds: null
				},
				staticData: {
					transmitters: {},
					nodes: {}
				},
				monitoringData: {
					transmitters: {},
					nodes: {}
				},
				icons: {},
				wsHandler: {}
			};
		},
		computed: {
		},
		methods: {
			chartDataMessageQueue(transmittername) {
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
			getTimestampFormated(ISOTime) {
				return moment(ISOTime).format('LLL');
			},
			loadCoverage() {
			},
			skipthisTransmitter(transmittername) {
				if (this.checkbox.widerangeonly && this.staticData.transmitters[transmittername].usage === 'widerange') {
					return (this.checkbox.onlineonly && (transmittername in this.monitoringData.transmitters));
				} else {
					return false;
				}
			},
			transmitterInBounds(transmittername) {
				if (transmittername in this.staticData.transmitters &&
				'coordinates' in this.staticData.transmitters[transmittername]) {
					let bounds = this.$refs.map.mapObject.getBounds();
					return bounds.contains(new L.LatLng(this.staticData.transmitters[transmittername].coordinates[0],
						this.staticData.transmitters[transmittername].coordinates[1]));
				} else {
					console.log('Transmitter ' + transmittername + ' not found in staticData or coodinated not present');
					return false;
				}
			},
			updateMarkersOnMapafterMove() {
				console.log('updateMarkersonMap executed');
				let markerTransmitters = [];
				let polylineTransmitters = [];
				// Only put transmitters inside of bound on map
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						if (!this.checkbox.pttstatus) {
							// Static Display
							if (!this.skipthisTransmitter(transmitterID)) {
								markerTransmitters.push({
									id: transmitterID,
									name: 't_' + transmitterID,
									coordinates: this.staticData.transmitters[transmitterID].coordinates,
									icon: this.getCorrespondingStaticIcon(transmitterID)
								});
							}
						} else {
							// OnAir Display
						}
					}
				}
				this.map.markers = markerTransmitters;
				console.log(this.map.markers);
			},
			loadMissingTransmitterDetailsInBound() {
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						this.loadMissingTransmitterDetail(transmitterID);
					} else {
						// console.log('OUT: ' + this.map.markers[i].id);
					}
				}
			},
			updateWSConnections() {
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						// Transmitter marker is on Map
						this.addWShandler(transmitterID);
					} else {
						this.removeWShandler(transmitterID);
					}
				}
			},
			removeWShandler(transmittername) {
				//console.log('try removeWS TX: ' + transmittername);
				if (transmittername in this.wsHandler) {
					console.log('removeWS TX: ' + transmittername);
					this.wsHandler[transmittername].close();
					delete this.wsHandler[transmittername];
					if (transmittername in this.monitoringData.transmitters) {
						delete this.monitoringData.transmitters[transmittername];
					}
				}
			},
			addWShandler(transmittername) {
				//console.log('try AddWS TX: ' + transmittername);
				if (!(transmittername in this.wsHandler)) {
					console.log('newWS TX: ' + transmittername);
					this.wsHandler[transmittername] = new WebSocket(this.$store.getters.url.telemetry +
						'/telemetry/transmitters/' + transmittername);
					this.wsHandler[transmittername].addEventListener('message', e => {
						let data = JSON.parse(e.data);
						if (!this.$helpers.isEmpty(data)) {
							console.log(transmittername);
							console.log(data);
							if (!(transmittername in this.monitoringData.transmitters)) {
								// save initial copy of data
								this.monitoringData.transmitters[transmittername] = data;
							} else {
								// overwrite with new chunk of data
								this.monitoringData.transmitters[transmittername] =
									Object.assign(this.monitoringData.transmitters[transmittername], data);
							}
						} else {
							delete this.monitoringData.transmitters[transmittername];
						}
					});
				}
			},
			loadMissingTransmitterDetail(transmittername) {
				// If transmitter is not already present or details not already loaded (by existens of _rev)
				if ((!(transmittername in this.staticData.transmitters)) ||
					(!('_rev' in this.staticData.transmitters[transmittername]))) {
					// Load transmitter details
					console.log('Loading TX details of: ' + transmittername);
					this.isLoadingData.transmitterdetails = true;
					this.$axios.get('transmitters/' + transmittername)
						.then(response => {
							this.staticData.transmitters[transmittername] = response.data;
							delete this.staticData.transmitters[transmittername]._id;
							this.isLoadingData.transmitterdetails = false;
						}).catch(e => {
							console.log('Error getting transmitter details in transmitters/Map.vue');
					});
				}
			},
			getCorrespondingStaticIcon(transmittername) {
				// find icon
				if (this.staticData.transmitters[transmittername].usage === 'widerange') {
					// Widerange
					if (transmittername in this.monitoringData) {
						// Widerange and online
						return this.icons.iconTransmitterWiderangeOnline;
					} else {
						// Widerange and offline
						return this.icons.iconTransmitterWiderangeOffline;
					}
				} else {
					// Personal
					if (transmittername in this.monitoringData) {
						// Personal and online
						return this.icons.iconTransmitterPersonalOnline;
					} else {
						// Peronal and offline
						this.icons.iconTransmitterPersonalOffline;
					}
				}
			},
			createIcons() {
				// create icons
				this.icons.iconNodeOnline = L.icon({
					iconUrl: './img/markers/marker-node-online.png',
					iconSize: [30, 30],
					iconAnchor: [15, 15],
					popupAnchor: [0, 0]
				});
				this.icons.iconNodeSuspended = L.icon({
					iconUrl: './img/markers/marker-node-suspended.png',
					iconSize: [30, 30],
					iconAnchor: [15, 15],
					popupAnchor: [0, 0]
				});
				this.icons.iconNodeUnknown = L.icon({
					iconUrl: './img/markers/marker-node-unknown.png',
					iconSize: [30, 30],
					iconAnchor: [15, 15],
					popupAnchor: [0, 0]
				});
				this.icons.iconTransmitterWiderangeOnline = L.icon({
					iconUrl: './img/markers/marker-transmitter-widerange-online.png',
					iconSize: [28, 30],
					iconAnchor: [15, 30],
					popupAnchor: [0, -25]
				});
				this.icons.iconTransmitterWiderangeOffline = L.icon({
					iconUrl: './img/markers/marker-transmitter-widerange-offline.png',
					iconSize: [28, 30],
					iconAnchor: [15, 30],
					popupAnchor: [0, -25]
				});
				this.icons.iconTransmitterPersonalOnline = L.icon({
					iconUrl: './img/markers/marker-transmitter-personal-online.png',
					iconSize: [28, 30],
					iconAnchor: [15, 30],
					popupAnchor: [0, -25]
				});
				this.icons.iconTransmitterPersonalOffline = L.icon({
					iconUrl: './img/markers/marker-transmitter-personal-offline.png',
					iconSize: [28, 30],
					iconAnchor: [15, 30],
					popupAnchor: [0, -25]
				});
			},
			loadTransmitterLocations() {
				// Load avaiable users
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/map')
					.then(response => {
						for (let i = 0; i < response.data.rows.length; i++)
						{
							this.staticData.transmitters[response.data.rows[i].id] =  {
									'usage': response.data.rows[i].value.usage,
									'coordinates': response.data.rows[i].value.coordinates
								};
						}
						this.isLoadingData.transmitters = false;

					})
					.catch(e => {
						console.log('Error getting transmitter locations in transmitters/Map.vue');
				});
			},
			loadNodes() {
				// Load avaiable users
				this.isLoadingData.nodes = true;
				this.$axios.get('nodes')
					.then(response => {
						for (let i = 0; i < response.data.rows.length; i++) {
							this.staticData.nodes[response.data.rows[i]._id] = response.data.rows[i];
							delete this.staticData.nodes[response.data.rows[i]._id]._id;
						}
						this.isLoadingData.nodes = false;
					})
					.catch(e => {
						console.log('Error getting nodes in transmitters/Map.vue');
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
