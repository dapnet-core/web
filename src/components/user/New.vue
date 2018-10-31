<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-toolbar>
						<v-toolbar-title>
							<div>
								<div class="headline">
									{{ this.isEdditing ? this.$t('users.general.edituser') : this.$t('users.general.newuser') }}
								</div>
							</div>
						</v-toolbar-title>
					</v-toolbar>
					<v-form>
						<v-card-text>
							<!--General settings-->
							<v-card color="blue-grey lighten-4">
								<v-card-title>
									<div>{{ $t('general.general_settings') }}</div>
										</v-card-title>
								<v-card-text>
									<!--ID-->
									<v-text-field
											prepend-icon="person"
											name="username"
											v-model="form._id"
											v-bind:label="$t('general.name')"
											type="text"
											v-bind:readonly="userformReadonly ? true : false"
									>
									</v-text-field>
									<!--Password-->
									<v-layout>
										<v-flex xs6>
											<v-text-field
													id="password"
													prepend-icon="lock"
													name="password"
													v-model="form.password"
													v-bind:label="passwordLabel"
													v-bind:type="passwordVisible ? 'text' : 'password'"
													v-bind:background-color="passwordValuesOk ? '' : 'red'"
													@input="updatePasswortLabel"
											>
											</v-text-field>
										</v-flex>
										<v-flex xs2>
											<v-btn
													v-on:click="passwordVisible = !passwordVisible"
													title="Toggle password visibility"
											>
												<v-icon v-if="passwordVisible">visibility_off</v-icon>
												<v-icon v-if="!passwordVisible">visibility</v-icon>
											</v-btn>
										</v-flex>
										<v-flex xs2>
											<v-btn
													:v-clipboard:copy="form.password"
													title="Copy password to clipboard"
											>
												<v-icon>assignment</v-icon>
											</v-btn>
										</v-flex>
										<v-flex xs2>
											<v-btn
													v-on:click="form.password = $helpers.generatePassword(); passwordVisible = true; updatePasswortLabel();"
													title="Generate random password"
											>
												<v-icon>refresh</v-icon>
											</v-btn>
										</v-flex>
									</v-layout>
									<!--Email-->
									<v-text-field
										id="email"
										prepend-icon="email"
										name="email"
										v-model="form.email"
										v-bind:label="$t('users.general.email')"
										type="text"
									>
									</v-text-field>
									<!--Roles, enabled and show third-party roles-->
									<v-layout>
										<!-- if user is allowed to change a role, display selection box -->
										<v-flex xs7 v-if="this.$store.getters.permission('user.change_role')">
											<v-autocomplete
                                                    hide-selected
                                                    chips
                                                    small-chips
                                                    deletable-chips
                                                    multiple
													prepend-icon="loyalty"
													v-model="form.roles"
													:items="formData.roles"
													v-bind:label="$t('users.general.roles')"
													v-bind:background-color="emptyRolesCombobox() ? '' : 'red'"
                                                    persistent-hint
                                                    v-bind:hint="emptyRolesCombobox() ? '' : $t('users.general.atleastonerole')"
											>
											</v-autocomplete>
										</v-flex>
										<!-- if user is not allowed to change a role, just display it -->
										<v-flex xs7 v-if="!this.$store.getters.permission('user.change_role')">
											<v-icon>loyalty</v-icon>
											<v-chip v-for="(role, index) in this.form.roles" v-bind:key="`role-${index}`" color="green" text-color="white">
												{{ role }}
											</v-chip>
										</v-flex>
										<!--Enabled-->
										<v-flex xs3>
											<v-layout row wrap class="dark--text">
												<v-flex xs6><p class="text-xs-center">{{ $t('users.general.enabled') }}</p></v-flex>
												<v-flex xs6><p class="text-xs-center">{{ $t('users.general.showthirdpartyroles') }}</p></v-flex>
											</v-layout>
											<v-layout row wrap>
												<v-flex>
													<div class="text-xs-center">
														<v-switch
																v-model="form.enabled"
																v-bind:readonly="enabledReadonly ? true : false"
														>
														</v-switch>
													</div>
												</v-flex>
												<v-flex v-if="this.$store.getters.permission('user.change_role')">
													<div class="text-xs-center">
														<v-checkbox
															v-model="showthirdpartyroles"
															hide-details
															v-on:click.native="changeAvailableRoles"
														>
														</v-checkbox>
													</div>
												</v-flex>
											</v-layout>
										</v-flex>
									</v-layout>
									<!-- Add third-party roles-->
									<v-expansion-panel v-if="showthirdpartyroles">
										<v-expansion-panel-content>
											<div slot="header">{{ $t('users.general.addroles.title') }}</div>
											<v-card>
												<v-layout>
													<v-flex xs3>
														<div>thirdparty.</div>
													</v-flex>
													<v-flex sx7>
														<v-text-field
															v-model="newthridpartyrole"
															v-bind:placeholder="$t('users.general.addroles.placeholder')"
															v-bind:hint="$t('users.general.addroles.help')"
															persistent-hint
															v-bind:background-color="newRoleOk ? '' : 'red'"
															@input="updateNewRoleField"
														>
														</v-text-field>
													</v-flex>
													<v-flex sx2>
														<v-btn
															color="success"
															v-bind:disabled="newRoleAddButtonDisabled"
															v-on:click="addNewThirdPartyRole"
														>
															{{ $t('users.general.addroles.add') }}
														</v-btn>
													</v-flex>
												</v-layout>
												<v-layout>
