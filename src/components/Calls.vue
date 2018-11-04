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
						<v-form>
                            <v-card-text>
                                <v-card color ="grey lighten-2">
                                    <v-layout>
                                        <v-flex>
                                            <v-textarea
                                                prepend-icon="message"
                                                name="message"
                                                v-model="form.data"
                                                v-bind:label="$t('calls.new.message.title')"
                                                v-bind:hint="$t('calls.new.message.charactersremaining', { remaining: messageCharsRemaining })"
                                                outline
                                                rows="2"
                                                persistent-hint
                                                v-bind:background-color="emptyMessage() ? '' : 'red'"
                                            >
                                            </v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5>
                                            <v-autocomplete
                                                persistent-hint
                                                hint="hjdkhasjk"
                                                chips
                                                small-chips
                                                deletable-chips
                                                multiple
                                                solo
                                                prepend-icon="person"
                                                v-model="form.subscribers"
                                                :items="formData.subscribers"
                                                v-bind:label="$t('users.general.subscribers')"
                                            >
                                            </v-autocomplete>
                                        </v-flex>
                                        <v-flex xs2></v-flex>
                                        <!-- Display default subscriber groups selection-->
                                        <v-flex xs5>
                                            <v-autocomplete
                                                chips
                                                small-chips
                                                deletable-chips
                                                multiple
                                                solo
                                                prepend-icon="people"
                                                v-model="form.subscriber_groups"
                                                :items="formData.subscriber_groups"
                                                v-bind:label="$t('users.general.subscriber_groups')"
                                            >
                                            </v-autocomplete>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <!-- Display default transmitter names selection-->
                                        <v-flex xs5>
                                            <v-autocomplete
                                                chips
                                                small-chips
                                                deletable-chips
                                                multiple
                                                solo
                                                prepend-icon="wifi"
                                                v-model="form.transmitters"
                                                :items="formData.transmitters"
                                                v-bind:label="$t('users.general.transmitters')"
                                            >
                                            </v-autocomplete>
                                        </v-flex>
                                        <v-flex xs2></v-flex>
                                        <!-- Display default trasnmitter groups selection-->
                                        <v-flex xs5>
                                            <v-autocomplete
                                                chips
                                                small-chips
                                                deletable-chips
                                                multiple
                                                solo
                                                prepend-icon="wifi_tethering"
                                                v-model="form.transmitter_groups"
                                                :items="formData.transmitter_groups"
                                                v-bind:label="$t('users.general.transmitter_groups')"
                                            >
                                            </v-autocomplete>
                                        </v-flex>
                                    </v-layout>

                                </v-card>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                    color="primary"
                                    @click="submitForm"
                                >
                                    {{ $t('general.submit') }}
                                </v-btn>
                            </v-card-actions>
						</v-form>
					</v-card>
				</v-flex>

				<v-flex xs12>
					<v-card color="cyan darken-2" class="white--text">
						<v-layout>
							<v-flex xs5>
								<v-img
									src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
									height="125px"
									contain
								></v-img>
							</v-flex>
							<v-flex xs7>
								<v-card-title primary-title>
									<div>
										<div class="headline">Supermodel</div>
										<div>Foster the People</div>
										<div>(2014)</div>
									</div>
								</v-card-title>
							</v-flex>
						</v-layout>
						<v-divider light></v-divider>
						<v-card-actions class="pa-3">
							Rate this album
							<v-spacer></v-spacer>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
						</v-card-actions>
					</v-card>
				</v-flex>

				<v-flex xs12>
					<v-card color="purple" class="white--text">
						<v-layout row>
							<v-flex xs7>
								<v-card-title primary-title>
									<div>
										<div class="headline">Halycon Days</div>
										<div>Ellie Goulding</div>
										<div>(2013)</div>
									</div>
								</v-card-title>
							</v-flex>
							<v-flex xs5>
								<v-img
									src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
									height="125px"
									contain
								></v-img>
							</v-flex>
						</v-layout>
						<v-divider light></v-divider>
						<v-card-actions class="pa-3">
							Rate this album
							<v-spacer></v-spacer>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
							<v-icon>star_border</v-icon>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-card>

</template>

<script>
	export default {
		created() {
			// Load avaiable subscriber names
			this.$axios.get('subscribers/_names')
				.then(response => {
					this.formData.subscribers = response.data;
				}).catch(e => {
					console.log('Error getting subscriber names in calls/Calls.vue');
				});

			// Load avaiable subscriber groups
			this.$axios.get('subscribers/_groups')
				.then(response => {
					this.formData.subscriber_groups = response.data;
				}).catch(e => {
					console.log('Error getting subscriber groups in calls/Calls.vue');
			});

			// Load avaiable stransmitter names
			this.$axios.get('transmitters/_names')
				.then(response => {
					this.formData.transmitters = response.data;
				}).catch(e => {
					console.log('Error getting subscriber names in calls/Calls.vue');
			});

			// Load avaiable transmitter groups
			this.$axios.get('transmitters/_groups')
				.then(response => {
					this.formData.transmitter_groups = response.data;
				}).catch(e => {
					console.log('Error getting subscriber groups in calls/Calls.vue');
			});
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
					priority: 3
				},
				formData: {
					subscribers: [],
					subscriber_groups: [],
					transmitters: [],
					transmitter_groups: []
				}
			};
		},
		computed: {
			messageCharsRemaining() {
				return 80 - this.form.data.length;
			}
		},
		methods: {
			emptyMessage(event) {
				return (this.form.data.length > 0);
			}
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
	};
</script>

<style>

</style>
