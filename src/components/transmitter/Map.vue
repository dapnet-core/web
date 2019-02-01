<template>
	<v-container fluid fill-height>
		<v-card class="elevation-12" min-width="95%">
			<v-card-title>
				<span class="headline">{{ $t('transmitters.map.title') }}</span>
			</v-card-title>
			<v-card-text>
			</v-card-text>
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
						v-for="(item, index) in map.markers"
						:key="item.name"
						:lat-lng="item.coordinates"
						:icon="item.icon"
						@click="loadCoverage(item.id)"
						@mouseover="loadTransmitterDetails(item.id, index)"
					>
						<l-popup v-if="item.details !== undefined">
							{{ item.details.changed_on }}
							asas
						</l-popup>
						<l-tooltip
							v-if="item.details"
							style="width: 400px;"
						>
							<v-layout fluid min-width="400px">
								<v-card flat>
									<v-card-title class="headline">
										{{ item.id }}
									</v-card-title>
									<v-card-text>
										<v-layout wrap>
											<v-flex xs5>{{ $t('general.transmitter_groups') }}</v-flex>
											<v-flex xs7>
												<v-chip
													v-for="(group, index) in item.details.groups"
													:key="index"
													small
													label
													color="primary"
												>
													{{ group }}
												</v-chip>
											</v-flex>
											<v-flex xs5>{{ $t('general.owners') }}</v-flex>
											<v-flex xs7>
												<v-chip
													v-for="(owner, index) in item.details.owners"
													:key="index"
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
										</v-layout>
									</v-card-text>
								</v-card>
							</v-layout>
						</l-tooltip>
					</l-marker>
				</l-map>
			</v-card-media>
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
			this.$refs.map.mapObject.on('moveend', () => {
				this.centerLatLong = this.$refs.map.mapObject.getCenter();
				this.map.bounds = this.$refs.map.mapObject.getBounds();
				console.log('map was moved');
				this.loadTransmitterDetailsInBound();
			});
			this.map.zoom = this.$store.getters.map.zoom;
		},
		watch: {
			'isLoadingData.transmitters'() {
				if (!this.isLoadingData.transmitters) {
					this.updateMapContent();
				}
			}
/*
			,
			'isLoadingData.nodes'() {
				if (!this.isLoadingData.nodes) {
					this.updateMapContent();
				}
			}
*/
		},
		data() {
			return {
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
				data: {
					transmitters: {},
					nodes: {}
				},
				icons: {}
			};
		},
		computed: {
		},
		methods: {
			getTimestampFormated(ISOTime) {
				return moment(ISOTime).format('LLL');
			},
			loadCoverage() {
			},
			updateMapContent() {
				console.log('updateMapContent');
				let markerTransmitters = [];
				let polylineTransmitters = [];

				for (let i = 0; i < this.data.transmitters.rows.length; i++) {
					// if (this.skipThisTransmitter(transmitter)) return true;
					let transmitter = this.data.transmitters.rows[i];
					let selectedMarkerIcon = null;
					// find icon
					if (transmitter.value.usage === 'widerange') {
						// TODO: There is no information about the online or offline status in the transmitter/map answer yet
						// so for now all transmitters are displayed as online
						selectedMarkerIcon = this.icons.iconTransmitterWiderangeOnline;
					} else {
						// TODO: There is no information about the online or offline status in the transmitter/map answer yet
						// so for now all transmitters are displayed as online
						selectedMarkerIcon = this.icons.iconTransmitterPersonalOnline;
					}
					markerTransmitters.push({
						id: transmitter.id,
						name: 't_' + transmitter.id,
						coordinates: transmitter.value.coordinates,
						icon: selectedMarkerIcon
					});
				}
				this.map.markers = markerTransmitters;
				console.log(this.map.markers);
				this.loadTransmitterDetailsInBound();
			},
			loadTransmitterDetailsInBound() {
				let bounds = this.$refs.map.mapObject.getBounds();
				for (let i = 0; i < this.map.markers.length; i++) {
					if (bounds.contains(new L.LatLng(this.map.markers[i].coordinates[0], this.map.markers[i].coordinates[1]))) {
						// console.log('IN:  ' + this.map.markers[i].id);
						this.loadTransmitterDetails(this.map.markers[i].id, i);
					} else {
						// console.log('OUT: ' + this.map.markers[i].id);
					}
				}
			},
			loadTransmitterDetails(transmittername, markerindex) {
				if (!('details' in this.map.markers[markerindex])) {
					// Load transmitter details
					console.log('Loading TX details of: ' + transmittername);
					this.isLoadingData.transmitterdetails = true;
					this.$axios.get('transmitters/' + transmittername)
						.then(response => {
							let updatedmarker = this.map.markers[markerindex]
							updatedmarker.details = response.data;
							this.map.markers.splice(markerindex, 1, updatedmarker);
							this.isLoadingData.transmitterdetails = false;
						}).catch(e => {
							console.log('Error getting transmitter details in transmitters/Map.vue');
					});
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
						this.data.transmitters = response.data;
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
						this.data.nodes = response.data;
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

</style>
