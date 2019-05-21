<template>
	<v-container fluid fill-height>
		<v-layout justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('pagetitle.node.edit') :
											this.$t('pagetitle.node.new') }}</span>
					</v-card-title>
					<v-form v-model="isFormValid" ref="form">
						<v-card-text>
							<v-container grid-list-md>
								<v-layout wrap>
									<!--ID-->
									<v-flex xs12 sm12 md6>
										<v-text-field
											name="_id"
											prepend-icon="label"
											required
											:counter="20"
											:rules="validationRules._id"
											v-model="form._id"
											:label="$t('general.name')"
											:hint="$t('nodes.new.id.help')"
											persistent-hint
											type="text"
											:readonly="isEditMode ? true : false"
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
											:rules="validationRules.authkey"
											v-model="form.auth_key"
											:label="$t('general.authkey')"
											:hint="$t('nodes.new.authkey.help')"
											:type="authkeyVisible ? 'text' : 'password'"
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
								<v-layout wrap>
									<!--Description-->
									<v-flex xs12 sm12 md6>
										<v-text-field
											name="description"
											prepend-icon="description"
											:counter="30"
											:rules="validationRules.description"
											v-model="form.description"
											:label="$t('general.description')"
											:hint="$t('nodes.new.description.help')"
											persistent-hint
											type="text"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
									<!--Hamcloud?-->
									<v-flex xs12 sm12 md6>
										<v-switch
											v-model="form.hamcloud"
											:label="$t('nodes.new.hamcloud.title')"
											:hint="$t('nodes.new.hamcloud.help')"
											persistent-hint
											prepend-icon="cloud"
										>
										</v-switch>
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
														:rules="validationRules.latitude"
														v-model="form.latlong.absolute.latitude"
														:label="$t('general.latlong.latitude')"
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
														:rules="validationRules.longitude"
														v-model="form.latlong.absolute.longitude"
														:label="$t('general.latlong.longitude')"
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
											:label="$t('general.owners')"
											:hint="$t('nodes.new.owner.help')"
											persistent-hint
											:loading="isLoadingData.users"
											:rules="validationRules.owners"
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
								:disabled="!isFormValid"
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
					nodes: true
				},
				isFormValid: true,
				authkeyVisible: false,
				form: {
					_id: '',
					_rev: '',
					auth_key: '',
					hamcloud: false,
					description: '',
					owners: [],
					coordinates: [0, 0],
					latlong: {
						northsouth: 1,
						westeast: 1,
						absolute: {
							latitude: 50,
							longitude: 10
						}
					}
				},
				formData: {
					nodes: [],
					users: []
				},
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: '',
				isEditMode: (!!(this.$route.params.id)),
				transmitterGroupSearch: null,
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
			validationRules() {
				return {
					'_id': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.name') }),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.name'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.name'),
							count: '3'
						}),
						v => (v && /^[a-z0-9.\-_]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumerichyphenunderscorepoint'),
						v => (v && this.isEditMode) || (v && !this.formData.nodes.includes(v)) || this.$t('formvalidation.allreadypresent', {
							fieldname: this.$t('general.name')
						})
					],
					'description': [
						v => (!v) || (v && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.description'),
							count: '30'
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
					]
				};
			}
		},
		methods: {
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
						console.log('Error getting user names in nodes/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.users.names.title'), e);
					});

				// Load available node names
				this.isLoadingData.nodes = true;
				this.$axios.get('nodes/_names')
					.then(response => {
						this.formData.nodes = response.data;
						this.isLoadingData.nodes = false;
					}).catch(e => {
						console.log('Error getting node names in node/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.nodes.names.title'), e);
					});

				// load data of given id
				this.isLoadingData.general = true;
				if (this.$route.params.id) {
					console.log('params:' + this.$route.params.id);
					this.isEditMode = true;
					this.$axios.get('nodes/' + this.$route.params.id)
						.then(response => {
							this.form._id = response.data._id;
							this.form._rev = response.data._rev;
							this.form.auth_key = response.data.auth_key;
							this.form.hamcloud = response.data.hamcloud;
							this.form.description = response.data.description;
							this.form.owners = response.data.owners;

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
								this.created_on = moment(response.data.created_on).format('LLL');
							} else {
								response.data.created_on = '';
							}
							if (response.data.created_by) {
								this.created_by = response.data.created_by;
							} else {
								this.created_by = '';
							}
							if (response.data.changed_on) {
								this.changed_on = moment(response.data.changed_on).format('LLL');
							} else {
								this.changed_on = '';
							}
							if (response.data.changed_by) {
								this.changed_by = response.data.changed_by;
							} else {
								this.changed_by = '';
							}
						}).catch(e => {
							console.log('Error getting nodes\'s individual details with axios or any exception in the get handler.');
							this.$helpers.swalError(this,
								this.$i18n.t('alerts.errorLoad.nodes.details.title', { fieldname: this.$route.params.id }),
								e);
							this.$router.push('/nodes');
						});
				} else {
					this.isEditMode = false;
				}
				this.isLoadingData.general = false;
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				if (this.$refs.form.validate()) {
					var data2Send = {};

					data2Send._id = this.form._id;
					if (this.isEditMode) {
						// if this is Node Mode
						data2Send._rev = this.form._rev;
					}
					data2Send.auth_key = this.form.auth_key;
					data2Send.description = this.form.description;
					data2Send.hamcloud = this.form.hamcloud;
					data2Send.coordinates = this.form.coordinates;
					data2Send.owners = this.form.owners;

					console.log('Data2Send von nodes:');
					console.log(data2Send);

					// Send data via axios by PUT
					this.$axios.put('nodes', data2Send)
						.then(response => {
							// Trigger Reload of sidebar Icons
							this.$root.$emit('ReloadSidebarIcons');
							// this.$router.push('/nodes');
							this.$router.go(-1);

							// Show Info snackbox of success
							if (this.isEditMode) {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.editmode.node.success.title', { fieldname: this.form._id }));
							} else {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.addmode.node.success.title', { fieldname: this.form._id }));
								// Trigger Reload of sidebar Icons
								this.$root.$emit('ReloadSidebarIcons');
							}
						}).catch(e => {
							console.log('Error in Data Put in node/New.vue');
							console.log(e);
							// Show Error SWAL2
							if (this.isEditMode) {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.editmode.node.fail.title', { fieldname: this.form._id }),
									e);
							} else {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.addmode.node.fail.title', { fieldname: this.form._id }),
									e);
							}
						});
				}
			},
			abortButton(event) {
				this.$router.push('/nodes');
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
