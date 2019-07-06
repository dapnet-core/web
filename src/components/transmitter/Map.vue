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
						<l-popup v-if="false">
							{{ item.details.changed_on }}
							asas
						</l-popup>
						<!--Transmitter Tooltip-->
						<l-tooltip
							v-if="item.type === 'transmitter' && transmitterDetailsLoaded(item.id)"
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
													<div
														v-if="transmitterQueueDataPresent(item.id)"
														class="chartContainer"
													>
														<chart-message-queue
															:chartData="chartDataMessageQueue(item.id)"
															style="width: 100px; height: 70px;"
														>
														</chart-message-queue>
													</div>
													<div v-else>No graph</div>
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
													v-for="(group, groupindex) in staticData.transmitters[item.id].groups"
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
													v-for="(owner, ownerindex) in staticData.transmitters[item.id].owners"
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
												<v-chip v-if="staticData.transmitters[item.id].aprs_broadcast" color="green" small>YES</v-chip>
												<v-chip v-else color="red" small>NO</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.new.emergency.available.title') }}</v-flex>
											<v-flex xs7>
												<v-chip v-if="staticData.transmitters[item.id].emergency_power && staticData.transmitters[item.id].available" color="green" small>YES</v-chip>
												<v-chip v-else color="red" small>NO</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.usage.title') }}</v-flex>
											<v-flex xs7>
												<v-chip v-if="staticData.transmitters[item.id].usage === 'widerange'" color="primary" small label>Widerange</v-chip>
												<v-chip v-else color="red" small label>personal</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('transmitters.power') }}</v-flex>
											<v-flex xs7>{{ staticData.transmitters[item.id].power }} W</v-flex>
											<v-flex xs5>{{ $t('general.created_on') }}</v-flex>
											<v-flex xs7>{{ getTimestampFormated(staticData.transmitters[item.id].created_on) }}
												{{ $t('general.byUser') }} {{ staticData.transmitters[item.id].created_by }}
											</v-flex>
											<v-flex xs5>{{ $t('general.changed_on') }}</v-flex>
											<v-flex xs7>{{ getTimestampFormated(staticData.transmitters[item.id].changed_on) }}
												{{ $t('general.byUser') }} {{ staticData.transmitters[item.id].changed_by }}
											</v-flex>
										</v-layout></div>
									</v-card-text>
								</v-card>
							</v-layout>
						</l-tooltip>
						<!--Node Tooltip-->
						<l-tooltip
							v-if="item.type === 'node'"
							style="width: 400px;"
						>
							<v-layout fluid>
								<v-card flat color="yellow">
									<v-card-title class="headline">
										<v-layout align-center justify-space-between row>
											<v-flex xs2>{{ item.id }}</v-flex>
										</v-layout>
									</v-card-title>
									<v-card-text>
										<div style="width: 350px;">
											<v-layout row wrap>
												<v-flex xs5>{{ $t('general.description') }}</v-flex>
												<v-flex xs7>{{ staticData.nodes[item.id].description }}
												</v-flex>
											</v-layout>
											<v-layout wrap>
												<v-flex xs5>{{ $t('general.owners') }}</v-flex>
												<v-flex xs7>
													<v-chip
														v-for="(owner, ownerindex) in staticData.nodes[item.id].owners"
														:key="ownerindex"
														small
														label
														color="primary"
													>
														{{ owner }}
													</v-chip>
												</v-flex>
												<v-flex xs5>{{ $t('nodes.new.hamcloud.title') }}</v-flex>
												<v-flex xs7>
													<v-chip v-if="staticData.nodes[item.id].hamcloud" color="green" small>YES</v-chip>
													<v-chip v-else color="red" small>NO</v-chip>
												</v-flex>
												<v-flex xs5>{{ $t('general.changed_on') }}</v-flex>
												<v-flex xs7>{{ getTimestampFormated(staticData.nodes[item.id].changed_on) }}
													{{ $t('general.byUser') }} {{ staticData.nodes[item.id].changed_by }}
												</v-flex>
											</v-layout></div>
									</v-card-text>
								</v-card>
							</v-layout>
						</l-tooltip>
					</l-marker>
					<l-polyline
						v-for="(polyline,index) in map.polylines"
						:key="index"
						:lat-lngs="polyline.latlngs"
						:color="polyline.color"
					>
					</l-polyline>
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
				<v-layout wrap row>
					<v-flex xs3>
						<v-checkbox
							v-model="checkbox.shownodes"
							:label="$t('transmitters.map.checkbox.shownodes')"
							>
						</v-checkbox>
					</v-flex>
					<v-flex xs3>
						<v-checkbox
							v-model="checkbox.shownodeline"
							:label="$t('transmitters.map.checkbox.shownodeline')"
							:disabled="!checkbox.shownodes"
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
	import ChartMessageQueue from '@/components/charts/MessageQueue';

	export default {
		name: 'Map',
		components: {
			ChartMessageQueue
		},
		created() {
			this.setupWShandler();
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
				this.updateMapContent();
			});
			// Initialize zoom
			this.map.zoom = this.$store.getters.map.zoom;
			const map = this.$refs.map.mapObject;
			map.addControl(new window.L.Control.Fullscreen());
		},
		watch: {
			'checkbox.pttstatus'() {
				this.checkbox.onlineonly = this.checkbox.pttstatus;
				this.updateMapContent();
			},
			'checkbox.onlineonly'() {
				this.updateMapContent();
			},
			'checkbox.widerangeonly'() {
				this.updateMapContent();
			},
			'checkbox.shownodes'() {
				if (!this.checkbox.shownodes) {
					this.checkbox.shownodeline = false;

					// Unsubscribe all Nodes Telemetry subscriptions
					if (this.subscriptions.nodes.length > 0) {
						this.wsHandler.send(JSON.stringify({
							unsubscribe_nodes: this.subscriptions.nodes
						}));
					}
				}
				this.updateMapContent();
			},
			'checkbox.shownodeline'() {
				this.updateMapContent();
			}
		},
		data() {
			return {
				checkbox: {
					pttstatus: false,
					onlineonly: false,
					widerangeonly: false,
					shownodes: false,
					shownodeline: false
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
					polylines: [],
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
				wsHandler: null,
				subscriptions: {
					transmitters: [],
					nodes: []
				}
			};
		},
		computed: {
		},
		methods: {
			transmitterQueueDataPresent(transmittername) {
				return (transmittername in this.monitoringData.transmitters &&
					'messages' in this.monitoringData.transmitters[transmittername] &&
					'queued' in this.monitoringData.transmitters[transmittername].messages);
			},
			transmitterDetailsLoaded(transmittername) {
				// return true, if transmitter is already present and details are already loaded (by existence of _rev)
				return ((transmittername in this.staticData.transmitters) &&
					('_rev' in this.staticData.transmitters[transmittername]));
			},
			nodeDetailsLoaded(nodename) {
				// return true, if node is already present and details are already loaded (by existence of _rev)
				return ((nodename in this.staticData.nodes) &&
					('_rev' in this.staticData.nodes[nodename]));
			},
			updateMapContent() {
				this.updateWSSubscriptions();
				this.generateAllMarkersOnMap();
				this.generateAllPolylinesOnMap();
			},
			chartDataMessageQueue(transmittername) {
				if (this.transmitterQueueDataPresent(transmittername)) {
					return {
						labels: ['L', '', 'M', '', 'H'],
						datasets: [{
							backgroundColor: ['#469408', '#e0d32b', '#e08b27', '#e04530', '#d9230f'],
							data: this.monitoringData.transmitters[transmittername].messages.queued
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
			displayThisTransmitter(transmittername) {
				if (this.checkbox.widerangeonly && this.staticData.transmitters[transmittername].usage !== 'widerange') {
					return false;
				}
				if (this.checkbox.onlineonly && (!(transmittername in this.monitoringData.transmitters))) {
					return false;
				}
				return true;
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
			nodeInBounds(nodename) {
				if (nodename in this.staticData.nodes &&
					'coordinates' in this.staticData.nodes[nodename]) {
					let bounds = this.$refs.map.mapObject.getBounds();
					return bounds.contains(new L.LatLng(this.staticData.nodes[nodename].coordinates[0],
						this.staticData.nodes[nodename].coordinates[1]));
				} else {
					console.log('Node ' + nodename + ' not found in staticData or coodinated not present');
					return false;
				}
			},
			generateAllMarkersOnMap() {
				console.log('generateAllMarkersOnMap executed');
				let markerTransmitters = [];
				let makerNodes = [];
				// Transmitters
				// Only put transmitters inside of bound on map
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						if (!this.checkbox.pttstatus) {
							// Static Display
							if (this.displayThisTransmitter(transmitterID)) {
								markerTransmitters.push({
									id: transmitterID,
									type: 'transmitter',
									coordinates: this.staticData.transmitters[transmitterID].coordinates,
									icon: this.getCorrespondingStaticIcon(transmitterID)
								});
							}
						} else {
							// OnAir Display
							if (this.displayThisTransmitter(transmitterID)) {
								markerTransmitters.push({
									id: transmitterID,
									type: 'transmitter',
									coordinates: this.staticData.transmitters[transmitterID].coordinates,
									icon: this.icons.pulsingIconOffAir
								});
							}
						}
					}
				}
				// Nodes
				if (this.checkbox.shownodes) {
					for (let nodeID in this.staticData.nodes) {
						makerNodes.push({
							id: nodeID,
							type: 'node',
							coordinates: this.staticData.nodes[nodeID].coordinates,
							// TODO: get online state via WS and add corresponding Icon
							icon: this.icons.iconNodeOnline
						});
					}
				}
				this.map.markers = markerTransmitters.concat(makerNodes);
				console.log(this.map.markers);
			},
			generateAllPolylinesOnMap() {
				// TODO: Not working, maybe due to node name convention got from CouchDB
				let polylineTransmitterToNodes = [];
				if (this.checkbox.shownodeline) {
					for (let transmitterID in this.monitoringData.transmitters) {
						if (this.displayThisTransmitter(transmitterID)) {
							for (let nodeID in this.staticData.nodes) {
								console.log(nodeID + ' -> ' + this.monitoringData.transmitters[transmitterID].node.name);
								if (('node' in this.monitoringData.transmitters[transmitterID]) &&
									('name' in this.monitoringData.transmitters[transmitterID].node) &&
									(nodeID.search(this.monitoringData.transmitters[transmitterID].node.name) !== -1)) {
									if (('coordinates' in this.staticData.transmitters[transmitterID]) &&
										('coordinates' in this.staticData.nodes[nodeID])) {
										polylineTransmitterToNodes.push({
											latlngs: [this.staticData.transmitters[transmitterID].coordinates,
												this.staticData.nodes[nodeID].coordinates],
											color: this.$helpers.stringToColor(nodeID)
										});
									}
								}
							}
						}
					}
				}
				this.map.polylines = polylineTransmitterToNodes;
				// console.log('Polylines:');
				// console.log(this.map.polylines);
			},
			updateOnlineStatusOnMap(transmittername) {
				// Find corresponding marker
				let found = false;
				let i = 0;
				while (i < this.map.markers.length) {
					if ((this.map.markers[i].id === transmittername && this.map.markers[i].type === 'transmitter')) {
						found = true;
						break;
					} else {
						i++;
					}
				}
				if (!found) {
					console.log('TX ' + transmittername + ' not found, so cannot update online status');
					return;
				}
				let markerToUpdate = this.map.markers[i];
				if (!this.checkbox.pttstatus) {
					markerToUpdate.icon = this.getCorrespondingStaticIcon(transmittername);
				} else {
					markerToUpdate.icon = this.getCorrespondingMonitoringIcon(transmittername);
				}
				this.map.markers.splice(i, 1, markerToUpdate);
			},
			loadMissingTransmitterDetailsInBound() {
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						this.loadMissingTransmitterDetail(transmitterID);
					}
				}
			},

			updateWSSubscriptions() {
				// Transmitters
				let newTXsubscriptions = [];
				let newTXunsubscriptions = [];
				console.log('updateWSSubscription called');
				for (let transmitterID in this.staticData.transmitters) {
					if (this.transmitterInBounds(transmitterID)) {
						// Transmitter marker is on map
						// console.log('Transmitter ID to check: ' + transmitterID);
						// console.log('Current TX subscriptions:');
						// console.log(this.subscriptions.transmitters);
						if (!(this.subscriptions.transmitters.includes(transmitterID))) {
							// Not yet subscribed, add to list to subscribe
							console.log('adding Transmitter ' + transmitterID);
							newTXsubscriptions.push(transmitterID);
						}
					} else {
						// Transmitter marker is off map
						if (this.subscriptions.transmitters.includes(transmitterID)) {
							// Was subscribed, so add to list to unsubscribe
							newTXunsubscriptions.push(transmitterID);
						}
					}
				}
				if (newTXsubscriptions.length > 0) {
					// Send out subscriptions and unsubscription requests
					this.wsHandler.send(JSON.stringify({
						subscribe_transmitters: newTXsubscriptions
					}));
				}
				if (newTXunsubscriptions.length > 0) {
					this.wsHandler.send(JSON.stringify({
						unsubscribe_transmitters: newTXunsubscriptions
					}));
				}

				// Nodes
				// Only do this if the nodes display checkbox is checked
				if (this.checkbox.shownodes) {
					let newNodesubscriptions = [];
					let newNodeunsubscriptions = [];
					for (let nodeID in this.staticData.nodes) {
						if (this.nodeInBounds(nodeID)) {
							// Node marker is on map
							// console.log('Node ID to check: ' + nodeID);
							// console.log('Current node subscriptions:');
							// console.log(this.subscriptions.nodes);
							if (!(this.subscriptions.nodes.includes(nodeID))) {
								// Not yet subscribed, add to list to subscribe
								console.log('adding Node ' + nodeID);
								newNodesubscriptions.push(nodeID);
							}
						} else {
							// Node marker is off map
							if (this.subscriptions.nodes.includes(nodeID)) {
								// Was subscribed, so add to list to unsubscribe
								newNodeunsubscriptions.push(nodeID);
							}
						}
					}
					if (newNodesubscriptions.length > 0) {
						// Send out subscriptions and unsubscription requests
						this.wsHandler.send(JSON.stringify({
							subscribe_nodes: newNodesubscriptions
						}));
					}
					if (newNodeunsubscriptions.length > 0) {
						this.wsHandler.send(JSON.stringify({
							unsubscribe_nodes: newNodeunsubscriptions
						}));
					}
				}
			},
			setupWShandler() {
				// UPDATE: Only one WS Handler is used for all transmitters and node by a subscribe/unsubscrive
				// procedure
				console.log('Setting up single WS Handler');
				this.wsHandler = new WebSocket(this.$store.getters.url.telemetry + '/telemetry/');
				// Add incoming handler
				this.wsHandler.addEventListener('message', e => {
					let data = JSON.parse(e.data);
					if (!this.$helpers.isEmpty(data)) {
						if ('_type' in data) {
							// Process data according to type
							if (data._type === 'transmitter') {
								this.processNewTXWSdata(data);
							} else if (data._type === 'node') {
								this.processNewNodeWSdata(data);
							} else if (data._type === 'subscription') {
								// Update local copy of subscriptions
								this.subscriptions.transmitters = data.transmitters;
								this.subscriptions.nodes = data.nodes;
							}
						}
					}
				});
			},
			processNewTXWSdata(data) {
				if ('_id' in data) {
					let transmittername = data._id;
					if ('messages' in data) {
						data.messages.sent.splice(6, 4);
						data.messages.sent.splice(0, 1);

						data.messages.queued.splice(6, 4);
						data.messages.queued.splice(0, 1);
					}
					if (!(transmittername in this.monitoringData.transmitters)) {
						// save initial copy of data
						this.monitoringData.transmitters[transmittername] = data;
					} else {
						// overwrite with new chunk of data
						this.monitoringData.transmitters[transmittername] =
							Object.assign(this.monitoringData.transmitters[transmittername], data);
					}
					this.updateOnlineStatusOnMap(transmittername);
					// TODO: Only add lines from this transmitter, not all like here
					this.generateAllPolylinesOnMap();
				} else {
					console.log('No _id given in websocket data, Type transmitter');
				}
			},
			processNewNodeWSData(data) {
				if ('_id' in data) {
					let nodename = data._id;
					if (!(nodename in this.monitoringData.nodes)) {
						// save initial copy of data
						this.monitoringData.node[nodename] = data;
					} else {
						// overwrite with new chunk of data
						this.monitoringData.nodes[nodename] =
							Object.assign(this.monitoringData.nodes[nodename], data);
					}
					// TODO: update Node online status
					// this.updateOnlineStatusOnMap(transmittername);
					// TODO: Only add lines from this transmitter, not all like here
					// this.generateAllPolylinesOnMap();
				} else {
					console.log('No _id given in websocket data, Type node');
				}
			},
			loadMissingTransmitterDetail(transmittername) {
				// If transmitter is not already present or details not already loaded (by existens of _rev)
				if (!(this.transmitterDetailsLoaded(transmittername))) {
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
					if (transmittername in this.monitoringData.transmitters) {
						// Widerange and online
						return this.icons.iconTransmitterWiderangeOnline;
					} else {
						// Widerange and offline
						return this.icons.iconTransmitterWiderangeOffline;
					}
				} else {
					// Personal
					if (transmittername in this.monitoringData.transmitters) {
						// Personal and online
						return this.icons.iconTransmitterPersonalOnline;
					} else {
						// Peronal and offline
						return this.icons.iconTransmitterPersonalOffline;
					}
				}
			},
			getCorrespondingMonitoringIcon(transmittername) {
				if (transmittername in this.monitoringData.transmitters && (this.monitoringData.transmitters[transmittername].onair)) {
					return this.icons.pulsingIconOnAir;
				} else {
					return this.icons.pulsingIconOffAir;
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
				this.icons.pulsingIconOnAir = L.icon.pulse({
					iconSize: [12, 12],
					color: 'green',
					animate: true
				});
				this.icons.pulsingIconOffAir = L.icon.pulse({
					iconSize: [12, 12],
					color: 'green',
					animate: false
				});
			},
			loadTransmitterLocations() {
				// Load avaiable users
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/map')
					.then(response => {
						for (let i = 0; i < response.data.rows.length; i++) {
							this.staticData.transmitters[response.data.rows[i].id] = {
								'usage': response.data.rows[i].value.usage,
								'coordinates': response.data.rows[i].value.coordinates
							};
						}
						this.isLoadingData.transmitters = false;
						console.log('loading of transmitterlocations done');
						this.loadMissingTransmitterDetailsInBound();
						this.updateMapContent();
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
						this.loadMissingTransmitterDetailsInBound();
						this.updateMapContent();
						console.log('loading of node done');
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
