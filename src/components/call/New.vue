<template>
	<v-card>
		<v-container
			fluid
			grid-list-lg
		>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card>
						<v-card-title primary-title>
							<div>
								<div class="headline">{{ $t('calls.overview.newcall') }}</div>
								<div>{{ $t('calls.overview.information.help') }}</div>
							</div>
						</v-card-title>
						<v-form v-model="isFormValid" ref="form">
							<v-card-text>
								<!-- Message -->
								<v-card color ="white">
									<v-layout wrap>
										<v-flex>
											<v-textarea
												prepend-icon="message"
												name="message"
												v-model="form.data"
												v-bind:label="$t('calls.new.message.title')"
												outline
												rows="2"
												persistent-hint
												:counter="80"
												v-bind:rules="validationRules.message"
											>
											</v-textarea>
										</v-flex>
									</v-layout>
									<!-- Subscriber selection -->
									<v-layout wrap>
										<!-- Display default subscriber selection-->
										<v-flex xs12 md12 lg6>
											<v-autocomplete
												:loading="isLoadingData.subscribers"
												chips
												small-chips
												deletable-chips
												multiple
												hide-selected
												prepend-icon="person"
												v-model="form.recipients.subscribers"
												:items="formData.subscribers"
												v-bind:label="$t('general.subscribers')"
											>
											</v-autocomplete>
										</v-flex>
										<v-spacer></v-spacer>
										<!-- Display default subscriber groups selection-->
										<v-flex xs12 md12 lg6>
											<v-autocomplete
												:loading="isLoadingData.subscriber_groups"
												chips
												small-chips
												deletable-chips
												multiple
												hide-selected
												prepend-icon="people"
												v-model="form.recipients.subscriber_groups"
												:items="formData.subscriber_groups"
												v-bind:label="$t('general.subscriber_groups')"
											>
											</v-autocomplete>
										</v-flex>
										<!-- Display default transmitter names selection-->
										<v-flex xs12 md12 lg6>
											<v-autocomplete
												:loading="isLoadingData.transmitters"
												chips
												small-chips
												deletable-chips
												multiple
												hide-selected
												prepend-icon="wifi"
												v-model="form.distribution.transmitters"
												:items="formData.transmitters"
												v-bind:label="$t('general.transmitters')"
											>
											</v-autocomplete>
										</v-flex>
										<v-spacer></v-spacer>
										<!-- Display default transmitter groups selection-->
										<v-flex xs12 md12 lg6>
											<!--
											<v-autocomplete
												:loading="isLoadingData.transmitter_groups"
												chips
												small-chips
												deletable-chips
												multiple
												hide-selected
												prepend-icon="wifi_tethering"
												v-model="form.distribution.transmitter_groups"
												:items="formData.transmitter_groups"
												v-bind:label="$t('general.transmitter_groups')"
											>
											</v-autocomplete>
											-->
											<v-treeview
												:items="TreeItems"
												v-model="formData.transmitter_groupsModel"
												selectable
												open-on-click
												@input="TreeSelectionChanged"
											>

											</v-treeview>
										</v-flex>
										<!-- Display default priority-->
										<v-flex xs12 md12 lg6>
											<v-select
												prepend-icon="low_priority"
												v-model="form.priority"
												:items="prioritySelect"
												item-text="label"
												item-value="value"
												v-bind:label="$t('general.priority')"
												v-bind:background-color="priorityColor"
												@input="updatePriorityColor"
											>
											</v-select>
										</v-flex>
										<!--<v-flex xs12 md12 lg6>
											<v-slider
												v-model="form.priority"
												:tick-labels="priority_labels"
												min="1"
												max="5"
												step="1"
												ticks="always"
												v-bind:label="$t('general.priority')"
												prepend-icon="low_priority"
												:color="priorityNumber2Color(form.priority)"
												>
											</v-slider>
										</v-flex>-->
									</v-layout>
									<v-layout wrap row>
										<v-flex xs12 md12 lg6>
											<v-menu
												:close-on-content-click="false"
												v-model="formData.dateTimePicker.showDateMenu"
												:nudge-right="40"
												lazy
												transition="scale-transition"
												offset-y
												full-width
												max-width="290px"
												min-width="290px"
											>
												<v-text-field
													slot="activator"
													v-model="computedDateFormatted"
													label="Date (read only text field)"
													hint="DD/MM/YYYY format"
													persistent-hint
													prepend-icon="event"
													readonly
												></v-text-field>
												<v-date-picker
													v-model="dateNonFormated"
													no-title
													@input="formData.dateTimePicker.showDateMenu = false"
													:locale="$root.$i18n.locale"
													:show-current="getCurrentDate"
													:first-day-of-week="getFirstDayOfTheWeek"
													:min="getCurrentDate"
													:max="getMaxDate"

												>
												</v-date-picker>
											</v-menu>
										</v-flex>
										<v-flex xs12 md12 lg6>
											<v-select
												:items="hoursSelect"
												item-text="label"
												item-value="value"
												required
												v-model="hour"
												v-bind:label="$t('subscribers.new.pager.type.title')"
												v-bind:hint="$t('subscribers.new.pager.type.help')"
												persistent-hint
											>
											</v-select>
										</v-flex>
									</v-layout>
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
	</v-card>

