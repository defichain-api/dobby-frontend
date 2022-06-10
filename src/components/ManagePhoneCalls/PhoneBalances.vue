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
					<span v-else>🧦🧦</span>
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
					<span v-else>🧦🧦</span>
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
				Please transfer some DFI to Dobby's DeFiChain account. Dobby will not call you when your collateral is too low!
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

					<div v-if="depositFromAddress" class="q-mt-md q-gutter-md">

						<q-card flat class="text-center" :class="{'bg-warning': !confirmedDepositFromAddress, 'bg-accent': confirmedDepositFromAddress}">
							<q-card-section>
								<p v-show="!confirmedDepositFromAddress">
									Make sure to send only DFI and only from the address you have set:
								</p>
								<p v-show="confirmedDepositFromAddress" class="text-h6">
									Send DFI from:
								</p>
								<p class="text-caption">
									<span v-if="!privacy">{{ depositFromAddress }}</span>
									<span v-else>🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦</span>
								</p>
								<q-checkbox
									v-show="!confirmedDepositFromAddress"
									v-model="confirmedDepositFromAddress"
									label="OK, got it!"
								/>

							</q-card-section>
						</q-card>

						<div class="full-width text-center" v-show="confirmedDepositFromAddress">
							<q-icon name="fa-light fa-arrow-down" size="xl"></q-icon>
						</div>

						<q-card flat v-show="confirmedDepositFromAddress" class="bg-accent text-center text-caption">
							<q-card-section class="q-pb-sm">
								<span class="text-h6">Send DFI to:</span>
							</q-card-section>
							<q-card-section class="q-pt-none">
								{{ fundsDepositAddress }}
								<p class="bg-white text-center q-py-lg" v-show="showDepositAddressQr">
									<qrcode-vue :value="fundsDepositAddress" :size="250" level="M" />
								</p>
								<q-btn
									rounded
									bordered
									outline
									dense
									class="full-width q-mt-md"
									color="white"
									icon="fa-light fa-clipboard-check"
									@click="toClipboard(fundsDepositAddress)"
									label="Copy address to Clipboard"
								/>
								<q-btn
									rounded
									bordered
									outline
									dense
									class="full-width q-mt-md"
									color="white"
									icon="fa-light fa-qrcode"
									@click="showDepositAddressQr = !showDepositAddressQr"
									label="Show QR Code"
								/>
							</q-card-section>
						</q-card>
						<p v-show="confirmedDepositFromAddress">
							Please send ONLY DFI! Processing the transaction may take some time. Please give it some minutes :)
						</p>
					</div>

					<div v-else>
						<p>
							Please tell Dobby from which DFI address you'll send your funds. That's
							neccessary because otherwise Dobby can't know which payment is yours.
						</p>
						<p>
							Please double-check this address! You won't be able to change it afterwards.
							Later, you'll be able to define multiple addresses.
						</p>
						<p>
							<q-input
								type="text"
								outlined
								label="DeFiChain depostit address"
								hint="The DFI address from which you'll send your DFI to Dobby's account"
								v-model="userDeFiChainAddress"
							/>
						</p>
						<p>
							<q-btn
								unelevated
								rounded
								class="full-width"
								icon="fa-light fa-house-flag"
								label="set address"
								color="primary"
								@click="setDepositFromAddress()"
								:loading="loading"
								:disable="!stringIsDfiAddress(userDeFiChainAddress)"
							/>
						</p>
					</div>

				</div>
			</q-slide-transition>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import { copyToClipboard } from 'quasar'

export default {
	name: 'ManagePhoneCalls',
	components: {
		QrcodeVue,
	},
	data() {
		return {
			userDeFiChainAddress: '',
			loading: false,

			showDepositInfo: false,
			showDepositAddressQr: false,
			confirmedDepositFromAddress: false,

			animationStep: 0,
		}
	},
	methods: {
		/**
		 * Copies a string to the clipboard
		 */
		toClipboard: function (text) {
			copyToClipboard(text)
				.then(() => {
						this.$q.notify({
							type: 'positive',
							message: 'Deposit address has been copied to your clipboard',
						})
				})
				.catch((error) => {
					console.log(error)
				})
		},

		setDepositFromAddress() {
			this.loading = true
			if (this.stringIsDfiAddress(this.userDeFiChainAddress)) {
				this.depositFromAddress = this.userDeFiChainAddress
			}
		},

		/**
		 * Checks if string is most likely a DFI address
		 */
		stringIsDfiAddress(string) {
			const isAlphaNumeric = str => /^[a-z0-9]+$/gi.test(str)

			return isAlphaNumeric(string) && (string.length == 34 || string.length == 42)
		},

	},
	computed: {
		callsLeftWarning: function() {
			return process.env.BALANCE_WARNING_CALLS
		},
		fundsDepositAddress: function() {
			return process.env.FUNDS_DEPOSIT_ADDRESS
		},
		depositFromAddress: {
			cache: false,
			get: function () {
				return this.settingValue('depositFromAddress')
			},
			set: function (address) {
				this.$store.dispatch('settings/setToAccount', { key: 'depositFromAddress', value: address })
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
			callPrice: 'notifications/phoneCostCall',
		}),
	}
}
</script>
