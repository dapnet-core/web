<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="page-header">
					<h1>{{ $t('navigation.transmitters.title') }}</h1>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-lg-9">
				<h2>{{ $t('navigation.transmitters.all') }}
					<i class="fa fa-refresh fa-fw" :class="{ 'fa-spin': running }" @click="loadData"></i>
				</h2>

				<info-error :message="errorMessage"></info-error>

				<tablegrid v-if="table.rows" :columns="table.columns" :data="table.rows" :mail-action="mailToOwner"
					:edit-action="editElement" :delete-action="deleteElement" :monitoring-action="openMonitoring" :send-rubrics-action="sendRubrics"></tablegrid>

				<h2>Timeslots</h2>
				<span class="label label-timeslot label-default" v-for="s in timeslotData" :key="s.name" :class="[s.active ? 'timeslot-active' : '']">{{ s.name }}</span>
			</div>
			<div class="col-lg-3">
				<div class="actions well">
					<template v-if="this.$store.getters.user.admin">
						<legend>{{ $t('general.actions') }}</legend>
						<ul>
							<li><router-link to="/transmitters/new">{{ $t('transmitter.overview.actions.newtransmitter') }}</router-link></li>
							<li><p class="linklike" @click="mailToAll">{{ $t('transmitter.overview.actions.sendmailtoallowners') }}</p></li>
						</ul>
						<br>
					</template>
					<template v-if="table.rows">
						<legend>{{ $t('general.statistics') }}</legend>
						<ul class="list-group">
							<li class="list-group-item"><b>{{ $t('transmitter.overview.statistics.widerange') }}</b><span class="badge">{{ stats.widerange.online }} / {{ stats.widerange.total }}</span></li>
							<li class="list-group-item"><b>{{ $t('transmitter.overview.statistics.personal') }}</b><span class="badge">{{ stats.personal.online }} / {{ stats.personal.total }}</span></li>
							<li class="list-group-item"><b>{{ $t('transmitter.overview.statistics.total') }}</b><span class="badge">{{ stats.total.online }} / {{ stats.total.total }}</span></li>
							<li class="list-group-item"><chart-transmitter-types :chartData="chartDataDeviceTypes"></chart-transmitter-types></li>
						</ul>
						<div class="checkbox">
							<label><input type="checkbox" v-model="settings.widerangeOnly"> {{ $t('transmitter.overview.statistics.widerangeonly') }}</label>
						</div>
					</template>
				</div>
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('transmitter.overview.information.text')"></p>
			</div>
		</div>
	</div>
</template>

