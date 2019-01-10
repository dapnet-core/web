<template>
	<v-card>
		<v-container
			fluid
			grid-list-lg
		>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card color="grey" class="white--text">
						<v-card-title primary-title>
							<div>
								<div class="headline">{{ $t('calls.overview.newcall') }}</div>
								<div>Send a new call now</div>
							</div>
						</v-card-title>
						<v-form v-model="isFormValid" ref="form">
							<v-card-text>
								<!-- Message -->
								<v-card color ="white">
									<v-layout>
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
									<v-layout>
										<!-- Display default subscriber selection-->
										<v-flex xs5>
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
										<v-flex xs5>
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
									</v-layout>
									<v-layout>
										<!-- Display default transmitter names selection-->
										<v-flex xs5>
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
										<v-flex xs2></v-flex>
										<!-- Display default transmitter groups selection-->
										<v-flex xs5>
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
										</v-flex>
									</v-layout>
									<v-layout>
										<!-- Display default priority-->
										<!--<v-flex xs5>
											<v-select
												prepend-icon="low_priority"
												v-model="form.priority"
												v-bind:items="priority_labels"
												v-bind:label="$t('general.priority')"
											>
											</v-select>
										</v-flex>-->
										<v-flex xs5>
											<v-slider
												v-model="form.priority"
												:tick-labels="priority_labels"
												min="1"
												max="5"
												step="1"
												ticks="always"
												v-bind:label="$t('general.priority')"
												prepend-icon="low_priority"
												>
											</v-slider>
										</v-flex>
										<v-flex xs2></v-flex>
										<!-- Display default duration -->
										<v-flex xs1>
											<v-select
												prepend-icon="timer"
												v-model="expiration_selection.days"
												v-bind:items="expiration_posibilities.days"
												v-bind:label="$t('general.days')"
											>
											</v-select>
										</v-flex>
										<v-spacer></v-spacer>
										<v-flex xs1>
											<v-select
												v-model="expiration_selection.hours"
												v-bind:items="expiration_posibilities.hours"
												v-bind:label="$t('general.hours')"
											>
											</v-select>
										</v-flex>
										<v-spacer></v-spacer>
										<v-flex xs1>
											<v-select
												v-model="expiration_selection.minutes"
												v-bind:items="expiration_posibilities.minutes"
												v-bind:label="$t('general.minutes')"
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
	export default {
		created() {
			this.loadSelectionChoices();
			this.loadUserDefaultSettings();
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
					transmitter_groups: []
				},
				isLoadingData: {
					subscribers: true,
					subscriber_groups: true,
					transmitters: true,
					transmitter_groups: true,
					userDefaults: true
				},
				isFormValid: true,
				expiration_posibilities: {
					minutes: [0, 10, 20, 30, 40, 50],
					hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
					days: [0, 1, 2, 3, 4, 5, 6]
				},
				expiration_selection: {
					minutes: 0,
					hours: 0,
					days: 0
				}
			};
		},
		computed: {
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
			priority_labels() {
				return [
					this.$t('general.priorities.lowest'),
					this.$t('general.priorities.low'),
					this.$t('general.priorities.medium'),
					this.$t('general.priorities.high'),
					this.$t('general.priorities.highest')
				];
			},
		},
		methods: {
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
								this.form.distribution.transmitter_groups = response.data.defaults.transmitter_groups;
							} else {
								this.form.distribution.transmitter_groups = [];
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
							/*
							if (response.data.defaults.expiration_duration) {
								this.form.expiration_duration = response.data.defaults.expiration_duration;
								if (this.form.expiration_duration > ((6 * 3600 * 24) + (23 * 3600) + (45 * 60))) {
									this.form.expiration_duration = (6 * 3600 * 24) + (23 * 3600) + (50 * 60);
								}
								this.expiration_selection.days = Math.floor(this.form.expiration_duration / (3600 * 24));
								this.expiration_selection.hours = Math.floor(this.form.expiration_duration % (3600 * 24) / 3600);
								this.expiration_selection.minutes = Math.floor(this.form.expiration_duration % 3600 / 60 / 10) * 10;
							} else {
								this.form.expiration_duration = '';
							}
							*/
							if (response.data.defaults.priority) {
								this.form.priority = this.$helpers.priorityNumber2String(this, response.data.defaults.priority);
							} else {
								this.form.priority = '';
							}
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
				this.form2send = Object.assign({}, this.form);

				this.form2send.priority = this.$helpers.priorityString2Number(this, this.form.priority);
				// this.form2send.expiration_duration = this.expiration_selection.days * (24 * 3600) +
				//	this.expiration_selection.hours * 3600 +
				//	this.expiration_selection.minutes * 60;
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
