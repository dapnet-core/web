<template>
	<v-container fluid fill-height>
		<v-layout justify-center>
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
											v-bind:readonly="isEditMode ? true : false"
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
								<!-- pagers list -->
								<v-layout
									v-for="(pager, index) in form.pagers"
									:key="`pager-${index}`"
								>
									<!-- Pager Type -->
									<v-flex xs3>
										<v-select
											:items="formData.pagertypes"
											item-text="label"
											item-value="value"
											required
											v-model="pager.type"
											v-bind:label="$t('subscribers.new.pager.type.title')"
											v-bind:hint="$t('subscribers.new.pager.type.help')"
											persistent-hint
										>
										</v-select>
									</v-flex>
									<!-- RIC -->
									<v-flex xs3>
										<v-text-field
											required
											v-bind:rules="validationRules.pagerRic"
											v-model="pager.ric"
											v-bind:label="$t('subscribers.new.pager.ric.title')"
											v-bind:hint="$t('subscribers.new.pager.ric.help')"
											persistent-hint
											type="numeric"
										>
										</v-text-field>
									</v-flex>
									<!-- Pager.function -->
									<v-flex xs2>
										<v-select
											:items="formData.functions"
											item-text="label"
											item-value="value"
											required
											v-model="pager.function"
											v-bind:label="$t('subscribers.new.pager.function.title')"
											v-bind:hint="$t('subscribers.new.pager.function.help')"
											persistent-hint
										>
										</v-select>
									</v-flex>
									<!-- Pager.name -->
									<v-flex xs4>
										<v-text-field
											required
											:counter="20"
											v-bind:rules="validationRules.pagerName"
											v-model="pager.name"
											v-bind:label="$t('subscribers.new.pager.name.title')"
											v-bind:hint="$t('subscribers.new.pager.name.help')"
											persistent-hint
											type="text"
										>
										</v-text-field>
									</v-flex>
									<!-- Enabled -->
									<v-flex xs2>
										<v-switch
											v-model="pager.enabled"
											:label="$t('subscribers.new.pager.enabled.title')"
										>
										</v-switch>
									</v-flex>
									<v-flex xs1>
										<v-btn
											flat
											icon
											color="red"
											v-on:click="deletePager(index)"
											v-bind:disabled="onlyOnePagerleft ? true : false"
										>
											<v-icon>delete</v-icon>
										</v-btn>
									</v-flex>
								</v-layout>
								<v-btn
									block
									color="green"
									v-on:click="addPager()"
								>
									Add new pager entry
								</v-btn>

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
											:items="formData.third_party_services_items"
											v-bind:label="$t('general.thirdpartyservices')"
											v-bind:hint="$t('subscribers.new.thirdpartyservices.help')"
											persistent-hint
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-autocomplete>
									</v-flex>
								</v-layout>

								<!-- Subscriber Groups -->
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
											v-bind:hint="$t('subscribers.new.owner.help')"
											persistent-hint
											:loading="isLoadingData.owners"
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
		mounted() {
			this.$refs.form.validate();
		},
		data() {
			return {
				isLoadingData: {
					general: true,
					users: true,
					subscribers: true,
					subscriber_groups: true
				},
				isFormValid: true,
				form: {
					_id: '',
					_rev: '',
					description: '',
					pagers: [
						{
							ric: '',
							function: '',
							name: '',
							type: '',
							enabled: true
						}
					],
					third_party_services: [],
					owners: [],
					groups: []
				},
				formData: {
					third_party_services: [
						'APRS',
						'Brandmeister'
					],
					users: [],
					subscribers: [],
					subscriber_groups: [],
					functions: [
						{ value: 0, label: '0/A' },
						{ value: 1, label: '1/B' },
						{ value: 2, label: '2/C' },
						{ value: 3, label: '3/D' }
					],
					third_party_services_items: [
						{ value: 'APRS', text: 'APRS' },
						{ value: 'BM', text: 'Brandmeister' }
					],
					pagertypes: [
						{ value: 'alphapoc', label: 'AlphaPoc' },
						{ value: 'skyper', label: 'Skyper' },
						{ value: 'quix', label: 'Quix' }
					]
				},
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: '',
				isEditMode: (!!(this.$route.params.id)),
				subscriberGroupSearch: null
			};
		},
		computed: {
			validationRules() {
				return {
					'_id': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.subscriber') }),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.subscriber'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.subscriber'),
							count: '3'
						}),
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric'),
						v => (v && this.isEditMode) || (v && !this.formData.subscribers.includes(v)) || this.$t('formvalidation.allreadypresent', {
							fieldname: this.$t('general.subscribers')
						})
					],
					'description': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('subscribers.new.description.title') }),
						v => (v && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('subscribers.new.description.title'),
							count: '30'
						}),
						v => (v && v.length >= 2) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('subscribers.new.description.title'),
							count: '2'
						})
					],
					'pagerRic': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('subscribers.new.pager.ric.title') }),
						v => (v && /^[0-9]+$/i.test(v)) || this.$t('formvalidation.onlyInteger', {
							fieldname: this.$t('subscribers.new.pager.ric.title')
						}),
						v => (v && v > 0 && v <= 2097151) || this.$t('formvalidation.OutOfRange', {
							fieldname: this.$t('subscribers.new.pager.ric.title'),
							min: '0',
							max: '2097151'
						})
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
			},
			onlyOnePagerleft() {
				return (this.form.pagers.length <= 1);
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
						console.log('Error getting user names in subscriber/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.users.names.title'), e);
					});

				// Load available subscriber names
				this.isLoadingData.subscribers = true;
				this.$axios.get('subscribers/_names')
					.then(response => {
						this.formData.subscribers = response.data;
						this.isLoadingData.subscribers = false;
					}).catch(e => {
						console.log('Error getting subscriber names in subscriber/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.subscribers.names.title'), e);
					});

				// Load available subscriber groups
				this.isLoadingData.subscriber_groups = true;
				this.$axios.get('subscribers/_groups')
					.then(response => {
						this.formData.subscriber_groups = response.data;
						this.isLoadingData.subscriber_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in subscriber/new.vue');
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.subscribers.groups.title'), e);
					});

				// load data of given id
				this.isLoadingData.general = true;
				if (this.$route.params.id) {
					console.log('params:' + this.$route.params.id);
					this.isEditMode = true;
					this.$axios.get('subscribers/' + this.$route.params.id)
						.then(response => {
							this.form._id = response.data._id;
							this.form._rev = response.data._rev;
							this.form.description = response.data.description;
							this.form.pagers = response.data.pagers;
							this.form.third_party_services = response.data.third_party_services;
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
							this.$helpers.swalError(this,
								this.$i18n.t('alerts.errorLoad.subscribers.details.title', { fieldname: this.$route.params.id }),
								e);
							this.$router.push('/subscribers');
						});
				} else {
					this.isEditMode = false;
				}
				this.isLoadingData.general = false;
			},
			addPager() {
				this.form.pagers.push({
					ric: '',
					function: '',
					name: '',
					type: '',
					enabled: true
				});
				console.log(this.form.pagers);
			},
			deletePager(index) {
				this.form.pagers.splice(index, 1);
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				if (this.$refs.form.validate()) {
					if (!this.isEditMode) {
						delete this.form._rev;
					}
					for (let pagerIndex = 0; pagerIndex < this.form.pagers.length; pagerIndex++) {
						if (this.form.pagers[pagerIndex].ric) {
							this.form.pagers[pagerIndex].ric = parseInt(this.form.pagers[pagerIndex].ric);
						}
						if (this.form.pagers[pagerIndex].function) {
							this.form.pagers[pagerIndex].function = parseInt(this.form.pagers[pagerIndex].function);
						}
					}
					console.log('Data2Send von subscriber:');
					console.log(this.form);

					// Send data via axios by PUT
					this.$axios.put('subscribers', this.form)
						.then(response => {
							// this.$router.push('/subscribers');
							this.$router.go(-1);

							// Show Info snackbox of success
							if (this.isEditMode) {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.editmode.subscriber.success.title', { fieldname: this.form._id }));
							} else {
								this.$helpers.snackbarStackInfo(this,
									this.$i18n.t('alerts.addmode.subscriber.success.title', { fieldname: this.form._id }));
								// Trigger Reload of sidebar Icons
								this.$root.$emit('ReloadSidebarIcons');
							}
						}).catch(e => {
							console.log('Error in Data Put in subscriber/New.vue');
							console.log(e);
							// Show Error SWAL2
							if (this.isEditMode) {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.editmode.subscriber.fail.title', { fieldname: this.form._id }),
									e);
							} else {
								this.$helpers.swalError(this,
									this.$i18n.t('alerts.addmode.subscriber.fail.title', { fieldname: this.form._id }),
									e);
							}
						});
				}
			},
			abortButton(event) {
				this.$router.push('/subscribers');
			}
		}
	};
</script>
<style scoped>
</style>
