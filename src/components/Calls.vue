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
                                <v-card color ="grey lighten-2">
                                    <v-layout>
                                        <v-flex>
                                            <v-textarea
                                                prepend-icon="message"
                                                name="message"
                                                v-model="form.message"
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
                                                v-model="form.subscribers"
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
                                                v-model="form.subscriber_groups"
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
                                                v-model="form.transmitters"
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
                                                v-model="form.transmitter_groups"
                                                :items="formData.transmitter_groups"
                                                v-bind:label="$t('general.transmitter_groups')"
                                            >
                                            </v-autocomplete>
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
	export default {
		created() {
			this.loadSelectionChoices();
			this.loadUserDefaultSettings();
		},
		data() {
			return {
				form: {
					message: this.$store.getters.user._id.toUpperCase() + ': ',
					subscribers: [],
					subscriber_groups: [],
					transmitters: [],
					transmitter_groups: [],
					expiration_duration: '',
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
				isFormValid: true
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
			}
		},
		methods: {
			loadUserDefaultSettings() {
				// Load users details to obtain default settings
				this.isLoadingData.userDefaults = true;
				this.$axios.get('/users/' + this.$store.getters.username)
					.then(response => {
						if (response.data.defaults) {
							if (response.data.defaults.transmitters) {
								this.form.transmitters = response.data.defaults.transmitters;
							} else {
								this.form.transmitters = [];
							}
							if (response.data.defaults.transmitter_groups) {
								this.form.transmitter_groups = response.data.defaults.transmitter_groups;
							} else {
								this.form.transmitter_groups = [];
							}
							if (response.data.defaults.subscribers) {
								this.form.subscribers = response.data.defaults.subscribers;
							} else {
								this.form.subscribers = [];
							}
							if (response.data.defaults.subscriber_groups) {
								this.form.subscriber_groups = response.data.defaults.subscriber_groups;
							} else {
								this.form.subscriber_groups = [];
							}
							if (response.data.defaults.expiration_duration) {
								this.form.expiration_duration = response.data.defaults.expiration_duration;
							} else {
								this.form.expiration_duration = '';
							}
							if (response.data.defaults.priority) {
								this.form.priority = response.data.defaults.priority;
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
				if (this.form.password === '') {
					delete this.form2send.password;
				} else {
					var bcrypt = require('bcryptjs');
					this.form2send.password = bcrypt.hashSync(this.form.password, 10);
				}
				// check for input in all fields but password if empty
				if (!this.$helpers.checkForInput(this, this.form2send)) {
					return false;
				}
				console.log(this.form2send);
				this.$helpers.sendData(this, 'users', this.form2send, '/users');
				// TODO: Update auth if a user change their own password
			}
		}
	};
</script>

<style>

</style>
