<template>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>{{ $t('pagetitle.subscriber.my') }}</v-toolbar-title>
				</v-toolbar>

				<v-list two-line>
					<template>
						<div
							v-for="(mysubscriber, index) in mysubscribers.rows"
							:key="mysubscriber._id"
						>
							<v-divider
								v-if="index != 0"
							></v-divider>
							<v-list-tile>
								<v-list-tile-content>
									<v-list-tile-title>{{ mysubscriber._id }}</v-list-tile-title>
									<v-list-tile-sub-title>
										<template v-for="(mypager, pagerindex) in mysubscriber.pagers">
											{{pagerindex}}: {{ mypager.name }}
										</template>
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
											v-on:click="editElement(mysubscriber)"
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
											v-on:click="deleteElement(props.item)"
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
				mysubscribers: ''
			};
		},
		methods: {
			loadData() {
				// load data of given id
				this.isLoadingData.general = true;
				this.$axios.get('subscribers/_my')
					.then(response => {
						console.log(response.data);
						this.mysubscribers = response.data;
						this.isLoadingData.general = false;
					}).catch(e => {
						console.log('Error getting subscribers\'s individual details with axios or any exception in the get handler.');
						console.log(e);
				});
				console.log(this.mysubscribers);
			},
			editElement(element) {
				this.$router.push({ name: 'Edit Subscriber', params: { id: element._id } });
			}
		}
	};
</script>

<style scoped>

</style>
