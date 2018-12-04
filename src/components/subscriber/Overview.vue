<template>
	<v-container fluid>

		<!--				<info-error :message="errorMessage"></info-error>

		-->
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('subscribers.overview.allsubscribers') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- Add Subscriber Button -->
						<v-fab-transition v-if="this.$store.getters.permission('subscriber.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									fab
									dark
									small
									to="/subscrivers/new"
									slot="activator"
								>
										<v-icon>add</v-icon>
								</v-btn>
								<span>{{ $t('subscribers.overview.newsubscriber') }}</span>
							</v-tooltip>
						</v-fab-transition>
					</v-card-title>
					<v-data-table
						:headers="getHeaders"
						:items="subscriberrows"
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
							<!-- ID column -->
							<td>{{ props.item._id }}</td>

							<!-- Description column -->
							<td class="text-xs-left">{{ props.item.description }}</td>

							<!-- Pager column -->
							<td class="text-xs-left">
								<span v-for="(pager, index) in props.item.pagers" v-bind:key="`pager-${index}`">
									<v-chip
										v-bind:color="`${pager.color}`"
										text-color="white"
										small
									>
										<v-avatar>
											<img v-bind:src="`${pager.avatar}`" v-bind:alt="`${pager.type}`">
										</v-avatar>
										{{ pager.ric }}
									</v-chip>
								</span>
							</td>
							<!-- Third-Party-Services column -->
							<td class="text-xs-left">
								<span v-for="(service, index) in props.item.third_party_services" v-bind:key="`service-${index}`">
									<v-chip
										v-bind:color="`${service.color}`"
										text-color="white"
										small
									>
										{{ service.text }}
									</v-chip>
								</span>
							</td>
							<!-- owner column -->
							<td class="text-xs-center">
								<span v-for="(owner, index) in props.item.owners" v-bind:key="`owner-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ owner }}
									</v-chip>
								</span>
							</td>
							<!-- Subscriber Groups column -->
							<td class="text-xs-left">
								<span v-for="(group, index) in props.item.groups" v-bind:key="`group-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ group }}
									</v-chip>
								</span>
							</td>
							<!-- Action Buttons -->
							<td class="text-xs-center" v-if="displayActionsColumn">
								<!-- Edit -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('subscriber.update') === 'all'"
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
											v-if="getPermissionsWrapper('subscriber.delete') === 'all'"
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
											v-if="getPermissionsWrapper('subscriber.update') === 'all'"
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
				subscriberrows: [],
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
			statTotal() {
				return this.table.rows.length;
			},
			getHeaders() {
				let answer = [
					{
						text: this.$i18n.t('general.name'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('general.description'),
						align: 'center',
						value: 'description'
					},
					{
						text: this.$i18n.t('general.pagers'),
						align: 'center',
						value: 'pagers'
					},
					{
						text: this.$i18n.t('general.thirdpartyservices'),
						align: 'center',
						value: 'third_party_services'
					},
					{
						text: this.$i18n.t('general.owner'),
						align: 'center',
						value: 'owners'
					},
					{
						text: this.$i18n.t('general.subscriber_groups'),
						align: 'center',
						value: 'groups'
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
				return ((this.$store.getters.permission('subscriber.update') === 'all') ||
				(this.$store.getters.permission('subscriber.delete') === 'all'));
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				this.isLoadingData = true;
				this.$axios.get('subscribers', {
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
						response.data.rows.forEach(subscriber => {
							// Set Description (if available)
							if (subscriber.description === undefined) {
								subscriber.description = '---';
							}
							// Render Pagers in a beautiful way  Rework, too much Copy here
							let pagersRendered = [];
							subscriber.pagers.forEach(pager => {
								if (pager.type === 'alphapoc') {
									pagersRendered.push({
										color: 'green',
										ric: pager.ric,
										avatar: './img/pager/alphapoc.png',
										type: pager.type,
										enabled: pager.enabled
									});
								} else if (pager.type === 'skyper') {
									pagersRendered.push({
										color: 'red',
										ric: pager.ric,
										avatar: './img/pager/skyper.png',
										type: pager.type,
										enabled: pager.enabled
									});
								} else if (pager.type === 'swissphone') {
									pagersRendered.push({
										color: 'grey',
										ric: pager.ric,
										avatar: './img/pager/swissphone.png',
										type: pager.type,
										enabled: pager.enabled
									});
								} else if (pager.type === 'quix') {
									pagersRendered.push({
										color: 'purple',
										ric: pager.ric,
										avatar: './img/pager/quix.png',
										type: pager.type,
										enabled: pager.enabled
									});
								}
							});
							subscriber.pagers = pagersRendered;

							// Render Third party assignments in a beautiful way
							let thirdspartyRendered = [];
							subscriber.third_party_services.forEach(service => {
								if (service === 'APRS') {
									thirdspartyRendered.push({
										color: 'deep-orange',
										text: 'APRS'
									});
								} else if (service === 'BM') {
									thirdspartyRendered.push({
										color: 'purple',
										text: 'Brandmeister'
									});
								}
							});
							subscriber.third_party_services = thirdspartyRendered;
						});
						this.subscriberrows = response.data.rows;
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
				this.$router.push({ name: 'Edit Subscriber', params: { id: element._id } });
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.axios.delete('subscribers/' + element._id, {
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
