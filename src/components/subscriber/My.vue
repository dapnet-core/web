<template>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<v-toolbar color="primary" dark>
					<v-toolbar-title>My Subscribers</v-toolbar-title>
				</v-toolbar>

				<v-list two-line>
					<template v-for="(mysubscriber, index) in mysubscribers.rows">

						<v-divider></v-divider>

						<v-list-tile
							:key="mysubscriber._id"
							@click=""
						>
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
				mysubscribers: '',
				items: [
					{ header: 'Today' },
					{
						avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
						title: 'Brunch this weekend?',
						subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
					},
					{ divider: true, inset: true },
					{
						avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
						title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
						subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
					},
					{ divider: true, inset: true },
					{
						avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
						title: 'Oui oui',
						subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
					}
				]
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
