<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						<div class="headline">{{ $t('navigation.nodes.all') }}</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="search"
							v-bind:label="$t('table.search')"
							single-line
							hide-details
						>
						</v-text-field>
						<!-- Add Node Button -->
						<v-fab-transition v-if="this.$store.getters.permission('node.create')">
							<v-tooltip bottom>
								<v-btn
									color="pink"
									fab
									dark
									small
									to="/nodes/new"
									slot="activator"
								>
										<v-icon>+</v-icon>
								</v-btn>
								<span>{{ $t('nodes.overview.newnode') }}</span>
							</v-tooltip>
						</v-fab-transition>
					</v-card-title>
					<v-data-table
						:headers="getHeaders"
						:items="noderows"
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
							<td class="text-xs-right">
								{{ props.item._id }}
							</td>

							<!-- Description column -->
							<td class="text-xs-right">
								{{ props.item.description }}
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

							<!-- Action Buttons -->
							<td class="text-xs-center" v-if="displayActionsColumn">
								<!-- Edit -->
								<v-tooltip bottom>
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('node.update') === 'all'"
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
											v-if="getPermissionsWrapper('node.delete') === 'all'"
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
								<!-- Send Email -->
								<v-tooltip bottom class="action-buttons">
									<v-btn class="action-buttons"
											v-if="getPermissionsWrapper('node.update') === 'all'"
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
				noderows: [],
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
				let answer = [
					{
						text: this.$i18n.t('general.name'),
						align: 'left',
						sortable: true,
						value: '_id'
					},
					{
						text: this.$i18n.t('general.description'),
						sortable: true,
						align: 'center',
						value: 'description'
					},
					{
						text: this.$i18n.t('general.owner'),
						align: 'center',
						value: 'owners'
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
		mounted() {
			this.$root.$on('LanguageChanged', () => {
				// this.rerender_localized();
			});
		},
		methods: {
			/* rerender_localized() {
				this.transmitterrows.forEach(transmitter => {
					// Render last seen as prosa text
					if (transmitter.status.last_seen) {
						transmitter.status.last_seen_localized = moment(transmitter.status.last_seen).fromNow();
					} else {
						transmitter.status.last_seen_localized = '---';
					}
				});
			},
			*/
			displayActionsColumn() {
				return ((this.$store.getters.permission('node.update') === 'all') ||
				(this.$store.getters.permission('node.delete') === 'all'));
			},
			getPermissionsWrapper(mypermission) {
				return (this.$store.getters.permission(mypermission));
			},
			loadData() {
				this.isLoadingData = true;
				this.$axios.get('nodes', {
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
						/*
						response.data.rows.forEach(nodes => {

							let usageRendered = [];
							if (transmitter.usage === 'widerange') {
								usageRendered.image = './img/icons/transmitter_widerange.png';
								usageRendered.text = 'Widerange';
							} else if (transmitter.usage === 'personal') {
								usageRendered.image = './img/icons/transmitter_personal.png';
								usageRendered.text = 'Personal';
							}
							transmitter.usage = usageRendered;

							// Render last seen as prosa text
							if (transmitter.status.last_seen) {
								transmitter.status.last_seen_localized = moment(transmitter.status.last_seen).fromNow();
							} else {
								transmitter.status.last_seen_localized = '---';
							}
						});
						*/

						this.noderows = response.data.rows;
					}
					this.isLoadingData = false;
				}, response => {
					// error --> show error message
					this.isLoadingData = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			mailToOwner(element) {
				window.location.href = 'mailto:' + element.email + '?subject=DAPNET%20Node%3A%20' + element._id;
			},
			editElement(element) {
				this.$router.push({ name: 'Edit Node', params: { id: element._id } });
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.axios.delete('nodes/' + element._id + '?revision=' + element._rev, {
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
					this.$root.$emit('ReloadSidebarIcons');
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
