<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="page-header">
					<h1>{{ $t('navigation.users') }}</h1>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-lg-9">
				<form class="form-horizontal well">
					<fieldset>
						<legend v-if="!this.$route.params.id">{{ $t('users.general.newuser') }}</legend>
						<legend v-if="this.$route.params.id">{{ $t('users.new.edituser') }}</legend>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('general.name') }}</label>
							<div class="col-lg-10">
								<input type="text" v-model="form._id" class="form-control" :disabled="editing">
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('general.password') }}</label>
							<div class="col-lg-10">
								<div class="input-group">
									<input :type="passwordVisible ? 'text' : 'password'" v-model="form.password" class="form-control" :class="passwordVisible ? 'password-readable' : ''">
									<span class="input-group-btn">
										<button type="button" @click="passwordVisible = !passwordVisible" title="Toggle password visibility" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa" v-bind:class="{ 'fa-eye': passwordVisible, 'fa-eye-slash': !passwordVisible }"></i></button>
										<button type="button" v-clipboard:copy="form.password" v-clipboard:success="() => {this.$dialogs.success(this)}" title="Copy password to clipboard" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa fa-clipboard"></i></button>
										<button type="button" @click="form.password = $helpers.generatePassword(); passwordVisible = true;" title="Generate random password" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa fa-repeat"></i></button>
									</span>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('users.general.email') }}</label>
							<div class="col-lg-10">
								<input type="text" v-model="form.email" class="form-control">
							</div>
						</div>
						<!-- if user is allowed to change a rolem display selection box-->
						<div class="form-group" v-if="this.$store.getters.permission('user.change_role')">
							<label class="col-lg-2 control-label">{{ $t('users.general.roles') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.roles" :options="formData.roles" :multiple="true" :searchable="false"
														:close-on-select="false" :hide-selected="true" :clear-on-select="true"
														placeholder="Type to search"></multiselect>
							</div>
						</div>
						<!-- if user is not allowed to change a role, just display it -->
						<div class="form-group" v-if="!this.$store.getters.permission('user.change_role')">
							<label class="col-lg-2 control-label">{{ $t('users.general.roles') }}</label>
							<div class="col-lg-10">
								<span v-for="(role, index) in form.roles" v-bind:key="`role-${index}`" class="label label-roles">
									{{ role }}
								</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('users.general.othersettings') }}</label>
							<div class="col-lg-10">
								<table style="width: 100%">
									<thead style="text-align: center">
										<tr>
											<td>{{ $t('users.general.enabled') }}</td>
											<td>{{ $t('users.general.email_valid') }}</td>
										</tr>
									</thead>
									<tbody style="text-align: center">
										<tr>
											<td>
												<input v-if="this.$store.getters.permission('user.change_role')" type="checkbox" v-model="form.enabled" class="userEnabeldCheckBox" value="true">
												<span v-if="form.enabled && !this.$store.getters.permission('user.change_role')" class="label label-success">{{ $t('general.yes') }}</span>
												<span v-if="!form.enabled && !this.$store.getters.permission('user.change_role')" class="label label-primary">{{ $t('general.no') }}</span>
											</td>
											<td>
												<input v-if="this.$store.getters.permission('user.change_role')" type="checkbox" v-model="form.email_valid" class="userEnabeldCheckBox" value="true">
												<span v-if="form.email_valid && !this.$store.getters.permission('user.change_role')" class="label label-success">{{ $t('general.yes') }}</span>
												<span v-if="!form.email_valid && !this.$store.getters.permission('user.change_role')" class="label label-primary">{{ $t('general.no') }}</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('users.general.metainfo') }}</label>
							<div class="col-lg-10">
								<table style="border-spacing: 9px;border-collapse: separate">
									<tbody style="text-align: left">
									<tr v-if="created_on || created_by">
										<td>
											<span>{{ $t('general.created_on') }}</span>
										</td>
										<td>
											<span v-if="created_on">{{ this.created_on}}</span>
											<span v-else>-{{ $t('general.missing') }}-</span>
										</td>
										<td>
											<span>{{ $t('general.byUser') }}</span>
										</td>
										<td>
											<span v-if="created_by">{{ this.created_by}}</span>
											<span v-else>-{{ $t('general.missing') }}-</span>
										</td>
									</tr>
									<tr v-if="changed_on || changed_by">
										<td>
											<span>{{ $t('general.changed_on') }}</span>
										</td>
										<td>
											<span v-if="changed_on">{{ this.changed_on}}</span>
											<span v-else>-{{ $t('general.missing') }}-</span>
										</td>
										<td>
											<span>{{ $t('general.byUser') }}</span>
										</td>
										<td>
											<span v-if="changed_by">{{ this.changed_by}}</span>
											<span v-else>-{{ $t('general.missing') }}-</span>
										</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="form-group">
							<div class="col-lg-10 col-lg-offset-2">
								<button type="submit" @click="submitForm" class="btn btn-primary">{{ $t('general.submit') }}</button>
								<router-link to="/users"><button class="btn btn-default">{{ $t('general.abort') }}</button></router-link>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div class="col-lg-3">
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('users.new.information.help')"></p>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import moment from 'moment';
	export default {
		created() {
			axios.get('auth/users/roles')
				.then(response => {
					this.formData.roles = response.data;
				}).catch(e => {
					console.log('Error getting user\'s roles in user/new.vue');
				});

			// load data of given id
			if (this.$route.params.id) {
				axios.get('users/' + this.$route.params.id).then(response => {
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
					this.$router.push('/users');
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
				form2send: {
					_id: '',
					password: '',
					email: '',
					roles: ['user'],
					enabled: true,
					email_valid: true
				},
				formData: {
					roles: []
				},
				passwordVisible: false,
				created_on: '',
				created_by: '',
				changed_on: '',
				changed_by: ''
			};
		},
		methods: {
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
				var bcrypt = require('bcryptjs');
				var hash = bcrypt.hashSync(this.form.password, 10);
				this.form2send = Object.assign({}, this.form);
				this.form2send.password = hash;
				this.$helpers.sendData(this, 'users', this.form2send, '/users');

				// TODO: Update auth if a user change their own password
			}
		}
	};
</script>

<style scoped>

	.label-roles {
		font-size: small;
		margin-right: 2px;
		background-color: #469408;
	}
</style>
