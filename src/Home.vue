<template>
    <v-container>
		<div id="header-carousel">
			<v-carousel
				hide-delimiters
				height="400"
				prev-icon="keyboard_arrow_left"
				next-icon="keyboard_arrow_right"
			>
				<v-carousel-item v-for="(index,i) in 10" :key="i">
					<v-layout fill-height>
						<v-flex xs7>
							<v-card
								color="grey"
								class="flexcard"
							>
								<v-card-title primary-title>
									<div>
										<h3 class="headline mb-0">{{ $t('home.carousel.' + index + '.title') }}</h3>

									</div>
								</v-card-title>
								<v-card-text>
									{{ $t('home.carousel.' + index + '.text') }}
								</v-card-text>
								<v-card-actions v-if="getLink(index) && getLink(index) !== 'NONE'">
									<a :href="getLink(index)" target="_blank">
										<v-btn large color="primary">
											External Link with more information
										</v-btn>
									</a>
								</v-card-actions>
							</v-card>
						</v-flex>
						<v-flex xs5 v-if="getLink(index) && getLink(index) !== 'NONE'">
							<a :href="getLink(index)" target="_blank">
								<v-responsive :aspect-ratio="400/400">
									<v-img
										height="400"
										:src="'./img/carousel/img' + index + '.png'"
									>
									</v-img>
								</v-responsive>
							</a>
						</v-flex>
						<v-flex xs5 v-else>
							<v-responsive :aspect-ratio="400/400">
								<v-img
									height="400"
									:src="'./img/carousel/img' + index + '.png'"
								>
								</v-img>
							</v-responsive>
						</v-flex>
					</v-layout>
				</v-carousel-item>
			</v-carousel>
		</div>
    </v-container>
</template>

<script>

	export default {
		components: {},
		methods: {
			sendEvent() {
				this.$root.$emit('ReloadSidebarIcons');
			},
			getLink(index) {
				return this.$i18n.t('home.carousel.' + index + '.link');
			}
		}
	};

</script>

<style>
	.flexcard {
		display: flex;
		flex-direction: column;
	}
</style>
