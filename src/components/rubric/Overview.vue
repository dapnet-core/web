<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<v-layout>
							<v-flex xs4>
								<div class="headline">{{ $t('rubrics.overview.allrubrics') }}</div>
							</v-flex>
							<v-spacer></v-spacer>
							<v-flex xs3>
								<v-form v-model="isSearchValid" ref="searchField">
									<v-text-field
										v-model="search"
										append-icon="search"
										v-bind:label="$t('table.search')"
										v-on:input="reloadDueToSearch"
										:rules="validationRules.search"
										persistent-hint
										:disabled="!searchEnabled"
										:hint="searchHint"
									>
									</v-text-field>
								</v-form>
							</v-flex>
							<v-flex xs1>
							</v-flex>
							<v-flex xs2>
								<v-select
									v-model="sortByselect"
									:items="getSortSelectItems"
									item-text="text"
									item-value="columnkey"
									:hint="getSearchHint"
									append-outer-icon="sort_by_alpha"
									persistent-hint
									return-object
									single-line
									@input="sortSelectChanged"
									:disabled="!sortByselectEnabled"
								></v-select>
							</v-flex>
							<v-flex xs1></v-flex>
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
						</v-layout>
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
							<td class="text-xs-center">
								<v-chip label small>
									{{ props.item.number }}
								</v-chip>
							</td>

							<!--Function column-->
							<td class="text-xs-center">
								<v-chip
									label
									small
									:color="functionToColor(props.item.function)"
								>
									{{ props.item.function }}
								</v-chip>
							</td>

							<!--Description column-->
							<td class="text-xs-left">
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
					if (this.pagination.sortBy === '_id') {
						this.sortByselect = { text: this.$i18n.t('rubrics.id'), columnkey: '_id', numeric: false };
						this.sortByselectEnabled = true;
						this.searchEnabled = true;
						this.searchSelectHint = this.$i18n.t('general.searchSelectHint');
						this.searchHint = '';
					} else if (this.pagination.sortBy === 'label') {
						this.sortByselect = { text: this.$i18n.t('rubrics.label'), columnkey: 'label', numeric: false };
						this.sortByselectEnabled = true;
						this.searchEnabled = true;
						this.searchSelectHint = this.$i18n.t('general.searchSelectHint');
						this.searchHint = '';
					} else if (this.pagination.sortBy === 'number') {
						this.sortByselect = { text: this.$i18n.t('rubrics.number'), columnkey: 'number', numeric: true };
						this.sortByselectEnabled = true;
						this.searchEnabled = true;
						this.searchSelectHint = this.$i18n.t('general.searchSelectHint');
						this.searchHint = '';
					} else if (this.pagination.sortBy === 'function') {
						this.sortByselect = { text: this.$i18n.t('rubrics.subric'), columnkey: 'function', numeric: true };
						this.sortByselectEnabled = true;
						this.searchEnabled = true;
						this.searchSelectHint = this.$i18n.t('general.searchSelectHint');
						this.searchHint = '';
					} else {
						this.sortByselectEnabled = false;
						this.searchEnabled = false;
						this.searchSelectHint = this.$i18n.t('general.seachHintDisabled');
						this.searchHint = this.$i18n.t('general.seachHintDisabled');
					}
					this.reloadDueToSearch();
				},
				deep: true
			}
		},
		data() {
			return {
				isSearchValid: false,
				search: '',
				total_rows: 0,
				rubricrows: [],
				isLoadingData: true,
				pagination: {
					sortBy: '_id',
					descending: false,
					rowsPerPage: 10,
					page: 1
				},
				sortByselect: { text: 'ID', columnkey: '_id', numeric: false },
				sortByselectEnabled: true,
				searchEnabled: true,
				searchHint: '',
				searchSelectHint: this.$i18n.t('general.searchSelectHint')
			};
		},
		computed: {
			getSortSelectItems() {
				return [
					{ text: this.$i18n.t('rubrics.id'), columnkey: '_id', numeric: false },
					{ text: this.$i18n.t('rubrics.label'), columnkey: 'label', numeric: false },
					{ text: this.$i18n.t('rubrics.number'), columnkey: 'number', numeric: true },
					{ text: this.$i18n.t('rubrics.subric'), columnkey: 'function', numeric: true }
				];
			},
			getSearchHint() {
				return this.searchSelectHint;
			},
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
						text: this.$i18n.t('rubrics.subric'),
						sortable: true,
						align: 'center',
						value: 'function'
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
						value: 'numberofMessages'
					},
					{
						text: this.$i18n.t('general.owner'),
						align: 'center',
						value: 'owners',
						sortable: false
					},
					{
						text: this.$i18n.t('general.transmitters'),
						align: 'center',
						value: 'transmitters',
						sortable: false
					},
					{
						text: this.$i18n.t('general.transmitter_groups'),
						align: 'center',
						value: 'transmitter_groups',
						sortable: false
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
			},
			validationRules() {
				return {
					'search': [
						v => ((!this.sortByselect.numeric) || (/^[0-9]*$/i.test(v))) || this.$t('formvalidation.onlyIntegerSearch')
					]
				};
			}
		},
		methods: {
			sortSelectChanged() {
				if (this.$refs.searchField.validate()) {
					this.pagination.sortBy = this.sortByselect.columnkey;
				}
			},
			reloadDueToSearch() {
				if (this.$refs.searchField.validate()) {
					this.loadData();
				}
			},
			functionToColor(subric) {
				if (subric === 0) {
					return 'red';
				} else if (subric === 1) {
					return 'yellow';
				} else if (subric === 2) {
					return 'orange';
				} else {
					return 'grey';
				}
			},
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
				console.log(this.pagination.sortBy);
				this.isLoadingData = true;
				let getPath = '';
				let adaptedparams = {
					descending: !!this.pagination.descending,
					limit: this.pagination.rowsPerPage,
					skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
					startswith: '"' + this.search + '"'
				}
				if (this.pagination.sortBy === '_id') {
					getPath = 'rubrics';
				} else if (this.pagination.sortBy === 'label') {
					getPath = 'rubrics/_view/byLabel';
				} else if (this.pagination.sortBy === 'number') {
					getPath = 'rubrics/_view/byNumber';
					adaptedparams.startswith = this.search;
					adaptedparams.numeric = true;
				} else if (this.pagination.sortBy === 'function') {
					getPath = 'rubrics/_view/byFunction';
					adaptedparams.startswith = this.search;
					adaptedparams.numeric = true;
				} else if (this.pagination.sortBy === 'description') {
					getPath = 'rubrics/_view/byDescription';
				} else if (this.pagination.sortBy === 'cyclic_transmit') {
					getPath = 'rubrics/_view/byCyclicTransmit';
					adaptedparams.startswith = '';
					adaptedparams.numeric = true;
				}
				this.$axios.get(getPath, {
					params: adaptedparams
				}).then(response => {
					// success --> save new data

					// save total rows of answer
					if (this.search !== '' && response.data.rows) {
						this.total_rows = response.data.rows.length;
					} else if (response.data.total_rows) {
						this.total_rows = response.data.total_rows;
					}

					// save rows
					if (response.data.rows) {
						this.rubricrows = response.data.rows;
					}
					this.isLoadingData = false;
				}).catch(e => {
					this.isLoadingData = false;
					this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.rubrics.list.title'), e);
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
				this.$helpers.swalDeleteConfirm(
					this,
					this.$i18n.t('alerts.delete.rubric.title', { fieldname: element._id }),
					this.$i18n.t('alerts.delete.rubric.confirm', { fieldname: element._id })
				).then(swalresult => {
					if (swalresult) {
						console.log('Deleting rubric ' + element._id);
						this.axios.delete('rubrics/' + element._id + '?revision=' + element._rev, {
							// before(request) {
							//	request.headers.delete('Content-Type');
							// }
						}).then(response => {
							// success --> reload data
							this.loadData();
							this.$root.$emit('ReloadSidebarIcons');
							this.$helpers.swalDeleteSuccess(
								this,
								this.$i18n.t('alerts.delete.rubric.success', { fieldname: element._id })
							);
						}).catch(e => {
							this.$helpers.swalDeleteFail(
								this,
								this.$i18n.t('alerts.delete.rubric.error', { fieldname: element._id }),
								e
							);
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
