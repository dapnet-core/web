<template>
	<v-container fluid>
		<v-card>
			<v-card-title>
				<v-layout>
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
				</v-layout>
				<v-layout wrap>
					<v-flex xs4>
						<v-checkbox
							v-model="rubriccontent.showExpirationInputs"
							:label="$t('rubrics.expirationenabled.show')"
						></v-checkbox>
					</v-flex>
					<v-flex xs4>
						<v-checkbox
							v-model="rubriccontent.showPriorityBootsInputs"
							:label="$t('rubrics.priorityboost.show')"
						></v-checkbox>
					</v-flex>
				</v-layout>
			</v-card-title>
			<v-card-text>
				<v-form v-model="isFormValid" ref="editForm">
					<v-layout
						align-center
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
						<v-flex xs2 v-if="rubriccontent.showExpirationInputs">
							<v-checkbox
								v-model="rubriccontent.enableExpirationDateTime[index]"
								:label="$t('rubrics.expirationenabled.title')"
								@change="initializeExpiration(index)"
							>
							</v-checkbox>
						</v-flex>
						<!--Expiration Time-->
						<v-flex xs3 v-if="rubriccontent.showExpirationInputs && rubriccontent.enableExpirationDateTime[index]">
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
						<v-flex xs3 v-if="rubriccontent.showExpirationInputs && !rubriccontent.enableExpirationDateTime[index]"></v-flex>
						<!--Expiration time-->
						<v-flex xs2 v-if="rubriccontent.showExpirationInputs && rubriccontent.enableExpirationDateTime[index] && hoursSelect(index).length > 0">
							<v-select
								:items="hoursSelect(index)"
								required
								v-model="hour[index]"
								:label="$t('rubrics.expirationtime.title')"
								:hint="$t('rubrics.expirationtime.help')"
							>
							</v-select>
						</v-flex>
						<v-flex xs2 v-if="rubriccontent.showExpirationInputs && rubriccontent.enableExpirationDateTime[index] && (!(hoursSelect(index).length > 0))">
							<v-chip label outline color="red">
								{{ $t('rubrics.overview.dateinthepast') }}
							</v-chip>
						</v-flex>
						<v-flex xs2 v-if="rubriccontent.showExpirationInputs && !rubriccontent.enableExpirationDateTime[index]"></v-flex>
						<v-flex v-if="rubriccontent.showPriorityBootsInputs">
							<v-checkbox
								v-model="rubriccontent.priorityBoost[index]"
								:label="$t('rubrics.priorityboost.title')"
							>
							</v-checkbox>
						</v-flex>
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
					@click="SaveButton"
					v-bind:disabled="!isFormValid"
				>
					Save changes
				</v-btn>
				<v-btn
					color="primary"
					flat
					@click="CloseButton"
				>
					Close
				</v-btn>
			</v-card-actions>
		</v-card>

	</v-container>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'EditBulkContent',
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
			dateNonFormated: function(val) {
				this.formatDate(val);
				console.log('dateNonFormatted watch');
				console.log(val);
			}
		},
		data() {
			return {
				isLoadingData: true,
				rubriccontent: {
					_id: '',
					_rev: '',
					number: 0,
					function: 0,
					description: '',
					label: '',
					default_priority: 0,
					default_expiration: 0,
					enableExpirationDateTime: [],
					priorityBoost: [],
					showExpirationInputs: false,
					showPriorityBootsInputs: false,
					content: [
						{
							'data': '',
							'expires_on': null,
							'priority': null
						},
						{
							'data': '',
							'expires_on': null,
							'priority': null
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
							'expires_on': null,
							'priority': null
						},
						{
							'data': '',
							'expires_on': null,
							'priority': null
						}
					]
				},
				isFormValid: false,
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
			}
		},
		methods: {
			initializeExpiration(index) {
				if (this.rubriccontent.enableExpirationDateTime[index]) {
					// if changed to true
					let defaultExpirationTimeStamp = moment().add(this.rubriccontent.default_expiration, 'seconds');
					this.dateNonFormated[index] = defaultExpirationTimeStamp.format('YYYY-MM-DD');
					this.dateFormated[index] = defaultExpirationTimeStamp.format('L');
					this.hour[index] = parseInt(defaultExpirationTimeStamp.format('HH'));
					this.rubriccontent.content[index].expires_on = defaultExpirationTimeStamp.toISOString();
				}
			},
			atLeastOnePriorityBoostEnabled() {
				for (let i = 0; i < this.rubriccontent.priorityBoost.length; i++) {
					if (this.rubriccontent.priorityBoost[i]) {
						return true;
					}
				}
				return false;
			},
			atLeastOneExpirationDateset() {
				for (let i = 0; i < this.rubriccontent.enableExpirationDateTime.length; i++) {
					if (this.rubriccontent.enableExpirationDateTime[i]) {
						return true;
					}
				}
				return false;
			},
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
									text: myhour.toString() + ':00'
								}
							);
						} else {
							returnvalue.push(
								{
									value: myhour,
									text: (myhour % 12).toString() + (myhour < 12 ? ':00 am' : ':00 pm')
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
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				// Load specific rubric's content data
				if (this.$route.params.id) {
					this.$axios.get('rubrics/' + this.$route.params.id)
						.then(response => {
							this.rubriccontent._id = response.data._id;
							this.rubriccontent._rev = response.data._rev;
							this.rubriccontent.number = response.data.number;
							this.rubriccontent.description = response.data.description;
							this.rubriccontent.label = response.data.label;
							this.rubriccontent.function = response.data.function;
							this.rubriccontent.default_expiration = response.data.default_expiration;
							this.rubriccontent.default_priority = response.data.default_priority;

							// Load 10 Messages and compute date and time display
							for (var i = 0; i < 10; i++) {
								if (response.data.content && response.data.content[i]) {
									this.rubriccontent.content[i] = response.data.content[i];
									if (this.rubriccontent.content[i].priority &&
										(this.rubriccontent.content[i].priority > this.rubriccontent.default_priority)) {
										this.rubriccontent.priorityBoost[i] = true;
										this.rubriccontent.content[i].priority = this.rubriccontent.default_priority + 1;
									} else {
										this.rubriccontent.priorityBoost[i] = false;
										this.rubriccontent.content[i].priority = this.rubriccontent.default_priority;
									}

									if (this.rubriccontent.content[i].expires_on && this.rubriccontent.content[i].expires_on !== null) {
										this.dateNonFormated[i] = moment(this.rubriccontent.content[i].expires_on)
											.format('YYYY-MM-DD');
										this.hour[i] = parseInt(moment(this.rubriccontent.content[i].expires_on)
											.format('HH'));
										this.rubriccontent.enableExpirationDateTime[i] = true;
									} else {
										this.dateNonFormated[i] = null;
										this.rubriccontent.enableExpirationDateTime[i] = false;
									}
								} else {
									this.rubriccontent.content[i] = {
										'data': null,
										'expires_on': null,
										'priority': null
									};
								}
							}
							this.rubriccontent.showPriorityBootsInputs = this.atLeastOnePriorityBoostEnabled();
							this.rubriccontent.showExpirationInputs = this.atLeastOneExpirationDateset();
							this.formatDate(this.dateNonFormated);
						}).catch(e => {
							console.log('Error getting rubric\'s individual details with axios or any exception' +
								'in the get handler of EditBulkContent.' + e);
						});
				}
			},
			SaveButton() {
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
							// If expires checkbox is false, set expiration to null
							if (this.rubriccontent.enableExpirationDateTime[i]) {
								// Combine Date and Time
								if (this.dateNonFormated[i] && this.dateNonFormated[i] !== '') {
									let expiration = moment(this.dateNonFormated[i]);
									if (this.hour[i]) {
										expiration.add(this.hour[i], 'hours');
									}
									contentToAdd.expires_on = expiration.toISOString();
								}
							}
							if (this.rubriccontent.priorityBoost[i]) {
								contentToAdd.priority = this.rubriccontent.content[i].priority + 1;
							}
							data2Send.content.push(contentToAdd);
						}
					}
					console.log('Data2Send von rubrics:');
					console.log(data2Send);
					this.$helpers.sendData(this, 'rubrics', data2Send, '');
					this.$router.go(-1);
				}
			},
			CloseButton() {
				this.$router.go(-1);
			}
		}
	};
</script>

<style scoped>

</style>
