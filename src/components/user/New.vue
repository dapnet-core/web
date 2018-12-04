<template>
	<!--
	<v-avatar
		v-if="this.$store.getters.avatar"
		size="80"
	>
		<img v-auth-image="'/users/' + this.$store.getters.username + '/avatar.jpg'">

	</v-avatar>
	<v-btn
		absolute
		icon
		right
		top
	>
		<v-icon>edit</v-icon>
	</v-btn>
	-->

	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm9 md9>
				<v-card class="elevation-12">
					<!--General toolbar-->
					<v-card-title>
						<span class="headline">{{ this.isEditMode ? this.$t('users.edituser') :
											this.$t('users.newuser') }}</span>
					</v-card-title>
					<v-form v-model="isFormValid" ref="form">
						<v-card-text>
							<v-container grid-list-md>
								<v-layout wrap>
									<!--ID-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											name="username"
											prepend-icon="person"
											required
											:counter="20"
											v-bind:rules="validationRules.username"
											v-model="form._id"
											v-bind:label="$t('general.username')"
											type="text"
											v-bind:readonly="userformReadonly ? true : false"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>

									<!--Email-->
									<v-flex xs12 sm6 md4>
										<v-text-field
											id="email"
											prepend-icon="email"
											name="email"
											required
											v-bind:rules="validationRules.email"
											v-model="form.email"
											v-bind:label="$t('general.email')"
											type="text"
											:loading="isLoadingData.general"
										>
											<v-progress-linear color="blue" indeterminate></v-progress-linear>
										</v-text-field>
									</v-flex>
									<v-spacer></v-spacer>
									<!-- Avatar -->
									<div class="avatar-position">
									<v-avatar
										v-if="this.$store.getters.avatar"
										size="80"
									>
										<img v-bind:src="AvatarImageComputed" />
										<div class="avatar-editicon-position">
										<v-btn
											flat
											icon
											color="red"
											@click="editavatardialog = true"
										>
											<v-icon>edit</v-icon>
										</v-btn>
										</div>
									</v-avatar>
									</div>
									<!--Edit avatar Dialog-->
									<v-dialog v-model="editavatardialog" max-width="430px">
										<v-card>
											<v-card-title>
												<span class="headline">Edit avatar picture</span>
											</v-card-title>
											<v-card-text>
														<div align="center">
														<vue-avatar
															:width="400"
															:height="400"
															:rotation="rotation"
															:borderRadius=0
															:scale="scale"
															:border="0"
															ref="vueavatar"
															@vue-avatar-editor:image-ready="onImageReady"
															:image="AvatarImageComputed"
														>
														</vue-avatar>
														</div>
												<v-layout align-center justify-center>
													<v-flex xs10>
														<v-slider
															v-model="scale"
															label="Zoom:"
															min="1"
															max="4"
															step="0.02"
															thumb-label
															width="400"
														>
														</v-slider>

													<br />
														<v-slider
															v-model="rotation"
															label="Rotation:"
															min="0"
															max="360"
															step="1"
															thumb-label
															width="400"
														>

														</v-slider>
													</v-flex>
												</v-layout>
											</v-card-text>
											<v-card-actions>
												<v-btn v-on:click="avatarSaveClicked">Save changes</v-btn>
												<v-btn color="primary" flat @click="editavatardialog=false">Close</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
									<!--Password-->
									<v-flex xs12>
										<v-layout align-center>
											<v-flex xs9>
												<v-text-field
												id="password"
												prepend-icon="lock"
												name="password"
												:required="!isEditMode"
												:counter="30"
												v-bind:rules="validationRules.password"
												v-model="form.password"
												v-bind:label="passwordLabel"
												v-bind:type="passwordVisible ? 'text' : 'password'"
												>
												</v-text-field>
											</v-flex>
											<v-flex xs2>
												<v-tooltip bottom>
													<v-btn class="action-buttons"
														flat
														icon
														small
														v-on:click="passwordVisible = !passwordVisible"
														slot="activator"
													>
														<v-icon v-if="passwordVisible">visibility_off</v-icon>
														<v-icon v-if="!passwordVisible">visibility</v-icon>
													</v-btn>
													<span>Toggle password visibility</span>
												</v-tooltip>
												<v-tooltip bottom>
													<v-btn class="action-buttons"
														flat
														icon
														small
														:v-clipboard:copy="form.password"
														slot="activator"
													>
														<v-icon>assignment</v-icon>
													</v-btn>
													<span>Copy password to clipboard</span>
												</v-tooltip>
												<v-tooltip bottom>
													<v-btn class="action-buttons"
														flat
														icon
														small
														v-on:click="form.password = $helpers.generatePassword(); passwordVisible = true;"
														slot="activator"
													>
														<v-icon>refresh</v-icon>
													</v-btn>
													<span>Generate random password</span>
												</v-tooltip>
											</v-flex>
										</v-layout>
									</v-flex>

							<!--General settings-->
