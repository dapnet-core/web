<template>
	<v-container fluid>
		<v-layout>
			<v-flex sx3><h1>{{ $t('users.overview.allusers') }}</h1></v-flex>
			<v-flex xs9 v-if="this.$store.getters.permission('user.create')">
				<v-card class="elevation-12">
					<v-card-title>{{ $t('general.actions') }}</v-card-title>
					<v-btn>
						<router-link to="/users/new">{{ $t('users.general.newuser') }}</router-link>
					</v-btn>
					<v-btn v-on:click="mailToAll">{{ $t('users.overview.sendemailallusers') }}</v-btn>
				</v-card>
			</v-flex>
			<!--			<template v-if="table.rows">
                            <legend>{{ $t('general.statistics') }}</legend>
                            <ul class="list-group">
                                <li class="list-group-item"><b>{{ $t('users.overview.totalusers') }}</b><span class="badge">{{ statTotal }}</span></li>
                            </ul>
                        </template>
            -->
		</v-layout>

		<!--				<info-error :message="errorMessage"></info-error>

                        <tablegrid v-if="table.rows" :columns="table.columns" :data="table.rows" :mail-action="mailToOwner" :edit-action="editElement" :delete-action="deleteElement"></tablegrid>
        -->

		<v-layout>
			<v-flex xs12>
				<v-data-table
					:headers="headers"
					:items="userrows"
					:pagination.sync="pagination"
					:total-items="total_rows"
					:loading="loadingdata"
					:rows-per-page-items="[10, 25, 50, 100]"
					must-sort
					class="elevation-1"
				>
					<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
					<template slot="items" slot-scope="props">
						<td>{{ props.item._id }}</td>
						<td class="text-xs-center">{{ props.item.email }}</td>
						<td class="text-xs-center">
							<span v-html="props.item.roles"></span>
						</td>
						<td class="text-xs-right">
							<span v-if="props.item.enabled" class="label label-success">{{ $t('general.yes') }}</span>
							<span v-else class="label label-primary">{{ $t('general.no') }}</span>
						</td>
					</template>
				</v-data-table>
			</v-flex>
		</v-layout>
		<h2>{{ $t('general.information') }}</h2>
		<p v-html="$t('users.overview.information.help')"></p>
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
				total_rows: 0,
				userrows: [],
				headers: [
					{
						text: this.$i18n.t('general.name'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('users.general.email'),
						align: 'center',
						value: 'email'
					},
					{
						text: this.$i18n.t('users.general.roles'),
						align: 'center',
						value: 'roles'
					},
					{
						text: this.$i18n.t('users.general.enabled'),
						align: 'right',
						value: 'enabled'
					}
				],
				errorMessage: false,
				loadingdata: true,
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
			statTotal() {
				return this.table.rows.length;
			}
		},
		methods: {
			loadData() {
				this.loadingdata = true;
				this.$axios.get('users', {
					params: {
						descending: !!this.pagination.descending,
						limit: this.pagination.rowsPerPage,
						skip: (this.pagination.page - 1) * this.pagination.rowsPerPage
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
							let rolesRenderd = '';
							// Render Roles in a beautiful way
							user.roles.forEach(role => {
								rolesRenderd = rolesRenderd + '<span class="badge">' + role + '</span><br />';
							});
							user.roles = rolesRenderd;
						});
						this.userrows = response.data.rows;
					}
					this.loadingdata = false;
				}, response => {
					// error --> show error message
					this.loadingdata = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.email + '?subject=DAPNET%20User%3A%20' + element._id;
			},
			editElement(element) {
				this.$router.push({name: 'Edit User', params: {id: element._id}});
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.$http.delete('users/' + element._id, {
						before(request) {
							request.headers.delete('Content-Type');
						}
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
				this.table.rows.forEach(user => {
					if (!mailTo.includes(user.email)) {
						// add user's mail-address if it is not already in the list
						mailTo.push(user.email);
					}
				});
				window.location.href = 'mailto:' + mailTo.join(',') + '?subject=DAPNET%20User';
			}
		}
	};
</script>

<style scoped>

</style>
