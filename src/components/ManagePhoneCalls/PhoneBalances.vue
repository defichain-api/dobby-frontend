<template>
	<q-card flat>
		<!--
		<q-card-section class="text-body1">
			Your balance
		</q-card-section>
		-->
		<q-card-section class="text-center row q-pt-xl" :class="{ 'bg-warning text-white':  balanceWarning && !balanceTooLow, 'bg-negative text-white': balanceTooLow }">
			<div class="col-6">
				<div>your balance is</div>
				<div class="text-h2" v-if="typeof balance == 'number'">
					<span v-if="!privacy">{{ balance.toLocaleString(locale, numberFormats.twoDecimals) }}</span>
					<span v-else>🧦🧦🧦</span>
				</div>
				<div>
					DFI
				</div>
			</div>
			<div class="col-6">
				<div>
					that's <span v-if="balanceWarning && !balanceTooLow">just</span>
				</div>
				<div class="text-h2 text-accent" v-if="typeof balance == 'number'">
					<span v-if="!privacy">
						{{ Math.floor(balance / callPrice) }}
					</span>
					<span v-else>🧦🧦🧦</span>
				</div>
				<div>
					<span v-if="Math.floor(balance / callPrice) == 1">
						Call
					</span>
					<span v-else>
						Calls
					</span>
				</div>
			</div>
		</q-card-section>
		<q-card-section>
			<q-btn
				unelevated
				rounded
				:outline="!balanceTooLow"
				class="full-width"
				icon="fa-light fa-coins"
				label="Deposit DFI"
				:color="depositButtonColor"
			/>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'ManagePhoneCalls',
	computed: {
		callPrice: function() {
			return process.env.CALL_PRICE
		},
		balanceWarning: function() {
			return this.balance < 2
		},
		balanceTooLow: function() {
			return this.balance < 0.5
		},
		locale: function() {
			return this.$root.$i18n.locale
		},
		depositButtonColor: function() {
			if (this.balanceTooLow) {
				return 'negative'
			}

			if (this.balanceWarning && !this.balanceTooLow) {
				return 'warning'
			}

			return 'null'
		},
		privacy() {
			return this.settingValue('uiPrivacyEnabled')
		},
		...mapGetters({
			settingValue: 'settings/value',
			numberFormats: 'settings/numberFormats',
			balance: 'notifications/phoneBalance',
		}),
	}
}
</script>
