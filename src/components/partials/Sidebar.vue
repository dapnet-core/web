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
						<v-icon>cast</v-icon>
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
						<v-icon>cast</v-icon>
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
						<v-icon>cast</v-icon>
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
		},
		data() {
			return {
				isLoadingData: {
					mysubscribers : true,
					myrubrics: true,
					mytransmitters: true,
					mynodes: true
				},
				countMyObjects: {
					mysubscribers : 0,
					myrubrics: 0,
					mytransmitters: 0,
					mynodes: 0
				}
			};
		},
		methods: {
			loadMySubscribers() {
				this.isLoadingData.mysubscribers = true;
				axios.get('subscribers/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.countMyObjects.mysubscribers = response.data.count;
					}
					console.log('mySubscribers: ' + this.countMyObjects.mytransmitters);
					this.isLoadingData.mysubscribers = false;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			},
			loadMyTransmitters() {
				this.isLoadingData.mytransmitters = true;
				axios.get('transmitters/_my_count').then(response => {
					// success --> save new data
					if (response.data.count) {
						this.countMyObjects.mytransmitters = response.data.count;
					}
					console.log('myTransmitters: ' + this.countMyObjects.mytransmitters);
					this.isLoadingData.mysubscribers = false;
				}, response => {
					// error --> show error message
					this.errorMessage = this.$helpers.getAjaxErrorMessage(this, response);
				});
			}
		}
	};
</script>
