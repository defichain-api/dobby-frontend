<template>
	<q-card flat>

		<q-card-section>
			<div class="text-primary text-h6">{{ $t('Summaries') }}</div>
			<div class="text q-mt-sm">{{ $t('How often do you want Dobby to give you a status update?') }}</div>
		</q-card-section>

		<q-card-section class="q-pt-none text-center row">
			<q-select
				outlined
				v-model="currentSetting"
				:options="availableOptions"
				:option-label="opt => Object(opt) === opt && 'label' in opt ? opt.label : '- Null -'"
				map-options
				emit-value
				class="full-width"
				:loading="saving"
			/>
		</q-card-section>

	</q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SummaryIntervalSetting',
	data() {
		return {
			settingName: 'summaryInterval',
			availableOptions: [
				{
					value: 'none',
					label: 'Never receive summary messages',
				},
				{
					value: 'daily',
					label: '1x daily: In the morning',
				},
				{
					value: 'daily_2x',
					label: '2x daily: In the morning and evening',
				},
				{
					value: 'daily_3x',
					label: '3x daily: Morning, lunch time, evening',
				},
				{
					value: 'hourly',
					label: 'Every hour',
				},
			],
			firstSet: true,
			saving: false,
			savingDone: false,
		}
	},
	computed: {
		currentSetting: {
			get: function() {
				return this.$store.getters['settings/value'](this.settingName)
			},
			set: function(newSetting) {
				this.$store.dispatch('settings/setToAccount', { key: this.settingName, value: newSetting })
			}
		},
	},
})
</script>

<style lang="sass">

</style>
