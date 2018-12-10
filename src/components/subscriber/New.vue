<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('subscribers.editsubscriber') :
											this.$t('subscribers.newsubscriber') }}</span>
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
											v-bind:label="$t('subscribers.new.subscriber.title')"
											v-bind:hint="$t('subscribers.new.subscriber.help')"
											persistent-hint
											type="text"
											v-bind:readonly="userformReadonly ? true : false"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>

									<!-- Description-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											prepend-icon="description"
											name="description"
											required
											:counter="30"
											v-bind:rules="validationRules.description"
											v-model="form.description"
											v-bind:label="$t('subscribers.new.description.title')"
											v-bind:hint="$t('subscribers.new.description.help')"
											persistent-hint
											type="text"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
								</v-layout>
								<!-- Third Party Service Selection -->
								<v-layout>
									<v-flex>
										<v-autocomplete
											chips
											small-chips
											deletable-chips
											multiple
											hide-selected
											prepend-icon="cloud_upload"
											v-model="form.third_party_services"
											:items="formData.third_party_serivces"
											v-bind:label="$t('general.thirdpartyservices')"
											v-bind:hint="$t('subscribers.new.thirdpartyservices.help')"
											persistent-hint
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-autocomplete>
									</v-flex>
								</v-layout>
								<v-layout>
									<v-flex>
										<v-combobox
											v-model="form.groups"
											:items="formData.subscriber_groups"
											:search-input.sync="subscriberGroupSearch"
											hide-selected
											prepend-icon="people"
											v-bind:label="$t('general.subscriber_groups')"
											v-bind:hint="$t('subscribers.new.subscriber_groups.help')"
											persistent-hint
											multiple
											small-chips
											deletable-chips
											:loading="isLoadingData.subscriber_groups"
										>
											<template slot="no-data">
												<v-list-tile>
													<v-list-tile-content>
														<v-list-tile-title>
															No results matching "<strong>{{ subscriberGroupSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
														</v-list-tile-title>
													</v-list-tile-content>
												</v-list-tile>
											</template>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-combobox>
									</v-flex>
								</v-layout>
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
											:items="formData.subscribers"
											v-bind:label="$t('general.owners')"
											v-bind:hint="$t('subscribers.new.owner.help')"
											persistent-hint
											:loading="isLoadingData.subscribers"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-autocomplete>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>
						<v-card-text>
							<!-- Timestamps -->
							<v-card color="red lighten-2">
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
								exact to="/"
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
					subscribers: true,
					subscriber_groups: true,
				},
				isFormValid: true,
				form: {
					_id: '',
					_rev: '',
					description: '',
					pagers: [],
					third_party_services: [],
					owners: [],
					groups: []
				},
				formData: {
					third_party_serivces: [
						'APRS',
						'Brandmeister'
					],
					subscribers: [],
					subscriber_groups: []
				},
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: '',
				isEditMode: (!!(this.$route.params.id)),
				subscriberGroupSearch : null
			};
		},
		computed: {
			validationRules() {
				return {
					'_id': [
						v => !!v || this.$t('formvalidation.isrequired', {fieldname: this.$t('general.subscriber')}),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.subscriber'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.subscriber'),
							count: '3'
						}),
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric')
					]
				};
			},
		},
		methods: {
			loadData() {
				console.log('Created');
				// Load avaiable user roles

				// Load available subscriber names
				this.isLoadingData.subscribers = true;
				this.$axios.get('subscribers/_names')
					.then(response => {
						this.formData.subscribers = response.data;
						this.isLoadingData.subscribers = false;
					}).catch(e => {
						console.log('Error getting subscriber names in user/new.vue');
				});

				// Load available subscriber groups
				this.isLoadingData.subscriber_groups = true;
				this.$axios.get('subscribers/_groups')
					.then(response => {
						this.formData.subscriber_groups = response.data;
						this.isLoadingData.subscriber_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in user/new.vue');
				});

				// load data of given id
				this.isLoadingData.general = true;
				if (this.$route.params.id) {
					console.log('params:' + this.$route.params.id);
					this.userformReadonly = true;
					this.$axios.get('subscribers/' + this.$route.params.id)
						.then(response => {
							this.form._id = response.data._id;
							this.form._rev = response.data._rev;
							this.form.description = response.data.description;
							this.form.pagers = response.data.pagers;
							this.form.third_party_services = response.data.third_party_serivces;
							this.form.owners = response.data.owners;
							this.form.groups = response.data.groups;
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
							console.log('Error getting subscribers\'s individual details with axios or any exception in the get handler.');
							this.$dialogs.passwordError(this, e);
							// this.$router.push('/users');
					});
				} else {
					this.userformReadonly = false;
				}

				console.log('this.$route.params.id ' + this.$route.params.id);
				console.log('EditMode: ' + this.isEditMode);
				console.log(this.form);
				this.isLoadingData.general = false;
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				if (this.$refs.form.validate()) {

					console.log('Data2Send:');
					console.log(this.form);
					this.$helpers.sendData(this, 'users', this.form, '/users');

					// TODO: Update auth if a user change their own password
				}
			}
		}
	};
</script>
<style scoped>
</style>