</template>

<script>
	import axios from 'axios';
	import moment from 'moment';

	// TODO: Date format according to i18n selection
	export default {
		mounted() {
			console.log(this.$vuetify.breakpoint);
		},
		created() {
			moment.locale(this.$root.$i18n.locale);
			this.loadSelectionChoices();
			this.loadUserDefaultSettings();
		},
		watch: {
			dateNonFormated(val) {
				this.dateFormated = moment(this.dateNonFormated).format('L');
			}
		},
		data() {
			return {
				form: {
					data: this.$store.getters.user._id.toUpperCase() + ': ',
					recipients: {
						subscribers: [],
						subscriber_groups: []
					},
					distribution: {
						transmitters: [],
						transmitter_groups: []
					},
					expires_on: '2020-01-10T18:45:44.739Z',
					priority: 3
				},
				formData: {
					subscribers: [],
					subscriber_groups: [],
					transmitters: [],
					transmitter_groups: [],
					transmitter_groupsModel: [],
					dateTimePicker: {
						showDateMenu: false
					}
				},
				isLoadingData: {
					subscribers: true,
					subscriber_groups: true,
					transmitters: true,
					transmitter_groups: true,
					userDefaults: true
				},
				isFormValid: true,
				defaults: {
					expiration_duration: 0
				},
				priorityColor: 'grey',
				dateNonFormated: '2019-01-01',
				dateFormated: '',
				hour: 0
			};
		},
		computed: {
			TreeItems() {
				let result = [];
				for (let txGroupIndex = 0; txGroupIndex < this.formData.transmitter_groups.length; txGroupIndex++) {
					let individualGroupNames = this.formData.transmitter_groups[txGroupIndex].split('.');
					result = this.processTreeNode(result, individualGroupNames[0], individualGroupNames[0], this.formData.transmitter_groups[txGroupIndex], 0);
				}
				return result;
			},
			hoursSelect() {
				let returnvalue = [];
				for (let hour = 0; hour < 24; hour++) {
					let selectedDateTime = moment(this.dateNonFormated);
					selectedDateTime.add(hour, 'hours');
					// console.log('selectedDateTime: ' + selectedDateTime.format('DD.MM.YYYY HH:mm:ss'));
					// console.log('now: ' + moment().format('DD.MM.YYYY HH:mm:ss'));
					if (selectedDateTime.isAfter(moment().add(1, 'hours'))) {
						// console.log('vorher');
						if (this.$t('general.24hr') === 'true') {
							returnvalue.push(
								{
									value: hour,
									label: hour.toString() + ':00'
								}
							);
						} else {
							returnvalue.push(
								{
									value: hour,
									label: (hour % 12).toString() + (hour < 12 ? ':00 am' : ':00 pm')
								}
							);
						}
					} else {
						// console.log('nachher');
					}
				}
				// console.log(returnvalue);
				return returnvalue;
			},
			getFirstDayOfTheWeek() {
				if (this.$t('general.firstdayofweek') === 'Sunday') {
					return 0;
				} else {
					return 1;
				}
			},
			getTimeFormat() {
				if (this.$t('general.24hr') === '24hr') {
					return '24hr';
				} else {
					return 'ampm';
				}
			},
			getCurrentDate() {
				return moment().format('YYYY-MM-DD');
			},
			getMaxDate() {
				return moment().add(10, 'days').format('YYYY-MM-DD');
			},
			computedDateFormatted() {
				return this.dateFormated;
			},
			validationRules() {
				return {
					'message': [
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.message') }),
						v => (v && v.length <= 80) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.message'),
							count: '80'
						})
					]
				};
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
			}
		},
		methods: {
			processTreeNode(currentList, currentID, currentName, completeChain, level) {
				// Parent Node: Array of nodes at this level
				// Name       : Just the ID of the node to be processed
				// ID         : The complete name-chain to be processed, dot-separated

				// Test, if Node with ID is already present
				if (this.getIndexOfListEntryWithID(currentList, currentID) === -1) {
					// If not present, add it
					currentList.push(
						{
							id: currentID,
							name: currentName
						}
					);
					// Determine, if there are more children
					if (currentID !== completeChain) {
						// Further childs exist
						// Get the index of the just added node
						let justAddedEntryIndex = this.getIndexOfListEntryWithID(currentList, currentID);
						// Add children list
						currentList[justAddedEntryIndex]['children'] = [];
					}
				}
				if (currentID !== completeChain) {
					// Further childs exist
					let individualChainEntries = completeChain.split('.');

					let thisEntryIndex = this.getIndexOfListEntryWithID(currentList, currentID);
					let childName = individualChainEntries[level + 1];
					// Build childID
					let childID = '';
					for (let i = 0; i <= level + 1; i++) {
						if (i === 0) {
							childID = individualChainEntries[i];
						} else {
							childID = childID + '.' + individualChainEntries[i];
						}
					}
					let children = this.processTreeNode(currentList[thisEntryIndex]['children'], childID, childName, completeChain, level + 1);
					currentList[thisEntryIndex]['children'] = children;
				}
				return currentList;
			},
			getIndexOfListEntryWithID(Tree, ID) {
				for (let i = 0; i < Tree.length; i++) {
					if (Tree[i]['id'] === ID) {
						return i;
					}
				}
				return -1;
			},
			TreeSelectionChanged() {
				// Clean up selection and reduce redundant entries of leafs, it the parent node is selected
				this.form.distribution.transmitter_groups = JSON.parse(JSON.stringify(this.formData.transmitter_groupsModel));

				let groupIndex = 0;
				// Run until all is cleaned up
				while (groupIndex < this.form.distribution.transmitter_groups.length) {
					let currentGroup = this.form.distribution.transmitter_groups[groupIndex];
					// Find any other node, that contains this
					let searchIndex = 0;
					while (searchIndex < this.form.distribution.transmitter_groups.length) {
						let searchGroup = this.form.distribution.transmitter_groups[searchIndex];
						if (searchGroup.includes(currentGroup) && (searchGroup.length > currentGroup.length)) {
							this.form.distribution.transmitter_groups.splice(searchIndex, 1);
							groupIndex = -1;
						}
						searchIndex++;
					}
					groupIndex++;
				}
			},
			updatePriorityColor() {
				this.priorityColor = this.priorityNumber2Color(this.form.priority);
			},
			priorityNumber2Color(priority) {
				if (priority === 1) {
					return 'green';
				} else if (priority === 2) {
					return 'green';
				} else if (priority === 3) {
					return 'green';
				} else if (priority === 4) {
					return 'green';
				} else if (priority === 5) {
					return 'orange';
				} else {
					return 'grey';
				}
			},
			loadUserDefaultSettings() {
				// Load users details to obtain default settings
				this.isLoadingData.userDefaults = true;
				this.$axios.get('/users/' + this.$store.getters.username)
					.then(response => {
						if (response.data.defaults) {
							if (response.data.defaults.transmitters) {
								this.form.distribution.transmitters = response.data.defaults.transmitters;
							} else {
								this.form.distribution.transmitters = [];
							}
							if (response.data.defaults.transmitter_groups) {
								this.formData.transmitter_groupsModel = response.data.defaults.transmitter_groups;
							} else {
								this.formData.transmitter_groupsModel = [];
							}
							if (response.data.defaults.subscribers) {
								this.form.recipients.subscribers = response.data.defaults.subscribers;
							} else {
								this.form.recipients.subscribers = [];
							}
							if (response.data.defaults.subscriber_groups) {
								this.form.recipients.subscriber_groups = response.data.defaults.subscriber_groups;
							} else {
								this.form.recipients.subscriber_groups = [];
							}
							if (response.data.defaults.expiration_duration) {
								this.defaults.expiration_duration = response.data.defaults.expiration_duration;
								this.dateNonFormated = moment().add(this.defaults.expiration_duration, 'seconds')
									.format('YYYY-MM-DD');
								this.hour = parseInt(moment().add(this.defaults.expiration_duration, 'seconds')
									.add(1, 'hours').format('HH'));
								console.log('default expiration: ' + this.defaults.expiration_duration);
							}
							if (response.data.defaults.priority) {
								this.form.priority = response.data.defaults.priority;
							} else {
								this.form.priority = 3;
							}
							this.updatePriorityColor();
						}
						this.isLoadingData.userDefaults = false;
					}).catch(e => {
						console.log('Error getting subscriber names in calls/Calls.vue');
				});
			},
			loadSelectionChoices() {
				// Load available subscriber names
				this.isLoadingData.subscribers = true;
				this.$axios.get('subscribers/_names')
					.then(response => {
						this.formData.subscribers = response.data;
						this.isLoadingData.subscribers = false;
					}).catch(e => {
						console.log('Error getting subscriber names in calls/Calls.vue');
				});

				// Load available subscriber groups
				this.isLoadingData.subscriber_groups = true;
				this.$axios.get('subscribers/_groups')
					.then(response => {
						this.formData.subscriber_groups = response.data;
						this.isLoadingData.subscriber_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in calls/Calls.vue');
				});

				// Load available transmitter names
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/_names')
					.then(response => {
						this.formData.transmitters = response.data;
						this.isLoadingData.transmitters = false;
					}).catch(e => {
						console.log('Error getting subscriber names in calls/Calls.vue');
				});

				// Load available transmitter groups
				this.isLoadingData.transmitter_groups = true;
				this.$axios.get('transmitters/_groups')
					.then(response => {
						this.formData.transmitter_groups = response.data;
						this.isLoadingData.transmitter_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in calls/Calls.vue');
				});
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);
				this.form2send = JSON.parse(JSON.stringify(this.form));

				this.form2send.priority = this.$helpers.priorityString2Number(this, this.form.priority);
				this.form2send.expires_on = moment(this.dateNonFormated).add(this.hour, 'hours').toISOString();
				console.log(this.form2send);
				axios.post('/calls', this.form2send)
					.then(function(response) {
				});
				this.$router.go(-1);
			}
		}
	};
</script>

<style>

</style>
