<template>
	<div class="q-pa-md row items-start q-gutter-md">
		<div class="text-h6 col-12">General</div>
			<UserId />
			<TimeZone />
			<SummaryInterval />
	</div>
	<div class="q-pa-md row items-start q-gutter-md">
		<div class="text-h6 col-12">App</div>
			<DarkMode />
			<Privacy />
	</div>
	<div class="q-pa-md row items-start q-gutter-md">
		<div class="text-h6 col-12">Dashboard</div>
			<DashboardCardsInfo />
			<DashboardCardsDisplay />
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import UserId from 'components/Settings/UserId.vue'
import DarkMode from 'components/Settings/DarkMode.vue'
import DashboardCardsInfo from 'components/Settings/DashboardCardsInfo.vue'
import DashboardCardsDisplay from 'components/Settings/DashboardCardsDisplay.vue'
import TimeZone from 'components/Settings/TimeZone.vue'
import SummaryInterval from 'components/Settings/SummaryInterval.vue'
import Privacy from 'components/Settings/Privacy.vue'

export default defineComponent({
	name: 'Settings',
	components: {
		UserId,
		DarkMode,
		DashboardCardsInfo,
		DashboardCardsDisplay,
		TimeZone,
		SummaryInterval,
		Privacy,
	},
	created() {
		this.$store.dispatch('setHeadline', {text: 'Dobby Settings', icon: 'fal fa-sliders-h'})
	},
})
</script>

<style lang="sass" scoped>
	.q-card
		min-width: 320px
		min-height: 200px

	body.screen--xs
		.q-card
			width: 100%
			min-width: inherit

	body.screen--sm
		.q-card
			width: 47%
			min-width: inherit

	body.screen--md
		.q-card
			width: 31%

	body.screen--lg
		.q-card
			width: 23%

	body.screen--xl
		.q-card
			width: 23%
</style>
