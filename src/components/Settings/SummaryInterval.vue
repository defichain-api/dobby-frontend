<template>
	<q-card flat>

		<q-card-section>
			<div class="row items-center no-wrap">
					<div class="col">
							<div class="text-primary text-h6">{{ $t('Summaries') }}</div>
					</div>
					<transition appear enter-active-class="animated flipInY" leave-active-class="animated flipOutY" :duration="2000">
						<div class="col-auto" v-show="savingDone">
							<span class="text-body">
								saved
								<q-icon class="q-ml-sm" name="fa-light fa-cloud-check" size="sm" color="positive" />
							</span>
						</div>
					</transition>
			</div>
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
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex'

/*
const NONE = 'none';
	const DAILY_ONCE = 'daily';
	const DAILY_TWICE = 'daily_2x';
	const DAILY_THRICE = 'daily_3x';
	const HOURLY = 'hourly';


*/
export default defineComponent({
	name: 'SummaryIntervalSetting',
	data() {
		return {
			settingName: 'summaryInterval',
			currentSetting: null,
			availableOptions: [
				{
					value: 'none',
					label: 'Never receive summary messages',
				},
				{
					value: 'daily',
					label: '1x daily: At the morning',
				},
				{
					value: 'daily_2x',
					label: '2x daily: In the morning and evening',
				},
				{
					value: 'daily_3x',
					label: '3x daily: In the morning, during lunch time and in the evening',
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
	created() {
		this.currentSetting = this.settingValue(this.settingName)
	},
	watch: {
		currentSetting(newSetting) {

			// Don't dispatch when setting a value first because this is the initial setting
			if (this.firstSet) {
				this.firstSet = false
				return
			}

			this.saving = true
			this.$store
				.dispatch('settings/setToAccount', { key: this.settingName, value: newSetting })
				.then(() => {
					this.saving = false
					this.savingDone = true
				})
		},
		savingDone(newVal) {
			if (newVal == true) {
				setTimeout(() => {
					this.savingDone = false
				}, 2000)
			}
		},
	},
	computed: {
		...mapGetters({
			settingValue: 'settings/value',
		}),
	},
})
</script>

<style lang="sass">

</style>
