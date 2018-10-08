<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="page-header">
					<h1>{{ $t('navigation.calls') }}</h1>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-lg-9">
				<form class="form-horizontal well">
					<fieldset>
						<legend>{{ $t('calls.new.newcall') }}</legend>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('calls.new.message.title') }}</label>
							<div class="col-lg-10">
								<textarea class="form-control" rows="2" maxlength="80" v-model="form.data"></textarea>
								<span class="help-block" v-html="$t('calls.new.message.charactersremaining', { remaining: messageCharsRemaining })"></span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('navigation.subscribers') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.recipients.subscribers" :options="formData.subscribers" :multiple="true" :close-on-select="false" :hide-selected="true" :clear-on-select="true" placeholder="Type to search"></multiselect>
								<span class="help-block">{{ $t('calls.new.subscribers.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('calls.new.subscriber_groups.title') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.recipients.subscriber_groups" :options="formData.subscriber_groups" :multiple="true" :close-on-select="false" :hide-selected="true" :clear-on-select="true" placeholder="Type to search"></multiselect>
								<span class="help-block">{{ $t('calls.new.subscriber_groups.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('navigation.transmitters.title') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.distribution.transmitters" :options="formData.transmitters" :multiple="true" :close-on-select="false" :hide-selected="true" :clear-on-select="true" placeholder="Type to search"></multiselect>
								<span class="help-block">{{ $t('calls.new.transmitters.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('calls.new.transmitter_groups.title') }}</label>
							<div class="col-lg-10">
								<multiselect v-model="form.distribution.transmitter_groups" :options="formData.transmitter_groups" :multiple="true" :close-on-select="false" :hide-selected="true" :clear-on-select="true" placeholder="Type to search"></multiselect>
								<span class="help-block">{{ $t('calls.new.transmitter_groups.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('calls.new.priority.title') }}</label>
							<div class="col-lg-10">
								<label>
									<input type="number" v-model.number="form.priority" min="1" max="5" step="1" class="form-control">
								</label>
								<span class="help-block">{{ $t('calls.new.priority.help') }}</span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-lg-10 col-lg-offset-2">
								<button type="submit" @click="submitForm" class="btn btn-primary">{{ $t('general.submit') }}</button>
								<router-link to="/calls"><button class="btn btn-default">{{ $t('general.abort') }}</button></router-link>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div class="col-lg-3">
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('calls.new.information.help')"></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		created() {
			this.$http.get('subscribers/_names').then(response => {
				this.formData.subscribers = response.body;
			});

			this.$http.get('subscribers/_groups').then(response => {
				this.formData.subscriber_groups = response.body;
			});

			this.$http.get('transmitters/_names').then(response => {
				this.formData.transmitters = response.body;
			});

			this.$http.get('transmitters/_groups').then(response => {
				this.formData.transmitter_groups = response.body;
			});
		},
		data() {
			return {
				form: {
					data: this.$store.getters.user._id.toUpperCase() + ': ',
					recipients: {
						subscribers: [],
						subscriber_groups: []
					},
					distribution: {
						transmitters: [],
						transmitter_groups: []
					},
					priority: 3
				},
				formData: {
					subscribers: [],
					subscriber_groups: [],
					transmitters: [],
					transmitter_groups: []
				}
			};
		},
		computed: {
			messageCharsRemaining() {
				return 80 - this.form.data.length;
			}
		},
		methods: {
			submitForm(event) {
				event.preventDefault();

				// check for input in all fields
				if (!this.$helpers.checkForInput(this, this.form)) {
					return false;
				}

				this.$http.post('calls', this.form).then(response => {
					this.$router.push('/calls');
				}, response => {
					this.$dialogs.ajaxError(this, response);
				});
			}
		}
	};
</script>

<style scoped>

</style>
