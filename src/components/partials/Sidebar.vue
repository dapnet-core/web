<template>
    <div>
<!--        <div>
            <clock></clock>
            <status></status>
        </div>
-->

        <v-list>
            <v-list-tile exact to="/">
                <v-list-tile-action>
                    <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ $t('navigation.home') }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile exact to="/calls">
                <v-list-tile-action>
                    <v-icon>message</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ $t('navigation.calls') }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-if="this.$store.getters.permission('user.read') === 'all'" exact to="/users">
                <v-list-tile-action>
                    <v-icon>account_box</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ $t('navigation.users') }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

			<v-list-tile
				v-if="!(this.$store.getters.permission('user.read') === 'all')"
				exact to="/usersonlynames"
			>
				<v-list-tile-action>
					<v-icon>account_box</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>{{ $t('navigation.users') }}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>

			<!-- subscribers group -->
			<v-list-group
				prepend-icon="cast"
				value="true"
			>
				<!-- subscribers Header in Menu -->
				<v-list-tile slot="activator">
					<v-list-tile-title>{{ $t('navigation.subscribers') }}</v-list-tile-title>
				</v-list-tile>
				<!-- if permission read === all, link to table -->
				<v-list-tile
					v-if="(this.$store.getters.permission('subscriber.read') === 'all')"
					exact to="/subscribers"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.subscribers"
						>
							<span slot="badge">{{ count_total.subscribers }}</span>
							<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.allsubscribers') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<!-- if !(permission read === all), link to overview -->
				<v-list-tile
					v-if="!(this.$store.getters.permission('subscriber.read') === 'all')"
					exact to="/subscribersoverview"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.total.subscribers"
						>
							<span slot="badge">{{ count_total.subscribers }}</span>
							<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ $t('navigation.allsubscribers') }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<!-- Show my subscribers -->
				<v-list-tile
					exact to="/mysubscribers"
				>
					<v-list-tile-action>
						<v-badge
							right
							overlap
							v-model="isReadyLoadingData.my.subscribers"
						>
							<span slot="badge">{{ count_my.subscribers }}</span>
								<v-icon>cast</v-icon>
						</v-badge>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>My Subscribers</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

			</v-list-group>
		</v-list>

<!--        <div class="version">Version {{version}}</div>-->
    </div>
</template>

<style scoped>
    .version {
        text-align: center;
        padding: 5px 0;
        font-size: 13px;
        opacity: .54;
    }
</style>

<script>
	import axios from 'axios';

	export default {
		name: 'Sidebar',
		created() {
			this.loadMySubscribers();
			this.loadMyTransmitters();
			this.loadTotalSubscribers();
			this.loadTotalTransmitters();
		},
		data() {
			return {
				isReadyLoadingData: {
					my: {
						subscribers: false,
						rubrics: false,
						transmitters: false,
						nodes: false
					},
					total: {
						subscribers: false,
						rubrics: false,
						transmitters: false,
						nodes: false
					}
				},
				count_my: {
					subscribers: 0,
					rubrics: 0,
					transmitters: 0,
					nodes: 0
				},
				count_total: {
					subscribers: 0,
					rubrics: 0,
					transmitters: 0,
					nodes: 0
				}
			};
		},
		computed: {
		},
		methods: {
			loadMySubscribers() {
				this.isReadyLoadingData.my.subscribers = false;
				axios.get('subscribers/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.subscribers = response.data.count;
					}
					console.log('mySubscribers: ' + this.count_my.transmitters);
					this.isReadyLoadingData.my.subscribers = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadMyTransmitters() {
				this.isReadyLoadingData.my.transmitters = false;
				axios.get('transmitters/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_my.transmitters = response.data.count;
					}
					console.log('myTransmitters: ' + this.count_my.transmitters);
					this.isReadyLoadingData.my.transmitters = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalSubscribers() {
				this.isReadyLoadingData.total.subscribers = false;
				axios.get('subscribers/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.subscribers = response.data.count;
					}
					console.log('Total Subscribers: ' + this.count_total.subscribers);
					this.isReadyLoadingData.total.subscribers = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadTotalTransmitters() {
				this.isReadyLoadingData.total.transmitters = false;
				axios.get('transmitters/_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.count_total.transmitters = response.data.count;
					}
					console.log('Total Transmitters: ' + this.count_total.transmitters);
					this.isReadyLoadingData.total.transmitters = true;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
</script>
