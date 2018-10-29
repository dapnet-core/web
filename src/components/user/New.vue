<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md8>
				<v-card class="elevation-12">
					<v-toolbar>
						<v-toolbar-title
								v-if="this.$route.params.id"
						>
							{{ $t('users.new.edituser') }}
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
                                    readonly
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
                                            :type="passwordVisible ? 'text' : 'password'"
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
						</v-form>
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
				this.$axios.get('users/' + this.$route.params.id).then(response => {
					this.editing = true;
					this.form._id = response.data._id;
					this.form._rev = response.data._rev;
					this.form.email = response.data.email;
					this.form.roles = response.data.roles;
					this.form.enabled = response.data.enabled;
					this.form.email_valid = response.data.email_valid;
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
					// this.$router.push('/users');
				});
			}
		},
		data() {
			return {
				editing: false,
				form: {
					_id: '',
					password: '',
					email: '',
					roles: ['user'],
					enabled: true,
					email_valid: true
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
				passwordLabel: this.$t('general.password_unchanged')
			};
		},
		methods: {
			updatePasswortLabel(event) {
				if (this.form.password === '') {
					this.passwordLabel = this.$t('general.password_unchanged');
				} else {
					this.passwordLabel = this.$t('general.password_new');
				}
			},
			submitForm(event) {
				event.preventDefault();

				// prevent anything but A-Z, a-z, 0-9 as password
				if (this.form.password.match(/[^A-Za-z0-9]/g)) {
					this.$dialogs.passwordError(this);
					return false;
				}

				if (!this.form.roles.length > 0) {
					this.$dialogs.rolesEmptyError(this);
					return false;
				}

				// workaround to allow empty password to not change it
				if (this.$route.params.id && this.form.password === '') {
					this.form.password = '~~~DO_NOT_CHANGE_PASSWORD~~~';
				}

				// check for input in all fields
				if (!this.$helpers.checkForInput(this, this.form)) {
					return false;
				}

				// second part of the workaround
				if (this.$route.params.id && this.form.password === '~~~DO_NOT_CHANGE_PASSWORD~~~') {
					this.form.password = '';
				}
				this.form2send = Object.assign({}, this.form);
				if (this.form.password === '') {
					delete this.form2send.password;
				} else {
					var bcrypt = require('bcryptjs');
					var hash = bcrypt.hashSync(this.form.password, 10);
					this.form2send.password = hash;
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
