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
								<v-list-tile-content>
									<v-list-tile-title>{{ myrubric._id }}</v-list-tile-title>
									<v-list-tile-sub-title>
										<!-- TODO: Make more informative -->
										{{ myrubric._id }}
									</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>

									<!-- Edit -->
									<v-tooltip bottom>
										<v-btn class="action-buttons"
											flat
											icon
											small
											fab
											color="blue"
											v-on:click="editElement(myrubric._id)"
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
											v-on:click="deleteElement(myrubric._id)"
											slot="activator"
										>
											<v-icon>delete</v-icon>
										</v-btn>
										<span>{{ $t('table.actionbuttons.delete') }}</span>
									</v-tooltip>
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
			}
		}
	};
</script>

<style scoped>

</style>
