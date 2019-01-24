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
						<v-chip
							label
							color="yellow"
							v-if="this.rubriccontent.function !== 3"
						>
							<v-avatar>
								<v-icon>warning</v-icon>
							</v-avatar>
							{{ $t('rubrics.notskypershort') }}
						</v-chip>
					</span>
				</v-card-title>
				<v-card-text>
					<v-form v-model="editDialogFormValid" ref="editForm">
						<v-layout
							align-center
							justify-space-between
							v-for="(thiscontent, index) in this.rubriccontent.content"
							:key="index"
						>
							<!--Data-->
							<v-flex xs4>
								<v-textarea
									v-model="rubriccontent.content[index].data"
									:prefix="(index + 1).toString()"
									:counter="80"
									rows="2"
									:rules="validationRules.message"
									@change="emptyMessagesInBetween = getEmptyMessagesInBetween()"
								>
								</v-textarea>
							</v-flex>
							<v-flex xs2>
								<v-checkbox
									v-model="rubriccontent.enableExpirationDateTime[index]"
									:label="$t('rubrics.expirationenabled.title')"
								>
								</v-checkbox>
							</v-flex>
							<!--Expiration Time-->
							<v-flex xs3 v-if="rubriccontent.enableExpirationDateTime[index]">
								<v-menu
									:close-on-content-click="false"
									v-model="dateTimePicker.showDateMenu[index]"
									:nudge-right="40"
									lazy
									transition="scale-transition"
									offset-y
									full-width
									max-width="290px"
									min-width="290px"
								>
									<v-text-field
										slot="activator"
										v-model="dateFormated[index]"
										:label="$t('rubrics.expirationdate.title')"
										:hint="$t('rubrics.expirationdate.help')"
										prepend-icon="event"
										readonly
									></v-text-field>
									<v-date-picker
										v-model="dateNonFormated[index]"
										no-title
										@input="dateTimePicker.showDateMenu[index] = false"
										:locale="$root.$i18n.locale"
										:show-current="getCurrentDate"
										:first-day-of-week="getFirstDayOfTheWeek"
										:min="getCurrentDate"
										:max="getMaxDate"
									>
									</v-date-picker>
								</v-menu>
							</v-flex>
							<v-flex xs3 v-if="!rubriccontent.enableExpirationDateTime[index]"></v-flex>
							<!--Expiration time-->
							<v-flex xs2 v-if="rubriccontent.enableExpirationDateTime[index] && hoursSelect(index).length > 0">
								<v-select
									:items="hoursSelect(index)"
									item-text="label"
									item-value="value"
									required
									v-model="hour[index]"
									:label="$t('rubrics.expirationtime.title')"
									:hint="$t('rubrics.expirationtime.help')"
								>
								</v-select>
							</v-flex>
							<v-flex xs2 v-if="rubriccontent.enableExpirationDateTime[index] && (!(hoursSelect(index).length > 0))">
								<v-chip label outline color="red">
									{{ $t('rubrics.overview.dateinthepast') }}
								</v-chip>
							</v-flex>
							<v-flex xs2 v-if="!rubriccontent.enableExpirationDateTime[index]"></v-flex>
							<!--Action Buttons-->
							<v-flex xs2 v-if="getPermissionsWrapper('news.update') === 'all'">
								<v-tooltip bottom>
									<v-btn
										v-if="index != 9 && index != 0"
										class="action-buttons"
										flat
										icon
										small
										fab
										color="pink"
										v-on:click="AddContentAbove(index)"
										slot="activator"
									>
										<v-icon>add</v-icon>
									</v-btn>
									<span>{{ $t('rubrics.overview.addcontentabove') }}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<v-btn
										v-if="index != 0"
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
								<br />
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
								<v-tooltip bottom>
									<v-btn
										v-if="index != 9"
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
							</v-flex>
						</v-layout>
					</v-form>
					<v-layout v-if="emptyMessagesInBetween">
						<v-flex xs12>
							<v-alert
								:value="true"
								type="warning"
							>
								{{ $t('rubrics.emptymessages') }}
							</v-alert>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="editDialogSaveButton"
						v-bind:disabled="!editDialogFormValid"
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
					<v-form v-model="addDialogFormValid" ref="addForm">
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
						@click="addDialogSaveButton"
						v-bind:disabled="!addDialogFormValid"
					>
						Save changes
					</v-btn>
					<v-btn
						color="primary"
						flat
						@click="AddContentDialogVisible=false"
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
			},
			dateNonFormated: function(val) {
				this.formatDate(val);
				console.log('dateNonFormatted watch');
				console.log(val);
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
					enableExpirationDateTime: [],
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
					]
				},
				addcontent: {
					_id: '',
					_rev: '',
					number: 0,
					function: 0,
					description: '',
					label: '',
					content: {
						'data': '',
						'expires_on': '',
						'priority': 0
					}
				},
				addDialogFormValid: false,
				editDialogFormValid: false,
				dateTimePicker: {
					showDateMenu: []
				},
				dateNonFormated: [],
				dateFormated: [],
				hour: [],
				emptyMessagesInBetween: false
			};
		},
		computed: {
			getFirstDayOfTheWeek() {
				if (this.$t('general.firstdayofweek') === 'Sunday') {
					return 0;
				} else {
					return 1;
				}
			},
			getCurrentDate() {
				return moment().format('YYYY-MM-DD');
			},
			getMaxDate() {
				return moment().add(1, 'years').format('YYYY-MM-DD');
			},
			validationRules() {
				return {
					'message': [
						v => (!v) || (!!v && v.length <= 80) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.message'),
							count: '80'
						})
					]
				};
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
			getEmptyMessagesInBetween() {
				for (let i = 1; i < (this.rubriccontent.content.length - 1); i++) {
					console.log('Index: ' + i);
					console.log(this.rubriccontent.content[i + 1].data);
					console.log(this.rubriccontent.content[i].data);
					if (this.rubriccontent.content[i + 1].data !== null &&
					(this.rubriccontent.content[i].data === null || this.rubriccontent.content[i].data === '')) {
						return true;
					}
				}
				return false;
			},
			hoursSelect(index) {
				// index from 0 to 9
				let returnvalue = [];
				for (let myhour = 0; myhour < 24; myhour++) {
					let selectedDateTime = moment(this.dateNonFormated[index]);
					selectedDateTime.add(myhour, 'hours');
					// console.log('selectedDateTime: ' + selectedDateTime.format('DD.MM.YYYY HH:mm:ss'));
					// console.log('now: ' + moment().format('DD.MM.YYYY HH:mm:ss'));
					if (selectedDateTime.isAfter(moment().add(1, 'hours'))) {
						// console.log('vorher');
						if (this.$t('general.24hr') === 'true') {
							returnvalue.push(
								{
									value: myhour,
									label: myhour.toString() + ':00'
								}
							);
						} else {
							returnvalue.push(
								{
									value: myhour,
									label: (myhour % 12).toString() + (myhour < 12 ? ':00 am' : ':00 pm')
								}
							);
						}
					}
				}
				return returnvalue;
			},
			formatDate(val) {
				if (val) {
					for (let i = 0; i < val.length; i++) {
						if (val[i]) {
							this.dateFormated[i] = moment(val[i]).format('L');
						} else {
							this.dateFormated[i] = '';
						}
					}
				}
			},
			AddContentAbove(index) {
				this.rubriccontent.content.splice(index - 1 + 1, 0, {
					'data': '',
					'expires_on': '',
					'priority': 0
				});
				// Delete last element, which is number 11, index 10
				this.rubriccontent.content.splice(10, 1);
			},
			moveContentUp(index) {
				// index starts at 0, ends at 9
				let help = this.rubriccontent.content[index - 1];
				this.rubriccontent.content[index - 1] = this.rubriccontent.content[index];
				this.rubriccontent.content[index] = help;
				// Workaround to update v-text-area
				// TODO: Find better way
				this.rubriccontent.content.push('');
				this.rubriccontent.content.splice(-1, 1);
			},
			moveContentDown(index) {
				// index starts at 0, ends at 9
				let help = this.rubriccontent.content[index + 1];
				this.rubriccontent.content[index + 1] = this.rubriccontent.content[index];
				this.rubriccontent.content[index] = help;
				// Workaround to update v-text-area
				// TODO: Find better way
				this.rubriccontent.content.push('');
				this.rubriccontent.content.splice(-1, 1);
			},
			deleteContent(index) {
				// index starts at 0, ends at 9
				this.rubriccontent.content.splice(index, 1);
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
						// Load 10 Messages and compute date and time display
						for (var i = 0; i < 10; i++) {
							if (response.data.content && response.data.content[i]) {
								this.rubriccontent.content[i] = response.data.content[i];
								if (this.rubriccontent.content[i].expires_on) {
									this.dateNonFormated[i] = moment(this.rubriccontent.content[i].expires_on)
										.format('YYYY-MM-DD');
									this.hour[i] = parseInt(moment(this.rubriccontent.content[i].expires_on)
										.format('HH'));
								} else {
									this.dateNonFormated[i] = null;
								}
							} else {
								this.rubriccontent.content[i] = {
									'data': null,
									'expires_on': null,
									'priority': null
								};
							}
							// Set selection state for each message
							this.rubriccontent.enableExpirationDateTime[i] = (this.rubriccontent.content[i]['expires_on'] !== null);
						}
						console.log('Load rubric data');
						this.EditContentDialogVisible = true;
					}).catch(e => {
						console.log('Error getting rubric\'s individual details with axios or any exception' +
							'in the get handler of showEditContentDialog.' + e);
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
						console.log('Error getting rubric\'s individual details with axios or any exception' +
							'in the get handler of showAddContentDialog.');
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
					this.axios.delete('rubrics/' + element._id + '?revision=' + element._rev, {
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
			addDialogSaveButton() {

			},
			editDialogSaveButton() {
				// Send changed rubric content to database Service
				console.log('Save button');
				console.log(this.rubriccontent);
				console.log(this.hour);

				if (this.$refs.editForm.validate()) {
					let data2Send = {};
					// Build data to send
					data2Send._id = this.rubriccontent._id;
					data2Send._rev = this.rubriccontent._rev;
					data2Send.content = [];
					for (let i = 0; i < this.rubriccontent.content.length; i++) {
						if (this.rubriccontent.content[i].data && this.rubriccontent.content[i].data !== null && this.rubriccontent.content[i].data !== '') {
							let contentToAdd = {};
							contentToAdd.data = this.rubriccontent.content[i]['data'];
							// Combine Date and Time
							if (this.dateNonFormated[i] && this.dateNonFormated[i] !== '') {
								let expiration = moment(this.dateNonFormated[i]);
								if (this.hour[i]) {
									expiration.add(this.hour[i], 'hours');
								}
								contentToAdd.expires_on = expiration.toISOString();
							} else {
								contentToAdd.expires_on = null;
							}
							if (this.rubriccontent.content[i].priority &&
								this.rubriccontent.content[i].priority >= 1 &&
								this.rubriccontent.content[i].priority <= 5) {
									contentToAdd.priority = this.rubriccontent.content[i].priority;
							} else {
								contentToAdd.priority = 1;
							}
							data2Send.content.push(contentToAdd);
						}
					}
					console.log('Data2Send von rubrics:');
					console.log(data2Send);
					this.$helpers.sendData(this, 'rubrics', data2Send, '');

					// Trigger Reload of sidebar Icons
					this.$root.$emit('ReloadSidebarIcons');
					this.EditContentDialogVisible = false;
					// Reload Table
					this.loadData();
				}
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
