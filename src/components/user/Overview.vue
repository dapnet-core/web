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
				<h2>{{ $t('users.overview.allusers') }}
					<i class="fa fa-refresh fa-fw" :class="{ 'fa-spin': running }" @click="loadData"></i>
				</h2>

				<info-error :message="errorMessage"></info-error>

				<tablegrid v-if="table.rows" :columns="table.columns" :data="table.rows" :mail-action="mailToOwner" :edit-action="editElement" :delete-action="deleteElement"></tablegrid>
			</div>
			<div class="col-lg-3">
				<div class="actions well">
					<template v-if="this.$store.getters.permissions.includes('user.create')">
						<legend>{{ $t('general.actions') }}</legend>
						<ul>
							<li><router-link to="/users/new">{{ $t('users.general.newuser') }}</router-link></li>
							<li><p class="linklike" @click="mailToAll">{{ $t('users.overview.sendemailallusers') }}</p></li>
						</ul>
						<br>
					</template>
					<template v-if="table.rows">
						<legend>{{ $t('general.statistics') }}</legend>
						<ul class="list-group">
							<li class="list-group-item"><b>{{ $t('users.overview.totalusers') }}</b><span class="badge">{{ statTotal }}</span></li>
						</ul>
					</template>
				</div>
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('users.overview.information.help')"></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		created() {
			this.loadData();
		},
		data() {
			return {
				errorMessage: false,
				running: false,
				table: {
					columns: [
						{
							id: '_id',
							title: 'general.name'
						},
						{
							id: 'email',
							title: 'users.general.email'
						},
						{
							id: 'roles',
							title: 'users.general.roles'
						},
						{
							id: 'actions',
							title: 'general.actions'
						}
					],
					rows: false
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
				this.running = true;
				this.$http.get('users').then(response => {
					// success --> save new data
					response.body.rows.forEach(user => {
						// add email address (if available)
						if (user.email === undefined) {
							user.email = '---';
						}

						// add actions (if admin or owner)
						user.actions = false;
						console.log(this.$store.getters.permissions);
						if (this.$store.getters.permissions.includes('user.update')) {
							user.actions = true;
						}
					});

					this.table.rows = response.body.rows;
					this.running = false;
				}, response => {
					// error --> show error message
					this.running = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.mail + '?subject=DAPNET%20User%3A%20' + element.name;
			},
			editElement(element) {
				this.$router.push({name: 'Edit User', params: {id: element.name}});
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.$http.delete('users/' + element.name, {
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
