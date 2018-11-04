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

	export default {
		name: 'Sidebar'
	};
</script>
