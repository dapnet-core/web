<script>
	import { Bar, mixins } from 'vue-chartjs';
	export default {
		mixins: [Bar, mixins.reactiveProp],
		data() {
			return {
				chartOptions: {
					maintainAspectRatio: false,
					responsive: true,
					legend: {
						display: false
					},
					scales: {
						xAxes: [{
							ticks: {
								display: true
							}
						}],
						yAxes: [{
							ticks: {
								display: false,
								beginAtZero: true,
								max: 100
							},
							gridLines: {
								display: false
							}
						}]
					}
				}
			};
		},
		mounted() {
			this.renderChart(this.chartData, this.chartOptions);
		}
	};
</script>
