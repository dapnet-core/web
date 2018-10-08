<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="page-header">
					<h1>{{ $t('navigation.calls') }}</h1>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-lg-9">
				<h2>{{ $t('calls.overview.allcalls') }}
					<i class="fa fa-refresh fa-fw" :class="{ 'fa-spin': running }" @click="loadData"></i>
				</h2>

				<info-error :message="errorMessage"></info-error>

				<tablegrid v-if="table.rows" :columns="table.columns" :data="table.rows"></tablegrid>
			</div>
			<div class="col-lg-3">
				<div class="actions well">
					<legend>{{ $t('general.actions') }}</legend>
					<ul>
						<li><router-link to="/calls/new">{{ $t('calls.overview.newcall') }}</router-link></li>
					</ul>
					<br>
					<template v-if="table.rows">
						<legend>{{ $t('general.statistics') }}</legend>
						<ul class="list-group">
							<li class="list-group-item"><b>{{ $t('calls.overview.totalcalls') }}</b><span class="badge">{{ statTotal }}</span></li>
						</ul>
					</template>
				</div>
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('calls.overview.information.help')"></p>
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
							id: 'created_on',
							title: 'calls.overview.table.timestamp'
						},
						{
							id: 'subscribers',
							title: 'navigation.subscribers'
						},
						{
							id: 'transmitters',
							title: 'calls.overview.table.transmitters'
						},
						{
							id: 'data',
							title: 'calls.overview.table.message'
						},
						{
							id: 'priority',
							title: 'calls.overview.table.priority'
						},
						{
							id: 'created_by',
							title: 'general.owner'
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
				// load user's calls if user is not an admin
				this.running = true;
				this.$http.get('calls').then(response => {
					// success --> save new data
					this.table.rows = response.body;

					this.table.rows.forEach(call => {
						call.subscribers = [].concat(call.recipients.subscribers).concat(call.recipients.subscriber_groups).join(', ');

						call.transmitters = [].concat(call.distribution.transmitters).concat(call.distribution.transmitter_groups).join(', ');
					});

					this.running = false;
					this.errorMessage = false;
				}, response => {
					// error --> show error message
					this.running = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
</script>

<style scoped>

</style>
