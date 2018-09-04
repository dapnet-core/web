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
				<form class="form-horizontal well">
					<fieldset>
						<legend v-if="!this.$route.params.id">{{ $t('transmitter.new.newtransmitter') }}</legend>
						<legend v-if="this.$route.params.id">{{ $t('transmitter.new.edittransmitter') }}</legend>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.callsign.title') }}</label>
							<div class="col-lg-5">
								<input type="text" v-model="form.id" class="form-control">
								<span class="help-block">{{ $t('transmitter.new.callsign.help') }}</span>
								<span v-if="editing" v-html="this.$i18n.t('general.duplication')" class="help-block"></span>
							</div>
							<div class="col-lg-5">
								<multiselect v-model="formData.hamnetDb.selected" :options="formData.hamnetDb.all" :multiple="false" :close-on-select="true" :hide-selected="true" :clear-on-select="true" placeholder="Type to search" label="name" track-by="name"></multiselect>
								<span class="help-block">{{ $t('transmitter.new.import.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.password.title') }}</label>
							<div class="col-lg-10">
								<div class="input-group">
									<input :type="passwordVisible ? 'text' : 'password'" v-model="form.auth_key" class="form-control" :class="passwordVisible ? 'password-readable' : ''">
									<span class="input-group-btn">
										<button type="button" @click="passwordVisible = !passwordVisible" title="Toggle AuthKey visibility" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa" v-bind:class="{ 'fa-eye': passwordVisible, 'fa-eye-slash': !passwordVisible }"></i></button>
										<button type="button" v-clipboard:copy="form.auth_key" v-clipboard:success="() => {this.$dialogs.success(this)}" title="Copy password to clipboard" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa fa-clipboard"></i></button>
										<button type="button" @click="form.auth_key = $helpers.generatePassword(); passwordVisible = true;" title="Generate random AuthKey" class="btn btn-info" data-toggle="tooltip" data-placement="bottom" data-container="body"><i class="fa fa-repeat"></i></button>
									</span>
								</div>
								<span class="help-block">{{ $t('transmitter.new.password.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('general.latlong.title') }}</label>
							<div class="col-lg-3">
								<input type="number" lang="en-150" v-model.number="form.latitude.value" min="0" max="90" placeholder="0 - 90" class="form-control">
							</div>
							<div class="col-lg-2">
								<select class="form-control" v-model.number="form.latitude.orientation">
									<option value="1">{{ $t('general.latlong.north') }}</option>
									<option value="-1">{{ $t('general.latlong.south') }}</option>
								</select>
							</div>
							<div class="col-lg-3">
								<input type="number" lang="en-150" v-model.number="form.longitude.value" min="0" max="180" placeholder="0 - 180" class="form-control">
							</div>
							<div class="col-lg-2">
								<select class="form-control" v-model.number="form.longitude.orientation">
									<option value="1">{{ $t('general.latlong.east') }}</option>
									<option value="-1">{{ $t('general.latlong.west') }}</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('general.latlong.picker') }}</label>
							<div class="col-lg-10">
								<v-map :zoom="map.zoom" :center="map.center" v-on:l-click="mapClicked" style="height: 30em">
									<v-tilelayer :url="map.url" :attribution="map.attribution"></v-tilelayer>
									<v-marker :lat-lng="map.marker"></v-marker>
								</v-map>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.usage.title') }}</label>
							<div class="col-lg-10">
								<select class="form-control" v-model="form.usage">
									<option value="personal">{{ $t('transmitter.new.usage.personal') }}</option>
									<option value="widerange">{{ $t('transmitter.new.usage.widerange') }}</option>
								</select>
								<span class="help-block">{{ $t('transmitter.new.usage.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.antennatype.title') }}</label>
							<div class="col-lg-5">
								<select class="form-control" v-model="form.antenna.type">
									<option value="omni">{{ $t('transmitter.new.antennatype.omni') }}</option>
									<option value="directional">{{ $t('transmitter.new.antennatype.directional') }}</option>
								</select>
								<span class="help-block">{{ $t('transmitter.new.antennatype.help') }}</span>
							</div>
							<div class="col-lg-5">
								<input type="number" v-model.number="form.antenna.direction" :disabled="form.antenna.type === 'omni'" min="0" max="359" placeholder="0 - 359" class="form-control">
								<span class="help-block"><p v-html="$t('transmitter.new.antennadirection.help')"></p></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.antennatype.other') }}</label>
							<div class="col-lg-5">
								<input type="number" v-model.number="form.power" min="0" max="200" placeholder="0 - 200" class="form-control">
								<span class="help-block"><p v-html="$t('transmitter.new.other.power.help')"></p></span>
							</div>
							<div class="col-lg-5">
								<input type="number" v-model.number="form.antenna.agl" min="0" max="1000" placeholder="0 - 1000" class="form-control">
								<span class="help-block"><p v-html="$t('transmitter.new.other.antennalevel.help')"></p></span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-lg-5 col-lg-offset-2">
								<input type="number" v-model.number="form.antenna.gain" min="-50" max="80" placeholder="-50 - 80" class="form-control">
								<span class="help-block"><p v-html="$t('transmitter.new.other.antennagain.help')"></p></span>
							</div>
							<div class="col-lg-5">
								<input type="number" v-model.number="form.identificationAddress" min="0" max="2097151" placeholder="0 - 2097151" class="form-control">
								<span class="help-block"><p v-html="$t('transmitter.new.other.txidentric.help')"></p></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('transmitter.new.timeslots.title') }}</label>
							<div class="col-lg-10">
								<table style="width: 100%">
									<tbody style="text-align: center">
										<tr>
											<td>0</td>
											<td>1</td>
											<td>2</td>
											<td>3</td>
											<td>4</td>
											<td>5</td>
											<td>6</td>
											<td>7</td>
											<td>8</td>
											<td>9</td>
											<td>A</td>
											<td>B</td>
											<td>C</td>
											<td>D</td>
											<td>E</td>
											<td>F</td>
										</tr>
										<tr>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="0"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="1"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="2"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="3"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="4"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="5"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="6"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="7"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="8"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="9"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="a"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="b"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="c"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="d"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="e"></td>
											<td><input type="checkbox" v-model="form.timeslots" class="timeslotCheckBox" value="f"></td>
										</tr>
									</tbody>
								</table>
								<span class="help-block">{{ $t('transmitter.new.timeslots.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('general.owner') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.owners" :options="formData.users" :multiple="true" :close-on-select="false" :hide-selected="true" :clear-on-select="true" placeholder="Type to search"></multiselect>
								<span class="help-block">{{ $t('transmitter.new.owner.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-lg-10 col-lg-offset-2">
								<button type="submit" @click="submitForm" class="btn btn-primary">{{ $t('general.submit') }}</button>
								<router-link to="/transmitters">
									<button class="btn btn-default">{{ $t('general.abort') }}</button>
								</router-link>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vue2Leaflet from 'vue2-leaflet';
	import 'leaflet/dist/leaflet.css';
	Vue.component('v-map', Vue2Leaflet.Map);
	Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
	Vue.component('v-marker', Vue2Leaflet.Marker);

	export default {
		created() {
			this.$http.get(this.$store.getters.url.hamnetDb, {
				before(request) {
					request.headers.delete('Authorization');
				}
			}).then(response => {
				response.body.data.forEach(entry => {
					this.formData.hamnetDb.all.push({
						name: entry.callsign + ' - ' + entry.name,
						callsign: entry.callsign,
						latitude: entry.latitude,
						longitude: entry.longitude
					});
				});
			});

			this.$http.get('users/_usernames').then(response => {
				this.formData.users = response.body;
			});

			// load data of given id
			if (this.$route.params.id) {
				this.$http.get('transmitters/' + this.$route.params.id).then(response => {
					this.editing = true;

					let timeslots = [];
					if (response.body.timeslots && response.body.timeslots.length == 16) {
						for (let i = 0; i < 16; i++) {
							if (response.body.timeslots[i]) {
								timeslots.push(i.toString(16));
							}
						}
					}

					let owners = [];
					response.body.owners.forEach(owner => {
						owners.push(owner);
					});

					this.form.id = response.body._id;
					this.form.auth_key = response.body.auth_key;
					this.form.latitude.value = Math.abs(response.body.coordinates[0]);
					this.form.latitude.orientation = (response.body.coordinates[0] >= 0 ? 1 : -1);
					this.form.longitude.value = Math.abs(response.body.coordinates[1]);
					this.form.longitude.orientation = (response.body.coordinates[1] >= 0 ? 1 : -1);
					this.form.power = response.body.power;
					this.form.usage = response.body.usage;
					this.form.antenna = response.body.antenna;
					this.form.timeslots = timeslots;
					this.form.owners = owners;

					// center location picker to transmitter
					this.map.center = [this.form.latitude.value * this.form.latitude.orientation, this.form.longitude.value * this.form.longitude.orientation];
				}, response => {
					this.$router.push('/transmitters');
				});
			}
		},
		data() {
			return {
				editing: false,
				form: {
					id: '',
					auth_key: '',
					latitude: {
						value: 0,
						orientation: 1
					},
					longitude: {
						value: 0,
						orientation: 1
					},
					power: 0,
					usage: 'personal',
					antenna: {
						type: 'omni',
						agl: 0,
						direction: 0,
						gain: 0,
					},
					id_ric: 8,
					timeslots: [],
					owners: []
				},
				passwordVisible: false,
				formData: {
					hamnetDb: {
						all: [],
						selected: {}
					},
					users: []
				},
				map: {
					zoom: this.$store.getters.map.zoom,
					center: this.$store.getters.map.center,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
					url: this.$store.getters.url.map,
					marker: {
						lat: 0,
						lng: 0
					}
				}
			};
		},
		methods: {
			submitForm(event) {
				event.preventDefault();

				// check for input in all fields
				if (!this.$helpers.checkForInput(this, this.form)) {
					return false;
				}

				// prevent anything but A-Z, a-z, 0-9 as password
				if (this.form.auth_key.match(/[^A-Za-z0-9]/g)) {
					this.$dialogs.passwordError(this);
					return false;
				}

				// check if location is valid
				if (this.form.latitude.value === '' || this.form.longitude.value === '') {
					this.$dialogs.locationError(this);
					return false;
				}

				let ownerNames = [];
				this.form.owners.forEach(owner => {
					ownerNames.push(owner.name);
				});

				let body = {
					auth_key: this.form.auth_key,
					coordinates: [
						this.form.latitude.value * this.form.latitude.orientation,
						this.form.longitude.value * this.form.longitude.orientation,
					],
					power: this.form.power,
					usage: this.form.usage,
					antenna: {
						agl: this.form.antenna.agl,
						type: this.form.antenna.type,
						direction: this.form.antenna.direction,
						gain: this.form.antenna.gain,
					},
					id_ric: this.form.identificationAddress,
					timeslots: this.form.timeslot.sort().join(''),
					owners: ownerNames
				};

				this.$helpers.checkForOverwritingAndSend(this, this.$route.params.id, 'transmitters/' + this.form.name, body, '/transmitters');
			},
			mapClicked(e) {
				this.map.marker = {
					lat: e.latlng.lat,
					lng: e.latlng.lng
				};

				// set position in form
				this.form.latitude.value = Math.abs(e.latlng.lat).toFixed(6);
				this.form.latitude.orientation = (e.latlng.lat >= 0 ? 1 : -1);
				this.form.longitude.value = Math.abs(e.latlng.lng).toFixed(6);
				this.form.longitude.orientation = (e.latlng.lng >= 0 ? 1 : -1);
			},
			locationChanged() {
				this.map.marker = {
					lat: this.form.latitude.value * this.form.latitude.orientation,
					lng: this.form.longitude.value * this.form.longitude.orientation
				};
			}
		},
		watch: {
			'formData.hamnetDb.selected': function(val) {
				this.form.name = val.callsign;
				this.form.latitude.value = Math.abs(val.latitude).toFixed(6);
				this.form.latitude.orientation = (val.latitude >= 0 ? 1 : -1);
				this.form.longitude.value = Math.abs(val.longitude).toFixed(6);
				this.form.longitude.orientation = (val.longitude >= 0 ? 1 : -1);
			},
			'form.latitude.value': function() {
				this.locationChanged();
			},
			'form.latitude.orientation': function() {
				this.locationChanged();
			},
			'form.longitude.value': function() {
				this.locationChanged();
			},
			'form.longitude.orientation': function() {
				this.locationChanged();
			}
		}
	};
</script>

<style scoped>

</style>
