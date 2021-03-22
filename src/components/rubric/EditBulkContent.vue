<template>
	<v-container fluid>
		<v-card>
			<v-card-title>
				<v-layout>
					<span class="headline">
						{{ $t('rubrics.overview.editrubriccontentof') }}
						<v-chip label>
							<v-avatar class="teal">
								{{ rubric.number }}
							</v-avatar>
							{{ rubric.label }}
						</v-chip>
						<v-chip label>
							<v-avatar :class="this.rubric.function === 3 ? 'green' : 'red'">
								{{ this.rubric.function }}
							</v-avatar>
							{{ $t('rubrics.function.title') }}
						</v-chip>
						<v-chip
							label
							color="yellow"
							v-if="this.rubric.function !== 3"
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
							v-model="show_expiration"
							:label="$t('rubrics.expirationenabled.show')"
						></v-checkbox>
					</v-flex>
					<v-flex xs4>
						<v-checkbox
							v-model="show_priority_boost"
							:label="$t('rubrics.priorityboost.show')"
						></v-checkbox>
					</v-flex>
				</v-layout>
			</v-card-title>
			<v-card-text>
				<v-form v-model="isFormValid" ref="editForm">
					<v-layout
						align-center
						v-for="(item, index) in items"
						:key="index"
					>
						<!--Data-->
						<v-flex xs4>
							<v-textarea
								v-model="item.data"
								:prefix="(index + 1).toString()"
								:counter="80"
								rows="2"
								:rules="validationRules.message"
							>
							</v-textarea>
						</v-flex>
						<v-flex xs2 v-if="show_expiration">
							<v-checkbox
								v-model="item.enable_expiration"
								:label="$t('rubrics.expirationenabled.title')"
								@change="initializeExpiration(index)"
							>
							</v-checkbox>
						</v-flex>
						<!--Expiration Time-->
						<v-flex xs3 v-if="show_expiration && item.enable_expiration">
							<v-menu
								:close-on-content-click="false"
								:ref="'date_menu' + index"
								:return-value.sync="item.expiration_date"
								v-model="item.date_menu"
								:nudge-right="40"
								lazy
								transition="scale-transition"
								offset-y
								full-width
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-on="on"
										v-model="item.expiration_date"
										:label="$t('rubrics.expirationdate.title')"
										:hint="$t('rubrics.expirationdate.help')"
										prepend-icon="event"
										readonly
									></v-text-field>
								</template>
								<v-date-picker
									v-model="item.expiration_date"
									:locale="$root.$i18n.locale"
									@click:date="$refs['date_menu' + index][0].save(item.expiration_date)"
								>
							      <v-spacer></v-spacer>
						          <v-btn flat color="primary" @click="item.date_menu = false">Cancel</v-btn>
						          <v-btn flat color="primary" @click="$refs['date_menu' + index][0].save(item.expiration_date)">OK</v-btn>
								</v-date-picker>
							</v-menu>
						</v-flex>
						<v-flex xs3 v-if="show_expiration && !item.enable_expiration"></v-flex>
						<!--Expiration time-->
						<v-flex xs2 v-if="show_expiration && item.enable_expiration">
							<v-menu
								:close-on-content-click="false"
								:ref="'time_menu' + index"
								v-model="item.time_menu"
								:return-value.sync="item.expiration_time"
								:nude_right="40"
								lazy
								transition="scale-transition"
								offset-y
								full-width
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-on="on"
										v-model="item.expiration_time"
										:label="$t('rubrics.expirationtime.title')"
										:hint="$t('rubrics.expirationtime.help')"
										readonly
									></v-text-field>
								</template>
								<v-time-picker
									v-if="item.time_menu"
									v-model="item.expiration_time"
									format="24hr"
									full-width
									:locale="$root.$i18n.locale"
									@click:minute="$refs['time_menu' + index][0].save(item.expiration_time)"
								></v-time-picker>
							</v-menu>
						</v-flex>
						<v-flex xs2 v-if="show_expiration && !item.enable_expiration"></v-flex>
						<v-flex v-if="show_priority_boost">
							<v-checkbox
								v-model="item.priority_boost"
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
									v-on:click="addContentAbove(index)"
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

			</v-card-text>
			<v-card-actions>
				<v-btn
					@click="saveData"
					v-bind:disabled="!isFormValid"
				>
					Save changes
				</v-btn>
				<v-btn
					color="primary"
					flat
					@click="close"
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
			for (let i = 0; i < 10; i++) {
				this.items.push(this.emptyItem())
			}
			moment.locale(this.$root.$i18n.locale);
			this.loadData();
		},
		data() {
			return {
				loading: true,
				show_expiration: false,
				show_priority_boost: false,
				rubric: {
					_id: '',
					_rev: '',
					number: 0,
					function: 0,
					description: '',
					label: '',
					default_priority: 0,
					default_expiration: 0
				},
				items: [],
				rev: null,
				isFormValid: false
			};
		},
		computed: {
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
			emptyItem() {
				return { 
					'data': '',
					'expires_at': null,
					'priority': 0,
					'enable_expiration': false,
					'priority_boost': false
				};
			},
			initializeExpiration(index) {
				if (this.items[index].enable_expiration) {
					// if changed to true
					let expires_at = moment().add(this.rubric.default_expiration, 'seconds');
					this.items[index].expiration_date = expires_at.format('YYYY-MM-DD');
					this.items[index].expiration_time = expires_at.format('HH:MM');
				}
			},
			addContentAbove(index) {
				this.items.splice(index - 1 + 1, 0, emptyItem());
				// Delete last element, which is number 11, index 10
				this.items.splice(10, 1);
			},
			moveContentUp(index) {
				let tmp = this.items[index - 1];
				this.$set(this.items, index - 1, this.items[index]);
				this.$set(this.items, index, tmp);
			},
			moveContentDown(index) {
				let tmp = this.items[index + 1];
				this.$set(this.items, index + 1, this.items[index]);
				this.$set(this.items, index, tmp);
			},
			deleteContent(index) {
				// index starts at 0, ends at 9
				this.items.splice(index, 1);
				// Restore number of elements to 10
				this.items.push('');
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				// Load specific rubric's content data
				if (this.$route.params.id) {
					let axios = this.$axios;

					axios.get('rubrics/' + this.$route.params.id)
						.then(response => {
							this.rubric = response.data;
							return axios.get('rubrics/' + this.$route.params.id + '/news');
						})
						.catch(e => {
							console.log('Error getting rubric.' + e);
						})
						.then(response => {
							this.rev = response.data["_rev"];
							let items = response.data["items"] || [];
							// Load 10 Messages and compute date and time display
							for (var i = 0; i < 10; i++) {
								if (items[i]) {
									this.items[i].data = items[i].data;

									this.items[i].priority_boost = items[i].priority > this.rubric.default_priority;

									if (items[i].expires_at) {
										this.items[i].expiration_date = moment(items[i].expires_at)
											.format('YYYY-MM-DD');
										this.items[i].expiration_time = parseInt(moment(items[i].expires_at)
											.format('HH:MM'));
										this.items[i].enable_expiration = true;
									} else {
										this.items[i].enable_expiration = false;
									}
								} else {
									this.items[i] = {
										'data': '',
										'enable_expiration': false,
										'priority_boost': false
									};
								}
							}
							this.loading = false;
						}).catch(e => {
							console.log('Error getting rubric\'s individual details with axios or any exception' +
								'in the get handler of EditBulkContent.' + e);
						});
				}
			},
			saveData() {
				if (this.$refs.editForm.validate()) {
					let data = {
						'_id': this.rubric._id,
						'_rev': this.rev,
						'items': []
					};
					
					for (let i = 0; i < 10; i++) {
						if (this.items[i] && this.items[i].data) {
							let item = { 'data': this.items[i].data };
							if (this.items[i].enable_expiration) {
								let expiration = moment(this.items[i].expiration_date + "T" + this.items[i].expiration_time);
								item.expires_at = expiration.toISOString();
							}
							if (this.items[i].priority_boost) {
								item.priority = this.rubric.default_priority + 1;
							}
							data.items.push(item);
						}
						else {
							data.items.push(null);
						}
					}
					console.log(data);
					this.$helpers.sendData(this, 'rubrics/' + this.rubric._id + "/news", data, '');
					this.$router.go(-1);
				}
			},
			close() {
				this.$router.go(-1);
			}
		}
	};
</script>

<style scoped>

</style>
