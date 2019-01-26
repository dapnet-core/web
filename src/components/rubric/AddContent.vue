<template>
	<v-container fluid>
		<v-card>
			<v-card-title>
				<v-layout>
					<span class="headline">
						{{ $t('rubrics.overview.addcontenttorubric') }}
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
			</v-card-title>
			<v-card-text
				<v-layout>
					<v-flex xs2>
						<v-select
							:label="$t('rubrics.slotselect.title')"
							:hint="$t('rubrics.slotselect.help')"
							:items="slotSelectItems"
							v-model="selectedSlot"
							prepend-icon="reorder"
							persistent-hint
						>
						</v-select>
					</v-flex>
					<v-flex xs2>
						<v-checkbox
							v-model="enableExpirationTime"
							:label="$t('rubrics.expirationenabled.title')"
							@change="initializeExpiration"
						>
						</v-checkbox>
					</v-flex>
					<!--Expiration Time-->
					<v-flex xs3 v-if="enableExpirationTime">
						<v-menu
							:close-on-content-click="false"
							v-model="dateTimePicker.showDateMenu"
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
								v-model="dateFormated"
								:label="$t('rubrics.expirationdate.title')"
								:hint="$t('rubrics.expirationdate.help')"
								prepend-icon="event"
								readonly
							></v-text-field>
							<v-date-picker
								v-model="dateNonFormated"
								no-title
								@input="dateTimePicker.showDateMenu = false"
								:locale="$root.$i18n.locale"
								:show-current="getCurrentDate"
								:first-day-of-week="getFirstDayOfTheWeek"
								:min="getCurrentDate"
								:max="getMaxDate"
							>
							</v-date-picker>
						</v-menu>
					</v-flex>
					<!--Expiration time-->
					<v-flex xs2 v-if="enableExpirationTime">
						<v-select
							:items="hoursSelect()"
							required
							v-model="hour"
							:label="$t('rubrics.expirationtime.title')"
							:hint="$t('rubrics.expirationtime.help')"
						>
						</v-select>
					</v-flex>
					<v-flex xs2>
						<v-checkbox
							v-model="priorityBoost"
							:label="$t('rubrics.priorityboost.title')"
						>
						</v-checkbox>
					</v-flex>
				</v-layout>
				<v-layout wrap>
					<v-flex xs9>
						<v-form v-model="isFormValid" ref="addForm">
							<v-layout>
								<v-flex xs12>
									<v-textarea
										v-model="newcontent_data"
										prepend-icon="message"
										:counter="80"
										rows="2"
										:rules="validationRules.message"
										:label="$t('general.message')"
										:hint="$t('rubrics.message.help')"
										persistent-hint
										@input="generateLivePreview"
										box
									>
									</v-textarea>
								</v-flex>
							</v-layout>
						</v-form>
					</v-flex>
					<v-flex xs3>
						<v-checkbox
							v-model="livePreview"
							:label="$t('rubrics.livepreview.title')"
							:hint="$t('rubrics.livepreview.help')"
							@change="onLivePreviewChange"
						>
						</v-checkbox>
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
			<v-card-text>
				<!--Display Messages-->
				<v-container grid-list-md>
				<v-layout align-center row wrap
				>
					<v-flex xs12 v-for="(thiscontent, index) in this.rubriccontent.content"
							:key="index"
					>
						<v-card dark color="primary">
							<v-card-text>
								<v-avatar
									size="22"
									color="grey"
								>
									{{ index + 1 }}
								</v-avatar>
								{{ rubriccontent.content[index].data }}
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
				</v-container>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
	import moment from 'moment';
	import axios from 'axios';

	export default {
        name: "AddContent",
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
			},
			selectedSlot: function(val) {
				this.generateLivePreview();
			}
		},
		data() {
			return {
				isLoadingData: true,
				contentOriginal: [],
				rubriccontent: {
					_id: '',
					_rev: '',
					number: 0,
					function: 0,
					description: '',
					label: '',
					default_priority: 0,
					default_expiration: 0,
					enableExpirationDateTime: false,
					priorityBoost: false,
					showExpirationInputs: false,
					showPriorityBoostInputs: false,
					content: []
				},
				isFormValid: false,
				dateTimePicker: {
					showDateMenu: false
				},
				dateNonFormated: '',
				dateFormated: '',
				hour: '',
				newcontent_data: '',
				newcontent_expires_on: '',
				newcontent_priority: 0,
				selectedSlot: -1,
				priorityBoost: false,
				enableExpirationTime: false,
				livePreview: false,
				slotSelectItems: []
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
						v => (v && v.length > 0) || this.$t('formvalidation.isrequired', { fieldname: this.$t('general.message') }),
						v => (!v) || (!!v && v.length <= 80) || this.$t('formvalidation.overlength', {
							fieldname: this.$t('general.message'),
							count: '80'
						})
					]
				};
			},

		},
		methods: {
			generateLivePreview() {
				if (this.livePreview) {
					// First restore original content
					// Only if live preview is activated
					this.rubriccontent.content = JSON.parse(JSON.stringify(this.contentOriginal));
					let newcontent = {
						data: this.newcontent_data
					};
					if (this.selectedSlot === -1) {
						this.rubriccontent.content.splice(0, 0, newcontent);
						// Make sure there are max 10 messages
						while (this.rubriccontent.content.length > 10) {
							this.rubriccontent.content.pop();
						}
					} else {
						this.rubriccontent.content.splice(this.selectedSlot, 1, newcontent);
					}
				}
			},
			onLivePreviewChange() {
				if (this.livePreview) {
					this.generateLivePreview();
				} else {
					// Restore original content
					this.rubriccontent.content = [];
					this.rubriccontent.content = JSON.parse(JSON.stringify(this.contentOriginal));
				}

			},
			slotSelect() {
				let returnvalue = [];
				returnvalue.push(
					{
						value: -1,
						text: this.$t('rubrics.addfirst.selecttext')
					}
				);
				for (let i = 0; i < this.rubriccontent.content.length; i++) {
					returnvalue.push(
						{
							value: i,
							text: (i + 1).toString()
						}
					);
				}
				if (this.rubriccontent.content.length + 1 <= 10) {
					// If there is still space for one slot, that is not used yet, add it, too
					returnvalue.push(
						{
							value: (this.rubriccontent.content.length + 1),
							text: (this.rubriccontent.content.length + 1).toString()
						}
					);
				}
				return returnvalue;
			},
			initializeExpiration() {
				if (this.enableExpirationTime) {
					// if changed to true

					let defaultExpirationTimeStamp = moment().add(this.rubriccontent.default_expiration, 'seconds');
					this.dateNonFormated = defaultExpirationTimeStamp.format('YYYY-MM-DD');
					this.dateFormated = defaultExpirationTimeStamp.format('L');
					this.hour = parseInt(defaultExpirationTimeStamp.format('HH'));
					this.newcontent_expires_on = defaultExpirationTimeStamp.toISOString();
				}
			},
			hoursSelect() {
				let returnvalue = [];
				for (let myhour = 0; myhour < 24; myhour++) {
					let selectedDateTime = moment(this.dateNonFormated);
					selectedDateTime.add(myhour, 'hours');
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
					this.dateFormated = moment(val).format('L');
				} else {
					this.dateFormated = '';
				}
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				// Load specific rubric's content data
				if (this.$route.params.id) {
					console.log('Load messages of this rubric');
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

							if (response.data.content) {
								// Load messages
								for (var i = 0; i < response.data.content.length; i++) {
									this.rubriccontent.content.push({
										data: response.data.content[i].data
									});
								}
							}

							this.slotSelectItems = this.slotSelect();
							// Save origial content if the user disables the live preview again
							this.contentOriginal = JSON.parse(JSON.stringify(this.rubriccontent.content));
						}).catch(e => {
						console.log('Error getting rubric\'s individual details with axios or any exception' +
							'in the get handler of AddRubricContent.' + e);
					});
				}
			},
			SaveButton() {
				// Send changed rubric content to database Service
				console.log('Save button');
				console.log(this.rubriccontent);
				console.log(this.hour);

				if (this.$refs.addForm.validate()) {
					let data2Send = {};
					// Build data to send
					data2Send._id = this.rubriccontent._id;
					data2Send.data = this.newcontent_data;
					if (this.enableExpirationTime) {
						data2Send.expires_on = moment(this.dateNonFormated, 'YYYY-MM-DD').add(this.hour, 'hours').toISOString();
					}
					if (this.priorityBoost) {
						data2Send.priority = parseInt(this.rubriccontent.default_priority + 1);
					}
					console.log('Data2Send von rubrics:');
					console.log(data2Send);
					let url = '';
					if (this.selectedSlot === -1) {
						url = 'rubrics/content/first';
					} else {
						url = 'rubrics/content/slot/' + (this.selectedSlot + 1).toString();
					}

					let context = this;
					axios.post(url, data2Send)
						.then(function(response) {
							context.$router.go(-1);
					}).catch(function(error) {
						console.log('Error in put rubric content', error);
					});
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