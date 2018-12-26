<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('transmitters.new.edittransmitter') :
											this.$t('transmitters.new.newtransmitter') }}</span>
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
											v-model="form.description"
											v-bind:label="$t('transmitters.new.authkey.title')"
											v-bind:hint="$t('transmitters.new.authkey.help')"
											persistent-hint
											type="text"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
								</v-layout>
								<v-layout wrap>
									<!-- Usage Select -->
									<v-flex xs12 sm6 md4>
										<v-select
											:items="usagesSelect"
											item-text="label"
											item-value="value"
											required
											v-model="form.usage"
											v-bind:label="$t('transmitters.usage.title')"
											v-bind:hint="$t('transmitters.new.usage.help')"
											persistent-hint
											prepend-icon="settings_input_antenna"
										>
										</v-select>
									</v-flex>
									<!-- Power at Antenna feeding point -->
									<v-flex xs12 sm6 md4>
										<v-text-field
											required
											v-bind:value="form.power"
											v-bind:label="$t('transmitters.power')"
											v-bind:hint="$t('transmitters.new.power.help')"
											persistent-hint
											prepend-icon="waves"
											type="number"
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
										>
										</v-switch>
									</v-flex>
									<!-- Enabled -->
									<v-flex xs12 sm6 md4>
										<v-switch
											v-model="form.enabled"
											v-bind:label="$t('general.enabled')"
										>
										</v-switch>
									</v-flex>
								</v-layout>
								<!-- Emergency power-->
								<v-card
								>
									<v-card-title>{{ this.$t('transmitters.new.emergency.title') }}</v-card-title>
									<v-card-text>
										<v-layout wrap>
											<!-- Emergency Power available -->
											<v-flex xs12 sm6 md4>
												<v-switch
													v-model="form.emergency_power.available"
													v-bind:label="$t('transmitters.new.emergency.available.title')"
													v-bind:hint="$t('transmitters.new.emergency.available.help')"
													persistent-hint
												>
												</v-switch>
											</v-flex>
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
						<v-card-text>
							<!-- Timestamps -->
							<v-card color="red lighten-2" v-if="isEditMode">
								<v-card-text>
									<v-layout row wrap class="dark--text">
										<v-flex xs3>{{ $t('general.created_on') }}</v-flex>
										<v-flex xs3>{{ $t('general.byUser') }}</v-flex>
										<v-flex xs3>{{ $t('general.changed_on') }}</v-flex>
										<v-flex xs3>{{ $t('general.byUser') }}</v-flex>
									</v-layout>
									<v-layout row wrap>
										<v-flex xs3>{{ this.created_on}}</v-flex>
										<v-flex xs3>{{ this.created_by}}</v-flex>
										<v-flex xs3>{{ this.changed_on}}</v-flex>
										<v-flex xs3>{{ this.changed_by}}</v-flex>
									</v-layout>
								</v-card-text>
							</v-card>
						</v-card-text>
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

	export default {
		components: {
		},
		created() {
			this.loadData();
		},
		data() {
			return {
				isLoadingData: {
					general: true,
					users: true,
					transmitters: true,
					transmitter_groups: true,
				},
				isFormValid: true,
				form: {
					'_id': '',
					'_rev': '',
					'usage': '',
					'timeslots': [],
					'power': 0,
					'owners': [],
					'groups': [],
					'emergency_power': {
						'available': false,
						'infinite': false,
						'duration': 0
					},
					'coordinates': [],
					'created_on': '',
					'created_by': 'dh3wr',
					'changed_on': '',
					'changed_by': 'dh3wr',
					'aprs_broadcast': false,
					'enabled': false,
					'auth_key': '',
					'antenna': {}
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
				transmitterGroupSearch: null
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
					},
				]
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
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric')
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
					'pagerName': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('subscribers.new.pager.name.title') }),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('subscribers.new.pager.name.title'),
							count: '20'
						})
					],
					'owners': [
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('formvalidation.minoneowner') })
					]
				};
			}
		},
		methods: {
			loadData() {

				// Load avaiable user roles
				this.isLoadingData.users = true;
				this.$axios.get('users/_usernames')
					.then(response => {
						this.formData.users = response.data;
						this.isLoadingData.users = false;
					}).catch(e => {
					console.log('Error getting user names in transmitter/new.vue');
				});

				// Load available transmitters names
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/_names')
					.then(response => {
						this.formData.transmitters = response.data;
						this.isLoadingData.transmitters = false;
					}).catch(e => {
						console.log('Error getting transmitter names in transmitter/new.vue');
				});

				// Load available transmitters groups
				this.isLoadingData.transmitter_groups = true;
				this.$axios.get('transmitters/_groups')
					.then(response => {
						this.formData.transmitter_groups = response.data;
						this.isLoadingData.transmitter_groups = false;
					}).catch(e => {
						console.log('Error getting transmitter groups in transmitter/new.vue');
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
							this.form.power = response.data.power;
							this.form.owners = response.data.owners;
							this.form.groups = response.data.groups;

							// Set default values, to be overwritten eventually now:
							this.form.emergency_power.available = false;
							this.form.emergency_power.infinite = false;
							this.form.emergency_power.duration = 0;

							if (response.data.emergency_power && response.data.emergency_power.available) {
								this.form.emergency_power.available.response.data.emergency_power.available;
								if (response.data.emergency_power.infinite) {
									this.form.emergency_power.infinite = response.data.emergency_power.infinite;
								} else {
									this.form.emergency_power.infinite = false;
								}
								if (response.data.emergency_power.duration && (!response.data.emergency_power.infinite)) {
									this.form.emergency_power.duration = response.data.emergency_power.duration;
								}
							}

							if (response.data.coordinates &&
								Array.isArray(response.data.coordinates) &&
								response.data.coordinates.length === 2) {
								this.form.coordinates = response.data.coordinates;
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
								this.form.antenna = response.data.antenna;
							}
						}).catch(e => {
							console.log('Error getting transmitter\'s individual details with axios or any exception in the get handler.');
							this.$dialogs.passwordError(this, e);
							// this.$router.push('/users');
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
					if (!this.isEditMode) {
						delete this.form._rev;
					}
					console.log('Data2Send von transmitter:');
					console.log(this.form);
					this.$helpers.sendData(this, 'transmitters', this.form, '');

					// Trigger Reload of sidebar Icons
					this.$root.$emit('ReloadSidebarIcons');
					this.$router.go(-1);
				}
			},
			abortButton(event) {
				this.$router.go(-1);
			}
		}
	};
</script>
<style scoped>
</style>
