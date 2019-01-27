<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('pagetitle.calls.overview') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- New Call Button -->
						<v-fab-transition v-if="this.$store.getters.permission('rubric.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									icon
									dark
									to="/calls/new"
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
						:items="callslist"
						:loading="isLoadingData"
						:rows-per-page-items="[10, 25, 50, 100]"
						class="elevation-1"
						:search="search"
					>
						<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
						<template slot="items" slot-scope="props">
						<tr style="border-bottom: none;">
							<!-- Created by column -->
							<td class="text-xs-left">
								{{ props.item.created_by }}
							</td>

							<!-- recipients.subscribers and subscriber_groups column-->
							<td class="text-xs-left">
								<span v-for="(subscriber, index) in props.item.recipients.subscribers" v-bind:key="`subscriber-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										<v-avatar>
											<v-icon>person</v-icon>
										</v-avatar>
										{{ subscriber }}
									</v-chip>
								</span>
								<span v-for="(subscriber_group, index) in props.item.recipients.subscriber_groups" v-bind:key="`subscriber_groups-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										<v-avatar>
											<v-icon>people</v-icon>
										</v-avatar>
										{{ subscriber_group }}
									</v-chip>
								</span>
							</td>

							<!--distribution.transmitters column-->
							<td>
								<span v-for="(transmitter, index) in props.item.distribution.transmitters" v-bind:key="`transmitter-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										<v-avatar>
											<v-icon>signal_wifi_1_bar</v-icon>
										</v-avatar>
										{{ transmitter }}
									</v-chip>
								</span>
								<span v-for="(transmitter_group, index) in props.item.distribution.transmitter_groups" v-bind:key="`transmitter_groups-${index}`">
									<v-chip
										color="grey"
										text-color="white"
										small
									>
										<v-avatar>
											<v-icon>signal_wifi_4_bar</v-icon>
										</v-avatar>
										{{ transmitter_group }}
									</v-chip>
								</span>
							</td>

							<!-- origin column -->
							<td class="text-xs-center">
								{{ props.item.origin }}
							</td>

							<!-- priority column -->
							<td class="text-xs-center">
								<v-chip
									:color="priorityNumber2Color(props.item.priority)"
									text-color="black"
									small
								>
									{{ priorityNumber2String(props.item.priority) }}
								</v-chip>
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<v-chip
									label
									text-color="black"
									color="grey lighten-2"
								>
									<v-icon left>message</v-icon>
									{{ props.item.data }}
								</v-chip>
							</td>
						</tr>
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
				total_calls: 0,
				callslist: [],
				isLoadingData: true
			};
		},
		computed: {
			isReadyLoadingData() {
				return !this.isLoadingData;
			},
			getHeaders() {
				let headings = [
					{
						text: this.$i18n.t('calls.overview.from'),
						align: 'left',
						sortable: true,
						value: 'created_by'
					},
					{
						text: this.$i18n.t('general.subscribers'),
						sortable: true,
						align: 'center',
						value: 'recipients.subscribers'
					},
					{
						text: this.$i18n.t('general.transmitters'),
						sortable: true,
						align: 'center',
						value: 'distribution.transmitters'
					},
					{
						text: this.$i18n.t('calls.overview.origin'),
						align: 'center',
						value: 'origin'
					},
					{
						text: this.$i18n.t('general.priority'),
						align: 'center',
						value: 'priority'
					}
				];
				return headings;
			}
		},
		methods: {
			priorityNumber2Color(priority) {
				if (priority === 1) {
					return 'green';
				} else if (priority === 2) {
					return 'green';
				} else if (priority === 3) {
					return 'yellow';
				} else if (priority === 4) {
					return 'orange';
				} else if (priority === 5) {
					return 'red';
				} else {
					return 'grey';
				}
			},
			priorityNumber2String(priority) {
				return this.$helpers.priorityNumber2String(this, priority);
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				this.isLoadingData = true;
				this.$axios.get('calls')
					.then(response => {
						// success --> save new data
						// save calls
						if (response.data) {
							this.callslist = response.data;
						}
						this.isLoadingData = false;
					}, response => {
						// error --> show error message
						this.isLoadingData = false;
						this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
	// TODO: Make headers instant i18n updateable
</script>

<style scoped>

</style>