<!--							<v-card color="blue-grey lighten-4">
								<v-card-title>
									<div>{{ $t('general.general_settings') }}</div>
								</v-card-title>
-->
									<!--Roles, enabled and show third-party roles-->
									<v-flex xs12>
										<v-layout align-center>
										<!-- if user is allowed to change a role, display selection box -->
											<v-flex xs6 v-if="this.$store.getters.permission('user.change_role')">
												<v-autocomplete
													hide-selected
													chips
													small-chips
													deletable-chips
													multiple
													prepend-icon="loyalty"
													v-model="form.roles"
													:items="formData.roles"
													v-bind:label="$t('general.roles')"
													:loading="isLoadingData.roles"
													required
													v-bind:rules="validationRules.roles"
												>
													<v-progress-linear color="blue" indeterminate></v-progress-linear>
												</v-autocomplete>
											</v-flex>
										<!-- if user is not allowed to change a role, just display it -->
											<v-flex xs6 v-if="!this.$store.getters.permission('user.change_role')">
												<v-icon>loyalty</v-icon>
												<v-chip v-for="(role, index) in this.form.roles" v-bind:key="`role-${index}`" color="green" text-color="white">
													{{ role }}
												</v-chip>
											</v-flex>
											<!--Enabled-->
											<v-flex xs3>
												<v-switch
													v-model="form.enabled"
													v-bind:readonly="enabledReadonly ? true : false"
													:label="$t('general.enabled')"
												>
												</v-switch>
											</v-flex>
											<v-flex xs3>
												<v-checkbox
													v-model="showthirdpartyroles"
													hide-details
													v-on:click.native="changeAvailableRoles"
													:label="$t('users.showthirdpartyroles')"
												>
												</v-checkbox>
											</v-flex>
										</v-layout>
									</v-flex>
									<!-- Add third-party roles-->
									<v-expansion-panel v-if="showthirdpartyroles">
										<v-expansion-panel-content>
											<div slot="header">{{ $t('users.addroles.title') }}</div>
											<v-card>
												<v-layout>
													<v-flex xs3>
														<div>thirdparty.</div>
													</v-flex>
													<v-flex sx7>
														<v-text-field
															v-model="newthridpartyrole"
															v-bind:placeholder="$t('users.addroles.placeholder')"
															v-bind:hint="$t('users.addroles.help')"
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
															{{ $t('users.addroles.add') }}
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
								</v-layout>
							</v-container>
							<!-- Default settings -->
							<v-card color="green">
								<v-card-title>{{ $t('general.default_settings') }}</v-card-title>
								<v-card-text>
									<v-layout>
									<!-- Display default subscriber names selection-->
										<v-flex xs5>
											<v-autocomplete
												chips
												small-chips
												deletable-chips
												multiple
												hide-selected
												prepend-icon="person"
												v-model="form.defaults.subscribers"
												:items="formData.subscribers"
												v-bind:label="$t('general.subscribers')"
												:loading="isLoadingData.subscribers"
											>
												<v-progress-linear color="blue" indeterminate></v-progress-linear>
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
												hide-selected
												prepend-icon="people"
												v-model="form.defaults.subscriber_groups"
												:items="formData.subscriber_groups"
												v-bind:label="$t('general.subscriber_groups')"
												:loading="isLoadingData.subscriber_groups"
											>
												<v-progress-linear color="blue" indeterminate></v-progress-linear>
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
													hide-selected
													prepend-icon="wifi"
													v-model="form.defaults.transmitters"
													:items="formData.transmitters"
													v-bind:label="$t('general.transmitters')"
													:loading="isLoadingData.transmitters"
											>
												<v-progress-linear color="blue" indeterminate></v-progress-linear>
											</v-autocomplete>
										</v-flex>
										<v-flex xs2></v-flex>
										<!-- Display default transmitter groups selection -->
										<v-flex xs5>
											<v-autocomplete
													chips
													small-chips
													deletable-chips
													multiple
													hide-selected
													prepend-icon="wifi_tethering"
													v-model="form.defaults.transmitter_groups"
													:items="formData.transmitter_groups"
													v-bind:label="$t('general.transmitter_groups')"
													:loading="this.isLoadingData.transmitter_groups"
											>
												<v-progress-linear color="blue" indeterminate></v-progress-linear>
											</v-autocomplete>
										</v-flex>
									</v-layout>
									<v-layout>
										<!-- Display default message priority -->
										<v-flex xs5>
											<v-select
												prepend-icon="low_priority"
												v-model="form.defaults.priority"
												v-bind:items="priority_labels"
												v-bind:label="$t('general.priority')"
												persistent-hint
												v-bind:hint="$t('general.priority_hint')"
											>
											</v-select>
										</v-flex>
										<v-flex xs2></v-flex>
										<!-- Display default expiration time -->

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
								</v-card-text>
							</v-card>
							<!-- Timestamps -->
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
</template>
<script>
	import moment from 'moment';
	import { VueAvatar } from 'vue-avatar-editor-improved';

	export default {
		components: {
			VueAvatar: VueAvatar
		},
		created() {
			this.loadData();
		},
		data() {
			return {
				rotation: 0,
				scale: 1,
				editavatardialog: false,
				isLoadingData: {
					general: true,
					subscribers: true,
					subscriber_groups: true,
					transmitters: true,
					transmitter_groups: true,
					roles: true
				},
				isFormValid: true,
				form: {
					_id: '',
					_rev: '',
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
					},
					_attachments: {}
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
				userformReadonly: true,
				enabledReadonly: false,
				isEditMode: (!!(this.$route.params.id)),
				newthridpartyrole: '',
				newRoleOk: true,
				newRoleAddButtonDisabled: true,
				showthirdpartyroles: false,
				availableThirdPartyRoles: [],
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
			AvatarImageComputed() {
				return this.$store.getters.avatarImage;
			},
			passwordLabel() {
				if (this.isEditMode) {
					if (this.form.password === '') {
						return this.$t('general.password_unchanged');
					} else {
						return this.$t('general.password_new');
					}
				} else {
					return this.$t('general.password');
				}
			},
			validationRules() {
				return {
					'username': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.username') }),
						v => (v && v.length <= 20) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.username'),
							count: '20'
						}),
						v => (v && v.length >= 3) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.username'),
							count: '3'
						}),
						v => (v && /^[a-z0-9]+$/i.test(v)) || this.$t('formvalidation.onlyalphanumeric')
					],
					'password': [
						v => (!!v || this.isEditMode) || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.password') }),
						v => ((!!v || this.isEditMode) && v.length <= 30) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.password'),
							count: '30'
						}),
						v => ((!!v || this.isEditMode) && (!v || /^[a-z0-9]+$/i.test(v))) || this.$t('formvalidation.onlyalphanumeric'),
						v => ((!!v || this.isEditMode) && (!v || v.length >= 3)) || this.$t('formvalidation.underlength', {
							fieldname: this.$t('general.password'),
							count: '3'
						})
					],
					'email': [
						v => !!v || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.email') }),
						v => /.+@.+\..+/.test(v) || this.$t('formvalidation.isvalidEmail')
					],
					'roles': [
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('formvalidation.minonerole') })
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
			}
		},
		methods: {
			createBlob(dataURL) {
				var BASE64_MARKER = ';base64,';
				if (dataURL.indexOf(BASE64_MARKER) === -1) {
					var parts = dataURL.split(',');
					var contentType = parts[0].split(':')[1];
					var raw = decodeURIComponent(parts[1]);
					return new Blob([raw], { type: contentType });
				}
				var parts = dataURL.split(BASE64_MARKER);
				var contentType = parts[0].split(':')[1];
				var raw = window.atob(parts[1]);
				var rawLength = raw.length;

				var uInt8Array = new Uint8Array(rawLength);

				for (var i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}

				return new Blob([uInt8Array], { type: contentType });
			},
			avatarSaveClicked() {
				var img = this.$refs.vueavatar.getImageScaled();
				console.log('Stored new avatar to browser store');
				this.$store.commit('changeAvatar', {
					avatarImage: img.toDataURL('image/jpeg')
				});
				console.log('Storing to Couchdb');
				let avatarPutPath = '/users/' + this.$store.getters.username + '/avatar.jpg?rev=' + this.form._rev;
				console.log(avatarPutPath);
				var rawImage = this.createBlob(img.toDataURL('image/jpeg'));

				this.$axios.put(
					avatarPutPath,
					rawImage,
					{
						headers: {
							'Content-Type': 'image/jpeg'
						}
					}
				)
					.then(r => console.log(r.status))
					.catch(e => console.log(e));
				this.editavatardialog = false;
			},
			onImageReady() {
				this.scale = 1;
				this.rotation = 0;
			},
			loadData() {
				console.log('Created');
				// Load avaiable user roles
				this.isLoadingData.roles = true;
				this.$axios.get('auth/users/roles')
					.then(response => {
						this.formData.roles = response.data;
						this.formData.roles_backup = Array.from(this.formData.roles);
						this.isLoadingData.roles = false;
					}).catch(e => {
						console.log('Error getting user\'s roles in user/new.vue');
				});

				// TO: Load availableThirdPartyRoles from API:
				// Workaround: Set static
				this.availableThirdPartyRoles = ['thirdparty.brandmeister'];

				// Load available subscriber names
				this.isLoadingData.subscribers = true;
				this.$axios.get('subscribers/_names')
					.then(response => {
						this.formData.subscribers = response.data;
						this.isLoadingData.subscribers = false;
					}).catch(e => {
						console.log('Error getting subscriber names in user/new.vue');
				});

				// Load available subscriber groups
				this.isLoadingData.subscriber_groups = true;
				this.$axios.get('subscribers/_groups')
					.then(response => {
						this.formData.subscriber_groups = response.data;
						this.isLoadingData.subscriber_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in user/new.vue');
				});

				// Load available transmitter names
				this.isLoadingData.transmitters = true;
				this.$axios.get('transmitters/_names')
					.then(response => {
						this.formData.transmitters = response.data;
						this.isLoadingData.transmitters = false;
					}).catch(e => {
						console.log('Error getting subscriber names in user/new.vue');
				});

				// Load available transmitter groups
				this.isLoadingData.transmitter_groups = true;
				this.$axios.get('transmitters/_groups')
					.then(response => {
						this.formData.transmitter_groups = response.data;
						this.isLoadingData.transmitter_groups = false;
					}).catch(e => {
						console.log('Error getting subscriber groups in user/new.vue');
				});

				// load data of given id
				this.isLoadingData.general = true;
				if (this.$route.params.id) {
					console.log('params:' + this.$route.params.id);
					this.userformReadonly = true;
					this.$axios.get('users/' + this.$route.params.id)
						.then(response => {
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
							if (response.data.defaults) {
								if (response.data.defaults.transmitters) {
									this.form.defaults.transmitters = response.data.defaults.transmitters;
								} else {
									this.form.defaults.transmitters = [];
								}
								if (response.data.defaults.transmitter_groups) {
									this.form.defaults.transmitter_groups = response.data.defaults.transmitter_groups;
								} else {
									this.form.defaults.transmitter_groups = [];
								}
								if (response.data.defaults.subscribers) {
									this.form.defaults.subscribers = response.data.defaults.subscribers;
								} else {
									this.form.defaults.subscribers = [];
								}
								if (response.data.defaults.subscriber_groups) {
									this.form.defaults.subscriber_groups = response.data.defaults.subscriber_groups;
								} else {
									this.form.defaults.subscriber_groups = [];
								}
								if (response.data.defaults.expiration_duration) {
									this.form.defaults.expiration_duration = response.data.defaults.expiration_duration;
									if (this.form.defaults.expiration_duration > ((6 * 3600 * 24) + (23 * 3600) + (45 * 60))) {
										this.form.defaults.expiration_duration = (6 * 3600 * 24) + (23 * 3600) + (50 * 60);
									}
									this.expiration_selection.days = Math.floor(this.form.defaults.expiration_duration / (3600 * 24));
									this.expiration_selection.hours = Math.floor(this.form.defaults.expiration_duration % (3600 * 24) / 3600);
									this.expiration_selection.minutes = Math.floor(this.form.defaults.expiration_duration % 3600 / 60 / 10) * 10;
								} else {
									this.form.defaults.expiration_duration = '';
								}
								if (response.data.defaults.priority) {
									this.form.defaults.priority = this.$helpers.priorityNumber2String(this, response.data.defaults.priority);
								} else {
									this.form.defaults.priority = '';
								}
							}
							if (response.data._attachments) {
								this.form._attachments = response.data._attachments;
							} else {
								this.form._attachments = {};
							}
							// TODO: continue integration of avatar
							console.log(this.form._attachments['avatar.jpg'].content_type);
						}).catch(e => {
							console.log('Error getting user\'s individual details with axios or any exception in the get handler.');
							this.$dialogs.passwordError(this, e);
							// this.$router.push('/users');
					});
				} else {
					this.userformReadonly = false;
				}
				this.enabledReadonly = !(this.$store.getters.permission('user.change_role'));

				console.log('this.$route.params.id ' + this.$route.params.id);
				console.log('EditMode: ' + this.isEditMode);
				this.isLoadingData.general = false;
			},
			changeAvailableRoles(event) {
				if (this.showthirdpartyroles) {
					this.formData.roles.push.apply(this.formData.roles, this.availableThirdPartyRoles);
				} else {
					this.formData.roles = Array.from(this.formData.roles_backup);
				}
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
			submitForm(event) {
				event.preventDefault();
				console.log(this.form);

				if (this.$refs.form.validate()) {
					this.form2send = Object.assign({}, this.form);

					// Don't send password, if not changed
					if (this.form.password === '') {
						delete this.form2send.password;
					} else {
						var bcrypt = require('bcryptjs');
						this.form2send.password = bcrypt.hashSync(this.form.password, 10);
					}

					this.form2send.defaults.priority = this.$helpers.priorityString2Number(this, this.form.defaults.priority);
					this.form2send.defaults.expiration_duration = this.expiration_selection.days * (24 * 3600) +
						this.expiration_selection.hours * 3600 +
						this.expiration_selection.minutes * 60;

					console.log('Data2Send:');
					console.log(this.form2send);
					this.$helpers.sendData(this, 'users', this.form2send, '/users');

					// TODO: Update auth if a user change their own password
				}
			}
		}
	};
</script>
<style scoped>
	.action-buttons {
		padding: 1px;
		margin: 0px;
		display: inline-block;
	}

	.avatar-editicon-position {
		position: absolute;
		left: 30px;
		top: 30px;
	}
	.avatar-position {
		position: relative;
	}
</style>
