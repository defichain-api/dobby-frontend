<template>
	<q-card flat>

		<q-card-section class="text-body1">
			Your Transactions
		</q-card-section>

		<q-card-section>
			Payments
			<q-list bordered separator>
				<q-item v-for="payment in payments" :key="payment.booked_at">
					<q-item-section avatar>
						<q-item-label caption class="text-center">
							<div class="text-h6">
								-{{ payment.amountDfi.toLocaleString(locale, numberFormats.twoDecimals) }}
							</div>
							<div>
								DFI
							</div>
						</q-item-label>
					</q-item-section>
					<q-item-section>
						<q-item-label caption>
							{{ moment(payment.booked_at).format('MMMM Do YYYY, h:mm:ss a') }}
						</q-item-label>
						<q-item-label v-if="!privacy">{{ payment.reason }}</q-item-label>
					</q-item-section>
					<q-item-section side>
						<q-icon name="fa-light fa-file-invoice-dollar" color="negative" />
					</q-item-section>
				</q-item>
			</q-list>
		</q-card-section>

		<q-card-section>
			Deposits
			<q-list bordered separator>
				<q-item v-for="deposit in deposits" :key="deposit.txid">
					<q-item-section avatar>
						<q-item-label caption class="text-center">
							<div class="text-h6">
								+
								<span v-if="!privacy">{{ deposit.amountDfi.toLocaleString(locale, numberFormats.twoDecimals) }}</span>
								<span v-else>🧦</span>
							</div>
							<div>
								DFI
							</div>
						</q-item-label>
					</q-item-section>
					<q-item-section>
						<q-item-label caption>
							{{ moment(deposit.received_at).format('MMMM Do YYYY, h:mm:ss a') }}
						</q-item-label>
						<q-item-label caption v-if="!privacy">From: {{ deposit.senderAddress }}</q-item-label>
						<q-item-label caption v-else>From: 🧦🧦🧦</q-item-label>
						<q-item-label caption>TX: <a :href="'https://defiscan.live/transactions/' + deposit.txid" class="text-primary">view on DeFiScan</a></q-item-label>
					</q-item-section>
					<q-item-section side class="q-pl-none">
						<q-icon name="fa-light fa-coins" color="positive" />
					</q-item-section>
				</q-item>
			</q-list>
		</q-card-section>

	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: 'PhoneTransactions',
	created() {
		this.moment = moment
	},
	computed: {
		locale: function() {
			return this.$root.$i18n.locale
		},
		privacy() {
			return this.settingValue('uiPrivacyEnabled')
		},
		...mapGetters({
			settingValue: 'settings/value',
			numberFormats: 'settings/numberFormats',
			deposits: 'notifications/phoneDeposits',
			payments: 'notifications/phonePayments',
		}),
	}
}
</script>
