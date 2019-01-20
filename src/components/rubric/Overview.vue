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
									fab
									dark
									small
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
								<v-icon v-if="props.item.cyclic_transmit" color="green">toggle_on</v-icon>
								<v-icon v-else color ="red">toggle_off</v-icon>
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
										v-on:click="showEditContentDialog(props.item)"
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
											v-on:click="showAddContentDialog(props.item)"
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
		<!--Edit Content Dialog-->
		<v-dialog
			max-width="800px"
			v-model="EditContentDialogVisible"
		>
			<v-card>
				<v-card-title>
					<span class="headline">
						{{ $t('rubrics.overview.editrubriccontentof') }}
						<v-chip label>
							<v-avatar class="teal">
								{{ this.rubriccontent.number }}
							</v-avatar>
							{{ this.rubriccontent.label }}
						</v-chip>
						<v-chip label>
							<v-avatar :class="this.rubriccontent.function === 3 ? 'green' : 'red'">
								{{ this.rubriccontent.function }}
							</v-avatar>
							{{ $t('rubrics.function.title') }}
						</v-chip>

					</span>
				</v-card-title>
				<v-card-text>
					<v-form v-model="isMessageFormValid" ref="messageForm">
						<v-layout
							align-center
							v-for="index in 10"
							:key="index"
						>
							<!--Data-->
							<v-flex xs6>
								<v-textarea
									v-model="rubriccontent.content[index-1]['data']"
									:prefix="index.toString()"
									:counter="80"
									rows="2"
								>
								</v-textarea>
							</v-flex>
							<!--Expiration Time-->
							<v-flex xs2>
								asdj
							</v-flex>
							<!--Action Buttons-->
							<v-flex v-if="getPermissionsWrapper('news.update') === 'all'">
								<v-tooltip bottom>
									<v-btn
										v-if="index != 1"
										class="action-buttons"
										flat
										icon
										small
										fab
										color="primary"
										v-on:click="moveContentUp(index)"
										slot="activator"
									>
										<v-icon>arrow_upward</v-icon>
									</v-btn>
									<span>{{ $t('rubrics.overview.movecontentup') }}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<v-btn
										v-if="index != 10"
										class="action-buttons"
										flat
										icon
										small
										fab
										color="primary"
										v-on:click="moveContentDown(index)"
										slot="activator"
									>
										<v-icon>arrow_downward</v-icon>
									</v-btn>
									<span>{{ $t('rubrics.overview.movecontentdown') }}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<v-btn
										class="action-buttons"
										flat
										icon
										small
										fab
										color="red"
										v-on:click="deleteContent(index)"
										slot="activator"
									>
										<v-icon>delete_forever</v-icon>
									</v-btn>
									<span>{{ $t('rubrics.overview.deletecontent') }}</span>
								</v-tooltip>
							</v-flex>
						</v-layout>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="messagesSaveChanges"
						v-bind:disabled="!rubriccontent.formvalid"
					>
						Save changes
					</v-btn>
					<v-btn
						color="primary"
						flat
						@click="EditContentDialogVisible=false"
					>
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!--Add Content Dialog-->
		<!--max-width="430px"-->
		<v-dialog
			v-model="AddContentDialogVisible"
		>
			<v-card>
				<v-card-title>
					<span class="headline">
						ID: {{ this.rubriccontent._id }} - Label: {{ this.rubriccontent.label }} - Number: {{ this.rubriccontent.number }}
					</span>
				</v-card-title>
				<v-card-text>
					<v-form v-model="isMessageFormValid" ref="messageForm">
						<v-text-field
							v-for="index in 10"
							:key="index"
							v-bind:v-model="rubriccontent.content[index-1]"
							:prefix="index.toString()"
							:counter="80"
						>
						</v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="messagesSaveChanges"
						v-bind:disabled="!rubriccontent.formvalid"
					>
						Save changes
					</v-btn>
					<v-btn
						color="primary"
						flat
						@click="EditContentDialogVisible=false"
					>
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
	import moment from 'moment';

	export default {
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
				EditContentDialogVisible: false,
				AddContentDialogVisible: false,
				isMessageFormValid: false,
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
				},
				rubriccontent: {
					_id: '',
					_rev: '',
					number: 0,
					function: 0,
					description: '',
					label: '',
					content: [
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						},
						{
							'data': '',
							'expires_on': '',
							'priority': 0
						}
					],
					formvalid: false
				},
				addcontent: {
					_id: '',
					_rev: '',
					number: 0,
					description: '',
					label: '',
					formvalid: false
				}
			};
		},
		computed: {
			isReadyLoadingData() {
				return !this.isLoadingData;
			},
			statTotal() {
				return this.table.rows.length;
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
			moveContentUp(index) {
				// index starts at 1, ends at 10
				let help = this.rubriccontent.content[index - 2];
				this.rubriccontent.content[index - 2] = this.rubriccontent.content[index - 1];
				this.rubriccontent.content[index - 1] = help;
				// Workaround to update v-text-area
				// TODO: Find better way
				this.rubriccontent.content.push('');
				this.rubriccontent.content.splice(-1, 1);
			},
			moveContentDown(index) {
				// index starts at 1, ends at 10
				let help = this.rubriccontent.content[index];
				this.rubriccontent.content[index] = this.rubriccontent.content[index - 1];
				this.rubriccontent.content[index - 1] = help;
				// Workaround to update v-text-area
				// TODO: Find better way
				this.rubriccontent.content.push('');
				this.rubriccontent.content.splice(-1, 1);
			},
			deleteContent(index) {
				// index starts at 1, ends at 10
				this.rubriccontent.content.splice(index - 1, 1);
				// Restore number of elements to 10
				this.rubriccontent.content.push('');
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
			showEditContentDialog(element) {
				// Load specific rubric's content data
				this.$axios.get('rubrics/' + element._id)
					.then(response => {
						this.rubriccontent._id = response.data._id;
						this.rubriccontent._rev = response.data._rev;
						this.rubriccontent.number = response.data.number;
						this.rubriccontent.description = response.data.description;
						this.rubriccontent.label = response.data.label;
						this.rubriccontent.function = response.data.function;
						for (var i = 0; i < 10; i++) {
							if (response.data.content && response.data.content[i]) {
								this.rubriccontent.content[i] = response.data.content[i];
							} else {
								this.rubriccontent.content[i] = {
									'data': null,
									"expires_on": null,
									"priority": null
								};
							}
						}
						console.log(this.rubriccontent.content[1]['data']);
						this.EditContentDialogVisible = true;
					}).catch(e => {
						console.log('Error getting rubric\'s individual details with axios or any exception in the get handler.');
				});
			},
			showAddContentDialog(element) {
				// Load specific rubric's content data
				this.$axios.get('rubrics/' + element._id)
					.then(response => {
						this.addcontent._id = response.data._id;
						this.addcontent._rev = response.data._rev;
						this.addcontent.number = response.data.number;
						this.addcontent.description = response.data.description;
						this.addcontent.label = response.data.label;
						this.AddContentDialogVisible = true;
					}).catch(e => {
						console.log('Error getting rubric\'s individual details with axios or any exception in the get handler.');
				});
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
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.axios.delete('rubrics/' + element._id, {
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
			messagesSaveChanges() {

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
