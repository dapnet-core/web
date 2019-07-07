<template>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>{{ $t('pagetitle.rubric.my') }}</v-toolbar-title>
				</v-toolbar>

				<v-list two-line>
					<template>
						<div
							v-for="(myrubric, index) in myrubrics.rows"
							:key="myrubric._id"
						>
							<v-divider
								v-if="index != 0"
							></v-divider>
							<v-list-tile>
								<v-list-tile-avatar>
									<v-chip
										small
									>
										{{ myrubric.number }}
									</v-chip>
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>
										{{ myrubric.label }}
										<v-chip	small>
											<v-avatar color="teal">
												<span class="white--text">{{ myrubric.function }}</span>
											</v-avatar>
											{{ $t('rubrics.function.title') }}
										</v-chip>
									</v-list-tile-title>
									<v-list-tile-sub-title>
										{{ myrubric.description }}
										<v-chip
											v-if="myrubric.cyclic_transmit"
											label
											small
										>
											<v-avatar>
												<v-icon color="green">sync</v-icon>
											</v-avatar>
											{{ myrubric.cyclic_transmit_interval }} {{ $t('general.minutes') }}
										</v-chip>
										<v-chip
											v-else
											label
											small
										>
											<v-avatar>
												<v-icon color="red">sync_disabled</v-icon>
											</v-avatar>
											---
										</v-chip>
									</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-layout row>
										<v-flex xs12>
											<!-- Show and Edit Content -->
											<v-tooltip bottom>
												<v-btn class="action-buttons"
													   flat
													   icon
													   small
													   fab
													   color="orange"
													   v-on:click="editBulkContent(myrubric)"
													   slot="activator"
												>
													<v-icon>storage</v-icon>
												</v-btn>
												<span>{{ $t('table.actionbuttons.showeditrubriccontent') }}</span>
											</v-tooltip>
											<!-- Add Message  -->
											<v-tooltip bottom class="action-buttons">
												<v-btn class="action-buttons"
													flat
													icon
													small
													fab
													color="purple"
													v-on:click="AddContent(myrubric)"
													slot="activator"
												>
													<v-icon>add</v-icon>
												</v-btn>
												<span>{{ $t('rubrics.overview.addcontent') }}</span>
											</v-tooltip>
											<!-- Edit -->
											<v-tooltip bottom>
												<v-btn class="action-buttons"
													flat
													icon
													small
													fab
													color="blue"
													v-on:click="editElement(myrubric)"
													slot="activator"
												>
													<v-icon>edit</v-icon>
												</v-btn>
												<span>{{ $t('table.actionbuttons.edit') }}</span>
											</v-tooltip>
											<!-- Delete -->
											<v-tooltip bottom>
												<v-btn class="action-buttons"
													flat
													icon
													small
													fab
													color="pink"
													v-on:click="deleteElement(myrubric)"
													slot="activator"
												>
													<v-icon>delete</v-icon>
												</v-btn>
												<span>{{ $t('table.actionbuttons.delete') }}</span>
											</v-tooltip>
										</v-flex>
									</v-layout>
								</v-list-tile-action>
							</v-list-tile>
						</div>
					</template>
				</v-list>
			</v-card>
		</v-flex>
	</v-layout>
</template>
<script>
	export default {
		created() {
			this.loadData();
		},
		data() {
			return {
				isLoadingData: {
					general: true
				},
				myrubrics: ''
			};
		},
		methods: {
			loadData() {
				// load data of given id
				this.isLoadingData.general = true;
				this.$axios.get('rubrics/_my')
					.then(response => {
						console.log(response.data);
						this.myrubrics = response.data;
						this.isLoadingData.general = false;
					}).catch(e => {
						console.log('Error getting my rubric\'s details with axios or any exception in the get handler.');
						console.log(e);
						this.$helpers.swalError(this, this.$i18n.t('alerts.errorLoad.rubrics.my.title'), e);
					});
				console.log(this.myrubrics);
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
</script>

<style scoped>

</style>
