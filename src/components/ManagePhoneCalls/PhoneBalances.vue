<template>
	<q-card flat>
		<q-card-section>
			<div class="text-h6">Your balance</div>
		</q-card-section>
		<q-card-section class="text-center" :class="{ 'bg-warning':  balanceWarning && !balanceTooLow, 'bg-negative text-white': balanceTooLow }">
			<div class="text-h2" v-if="typeof balance == 'number'">
				{{ balance.toLocaleString(locale, numberFormats.twoDecimals) }}
			</div>
			<div>
				DFI
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
		...mapGetters({
			numberFormats: 'settings/numberFormats',
			balance: 'notifications/phoneBalance',
		}),
	}
}
</script>
