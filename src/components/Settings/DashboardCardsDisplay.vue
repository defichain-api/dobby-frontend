<template>
	<q-card flat>

		<q-card-section>
		<div class="text-primary text-h6">{{ $t('Show Dasboard Cards As...') }}</div>
		</q-card-section>

		<q-card-section class="q-pt-none text-center row">
			<div class="col-4 q-mt-md text-right" :class="{'text-grey-6': mode != false}">
				List
			</div>
			<q-toggle
				class="col-3"
				toggle-indeterminate
				indeterminate-value="auto"
				false-value="card"
				true-value="carousel"
				v-model="mode"
				size="xl"
				icon="fal fa-phone-laptop"
				checked-icon="fal fa-album-collection"
				unchecked-icon="fal fa-list-ol"
				color="primary"
				:keep-color="true"
			/>
			<div class="col-5 q-mt-md text-left" :class="{'text-grey-6': mode != true}">
				Carousel
			</div>
			<div class="full-width" :class="{'text-grey-6': mode != 'auto'}">Determined by your device.</div>
		</q-card-section>

		<q-separator inset />

		<q-card-section class="text-grey-6">
			<i><b>List</b></i>: scroll down<br />
			<i><b>Carousel</b></i>: swipe left/right<br />
			<i><b>Device</b></i>: Carousel on smarphones, list on larger devices<br />
		</q-card-section>
	</q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'DashboardCardsDisplay',
	computed: {
		mode: {
			get: function() {
				return this.$store.getters['settings/value']('uiDashboardCardsAsCarousel')
			},
			set: function(mode) {
				this.$store.dispatch('settings/setToAccount', { key: 'uiDashboardCardsAsCarousel', value: mode })
			}
		},
	},
})
</script>

<style lang="sass" scoped>

</style>
