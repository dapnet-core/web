<template>
	<v-card>
		<v-container
			fluid
			grid-list-lg
		>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card color="grey" class="white--text">
						<v-card-title primary-title>
							<div>
								<div class="headline">{{ $t('navigation.subscribersonlynames') }}</div>
								<div>{{ $t('subscribers.overviewonlynames.information.help') }}</div>
							</div>
						</v-card-title>
						<v-card-text>
							<v-card>
								<v-layout>
									<v-flex xs12>
										<div v-for="rows in rowCount" v-bind:key="rows">
											<div class="row">
												<div class="col-sm-3" v-for="column in numberOfColumns" v-bind:key="column">
													<div v-if="data.length >= layoutCount(rows, column)">
														{{ data[rows*column] }}
													</div>
												</div>
											</div>
										</div>
									</v-flex>
								</v-layout>
							</v-card>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-card>
</template>

<script>
	import axios from 'axios';
	export default {
		created() {
			this.loadData();
		},
		data() {
			return {
				errorMessage: false,
				running: false,
				data: [],
				numberOfColumns: 4
			};
		},
		computed: {
			rowCount: function() {
				return Math.floor(((this.data.length - 1) / this.numberOfColumns)) + 1;
			}
		},
		methods: {
			loadData() {
				this.running = true;
				axios.get('subscribers/_names').then(response => {
					// success --> save new data
					this.data = response.data;
					console.log(this.data);
					this.running = false;
				}).catch(e => {
					this.isLoadingData = false;
					this.$swal({
						title: this.$i18n.t('alerts.errorLoadUsers.title'),
						type: 'error',
						html: this.$i18n.t('alerts.ticketlink', {
							htmlcode: '<a href="https://support.hampager.de" target="_blank">support.hampager.de</a>'
						}) + '<br>' + e,
						showConfirmButton: true,
						confirmButtonText: this.$i18n.t('alerts.ok')
					});
				});			},
			layoutCount: function(rows, columns) {
				return (rows - 1) * this.numberOfColumns + columns;
			}
		}
	};
</script>

<style scoped>

</style>
