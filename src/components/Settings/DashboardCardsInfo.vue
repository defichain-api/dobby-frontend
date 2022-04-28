<template>
	<q-card flat>

		<q-card-section>
		<div class="text-primary text-h6">{{ $t('Information on Dashboard Cards') }}</div>
		</q-card-section>

		<q-card-section class="q-pt-none">
			<div>
				<q-toggle
					v-model="healthSummary"
					color="primary"
					icon="fal fa-heartbeat"
					label="Health Summary"
					size="xl"
				/>
			</div>
			<div>
				<q-toggle
					v-model="collateralInfo"
					color="primary"
					icon="fal fa-cauldron"
					label="Collateral Info"
					size="xl"
				/>
			</div>
			<div>
				<q-toggle
					v-model="collateralWaypoints"
					color="primary"
					icon="fal fa-telescope"
					label="Collateral Waypoints"
					size="xl"
				/>
			</div>
		</q-card-section>

	</q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex'

export default defineComponent({
	name: 'DashboardCardsInfo',
	computed: {
		healthSummary: {
			get: function() {
				return this.$store.getters['settings/value']('uiDashboardHealthSummaryEnabled')
			},
			set: function(setting) {
				this.setSetting({ key: 'uiDashboardHealthSummaryEnabled', value: setting })
			},
		},
		collateralInfo: {
			get: function() {
				return this.$store.getters['settings/value']('uiDashboardCollateralInfoEnabled')
			},
			set: function(setting) {
				this.setSetting({ key: 'uiDashboardCollateralInfoEnabled', value: setting })
			},
		},
		collateralWaypoints: {
			get: function() {
				return this.$store.getters['settings/value']('uiDashboardCollateralWaypointsEnabled')
			},
			set: function(setting) {
				this.setSetting({ key: 'uiDashboardCollateralWaypointsEnabled', value: setting })
			},
		},
	},
	methods: {
		...mapActions({
			setSetting: 'settings/setToAccount',
		}),
	},
})
</script>

<style lang="sass">

</style>
