<template>
	<q-card flat >
		<q-card-section class="q-pb-none">
			<div class="text-h6">User Accounts</div>
		</q-card-section>
		<q-card-section>
			<div class="text-h3 text-primary">{{ this.latest.user_count.toLocaleString(locale) }}</div>
		</q-card-section>
		<q-separator inset />
		<q-card-section>
			<area-chart :data="history" :points="false" :colors="[getColor('accent')]" :download="true" style="height: 200px;"/>
		</q-card-section>
	</q-card>
</template>

<script>
import { colors } from 'quasar'
const { getPaletteColor } = colors

export default {
	name: 'UserCount',
	props: {
		statistics: {
			required: true,
		},
	},
	data() {
		return {

		}
	},
	methods: {
		getColor(name) {
			return getPaletteColor(name)
		},
	},
	computed: {
		latest: function() {
			return this.statistics[0]
		},
		history: function() {
			let collection = {}
			this.statistics.forEach(function(day) {
				collection[day.date] = day.user_count
			})
			return collection
		},
		locale: function() {
			return this.$root.$i18n.locale
		},
	}
}
</script>

<style>

</style>