<script>
	import ChartTransmitterTypes from '@/components/charts/TransmitterTypes';

	export default {
		components: {
			ChartTransmitterTypes
		},
		created() {
			this.loadData();
			this.prepareWebsocket();
		},
		data() {
			// build timeslots
			let timeslotData = [];

			// timeslots: numbers
			for (let i = 0; i <= 9; i++) {
				timeslotData.push({
					name: i,
					active: false
				});
			}

			// timeslots: letters
			for (let i = 65; i <= 70; i++) {
				timeslotData.push({
					name: String.fromCharCode(i),
					active: false
				});
			}

			return {
				errorMessage: false,
				running: false,
				table: {
					columns: [
						{
							id: '_id',
							title: 'transmitter.overview.table.callsign'
						},
						{
							id: 'node',
							title: 'transmitter.overview.table.node'
						},
						{
							id: 'addr',
							title: 'transmitter.overview.table.ipaddress'
						},
						{
							id: 'owners',
							title: 'general.owner'
						},
						{
							id: 'device_text',
							title: 'transmitter.overview.table.device'
						},
						{
							id: 'status_text',
							title: 'transmitter.overview.table.status'
						},
						{
							id: 'connected_since',
							title: 'transmitter.overview.table.connectedsince'
						},
						{
							id: 'actions',
							title: 'general.actions'
						}
					],
					rows: false
				},
				timeslotData: timeslotData,
				settings: {
					widerangeOnly: false
				}
			};
		},
		computed: {
			stats() {
				return {
					widerange: {
						online: this.table.rows.filter(value => value.status.online && value.usage === 'widerange').length,
						total: this.table.rows.filter(value => value.usage === 'widerange').length
					},
					personal: {
						online: this.table.rows.filter(value => value.status.online && value.usage === 'personal').length,
						total: this.table.rows.filter(value => value.usage === 'personal').length
					},
					total: {
						online: this.table.rows.filter(value => value.status.online).length,
						total: this.table.rows.length
					}
				};
			},
			chartDataDeviceTypes() {
				let chartData = {
					labels: [],
					datasets: [{
						data: [],
						backgroundColor: [],
						hoverBackgroundColor: []
					}]
				};

				if (!this.table.rows || this.table.rows.length === 0) return chartData;

				let returnData = {};
				this.table.rows.forEach(transmitter => {
					// use only transmitters which are currently online
					if (!transmitter.status.online) {
						return true;
					}

					// hide non-widerange transmitters if checkbox is set
					if (this.settings.widerangeOnly && transmitter.usage !== 'widerange') {
						return true;
					}

					let deviceType = transmitter.status.software.name;

					if (!deviceType || deviceType === '---') {
						deviceType = 'Unknown';
					}

					if (returnData[deviceType] !== undefined) {
						returnData[deviceType].amount++;
					} else {
						returnData[deviceType] = {};
						returnData[deviceType].name = deviceType;
						returnData[deviceType].amount = 1;
					}
				});

				let orderedReturnData = {};
				Object.keys(returnData).sort().forEach(key => {
					orderedReturnData[key] = returnData[key];
				});

				const distColors = this.$helpers.getDistributedColors(Object.keys(orderedReturnData).length);
				let count = 0;
				for (let key in orderedReturnData) {
					if (!orderedReturnData.hasOwnProperty(key)) {
						return true;
					}

					chartData.labels.push(orderedReturnData[key].name);
					chartData.datasets[0].data.push(orderedReturnData[key].amount);

					let color = distColors[count];
					chartData.datasets[0].backgroundColor.push(color);
					chartData.datasets[0].hoverBackgroundColor.push(color);

					count++;
				}

				return chartData;
			}
		},
		methods: {
			loadData() {
				this.running = true;
				this.$http.get('transmitters').then(response => {
					// success --> save new data

					response.body.rows.forEach(transmitter => {
						// add ip (if available)
						if (!transmitter.address) {
							transmitter.address = '---';
						}

						// add icon to device
						if (transmitter.status && transmitter.status.online) {
							transmitter.addr = transmitter.status.addr;
							transmitter.connected_since = transmitter.status.connected_since;
							transmitter.node = transmitter.status.node;
							transmitter.device_text = transmitter.status.software.name + ' ' + transmitter.status.software.version;
						} else {
							transmitter.device_text = '---';
						}
						if (transmitter.usage === 'widerange') {
							transmitter.device_text = '<img src="./assets/img/transmitter_widerange.png" title="Widerange"> ' + transmitter.device_text;
						} else if (transmitter.usage === 'personal') {
							transmitter.device_text = '<img src="./assets/img/transmitter_personal.png" title="Personal"> ' + transmitter.device_text;
						}

						// make status more colorful
						if (transmitter.status.online) {
							transmitter.status_text = '<span class="label label-success">ONLINE</span>';
						} else {
							transmitter.status_text = '<span class="label label-primary">OFFLINE</span>';
						}

						// add actions (if admin or owner)
						transmitter.actions = false;
						if (this.$store.getters.permission('transmitter.update')) {
							transmitter.actions = true;
						}
					});

					this.table.rows = response.body.rows;

					this.running = false;
					this.errorMessage = false;
				}, response => {
					// error --> show error message
					this.running = false;
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			prepareWebsocket() {
				this.ws = new WebSocket('ws://' + location.hostname + '/telemetry/transmitters');
				this.ws.addEventListener('message', e => {
					let data = JSON.parse(e.data);
					console.log(data);

					// TODO: Update current timeslot
					// TODO: Update transmitter "rowStyle" based on "on_air"
				});
			},
			mailToOwner(element) {
				let mailTo = [];
				this.$http.get('users').then(response => {
					response.body.forEach(user => {
						if (element.owners.includes(user.name)) {
							mailTo.push(user.mail);
						}
					});
					window.location.href = 'mailto:' + mailTo.join(',') + '?subject=DAPNET%20Transmitter%3A%20' + element._id;
				}, response => {
					this.$dialogs.ajaxError(this, response);
				});
			},
			editElement(element) {
				this.$router.push({name: 'Edit Transmitter', params: {id: element._id}});
			},
			deleteElement(element) {
				this.$dialogs.deleteElement(this, () => {
					this.$http.delete('transmitters/' + element._id, {
						before(request) {
							request.headers.delete('Content-Type');
						}
					}).then(response => {
						// success --> reload data
						this.loadData();
					}, response => {
						// error --> show error message
						this.$dialogs.ajaxError(this, response);
					});
				});
			},
			openMonitoring(element) {
				this.$router.push({name: 'Transmitter Monitoring', params: {id: element._id}});
			},
			sendRubrics(element) {
				this.$http.get('transmitterControl/sendRubricNames/' + element._id).then(() => {
					// success
					this.$dialogs.success(this);
				}, response => {
					// error --> show error message
					this.$dialogs.ajaxError(this, response);
				});
			},
			mailToAll() {
				let mailTo = [];
				this.$http.get('users').then(response => {
					response.body.forEach(user => {
						// check if user owns a transmitter
						this.table.rows.forEach(row => {
							if (row.owners.includes(user.name) && !mailTo.includes(user.mail)) {
								// add user's mail-address if it is not already in the list
								mailTo.push(user.mail);
							}
						});
					});
					window.location.href = 'mailto:' + mailTo.join(',') + '?subject=DAPNET%20Transmitter';
				}, response => {
					this.$dialogs.ajaxError(this, response);
				});
			}
		}
	};
</script>

<style scoped>
	.label-timeslot {
		font-size: small;
		margin-right: 2px;
	}
</style>
