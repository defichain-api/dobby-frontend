<template>
	<q-card flat>
		<!--
		<q-card-section class="text-body1">
			Your balance
		</q-card-section>
		-->
		<q-card-section class="text-center row q-pt-lg" :class="{ 'bg-warning text-white':  balanceWarning && !balanceTooLow, 'bg-negative text-white': balanceTooLow }">
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
				<div class="text-h2" v-if="typeof balance == 'number'">
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
			<div v-if="balanceWarning && !balanceTooLow" class="col-12 q-mt-md" >
				You should consider transferring some DFI to keep Dobby able to call you.
			</div>
			<div v-if="balanceTooLow" class="col-12 q-mt-md" >
				Please transfer some DFI to your Dobby account. Dobby will not call you when your collateral is too low!
			</div>
		</q-card-section>
		<q-card-section>
			<q-btn
				label="Deposit DFI"
				@click="showDepositInfo = !showDepositInfo"
				unelevated
				rounded
				:outline="!balanceTooLow"
				class="full-width"
				icon="fa-light fa-coins"
				:color="depositButtonColor"
			/>
			<q-slide-transition>
				<div v-show="showDepositInfo" class="q-mt-md">

					<p>
						Please transfer some DFI to this address: <br /><br />{{ fundsDepositAddress }}
					</p>

					<p class="bg-white text-center q-py-lg">
						<qrcode-vue :value="fundsDepositAddress" :size="250" level="M" />
					</p>

					<p>
						{{ depositFromAddress }}
					</p>
				</div>
			</q-slide-transition>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'

export default {
	name: 'ManagePhoneCalls',
	components: {
		QrcodeVue,
	},
	data() {
		return {
			showDepositInfo: true,
		}
	},
	computed: {
		callPrice: function() {
			return process.env.CALL_PRICE
		},
		callsLeftWarning: function() {
			return process.env.BALANCE_WARNING_CALLS
		},
		fundsDepositAddress: function() {
			return process.env.FUNDS_DEPOSIT_ADDRESS
		},
		depositFromAddress: {
			get: function () {
				return this.settingValue('depositFromAddress')
			},
			set: function (value) {
				console.log(value)
			},
		},
		balanceWarning: function() {
			return Math.floor(this.balance / this.callPrice) <= this.callsLeftWarning
		},
		balanceTooLow: function() {
			return this.balance < this.callPrice
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