<!--													<v-flex xs1><v-icon>loyalty</v-icon></v-flex>
													<v-flex xs2>asdhajks.</v-flex>
													-->
													<v-flex xs12>
													</v-flex>
												</v-layout>
											</v-card>
										</v-expansion-panel-content>
									</v-expansion-panel>
								</v-card-text>
							</v-card>
							<v-card color="green">
								<v-card-title>{{ $t('general.default_settings') }}</v-card-title>
								<v-card-text>
									<v-layout>
									<!-- Display default subscriber names selection-->
										<v-flex xs5>
											<v-combobox
												chips
												deletable-chips
												multiple
												hide-selected
												solo
												prepend-icon="person"
												v-model="form.defaults.subscribers"
												:items="formData.subscribers"
												v-bind:label="$t('users.general.subscribers')"
											>
											</v-combobox>
										</v-flex>
										<v-flex xs2></v-flex>
										<!-- Display default subscriber groups selection-->
										<v-flex xs5>
											<v-combobox
												chips
												deletable-chips
												multiple
												solo
												prepend-icon="people"
												v-model="form.defaults.subscriber_groups"
												:items="formData.subscriber_groups"
												v-bind:label="$t('users.general.subscriber_groups')"
										>
										</v-combobox>
									</v-flex>
									</v-layout>
									<v-layout>
										<!-- Display default transmitter names selection-->
										<v-flex xs5>
											<v-combobox
													chips
													deletable-chips
													multiple
													solo
													prepend-icon="wifi"
													v-model="form.defaults.transmitters"
													:items="formData.transmitters"
													v-bind:label="$t('users.general.transmitters')"
											>
											</v-combobox>
										</v-flex>
										<v-flex xs2></v-flex>
										<!-- Display default trasnmitter groups selection-->
										<v-flex xs5>
											<v-combobox
													chips
													deletable-chips
													multiple
													solo
													prepend-icon="wifi_tethering"
													v-model="form.defaults.transmitter_groups"
													:items="formData.transmitter_groups"
													v-bind:label="$t('users.general.transmitter_groups')"
											>
											</v-combobox>
										</v-flex>
									</v-layout>
								</v-card-text>
							</v-card>
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
						<v-card-actions>
							<v-btn
								color="primary"
								@click="submitForm"
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
		created() {
			// Load avaiable user roles
			this.$axios.get('auth/users/roles')
				.then(response => {
					this.formData.roles = response.data;
					this.formData.roles_backup = Array.from(this.formData.roles);
				}).catch(e => {
					console.log('Error getting user\'s roles in user/new.vue');
				});

			// TO: Load availableThirdPartyRoles from API:
			// Workaround: Set static
			this.availableThirdPartyRoles = ['thirdparty.brandmeister'];

			// Load avaiable subscriber names
			this.$axios.get('subscribers/_names')
				.then(response => {
					this.formData.subscribers = response.data;
				}).catch(e => {
					console.log('Error getting subscriber names in user/new.vue');
			});

			// Load avaiable subscriber groups
			this.$axios.get('subscribers/_groups')
				.then(response => {
					this.formData.subscriber_groups = response.data;
				}).catch(e => {
					console.log('Error getting subscriber groups in user/new.vue');
			});

			// Load avaiable stransmitter names
			this.$axios.get('transmitters/_names')
				.then(response => {
					this.formData.transmitters = response.data;
				}).catch(e => {
					console.log('Error getting subscriber names in user/new.vue');
			});

			// Load avaiable transmitter groups
			this.$axios.get('transmitters/_groups')
				.then(response => {
					this.formData.transmitter_groups = response.data;
				}).catch(e => {
					console.log('Error getting subscriber groups in user/new.vue');
			});

			// load data of given id
			if (this.$route.params.id) {
				console.log('params:' + this.$route.params.id);
				this.userformReadonly = true;

				this.passwordLabel = this.$t('general.password_unchanged');

				this.$axios.get('users/' + this.$route.params.id).then(response => {
					this.form._id = response.data._id;
					this.form._rev = response.data._rev;
					this.form.email = response.data.email;
					this.form.roles = response.data.roles;
					this.form.enabled = response.data.enabled;
					this.form.email_lastchecked = response.data.email_lastchecked;
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
					console.log('Error getting user\'s individual details with axios');
					this.$dialogs.passwordError(this, e);
					// this.$router.push('/users');
				});
			} else {
				this.userformReadonly = false;
			}
			if (this.$store.getters.permission('user.change_role')) {
				this.enabledReadonly = false;
			} else {
				this.enabledReadonly = true;
			}
		},
		data() {
			return {
				form: {
					_id: '',
					password: '',
					email: '',
					roles: ['user'],
					enabled: true,
					email_lastchecked: '',
					defaults: {
						subscribers: [],
						subscriber_groups: [],
						transmitters: [],
						transmitter_groups: [],
						expiration_duration: '',
						priority: ''
					}
				},
				form2send: '',
				formData: {
					roles: [],
					roles_backup: [],
					subscribers: [],
					subscriber_groups: [],
					transmitters: [],
					transmitter_groups: [],
					expiration_duration: '',
					priority: ''
				},
				passwordVisible: false,
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: '',
				passwordLabel: this.$t('general.password'),
				passwordValuesOk: true,
				userformReadonly: true,
				enabledReadonly: false,
				isEdditing: this.$route.params.id,
				newthridpartyrole: '',
				newRoleOk: true,
				newRoleAddButtonDisabled: true,
				showthirdpartyroles: false,
				availableThirdPartyRoles: []
			};
		},
		methods: {
			changeAvailableRoles(event) {
				if (this.showthirdpartyroles) {
					this.formData.roles.push.apply(this.formData.roles, this.availableThirdPartyRoles);
				} else {
					this.formData.roles = Array.from(this.formData.roles_backup);
				}
			},
			emptyRolesCombobox(event) {
				return (this.form.roles.length > 0);
			},
			updateNewRoleField(event) {
				if (this.newthridpartyrole === '') {
					this.newRoleOk = true;
					this.newRoleAddButtonDisabled = true;
					return;
				}
				if ((!this.newthridpartyrole.match(/[^A-Za-z0-9]/g)) &&
				(!(this.availableThirdPartyRoles.includes('thirdparty.' + this.newthridpartyrole)))) {
					this.newRoleOk = true;
					this.newRoleAddButtonDisabled = false;
				} else {
					this.newRoleOk = false;
					this.newRoleAddButtonDisabled = true;
				}
			},
			addNewThirdPartyRole(event) {
				// Check again, although the Button should be disabled if this is not true
				if ((!this.newthridpartyrole.match(/[^A-Za-z0-9]/g)) &&
				(!(this.availableThirdPartyRoles.includes('thirdparty.' + this.newthridpartyrole)))) {
					this.formData.roles.push('thirdparty.' + this.newthridpartyrole);
					this.newthridpartyrole = '';
					this.newRoleAddButtonDisabled = true;
				}
			},
			updatePasswortLabel(event) {
				this.userformReadonly = this.isEdditing;
				if (this.isEdditing) {
					if (this.form.password === '') {
						this.passwordLabel = this.$t('general.password_unchanged');
						this.passwordValuesOk = true;
					} else {
						if (!this.form.password.match(/[^A-Za-z0-9]/g)) {
							this.passwordValuesOk = true;
							this.passwordLabel = this.$t('general.password_new');
						} else {
							this.passwordValuesOk = false;
							this.passwordLabel = this.$t('general.password_new') + ' - ' + this.$t('general.password_invalid_content');
						}
					}
				} else {
					if (this.form.password === '') {
						this.passwordLabel = this.$t('general.password');
						this.passwordValuesOk = true;
					} else {
						if (!this.form.password.match(/[^A-Za-z0-9]/g)) {
							this.passwordValuesOk = true;
							this.passwordLabel = this.$t('general.password');
						} else {
							this.passwordValuesOk = false;
							this.passwordLabel = this.$t('general.password') + ' - ' + this.$t('general.password_invalid_content');
						}
					}
				}
			},
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				// prevent anything but A-Z, a-z, 0-9 as password
				if (this.form.password.match(/[^A-Za-z0-9]/g)) {
					this.$dialogs.passwordError(this);
					return false;
				}

				if (!this.form.roles.length > 0) {
					this.$dialogs.rolesEmptyError(this);
					return false;
				}

				this.form2send = Object.assign({}, this.form);
				if (this.form.password === '') {
					delete this.form2send.password;
				} else {
					var bcrypt = require('bcryptjs');
					var hash = bcrypt.hashSync(this.form.password, 10);
					this.form2send.password = hash;
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
<style scoped>

</style>
