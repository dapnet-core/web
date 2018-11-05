<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<v-card class="elevation-12">
					<v-toolbar>
						<v-toolbar-title>{{ $t('navigation.login') }}</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form @keyup.native.enter="submitForm">
							<v-text-field
								prepend-icon="person"
								name="username"
								v-model="username"
								v-bind:label="$t('login.username')"
								type="text">
							</v-text-field>
							<v-text-field
								id="password"
								prepend-icon="lock"
								name="password"
								v-model="password"
								v-bind:label="$t('login.password')"
								type="password">
							</v-text-field>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="primary"
							@click="submitForm"
							type="submit"
						>
							{{ $t('general.submit') }}</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
<!--

						<info-error :message="errorMessage"></info-error>

						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('login.username') }}</label>
							<div class="col-lg-10">
								<input type="text" v-model="username" class="form-control" placeholder="Username">
							</div>
						</div>
						<div class="form-group">
							<label class="col-lg-2 control-label">{{ $t('login.password') }}</label>
							<div class="col-lg-10">
								<input type="password" v-model="password" class="form-control" placeholder="Password">
							</div>
						</div>
						<div class="form-group">
							<div class="col-lg-10 col-lg-offset-2">
								<button type="submit" @click="submitForm" class="btn btn-primary">{{ $t('general.submit') }}</button>
							</div>
						</div>
					</fieldset>
				</form>
			</div>

			<div class="col-lg-4">
				<h2>{{ $t('general.information') }}</h2>
				<p v-html="$t('login.information.help')"></p>
			</div>
		</div>
	</div>
	-->
</template>

<script>
	export default {
		created() {
			// check if already logged in
			if (this.$store.getters.isUserLoggedIn) {
				this.$router.push('/');
			}
		},
		data() {
			return {
				errorMessage: '',
				username: '',
				password: ''
			};
		},
		methods: {
			submitForm(event) {
				// event.preventDefault();
				// request given users data to validate credentials
				this.$axios.post('auth/users/login', {
					username: this.username,
					password: this.password
				}).then(response => {
					// success --> save credentials and go to home
					this.$store.commit('login', {
						user: response.data.user,
						permissions: response.data.permissions,
						auth: btoa(this.username + ':' + this.password)
					});
					this.$router.push('/');
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
</script>

<style scoped>

</style>
