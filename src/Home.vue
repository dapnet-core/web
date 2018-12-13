<template>
    <v-container>
        <v-layout
                text-xs-center
                wrap
        >
            <v-flex mb-4>
                <h1 class="display-2 font-weight-bold mb-3">
                    {{ $t('navigation.home') }}
                </h1>
				<v-btn
					@click="sendEvent"
				>
				Test send event
				</v-btn>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>

	export default {
		components: {},
		methods: {
			sendEvent() {
				this.$root.$emit('ReloadSidebarIcons');
			}
		}
	}

</script>

<style>

</style>
