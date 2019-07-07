<template>
	<v-container fluid fill-height>
		<v-layout justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('pagetitle.transmitter.edit') :
											this.$t('pagetitle.transmitter.new') }}</span>
					</v-card-title>
					<v-form v-model="isFormValid" ref="form">
						<v-card-text>
							<v-container grid-list-md>
								<v-layout wrap>
									<!--ID-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											name="_id"
											prepend-icon="label"
											required
											:counter="20"
											v-bind:rules="validationRules._id"
											v-model="form._id"
											v-bind:label="$t('transmitters.new.callsign.title')"
											v-bind:hint="$t('transmitters.new.callsign.help')"
											persistent-hint
											type="text"
											v-bind:readonly="isEditMode ? true : false"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
									<!-- Auth Key-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											prepend-icon="vpn_key"
											name="auth_key"
											required
											:counter="30"
											v-bind:rules="validationRules.authkey"
											v-model="form.auth_key"
											v-bind:label="$t('transmitters.new.authkey.title')"
											v-bind:hint="$t('transmitters.new.authkey.help')"
											v-bind:type="authkeyVisible ? 'text' : 'password'"
											persistent-hint
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
									<v-flex xs12 sm12 md2>
										<v-tooltip bottom>
											<v-btn class="action-buttons"
												flat
												icon
												small
												v-on:click="authkeyVisible = !authkeyVisible"
												slot="activator"
											>
												<v-icon v-if="authkeyVisible">visibility_off</v-icon>
												<v-icon v-if="!authkeyVisible">visibility</v-icon>
											</v-btn>
											<span>{{ this.$t('general.toggleauthkeyvisibility') }}</span>
										</v-tooltip>
										<v-tooltip bottom>
											<v-btn class="action-buttons"
												flat
												icon
												small
												v-clipboard:copy="form.auth_key"
												slot="activator"
											>
												<v-icon>assignment</v-icon>
											</v-btn>
											<span><span>{{ this.$t('general.copyauthkeytoclipboard') }}</span></span>
										</v-tooltip>
										<v-tooltip bottom>
											<v-btn class="action-buttons"
												flat
												icon
												small
												v-on:click="form.auth_key = $helpers.generatePassword(); authkeyVisible = true;"
												slot="activator"
											>
												<v-icon>refresh</v-icon>
											</v-btn>
											<span>{{ this.$t('general.generaterandomauthkey') }}</span>
										</v-tooltip>
									</v-flex>
								</v-layout>
								<!--Location-->
								<v-layout wrap>
									<!--TODO: Make aligment of boxes better -->
									<v-card>
										<v-card-title>
											<v-icon>my_location</v-icon>
											{{ this.$t('general.latlong.title') }}
										</v-card-title>
										<v-card-text>
											<v-layout wrap>
												<v-flex xs3 sm3 md3>
													<v-select
														:items="northsouthSelect"
														item-text="label"
														item-value="value"
														required
														v-model="form.latlong.northsouth"
														@input="updateLocationFromUserInput"
													>
													</v-select>
												</v-flex>
												<v-flex xs9 sm3 md3>
													<v-text-field
														required
														v-bind:rules="validationRules.latitude"
														v-model="form.latlong.absolute.latitude"
														v-bind:label="$t('general.latlong.latitude')"
														type="number"
														@input="updateLocationFromUserInput"
														suffix="°"
													>
													</v-text-field>
												</v-flex>
												<v-flex xs3 sm3 md3>
													<v-select
														:items="westeastSelect"
														item-text="label"
														item-value="value"
														required
														v-model="form.latlong.westeast"
														@input="updateLocationFromUserInput"
													>
													</v-select>
												</v-flex>
												<v-flex xs9 sm3 md3>
													<v-text-field
														required
														v-bind:rules="validationRules.longitude"
														v-model="form.latlong.absolute.longitude"
														v-bind:label="$t('general.latlong.longitude')"
														type="number"
														@input="updateLocationFromUserInput"
														suffix="°"
													>
													</v-text-field>
												</v-flex>
											</v-layout>
										</v-card-text>
										<!--OSM Map-->
										<v-card-media>
											<l-map
												:zoom="map.zoom"
												:center="mapCenter"
												@click="mapClicked"
												style="height: 30em"
											>
												<l-tile-layer
													:url="map.url"
													:attribution="map.attribution"
												>
												</l-tile-layer>
												<l-marker
													:lat-lng="mapMarker"
												>
												</l-marker>
											</l-map>
										</v-card-media>
									</v-card>
								</v-layout>
								<!--Usage and Power-->
								<v-layout wrap>
									<!-- Usage Select -->
									<v-flex xs12 sm6 md6>
										<v-select
											:items="usagesSelect"
											item-text="label"
											item-value="value"
											required
											v-model="form.usage"
											v-bind:rules="validationRules.usage"
											v-bind:label="$t('transmitters.usage.title')"
											v-bind:hint="$t('transmitters.new.usage.help')"
											persistent-hint
											prepend-icon="settings_input_antenna"
										>
										</v-select>
									</v-flex>
									<!-- Power at Antenna feeding point -->
									<v-flex xs12 sm6 md6>
										<v-text-field
											required
											v-model="form.power"
											v-bind:rules="validationRules.power"
											v-bind:label="$t('transmitters.power')"
											v-bind:hint="$t('transmitters.new.power.help')"
											persistent-hint
											prepend-icon="network_check"
											type="number"
											suffix="Watt"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<v-layout wrap>
									<v-flex xs12 sm6 md6>
										<v-select
											:items="antennaTypeSelect"
											item-text="label"
											item-value="value"
											required
											v-model="form.antenna.type"
											v-bind:rules="validationRules.antennaType"
											v-bind:label="$t('transmitters.new.antennatype.title')"
											v-bind:hint="$t('transmitters.new.antennatype.help')"
											persistent-hint
											prepend-icon="wifi_tethering"
										>
										</v-select>
									</v-flex>
									<v-flex xs12 sm6 md6
											v-if="(form.antenna.type === 'directional') "
									>
										<v-text-field
											required
											v-model="form.antenna.direction"
											v-bind:label="$t('transmitters.new.antennadirection.title')"
											v-bind:hint="$t('transmitters.new.antennadirection.help')"
											v-bind:rules="validationRules.antennaDirection"
											persistent-hint
											prepend-icon="360"
											type="number"
											suffix="°"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<v-layout wrap>
									<v-flex xs12 sm6 md6>
										<v-text-field
											required
											v-model="form.antenna.gain"
											v-bind:label="$t('transmitters.new.antennagain.title')"
											v-bind:hint="$t('transmitters.new.antennagain.help')"
											v-bind:rules="validationRules.antennaGain"
											persistent-hint
											prepend-icon="360"
											type="number"
											suffix="dBi"
										>
										</v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field
											required
											v-model="form.antenna.agl"
											v-bind:rules="validationRules.antennaElevation"
											v-bind:label="$t('transmitters.new.antennalevel.title')"
											v-bind:hint="$t('transmitters.new.antennalevel.help')"
											persistent-hint
											prepend-icon="360"
											type="number"
											suffix="m"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!-- APRS Broadcast and Enabled-->
								<v-layout wrap>
									<!-- APRS Broadcast -->
									<v-flex xs12 sm6 md4>
										<v-switch
											v-model="form.aprs_broadcast"
											v-bind:label="$t('transmitters.new.aprs_broadcast.title')"
											v-bind:hint="$t('transmitters.new.aprs_broadcast.help')"
											persistent-hint
											prepend-icon="location_on"
										>
										</v-switch>
									</v-flex>
									<!-- Enabled -->
									<v-flex xs12 sm6 md4>
										<v-switch
											v-model="form.enabled"
											v-bind:label="$t('transmitters.new.enabled.title')"
											v-bind:hint="$t('transmitters.new.enabled.help')"
											persistent-hint
											prepend-icon="power_settings_new"
										>
										</v-switch>
									</v-flex>
								</v-layout>
								<!-- Emergency power-->
								<v-layout wrap>
									<!-- Emergency Power available -->
									<v-flex xs12 sm12 md12>
										<v-switch
											v-model="form.emergency_power.available"
											v-bind:label="$t('transmitters.new.emergency.available.title')"
											v-bind:hint="$t('transmitters.new.emergency.available.help')"
											persistent-hint
										>
										</v-switch>
									</v-flex>
								</v-layout>
								<v-layout v-if="form.emergency_power.available">
									<!-- Emergency Power infinite? -->
									<v-flex xs12 sm6 md4>
										<v-switch
											v-bind:disabled="!form.emergency_power.available"
											v-model="form.emergency_power.infinite"
											v-bind:label="$t('transmitters.new.emergency.infinite.title')"
											v-bind:hint="$t('transmitters.new.emergency.infinite.help')"
											persistent-hint
										>
										</v-switch>
									</v-flex>
									<!-- Emergency Power duration -->
									<v-flex xs12 sm6 md4 v-if="(form.emergency_power.available) && (!form.emergency_power.infinite)">
										<v-text-field
											required
											v-bind:value="form.emergency_power.duration"
											v-bind:label="$t('transmitters.new.emergency.duration.title')"
											v-bind:hint="$t('transmitters.new.emergency.duration.help')"
											persistent-hint
											prepend-icon="timer"
											type="number"
											v-bind:rules="validationRules.emergency_duration"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!--Timeslots-->
								<v-card>
									<v-card-title>
										{{ this.$t('transmitters.new.timeslots.title') }}
									</v-card-title>

									<v-card-text>
										<v-layout v-if="noTimeslotsSelected">
											<v-flex xs12>
												<v-alert
													:value="true"
													type="error"
												>
													{{ $t('formvalidation.noTimeslotSelected') }}
												</v-alert>
											</v-flex>
										</v-layout>
										<!--Button Group-->
										<v-layout row wrap justify-space-around>
											<v-flex xs12 sm9 class="py-2">
												<v-btn-toggle
													v-model="timeslots_numeric"
													multiple
													mandatory
													@change="updateTimeslotsToBoolean"
												>
													<v-btn
														v-for="(index,i) in 16" :key="i"
														color="primary"
													>
														{{ i.toString(16).toUpperCase() }}</v-btn>

												</v-btn-toggle>
											</v-flex>
											<v-flex xs12 sm3>
												<v-btn
													v-on:click="EnableAllTimeslots"
													align-end
												>
													Select all
												</v-btn>
											</v-flex>
										</v-layout>
									</v-card-text>
								</v-card>
								<!-- Transmitter Groups -->
								<v-layout>
									<v-flex>
										<v-combobox
											v-model="form.groups"
											:items="formData.transmitter_groups"
											:search-input.sync="transmitterGroupSearch"
											hide-selected
											prepend-icon="people"
											v-bind:label="$t('general.transmitter_groups')"
											v-bind:hint="$t('transmitters.new.transmitter_groups.help')"
											persistent-hint
											multiple
											small-chips
											deletable-chips
											:loading="isLoadingData.transmitter_groups"
										>
											<template slot="no-data">
												<v-list-tile>
													<v-list-tile-content>
														<v-list-tile-title>
															No results matching "<strong>{{ transmitterGroupSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
														</v-list-tile-title>
													</v-list-tile-content>
												</v-list-tile>
											</template>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-combobox>
									</v-flex>
								</v-layout>
								<!-- owners selection -->
								<v-layout>
									<v-flex>
										<v-autocomplete
											chips
											small-chips
											deletable-chips
											multiple
											hide-selected
											prepend-icon="assignment_ind"
											v-model="form.owners"
											:items="formData.users"
											v-bind:label="$t('general.owners')"
											v-bind:hint="$t('transmitters.new.owner.help')"
											persistent-hint
											:loading="isLoadingData.users"
											v-bind:rules="validationRules.owners"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-autocomplete>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>
						<!-- Timestamps -->
						<v-card
							v-if="isEditMode"
							color=""
						>
							<v-card-text
								v-if="$vuetify.breakpoint.lgAndUp"
							>
								<v-layout row wrap class="dark--text">
									<v-flex lg3>{{ $t('general.created_on') }}</v-flex>
									<v-flex lg>{{ $t('general.byUser') }}</v-flex>
									<v-flex lg3>{{ $t('general.changed_on') }}</v-flex>
									<v-flex lg3>{{ $t('general.byUser') }}</v-flex>
								</v-layout>
								<v-layout row wrap>
									<v-flex lg3>{{ this.created_on}}</v-flex>
									<v-flex lg3>{{ this.created_by}}</v-flex>
									<v-flex lg3>{{ this.changed_on}}</v-flex>
									<v-flex lg3>{{ this.changed_by}}</v-flex>
								</v-layout>
							</v-card-text>
							<v-card-text
								v-if="!$vuetify.breakpoint.lgAndUp"
							>
								<v-layout row wrap class="dark--text">
									<v-flex xs6>{{ $t('general.created_on') }}</v-flex>
									<v-flex xs6>{{ $t('general.byUser') }}</v-flex>
								</v-layout>
								<v-layout row wrap>
									<v-flex xs6>{{ this.created_on}}</v-flex>
									<v-flex xs6>{{ this.created_by}}</v-flex>
								</v-layout>
							</v-card-text>
							<v-card-text
								v-if="!$vuetify.breakpoint.lgAndUp"
							>
								<v-layout row wrap class="dark--text">
									<v-flex xs6>{{ $t('general.changed_on') }}</v-flex>
									<v-flex xs6>{{ $t('general.byUser') }}</v-flex>
								</v-layout>
								<v-layout row wrap>
									<v-flex xs6>{{ this.changed_on}}</v-flex>
									<v-flex xs6>{{ this.changed_by}}</v-flex>
								</v-layout>
							</v-card-text>

						</v-card>

						<!-- Buttons -->
						<v-card-actions>
							<v-btn
								color="primary"
								@click="submitForm"
								:disabled="!isFormValid || noTimeslotsSelected"
							>
								{{ $t('general.submit') }}
							</v-btn>
							<v-btn
								color="red"
								@click="abortButton"
							>
								{{ $t('general.abort') }}
							</v-btn>
						</v-card-actions>
					</v-form>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
	import moment from 'moment';
	import L from 'leaflet';

	export default {
		components: {
		},
		created() {
			this.loadData();
		},
		mounted() {
			this.$refs.form.validate();
		},
		data() {
			return {
				isLoadingData: {
					general: true,
					users: true,
					transmitters: true,
					transmitter_groups: true
				},
				isFormValid: true,
				authkeyVisible: false,
				form: {
					_id: '',
					_rev: '',
					usage: '',
					timeslots: [],
					power: 0,
					owners: [],
					groups: [],
					emergency_power: {
						available: false,
						infinite: false,
						duration: 0
					},
					coordinates: [0, 0],
					latlong: {
						northsouth: 1,
						westeast: 1,
						absolute: {
							latitude: 50,
							longitude: 10
						}
					},
					aprs_broadcast: false,
					enabled: true,
					auth_key: '',
					antenna: {
						type: '',
						gain: null,
						direction: 0,
						agl: 0
					}
				},
				formData: {
					users: [],
					transmitters: [],
					transmitter_groups: []
				},
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: '',
				isEditMode: (!!(this.$route.params.id)),
				transmitterGroupSearch: null,
				timeslots_numeric: [],
				map: {
					zoom: this.$store.getters.map.zoom,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
					url: this.$store.getters.url.map
				},
				mapMarker: {
					lat: 50,
					lng: 10
				},
				mapCenter: {
					lat: 50,
					lng: 10
				}
			};
		},
		computed: {
			usagesSelect() {
				return [
					{
						value: 'personal',
						label: this.$t('transmitters.usage.personal')
					},
					{
						value: 'widerange',
						label: this.$t('transmitters.usage.widerange')
					}
				];
			},
			northsouthSelect() {
				return [
					{
						value: 1,
						label: this.$t('general.latlong.north')
					},
					{
						value: -1,
						label: this.$t('general.latlong.south')
					}
				];
			},
			westeastSelect() {
				return [
					{
						value: 1,
						label: this.$t('general.latlong.east')
					},
					{
						value: -1,
						label: this.$t('general.latlong.west')
					}
				];
			},
			antennaTypeSelect() {
				return [
					{
						value: 'omni',
						label: this.$t('transmitters.new.antennatype.omni')
					},
					{
						value: 'directional',
						label: this.$t('transmitters.new.antennatype.directional')
					}
				];
			},
			noTimeslotsSelected() {
				return (this.timeslots_numeric.length <= 0);
			},
			validationRules() {
				return {
					'_id': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.callsign') }),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.callsign'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.callsign'),
							count: '3'
						}),
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric'),
						v => (v && this.isEditMode) || (v && !this.formData.transmitters.includes(v)) || this.$t('formvalidation.allreadypresent', {
							fieldname: this.$t('general.callsign')
						})
					],
					'authkey': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('transmitters.new.authkey.title') }),
						v => (v && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('transmitters.new.authkey.title'),
							count: '30'
						}),
						v => (v && v.length >= 4) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('transmitters.new.authkey.title'),
							count: '4'
						}),
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric')
					],
					'owners': [
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('formvalidation.minoneowner') })
					],
					'emergency_duration': [
						v => (v && v > 0) || this.$t('formvalidation.notzeroornegative', { fieldname: this.$t('transmitters.new.emergency.duration.title_short') })
					],
					'latitude': [
						v => (v && v >= 0) || this.$t('formvalidation.notnegative', { fieldname: this.$t('general.latlong.latitude') }),
						v => (v && v <= 90) || this.$t('formvalidation.notgreateras', {
							fieldname: this.$t('general.latlong.latitude'),
							max: 90
						})
					],
					'longitude': [
						v => (v && v >= 0) || this.$t('formvalidation.notnegative', { fieldname: this.$t('general.latlong.longitude') }),
						v => (v && v <= 180) || this.$t('formvalidation.notgreateras', {
							fieldname: this.$t('general.latlong.longitude'),
							max: 180
						})
					],
					'antennaDirection': [
						v => (v && v >= 0 && v < 360) || this.$t('formvalidation.OutOfRange', {
							fieldname: this.$t('transmitters.new.antennadirection.title'),
							min: 0,
							max: 360
						})
					],
					'antennaGain': [
						v => (v && v >= -40 && v <= 60) || this.$t('formvalidation.OutOfRange', {
							fieldname: this.$t('transmitters.new.antennagain.title_short'),
							min: -40,
							max: 60
						})
					],
					'antennaType': [
						v => (v && v !== '') || this.$t('formvalidation.antennaTypeSelected')
					],
					'antennaElevation': [
						v => (v && v > 0) || this.$t('formvalidation.notzeroornegative', { fieldname: this.$t('transmitters.new.antennalevel.title_short') })
					],
					'usage': [
						v => (v && v !== '') || this.$t('formvalidation.usageSelected')
					],
					'power': [
						v => (v && v > 0) || this.$t('formvalidation.notzeroornegative', { fieldname: this.$t('transmitters.new.power.title_short') })
					]
				};
			}
		},
		methods: {
			updateTimeslotsToBoolean() {
				var timeslotsHelp = [];
				for (var i = 0; i < 16; i++) {
					if (this.timeslots_numeric.includes(i)) {
						timeslotsHelp.push(true);
					} else {
						timeslotsHelp.push(false);
					}
				}
				this.form.timeslots = timeslotsHelp;
			},
			EnableAllTimeslots() {
				this.timeslots_numeric = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
				this.updateTimeslotsToBoolean();
			},
			updateLocationFromUserInput() {
				this.form.coordinates[0] = this.form.latlong.absolute.latitude * this.form.latlong.northsouth;
				this.form.coordinates[1] = this.form.latlong.absolute.longitude * this.form.latlong.westeast;
				this.mapMarker = {
					lat: this.form.coordinates[0],
					lng: this.form.coordinates[1]
				};
				this.mapCenter = this.mapMarker;
			},
			mapClicked(e) {
				this.mapMarker = e.latlng;

				// set position in form
				this.form.latlong.absolute.latitude = Math.abs(e.latlng.lat).toFixed(6);
				this.form.latlong.northsouth = (e.latlng.lat >= 0 ? 1 : -1);
				this.form.latlong.absolute.longitude = Math.abs(e.latlng.lng).toFixed(6);
				this.form.latlong.westeast = (e.latlng.lng >= 0 ? 1 : -1);
				this.form.coordinates[0] = this.form.latlong.absolute.latitude * this.form.latlong.northsouth;
				this.form.coordinates[1] = this.form.latlong.absolute.longitude * this.form.latlong.westeast;
			},
			loadData() {
				// Load available users
				this.isLoadingData.users = true;
				this.$axios.get('users/_usernames')
					.then(response => {
						this.formData.users = response.data;
						this.isLoadingData.users = false;
					}).catch(e => {
						this.isLoadingData.users = false;
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.users.names.title'), e);
					});

				// Load available transmitters names
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/_names')
					.then(response => {
						this.formData.transmitters = response.data;
						this.isLoadingData.transmitters = false;
					}).catch(e => {
						console.log('Error getting transmitter names in transmitter/new.vue');
						this.isLoadingData.transmitters = false;
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.transmitters.names.title'), e);
					});

				// Load available transmitters groups
				this.isLoadingData.transmitter_groups = true;
				this.$axios.get('transmitters/_groups')
					.then(response => {
						this.formData.transmitter_groups = response.data;
						this.isLoadingData.transmitter_groups = false;
					}).catch(e => {
						console.log('Error getting transmitter groups in transmitter/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.transmitters.groups.title'), e);
					});

				// load data of given id
				this.isLoadingData.general = true;
				if (this.$route.params.id) {
					console.log('params:' + this.$route.params.id);
					this.isEditMode = true;
					this.$axios.get('transmitters/' + this.$route.params.id)
						.then(response => {
							this.form._id = response.data._id;
							this.form._rev = response.data._rev;
							this.form.usage = response.data.usage;
							this.form.timeslots = response.data.timeslots;
							for (var i = 0; i < this.form.timeslots.length; i++) {
								if (this.form.timeslots[i]) {
									this.timeslots_numeric.push(i);
								}
							}
							this.form.power = response.data.power;
							this.form.owners = response.data.owners;
							this.form.groups = response.data.groups;

							// Set default values, to be overwritten eventually now:
							this.form.emergency_power.available = false;
							this.form.emergency_power.infinite = false;
							this.form.emergency_power.duration = 0;

							if (response.data.emergency_power && response.data.emergency_power.available) {
								if (response.data.emergency_power.infinite) {
									this.form.emergency_power.infinite = response.data.emergency_power.infinite;
								} else {
									this.form.emergency_power.infinite = false;
								}
								if (response.data.emergency_power.duration && (!response.data.emergency_power.infinite)) {
									this.form.emergency_power.duration = response.data.emergency_power.duration;
								}
							}

							// Map and Coordinates
							if (response.data.coordinates &&
								Array.isArray(response.data.coordinates) &&
								response.data.coordinates.length === 2) {
								this.mapCenter = L.latLng(response.data.coordinates[0], response.data.coordinates[1]);

								this.form.latlong.northsouth = (response.data.coordinates[0] > 0 ? 1 : -1);
								this.form.latlong.westeast = (response.data.coordinates[1] > 0 ? 1 : -1);
								this.form.latlong.absolute.latitude = Math.abs(response.data.coordinates[0]).toFixed(6);
								this.form.latlong.absolute.longitude = Math.abs(response.data.coordinates[1]).toFixed(6);
								this.mapMarker = this.mapCenter;
							}


							// Format timestamp into readable version
							if (response.data.created_on) {
								this.created_on = moment(response.data.created_on).format('DD.MM.YYYY HH:mm:ss');
							} else {
								response.data.created_on = '';
							}
							if (response.data.created_by) {
								this.created_by = response.data.created_by;
							} else {
								this.created_by = '';
							}
							if (response.data.changed_on) {
								this.changed_on = moment(response.data.changed_on).format('DD.MM.YYYY HH:mm:ss');
							} else {
								this.changed_on = '';
							}
							if (response.data.changed_by) {
								this.changed_by = response.data.changed_by;
							} else {
								this.changed_by = '';
							}

							if (response.data.aprs_broadcast) {
								this.form.aprs_broadcast = response.data.aprs_broadcast;
							}
							if (response.data.enabled) {
								this.form.enabled = response.data.enabled;
							}
							if (response.data.auth_key) {
								this.form.auth_key = response.data.auth_key;
							}
							if (response.data.antenna) {
								if (response.data.antenna.type) {
									this.form.antenna.type = response.data.antenna.type;
								}
								if (response.data.antenna.gain) {
									this.form.antenna.gain = response.data.antenna.gain;
								}
								if (response.data.antenna.direction) {
									this.form.antenna.direction = response.data.antenna.direction;
								}
								if (response.data.antenna.agl) {
									this.form.antenna.agl = response.data.antenna.agl;
								}
							}
						}).catch(e => {
							console.log('Error getting transmitter\'s individual details with axios or any exception in the get handler.');
							this.$helpers.swalError(this,
								this.$i18n.t('alerts.errorLoad.transmitters.details.title', { fieldname: this.$route.params.id }),
								e);
							this.$router.push('/transmitters');
						});
				} else {
					this.isEditMode = false;
				}
				this.isLoadingData.general = false;
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				if (this.$refs.form.validate() && this.timeslots_numeric.length > 0) {
					let data2Send = {};
					data2Send.power = parseInt(this.form.power);
					data2Send.antenna = this.form.antenna;
					data2Send.antenna.gain = parseInt(this.form.antenna.gain);
					data2Send.antenna.direction = parseInt(this.form.antenna.direction);
					data2Send.antenna.agl = parseInt(this.form.antenna.agl);
					data2Send._id = this.form._id;
					if (this.isEditMode) {
						// if this is Node Mode
						data2Send._rev = this.form._rev;
					}
					data2Send.usage = this.form.usage;
					data2Send.timeslots = this.form.timeslots;
					data2Send.owners = this.form.owners;
					data2Send.groups = this.form.groups;
					data2Send.emergency_power = this.form.emergency_power;
					data2Send.emergency_power.duration = parseInt(this.form.emergency_power.duration);
					data2Send.coordinates = this.form.coordinates;
					data2Send.aprs_broadcast = this.form.aprs_broadcast;
					data2Send.enabled = this.form.enabled;
					data2Send.auth_key = this.form.auth_key;

					console.log('Data2Send von transmitter:');
					console.log(data2Send);

					// Send data via axios by PUT
					this.$axios.put('transmitters', data2Send)
						.then(response => {
							// this.$router.push('/transmitters');
							this.$router.go(-1);

							// Show Info snackbox of success
							if (this.isEditMode) {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.editmode.transmitter.success.title', { fieldname: this.form._id }));
							} else {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.addmode.transmitter.success.title', { fieldname: this.form._id }));
								// Trigger Reload of sidebar Icons
								this.$root.$emit('ReloadSidebarIcons');
							}
						}).catch(e => {
							console.log('Error in Data Put in transmitter/New.vue');
							console.log(e);
							// Show Error SWAL2
							if (this.isEditMode) {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.editmode.transmitter.fail.title', { fieldname: this.form._id }),
									e);
							} else {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.addmode.transmitter.fail.title', { fieldname: this.form._id }),
									e);
							}
						});
				}
			},
			abortButton(event) {
				this.$router.go(-1);
				//this.$router.push('/transmitters');
			}
		}
	};
</script>
<style scoped>
	.action-buttons {
		padding: 1px;
		margin: 0px;
		display: inline-block;
	}
</style>
