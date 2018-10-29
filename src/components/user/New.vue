<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md8>
				<v-card class="elevation-12">
					<v-toolbar>
						<v-toolbar-title>
							{{ this.isEdditing ? this.$t('users.general.edituser') : this.$t('users.general.newuser') }}
                        </v-toolbar-title>
                    </v-toolbar>
					<v-card-text>
						<v-form>
							<v-text-field
									prepend-icon="person"
									name="username"
									v-model="form._id"
									v-bind:label="$t('general.name')"
									type="text"
									v-bind:readonly="userformReadonly ? true : false"
							>
							</v-text-field>
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
                                            v-on:click="form.password = $helpers.generatePassword(); passwordVisible = true;"
                                            title="Generate random password"
                                    >
                                        <v-icon>refresh</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                                <v-text-field
                                    id="email"
                                    prepend-icon="email"
                                    name="email"
                                    v-model="form.email"
                                    v-bind:label="$t('users.general.email')"
                                    type="text"
                                >
                                </v-text-field>
                                <!-- if user is allowed to change a role, display selection box -->
                                <v-flex xs12 v-if="this.$store.getters.permission('user.change_role')">
                                    <v-combobox
                                            chips
                                            deletable-chips
                                            multiple
                                            solo
                                            prepend-icon="loyalty"
                                            v-model="form.roles"
                                            :items="formData.roles"
                                            v-bind:label="$t('users.general.roles')"
                                            v-bind:background-color="emptyRolesCombobox() ? '' : 'red'"
                                    >
                                    </v-combobox>
                                </v-flex>
                            </v-form>
                        <v-layout>
                            <!-- if user is not allowed to change a role, just display it -->
                            <v-flex xs6 v-if="!this.$store.getters.permission('user.change_role')">
                                <v-icon>loyalty</v-icon>
                                <v-chip v-for="(role, index) in this.form.roles" v-bind:key="`role-${index}`" color="green" text-color="white">
                                    {{ role }}
                                </v-chip>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-layout>
                            <v-flex xs6>
                                <v-switch
                                    v-model="form.enabled"
                                    v-bind:readonly="enabledReadonly ? true : false"
                                    v-bind:label="$t('users.general.enabled')"
                                >
                                </v-switch>
                            </v-flex>
                            <v-flex xs6>

                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
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
					<v-card-actions>
						<v-spacer></v-spacer>
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
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
	// import axios from 'axios';
	import moment from 'moment';
	export default {
		created() {
			this.$axios.get('auth/users/roles')
				.then(response => {
					this.formData.roles = response.data;
				}).catch(e => {
					console.log('Error getting user\'s roles in user/new.vue');
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
					email_lastchecked: ''
				},
				form2send: '',
				formData: {
					roles: []
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
				isEdditing: this.$route.params.id
			};
		},
		methods: {
			emptyRolesCombobox(event) {
				return (this.form.roles.length > 0);
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
