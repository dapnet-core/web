<template>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>{{ $t('pagetitle.node.my') }}</v-toolbar-title>
				</v-toolbar>
				<v-list two-line>
					<template>
						<div
							v-for="(mynode, index) in mynodes.rows"
							:key="mynode._id"
						>
							<v-divider
								v-if="index != 0"
							></v-divider>
							<v-list-tile>
								<v-list-tile-content>
									<v-list-tile-title>{{ mynode._id }}</v-list-tile-title>
									<v-list-tile-sub-title>
										<!-- TODO: Make more informative -->
										{{ mynode._id }}
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
											v-on:click="editElement(mynode._id)"
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
											v-on:click="deleteElement(mynode._id)"
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
				mynodes: ''
			};
		},
		methods: {
			loadData() {
				// load data of given id
				this.isLoadingData.general = true;
				this.$axios.get('nodes/_my')
					.then(response => {
						console.log(response.data);
						this.mynodes = response.data;
						this.isLoadingData.general = false;
					}).catch(e => {
						console.log('Error getting nodes\'s individual details with axios or any exception in the get handler.');
						console.log(e);
				});
				console.log(this.myrubrics);
			}
		}
	};
</script>

<style scoped>

</style>
