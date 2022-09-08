<template>
	<q-card flat>
		<q-card-section>
			<div class="row items-center no-wrap">
				<div class="col text-h6 ellipsis">
					<q-icon name="fa-light fa-percent" size="sm" class="q-mr-sm" />
					DUSD Interest rates
				</div>

				<div class="col-auto">
					<q-toggle
						class="col-3 text-center"
						v-model="enabled"
						size="xl"
						checked-icon="fa-light fa-check"
						unchecked-icon="fa-light fa-xmark"
						color="primary"
						keep-color
					/>
				</div>
			</div>
		</q-card-section>
		<q-card-section class="q-pt-none">
			<p class="text-left">
				Receive a Telegram message when DUSD interest rate rises<span v-if="enabled"> above...</span>
			</p>
		</q-card-section>
		<q-card-section class="q-pt-none" v-if="enabled">
			<div class="row">
				<div class="col-3">
					<q-input
						:type="($q.platform.is.mobile) ? 'number' : ''"
						v-model="triggerRatio"
						dense
						outlined
						debounce="1000"
						suffix="%"
					/>
				</div>
				<div class="col-8" style="padding-top: 5px;">
					<q-slider
						class="q-pl-md"
						thumb-size="30px"
						v-model="triggerRatio"
						:min="minSetting"
						:max="maxSetting"
					/>
				</div>
			</div>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn
				v-if="newTriggerRatioValue >= minSetting && newTriggerRatioValue <= maxSetting"
				@click="save()"
				:disabled="saving"
				outline
				rounded
				class="full-width"
			>
				<q-icon v-if="!savingDone" left name="fa-light fa-save" />
				<div v-if="!savingDone">save</div>
				<q-icon v-if="savingDone" left name="fa-light fa-check" />
			</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
export default {
	name: "InterestRateWarning",
	data() {
		return {
			settingName: "informDusdInterestRate",
			appearDisabledSetting: 999,
			newTriggerRatioValue: null,
			saving: false,
			savingDone: false,
			coldSetting: -20,
			minSetting: -100,
			maxSetting: 15,
		}
	},
	methods: {
		save() {
			this.$store
				.dispatch('settings/setToAccount', { key: this.settingName, value: this.newTriggerRatioValue })
				.then(() => {
					this.savingDone = true
					setTimeout(() => {
						this.newTriggerRatioValue = null
						this.savingDone = false
					}, 1000)
				})
		},
		saveDirectly() {
			this.$store.dispatch('settings/setToAccount', { key: this.settingName, value: this.triggerRatio })
		}
	},
	computed: {
		enabled: {
			get: function () {
				return this.triggerRatio < this.appearDisabledSetting
			},
			set: function (newSetting) {
				if (newSetting === true && this.triggerRatio == this.appearDisabledSetting) {
					this.triggerRatio = this.coldSetting
				}
				if (newSetting === false) {
					this.triggerRatio = this.appearDisabledSetting
				}
				this.saveDirectly()
			},
		},
		triggerRatio: {
			get: function() {
				if (this.newTriggerRatioValue != null) {
					return this.newTriggerRatioValue
				}
				return this.$store.getters['settings/value'](this.settingName) || this.appearDisabledSetting
			},
			set: function(newSetting) {
				if ((newSetting >= this.minSetting && newSetting <= this.maxSetting) || this.appearDisabledSetting ) {
					this.newTriggerRatioValue = newSetting
				} else {}
			}
		},
	},
}
</script>

<style>

</style>
