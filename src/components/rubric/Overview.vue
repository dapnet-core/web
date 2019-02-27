<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('rubrics.overview.allrubrics') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- Add Rubric Button -->
						<v-fab-transition v-if="this.$store.getters.permission('rubric.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									dark
									icon
									to="/rubrics/new"
									slot="activator"
								>
										<v-icon>add</v-icon>
								</v-btn>
								<span>{{ $t('rubrics.overview.addrubric') }}</span>
							</v-tooltip>
						</v-fab-transition>
					</v-card-title>
					<v-data-table
						:headers="getHeaders"
						:items="rubricrows"
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
							<td class="text-xs-left">
								{{ props.item._id }}
							</td>

							<!--Label column-->
							<td class="text-xs-left">
								{{ props.item.label }}
							</td>

							<!--Number column-->
							<td class="text-xs-right">
								{{ props.item.number }}
							</td>

							<!--Description column-->
							<td class="text-xs-right">
								{{ props.item.description }}
							</td>

							<!-- Cyclic Transmission column -->
							<td class="text-xs-center">
								<v-icon v-if="props.item.cyclic_transmit" color="green">sync</v-icon>
								<v-icon v-else color="red">sync_disabled</v-icon>
							</td>

							<!-- Number of containing messages -->
							<td class="text-xs-center">
								{{ getNumberofRubricContent(props.item) }}
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

							<!-- Transmitters column -->
							<td class="text-xs-left">
								<span v-for="(group, index) in props.item.transmitters" v-bind:key="`group-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										{{ group }}
									</v-chip>
								</span>
							</td>

							<!-- Transmitter Groups column -->
							<td class="text-xs-left">
								<span v-for="(group, index) in props.item.transmitter_groups" v-bind:key="`group-${index}`">
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
								<!-- Show and Edit Content -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
										v-if="getPermissionsWrapper('news.read') === 'all'"
										flat
										icon
										small
										fab
										color="orange"
										v-on:click="editBulkContent(props.item)"
										slot="activator"
									>
										<v-icon>storage</v-icon>
									</v-btn>
									<span>{{ $t('table.actionbuttons.showeditrubriccontent') }}</span>
								</v-tooltip>
								<!-- Edit -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('rubric.update') === 'all'"
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
											v-if="getPermissionsWrapper('rubric.delete') === 'all'"
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
								<!-- Add Message  -->
								<v-tooltip bottom class="action-buttons">
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('news.update') === 'all'"
											flat
											icon
											small
											fab
											color="purple"
											v-on:click="AddContent(props.item)"
											slot="activator"
									>
										<v-icon>add</v-icon>
									</v-btn>
									<span>{{ $t('rubrics.overview.addcontent') }}</span>
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
	import moment from 'moment';

	export default {
		mounted() {
			console.log(this.$vuetify.breakpoint);
			this.$root.$on('LanguageChanged', () => {
				this.formatDate(this.dateNonFormated);
				console.log('lang changed');
			});
		},
		created() {
			moment.locale(this.$root.$i18n.locale);
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
				rubricrows: [],
				errorMessage: false,
				isLoadingData: true,
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
				let headings = [
					{
						text: this.$i18n.t('rubrics.id'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('rubrics.label'),
						sortable: true,
						align: 'left',
						value: 'label'
					},
					{
						text: this.$i18n.t('rubrics.number'),
						sortable: true,
						align: 'center',
						value: 'number'
					},
					{
						text: this.$i18n.t('rubrics.description'),
						align: 'center',
						value: 'description'
					},
					{
						text: this.$i18n.t('rubrics.cyclicTX'),
						sortable: true,
						align: 'center',
						value: 'cyclic_transmit'
					},
					{
						text: this.$i18n.t('rubrics.numberofMessages'),
						sortable: false,
						align: 'center',
						value: 'getNumberofRubricContent(props.item)'
					},
					{
						text: this.$i18n.t('general.owner'),
						align: 'center',
						value: 'owners'
					},
					{
						text: this.$i18n.t('general.transmitters'),
						align: 'center',
						value: 'transmitters',
						sortable: true
					},
					{
						text: this.$i18n.t('general.transmitter_groups'),
						align: 'center',
						value: 'transmitter_groups',
						sortable: true
					}
				];
				if (this.displayActionsColumn()) {
					let actions = {
						text: this.$i18n.t('general.actions'),
						align: 'center',
						sortable: false
					};
					headings.push(actions);
				}
				return headings;
			}
		},
		methods: {
			getNumberofRubricContent(rubric) {
				if (!(rubric.content)) {
					return 0;
				}
				let n = 0;
				for (let i = 0; i < rubric.content.length; i++) {
					if (rubric.content[i] !== '') {
						n++;
					}
				}
				return n;
			},
			displayActionsColumn() {
				return ((this.$store.getters.permission('rubric.update') === 'all') ||
					(this.$store.getters.permission('rubric.delete') === 'all') ||
					(this.$store.getters.permission('rubric.read') === 'all') ||
				(this.$store.getters.permission('news.update') === 'all'));
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				this.isLoadingData = true;
				this.$axios.get('rubrics', {
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
						this.rubricrows = response.data.rows;
					}
					this.isLoadingData = false;
				}, response => {
					// error --> show error message
					this.isLoadingData = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.email + '?subject=DAPNET%20Rubric%3A%20' + element._id;
			},
			editElement(element) {
				this.$router.push({ name: 'Edit Rubric', params: { id: element._id } });
			},
			editBulkContent(element) {
				this.$router.push({ name: 'Edit Rubric Bulk Content', params: { id: element._id } });
			},
			AddContent(element) {
				this.$router.push({ name: 'Add Rubric Content', params: { id: element._id } });
			},
			deleteElement(element) {
				this.$confirm('Do you really want to delete rubric ' + element._id + ' ?').then(res => {
					if (res) {
						this.axios.delete('rubrics/' + element._id + '?revision=' + element._rev, {
							// before(request) {
							//	request.headers.delete('Content-Type');
							// }
						}).then(response => {
							// success --> reload data
							this.loadData();
						}).catch(e => {
							console.log('Error deleting rubric ' + element._id + ' in rubric/Overview.vue. ' + e);
						});
					}
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
