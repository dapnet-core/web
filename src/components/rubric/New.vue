<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('pagetitle.rubric.edit') :
											this.$t('pagetitle.rubric.new') }}</span>
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
											v-bind:label="$t('rubrics.id')"
											v-bind:hint="$t('rubrics.new.id.help')"
											persistent-hint
											type="text"
											v-bind:readonly="isEditMode ? true : false"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
									<!-- Label-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											prepend-icon="list_alt"
											required
											:counter="10"
											v-bind:rules="validationRules.label"
											v-model="form.label"
											v-bind:label="$t('rubrics.label')"
											v-bind:hint="$t('rubrics.new.label.help')"
											persistent-hint
											type="text"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!--Number and Description-->
								<v-layout wrap>
									<!-- Number -->
									<v-flex xs12 sm4 md4>
										<v-text-field
											required
											v-bind:rules="validationRules.number"
											v-model="form.number"
											v-bind:label="$t('rubrics.number')"
											v-bind:hint="$t('rubrics.new.number.help')"
											persistent-hint
											prepend-icon="looks_one"
											type="number"
										>
										</v-text-field>
									</v-flex>
									<!-- Description -->
									<v-flex xs12 sm8 md8>
										<v-text-field
											required
											:counter="30"
											v-model="form.description"
											v-bind:label="$t('rubrics.description')"
											v-bind:hint="$t('rubrics.new.description.help')"
											v-bind:rules="validationRules.description"
											persistent-hint
											prepend-icon="description"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!-- Cyclic transmit -->
								<v-layout wrap>
									<!--Cyclic transmit switch-->
									<v-flex xs12 sm6 md6>
										<v-switch
											v-model="form.cyclic_transmit"
											v-bind:label="$t('rubrics.cyclicTransmit')"
											v-bind:hint="$t('rubrics.new.cyclicTransmit.help')"
											persistent-hint
											prepend-icon="autorenew"
										>
										</v-switch>
									</v-flex>
									<!--Cyclic transmit interval-->
									<v-flex xs12 sm6 md6 v-if="form.cyclic_transmit">
										<v-text-field
											required
											v-model="form.cyclic_transmit_interval"
											v-bind:label="$t('rubrics.new.cyclicTransmitInterval.title')"
											v-bind:hint="$t('rubrics.new.cyclicTransmitInterval.help')"
											v-bind:rules="validationRules.cyclicTransmitInterval"
											persistent-hint
											prepend-icon="update"
											type="number"
											v-bind:suffix="$t('general.minutes')"
										>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!-- Transmitters -->
								<v-layout>
									<v-flex>
										<v-combobox
											v-model="form.transmitters"
											:items="formData.transmitters"
											hide-selected
											prepend-icon="wifi"
											v-bind:label="$t('general.transmitters')"
											v-bind:hint="$t('rubrics.new.transmitters.help')"
											v-bind:rules="validationRules.transmitters"
											persistent-hint
											multiple
											small-chips
											deletable-chips
											:loading="isLoadingData.transmitters"
											@change="validateForm"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-combobox>
									</v-flex>
								</v-layout>
								<!-- Transmitter Groups -->
								<v-layout>
									<v-flex>
										<v-combobox
											v-model="form.transmitter_groups"
											:items="formData.transmitter_groups"
											hide-selected
											prepend-icon="wifi_tethering"
											v-bind:label="$t('general.transmitter_groups')"
											v-bind:hint="$t('rubrics.new.transmitter_groups.help')"
											v-bind:rules="validationRules.transmitterGroups"
											persistent-hint
											multiple
											small-chips
											deletable-chips
											:loading="isLoadingData.transmitter_groups"
											@change="validateForm"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-combobox>
									</v-flex>
								</v-layout>
								<!-- owners selection -->
								<v-layout>
									<v-flex>
										<v-autocomplete
											v-model="form.owners"
											:items="formData.users"
											hide-selected
											prepend-icon="assignment_ind"
											v-bind:label="$t('general.owners')"
											v-bind:hint="$t('rubrics.new.owner.help')"
											v-bind:rules="validationRules.owners"
											persistent-hint
											multiple
											small-chips
											deletable-chips
											:loading="isLoadingData.users"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-autocomplete>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>
						<!-- Timestamps -->
						<v-card-text>
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
					transmitter_groups: true
				},
				isFormValid: true,
				form: {
					_id: '',
					_rev: '',
					number: 0,
					description: '',
					label: '',
					transmitter_groups: [],
					transmitters: [],
					cyclic_transmit: false,
					cyclic_transmit_interval: 60 * 6,
					owners: []
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
				isEditMode: (!!(this.$route.params.id))
			};
		},
		computed: {
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
						v => (v && /^[a-z0-9-]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumerichyphen')
					],
					'label': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('rubrics.new.label.title') }),
						v => (v && v.length <= 10) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('rubrics.new.label.title'),
							count: '10'
						}),
						v => (!!v && v.length >= 2) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('rubrics.new.label.title'),
							count: '2'
						}),
						v => (v && /^[a-z0-9- ]+$/i.test(v)) || this.$t('formvalidation.onylalphanumericspacehyphen')
					],
					'description': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('rubrics.new.description.title') }),
						v => (v && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('rubrics.new.description.title'),
							count: '30'
						})
					],
					'number': [
						v => (v && v >= 0) || this.$t('formvalidation.notnegative', { fieldname: this.$t('rubrics.number') }),
						v => (v && v <= 95) || this.$t('formvalidation.maximal', {
							fieldname: this.$t('rubrics.number'),
							max: 95
						})
					],
					'cyclicTransmitInterval': [
						v => (v && v > 60) || this.$t('formvalidation.notlessorequalthan', {
							fieldname: this.$t('rubrics.new.cyclicTransmitInterval.title'),
							min: 60
						}),
						v => (v && v <= 60 * 24 * 2) || this.$t('formvalidation.notgreateras', {
							fieldname: this.$t('rubrics.new.cyclicTransmitInterval.title'),
							max: 60 * 24 * 2
						})
					],
					'owners': [
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('formvalidation.minoneowner') })
					],
					'transmitterGroups': [
						v => ((!!this.form.transmitters && this.form.transmitters.length > 0) || (!!v && v.length > 0)) || this.$t('formvalidation.minonetransmitterorgroup')
					],
					'transmitters': [
						v => ((!!this.form.transmitter_groups && this.form.transmitter_groups.length > 0) || (!!v && v.length > 0)) || this.$t('formvalidation.minonetransmitterorgroup')
					]
				};
			}
		},
		methods: {
			validateForm() {
				this.$refs.form.validate();
			},
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
					this.$axios.get('rubrics/' + this.$route.params.id)
						.then(response => {
							this.form._id = response.data._id;
							this.form._rev = response.data._rev;
							this.form.number = response.data.number;
							this.form.description = response.data.description;
							this.form.label = response.data.label;
							this.form.owners = response.data.owners;
							this.form.transmitters = response.data.transmitters;
							this.form.transmitter_groups = response.data.transmitter_groups;
							this.form.cyclic_transmit = response.data.cyclic_transmit;
							this.form.cyclic_transmit_interval = response.data.cyclic_transmit_interval;

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
						}).catch(e => {
							console.log('Error getting rubric\'s individual details with axios or any exception in the get handler.');
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
					this.form.cyclic_transmit_interval = parseInt(this.form.cyclic_transmit_interval);
					this.form.number = parseInt(this.form.number);
					console.log('Data2Send von rubrics:');
					console.log(this.form);
					this.$helpers.sendData(this, 'rubrics', this.form, '');

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
