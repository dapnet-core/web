<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('users.overview.allusers') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- Add User Button -->
						<v-fab-transition v-if="this.$store.getters.permission('user.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									fab
									dark
									small
									to="/users/new"
									slot="activator"
								>
										<v-icon>add</v-icon>
								</v-btn>
								<span>{{ $t('users.newuser') }}</span>
							</v-tooltip>
						</v-fab-transition>
						<!-- Send Email to all users Button -->
						<v-fab-transition v-if="this.$store.getters.permission('user.create')">
							<v-tooltip bottom>
								<v-btn
									color="green"
									fab
									dark
									small
									v-on:click="mailToAll"
									slot="activator"
								>
									<v-icon>email</v-icon>
								</v-btn>
								<span>{{ $t('users.overview.sendemailallusers') }}</span>
							</v-tooltip>
						</v-fab-transition>
					</v-card-title>
					<v-data-table
						:headers="getHeaders"
						:items="userrows"
						:pagination.sync="pagination"
						:total-items="total_rows"
						:loading="isLoadingData"
						:rows-per-page-items="[10, 25, 50, 100]"
						must-sort
						class="elevation-1"
						:search="search"
					>
						<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
						<template slot="items" slot-scope="props">
							<td>{{ props.item._id }}</td>
							<td class="text-xs-center">{{ props.item.email }}</td>
							<!-- Roles column -->
							<td class="text-xs-left">
								<span v-for="(role, index) in props.item.roles" v-bind:key="`role-${index}`">
									<v-badge right overlap>
										<span slot="badge" v-if="role.badge">{{ role.badge }}</span>
										<v-chip
												label
												v-bind:color="`${role.color}`"
												text-color="white"
												small
										>
											{{ role.text }}
										</v-chip>
									</v-badge>
								</span>
							</td>
							<!-- Enabled column -->
							<td class="text-xs-right">
								<v-icon v-if="props.item.enabled" color="green">toggle_on</v-icon>
								<v-icon v-else color ="red">toggle_off</v-icon>
							</td>
							<!-- Action Buttons -->
							<td class="text-xs-center" v-if="displayActionsColumn">
								<!-- Edit -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('user.update') === 'all'"
											flat
											icon
											small
											fab
											color="blue"
											v-on:click="editElement(props.item)"
											slot="activator"
									>
										<v-icon>edit</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.edit') }}</span>
								</v-tooltip>
								<!-- Delete -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('user.delete') === 'all'"
											flat
											icon
											small
											fab
											color="pink"
											v-on:click="deleteElement(props.item)"
											slot="activator"
									>
										<v-icon>delete</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.delete') }}</span>
								</v-tooltip>
								<v-tooltip bottom class="action-buttons">
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('user.update') === 'all'"
											flat
											icon
											small
											fab
											color="grey"
											v-on:click="mailToOwner(props.item)"
											slot="activator"
									>
										<v-icon>contact_mail</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.email') }}</span>
								</v-tooltip>
							</td>
						</template>
						<v-alert slot="no-results" :value="true" color="error" icon="warning">
							Your search for "{{ search }}" found no results.
						</v-alert>
					</v-data-table>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		created() {
			this.loadData();
		},
		watch: {
			pagination: {
				handler() {
					this.loadData();
				},
				deep: true
			}
		},
		data() {
			return {
				search: '',
				total_rows: 0,
				userrows: [],
				errorMessage: false,
				isLoadingData: true,
				table: {
					columns: [
						{
							id: 'actions',
							title: 'general.actions'
						}
					]
				},
				pagination: {
					sortBy: 'doc._id',
					descending: true,
					rowsPerPage: 10,
					page: 1
				}
			};
		},
		computed: {
			getHeaders() {
				let answer = [
					{
						text: this.$i18n.t('general.name'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('general.email'),
						align: 'center',
						value: 'email'
					},
					{
						text: this.$i18n.t('general.roles'),
						align: 'left',
						value: 'roles'
					},
					{
						text: this.$i18n.t('general.enabled'),
						align: 'right',
						value: 'enabled'
					}
				];
				if (this.displayActionsColumn()) {
					let actions = {
						text: this.$i18n.t('general.actions'),
						align: 'center',
						sortable: false
					};
					answer.push(actions);
				}
				return answer;
			}
		},
		methods: {
			displayActionsColumn() {
				return ((this.$store.getters.permission('user.update') === 'all') ||
				(this.$store.getters.permission('user.delete') === 'all'));
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				this.isLoadingData = true;
				this.$axios.get('users', {
					params: {
						descending: !!this.pagination.descending,
						limit: this.pagination.rowsPerPage,
						skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
						startswith: '"' + this.search + '"'
					}
				}).then(response => {
					// success --> save new data

					// save total rows
					if (response.data.total_rows) {
						this.total_rows = response.data.total_rows;
					}

					// save rows
					if (response.data.rows) {
						response.data.rows.forEach(user => {
							// add email address (if available)
							if (user.email === undefined) {
								user.email = '---';
							}
							let rolesRenderd = [];
							// Render Roles in a beautiful way
							user.roles.sort(function(a, b) { return (b - a); });
							user.roles.forEach(role => {
								if (role === 'user') {
									rolesRenderd.push({
										text: 'U',
										color: 'green'
									});
								} else if (role === 'support') {
									rolesRenderd.push({
										text: 'S',
										color: 'yellow'
									});
								} else if (role === 'admin') {
									rolesRenderd.push({
										text: 'A',
										color: 'pink'
									});
								} else if ((role.split('.')[0]) === 'thirdparty') {
									let service = role.split('.')[1];
									if (service === 'brandmeister') {
										rolesRenderd.push({
											text: 'B',
											color: 'purple',
											badge: '3'
										});
									} else if (service === 'aprs') {
										rolesRenderd.push({
											text: 'A',
											color: 'deep-orange',
											badge: '3'
										});
									}
								}
							});
							user.roles = rolesRenderd;
						});
						this.userrows = response.data.rows;
					}
					this.isLoadingData = false;
				}, response => {
					// error --> show error message
					this.isLoadingData = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.email + '?subject=DAPNET%20User%3A%20' + element._id;
			},
			editElement(element) {
				this.$router.push({ name: 'Edit User', params: { id: element._id } });
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.axios.delete('users/' + element._id + '?revision=' + element._rev, {
						// before(request) {
						//	request.headers.delete('Content-Type');
						// }
					}).then(response => {
						// success --> reload data
						this.loadData();
					}, response => {
						// error --> show error message
						this.$dialogs.ajaxError(this, response);
					});
				});
			},
			mailToAll() {
				let mailTo = [];
				this.userrows.forEach(user => {
					if (!mailTo.includes(user.email)) {
						// add user's mail-address if it is not already in the list
						mailTo.push(user.email);
					}
				});
				window.location.href = 'mailto:' + mailTo.join(',') + '?subject=DAPNET%20User';
			}
		}
	};
	// TODO: Make headers instant i18n updateable
</script>

<style scoped>
	.action-buttons {
		padding: 1px;
		margin: 0px;
		display: inline-block;
	}
</style>
