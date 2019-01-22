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
							<v-layout wrap>
								<!--ID-->
								<v-flex xs12 sm12 md12 lg6>
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
								<v-flex xs12 sm12 md12 lg6>
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
							<!--Number, SubRIC and Description-->
							<v-layout wrap>
								<!-- Number -->
								<v-flex xs12 sm12 md12 lg3>
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
								<!-- SubRIC -->
								<v-flex xs12 sm12 md12 lg3>
									<v-select
										:items="formData.functions"
										item-text="label"
										item-value="value"
										required
										v-model="form.function"
										v-bind:label="$t('rubrics.function.title')"
										v-bind:hint="$t('rubrics.function.help')"
										persistent-hint
									>
									</v-select>
								</v-flex>
								<!-- Description -->
								<v-flex xs12 sm12 md12 lg6>
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
							<v-layout v-if="form.function !==3">
								<v-flex xs12>
									<v-alert
										:value="true"
										type="warning"
									>
										{{ $t('rubrics.notskyper') }}
									</v-alert>
								</v-flex>
							</v-layout>
							<!-- Cyclic transmit -->
							<v-layout wrap>
								<!--Cyclic transmit switch-->
								<v-flex xs12 sm12 md12 lg6>
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
								<v-flex xs12 sm12 md12 lg6
									v-if="form.cyclic_transmit"
								>
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
							<!-- Default priority -->
							<v-layout wrap>
								<v-flex xs12 sm12 md12 lg6>
									<v-select
										prepend-icon="low_priority"
										v-model="form.default_priority"
										:items="prioritySelect"
										item-text="label"
										item-value="value"
										v-bind:label="$t('general.priority')"
										v-bind:background-color="priorityColor"
										@input="updatePriorityColor"
									>
									</v-select>
								</v-flex>
								<v-spacer></v-spacer>
								<v-flex xs12 m12 md12 lg5 v-if="form.default_priority === 4">
									<v-alert
										:value="true"
										type="warning"
									>
										{{ $t('rubrics.highprioritywarning') }}
									</v-alert>
								</v-flex>
								<v-spacer></v-spacer>
								<v-flex xs12 m12 md12 lg5 v-if="form.default_priority === 5">
									<v-alert
										:value="true"
										type="error"
										color="red"
									>
										{{ $t('rubrics.highestprioritywarning') }}
									</v-alert>
								</v-flex>
							</v-layout>
							<!-- TODO: fill with real content -->
							<!-- Default expiration -->
							<v-layout wrap>
								<v-flex xs12 sm12 md12 lg6>
									<!-- Display default expiration time -->
									<div>{{ $t('general.default_expiration') }}</div>
									<v-layout wrap justify-space-around>
										<v-flex xs4>
											<v-select
												prepend-icon="timer"
												v-model="expiration_selection.days"
												:items="expiration_posibilities.days"
												:label="$t('general.days')"
											>
											</v-select>
										</v-flex>
										<v-flex xs3>
											<v-select
												v-model="expiration_selection.hours"
												:items="expiration_posibilities.hours"
												:label="$t('general.hours')"
											>
											</v-select>
										</v-flex>
										<v-flex xs3>
											<v-select
												v-model="expiration_selection.minutes"
												:items="expiration_posibilities.minutes"
												:label="$t('general.minutes')"
											>
											</v-select>
										</v-flex>
									</v-layout>
								</v-flex>
							</v-layout>

							<!-- Transmitters -->
							<v-layout wrap>
								<v-flex xs12 sm12 md12 lg6>
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
										@input="validateForm"
									>
										<v-progress-linear color="blue" indeterminate></v-progress-linear>
									</v-combobox>
								</v-flex>
								<!-- Transmitter Groups -->
								<v-flex xs12 sm12 md12 lg6>
									<!--
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
									-->
									<v-expansion-panel>
										<v-expansion-panel-content
											expand-icon="$vuetify.icons.dropdown"
										>
											<div slot="header">
												<v-autocomplete
													:loading="isLoadingData.transmitter_groups"
													chips
													small-chips
													readonly
													multiple
													prepend-icon="wifi_tethering"
													v-model="form.transmitter_groups"
													:items="form.transmitter_groups"
													v-bind:label="$t('general.transmitter_groups')"
													append-icon=""
													v-bind:rules="validationRules.transmitterGroups"
													@change="validateForm"
												>
													<v-progress-linear color="blue" indeterminate></v-progress-linear>
												</v-autocomplete>
											</div>
											<v-treeview
												:items="TreeItems"
												v-model="transmitter_groupsModel"
												selectable
												open-on-click
												@change="validateForm"
											>
											</v-treeview>

										</v-expansion-panel-content>
									</v-expansion-panel>

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
						</v-card-text>
						<!-- Timestamps -->
						<v-card color="">
							<v-card-text
								v-if="$vuetify.breakpoint.lgAndUp"
							>
								<v-layout row wrap justify-space-between>
									<v-flex lg3>{{ $t('general.created_on') }}</v-flex>
									<v-flex lg2>{{ $t('general.byUser') }}</v-flex>
									<v-flex lg3>{{ $t('general.changed_on') }}</v-flex>
									<v-flex lg2>{{ $t('general.byUser') }}</v-flex>
								</v-layout>
								<v-layout row wrap justify-space-between>
									<v-flex lg3>{{ this.created_on}}</v-flex>
									<v-flex lg2>{{ this.created_by}}</v-flex>
									<v-flex lg3>{{ this.changed_on}}</v-flex>
									<v-flex lg2>{{ this.changed_by}}</v-flex>
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
		mounted() {
			this.$root.$on('LanguageChanged', () => {
				moment.locale(this.$root.$i18n.locale);
				this.updateTimeStampFormat();
			});
		},
		created() {
			this.loadData();
		},
		watch: {
			transmitter_groupsModel: function(val) {
				this.form.transmitter_groups =
					this.$helpers.getCleanedUpTreeSelection(val);
				this.validateForm();
			}
		},
		data() {
			return {
				isLoadingData: {
					general: true,
					users: true,
					transmitters: true,
					transmitter_groups: true,
					rubrics: true
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
					owners: [],
					function: 3,
					default_expiration: 297600,
					default_priority: 2
				},
				formData: {
					users: [],
					transmitters: [],
					transmitter_groups: [],
					rubrics: [],
					functions: [
						{ value: 0, label: '0/A' },
						{ value: 1, label: '1/B' },
						{ value: 2, label: '2/C' },
						{ value: 3, label: '3/D - Skyper' }
					]
				},
				created_on: '',
				created_on_iso: '',
				created_by: '',
				changed_on: '',
				changed_on_iso: '',
				changed_by: '',
				isEditMode: (!!(this.$route.params.id)),
				expiration_posibilities: {
					minutes: [0, 10, 20, 30, 40, 50],
					hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
					days: [0, 1, 2, 3, 4, 5, 6]
				},
				expiration_selection: {
					minutes: 0,
					hours: 0,
					days: 0
				},
				priorityColor: '',
				transmitter_groupsModel: [],
				orig_TXGroups: []
			};
		},
		computed: {
			TreeItems() {
				let result = [];
				for (let txGroupIndex = 0; txGroupIndex < this.formData.transmitter_groups.length; txGroupIndex++) {
					let individualGroupNames = this.formData.transmitter_groups[txGroupIndex].split('.');
					result = this.$helpers.processTransmitterGroupsTreeNode(result, individualGroupNames[0], individualGroupNames[0], this.formData.transmitter_groups[txGroupIndex], 0);
				}
				// VERY IMPORTANT: Restore the deault TXGroups after Tree is build
				this.reloadDefaultTXGroupSelection();
				return result;
			},
			prioritySelect() {
				return [
					{
						value: 1,
						label: this.$t('general.priorities.lowest')
					},
					{
						value: 2,
						label: this.$t('general.priorities.low')
					},
					{
						value: 3,
						label: this.$t('general.priorities.medium')
					},
					{
						value: 4,
						label: this.$t('general.priorities.high')
					},
					{
						value: 5,
						label: this.$t('general.priorities.highest')
					}
				];
			},
			validationRules() {
				return {
					'_id': [
						v => !!v || this.$t('formvalidation.isrequired', {
							fieldname: this.$t('rubrics.id')
						}),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('rubrics.id'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('rubrics.id'),
							count: '3'
						}),
						v => (v && /^[a-z0-9-]+$/i.test(v)) || this.$t('formvalidation.onylalphanumerichyphen'),
						v => (v && this.isEditMode) || (v && !this.formData.rubrics.includes(v)) || this.$t('formvalidation.allreadypresent', {
							fieldname: this.$t('rubrics.id')
						})
					],
					'label': [
						v => !!v || this.$t('formvalidation.isrequired', {
							fieldname: this.$t('rubrics.label')
						}),
						v => (v && v.length <= 10) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('rubrics.label'),
							count: '10'
						}),
						v => (!!v && v.length >= 2) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('rubrics.label'),
							count: '2'
						}),
						v => (v && /^[a-z0-9- ]+$/i.test(v)) || this.$t('formvalidation.onylalphanumericspacehyphen'),
						v => (v && this.isEditMode) || (v && !this.formData.rubrics.includes(v)) || this.$t('formvalidation.allreadypresent', {
							fieldname: this.$t('rubrics.label')
						})
					],
					'description': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('rubrics.new.description') }),
						v => (v && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('rubrics.description'),
							count: '30'
						})
					],
					'number': [
						v => (v && v >= 1 && v <= 95) || this.$t('formvalidation.OutOfRange', {
							fieldname: this.$t('rubrics.number'),
							min: 1,
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
			reloadDefaultTXGroupSelection() {
				this.transmitter_groupsModel = this.orig_TXGroups;
			},
			updateTimeStampFormat() {
				this.created_on = moment(this.created_on_iso).format('LLL');
				this.changed_on = moment(this.changed_on_iso).format('LLL');
			},
			updatePriorityColor() {
				this.priorityColor = this.priorityNumber2Color(this.form.default_priority);
			},
			priorityNumber2Color(priority) {
				if (priority === 1) {
					return 'green';
				} else if (priority === 2) {
					return 'green';
				} else if (priority === 3) {
					return 'yellow';
				} else if (priority === 4) {
					return 'orange';
				} else if (priority === 5) {
					return 'red';
				} else {
					return 'grey';
				}
			},
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

				// Load available rubrics
				this.isLoadingData.rubrics = true;
				this.$axios.get('rubrics/_names')
					.then(response => {
						this.formData.rubrics = response.data;
						this.isLoadingData.rubrics = false;
					}).catch(e => {
						console.log('Error getting rubric names in transmitter/new.vue');
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

							if (response.data.transmitter_groups) {
								this.transmitter_groupsModel = response.data.transmitter_groups;
							} else {
								this.transmitter_groupsModel = [];
							}
							// Save default TX Groups for later
							this.orig_TXGroups = JSON.parse(JSON.stringify(this.transmitter_groupsModel));

							this.form.cyclic_transmit = response.data.cyclic_transmit;
							this.form.cyclic_transmit_interval = response.data.cyclic_transmit_interval;
							this.form.function = response.data.function;
							this.form.default_expiration = response.data.default_expiration;

							if (response.data.default_expiration) {
								this.form.default_expiration = response.data.default_expiration;

								if (this.form.default_expiration > ((6 * 3600 * 24) + (23 * 3600) + (45 * 60))) {
									this.form.default_expiration = (6 * 3600 * 24) + (23 * 3600) + (50 * 60);
								}
								this.expiration_selection.days = Math.floor(this.form.default_expiration / (3600 * 24));
								this.expiration_selection.hours = Math.floor(this.form.default_expiration % (3600 * 24) / 3600);
								this.expiration_selection.minutes = Math.floor(this.form.default_expiration % 3600 / 60 / 10) * 10;
							} else {
								this.form.default_expiration = '';
							}

							this.form.default_priority = response.data.default_priority;
							this.updatePriorityColor();

							// Format timestamp into readable version
							if (response.data.created_on) {
								this.created_on_iso = response.data.created_on;
							} else {
								response.data.created_on_iso = '';
							}
							if (response.data.created_by) {
								this.created_by = response.data.created_by;
							} else {
								this.created_by = '';
							}
							if (response.data.changed_on) {
								this.changed_on_iso = response.data.changed_on;
							} else {
								this.changed_on_iso = '';
							}

							if (response.data.changed_by) {
								this.changed_by = response.data.changed_by;
							} else {
								this.changed_by = '';
							}

							this.updateTimeStampFormat();
						}).catch(e => {
							console.log('Error getting rubric\'s individual details with axios or any exception in the get handler.');
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

					this.form.default_expiration = this.expiration_selection.days * (24 * 3600) +
						this.expiration_selection.hours * 3600 +
						this.expiration_selection.minutes * 60;

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
