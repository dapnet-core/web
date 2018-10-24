<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="page-header">
					<h1>{{ $t('navigation.usersonlynames') }}</h1>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-9">
				<div v-for="columns in rowCount" v-bind:key="columns">
					<div class="row">
						<div class="col-sm-3" v-for="column in numberOfColumns" v-bind:key="column">
							<div v-if="data.length >= layoutCount(columns, column)">
								{{ data[columns*column] }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-3">
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('users.overviewonlynames.information.help')"></p>
			</div>
		</div>
	</div>
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
			statTotal() {
				return this.data.length;
			},
			rowCount: function() {
				return Math.floor(((this.data.length - 1) / this.numberOfColumns)) + 1;
			}
		},
		methods: {
			loadData() {
				this.running = true;
				axios.get('users/_usernames').then(response => {
					// success --> save new data
					this.data = response.data;
					console.log(this.data);
					this.running = false;
				}, response => {
					// error --> show error message
					this.running = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			layoutCount: function(rows, columns) {
				return (rows - 1) * this.numberOfColumns + columns;
			}
		}
	};
</script>

<style scoped>

</style>
