<template>
	<q-card flat :class="{ 'bg-dark text-white': darkMode }">

		<div class="q-pa-md">
			<div class="text-h5 q-mb-md">
				Set Up Phone Calls <q-icon :name="icon" color="primary" />
			</div>
			<p class="text-body1">
				Dobby can call you. That's very useful during the night when most iOS smart phones don't show notifictaions - But they'll let calls go through.
			</p>

			<p>
				Dobby Call is a premium service because Dobby has to pay a fee to his phone provider to make calls. To make things easy, Dobby accepts DFI as a pre-paid payment. Thankfully, DeFiChains master node community accepted Dobby's Community Fund Proposal which helps bringing the <b>fees to a lower level</b> and make <b>a free test call</b> to ensure everything is working properly. You can fund your account with some DFI after setting up Dobby Call.
			</p>

			<p v-if="hasGatewayType('phone')">
				You currently receive calls at <span class="text-h6 text-primary">{{ gatewayType('phone').value }}</span>
			</p>

			<p v-if="hasGatewayType('phone')">
				You can change that number to another one:
			</p>

			<p>
				<q-input
					type="tel"
					outlined
					label="your phone number incl. county code"
					hint="+4913371337 or +1420691337"
					v-model="phoneNumber"
				/>
				<q-input
					type="email"
					outlined
					label="email address"
					hint="dobby@defichain-dobby.com"
					v-model="phoneNumber"
				/>
				<q-input
					type="text"
					outlined
					label="DeFiChain depostit address"
					hint="The DFI address from where you'll send your DFI to dobby"
					v-model="phoneNumber"
				/>
			</p>

			<q-item tag="label" v-ripple>
        <q-item-section avatar top>
          <q-checkbox v-model="consent" color="accent" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dobby Call is not free</q-item-label>
          <q-item-label caption>
            I understand that Dobby Call is a premium feature which will cost <b>0.5 DFI/call</b>. I also understand that calls will not be done until I fund my Dobby account with some pre-paid DFI.
          </q-item-label>
        </q-item-section>
      </q-item>

			<p>
				<q-btn
					unelevated
					rounded
					class="full-width"
					:icon="icon"
					label="Set phone number"
					color="primary"
					@click="setPhoneNumber()"
					:loading="loading"
					:disable="!consent || !isPhoneNumber"
				/>
			</p>

			<p v-if="done">
				New number has been saved successfully.
			</p>

		</div>
	</q-card>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
	name: 'PhoneChannelSetup',
	data() {
		return {
			consent: false,
			icon: 'fa-light fa-phone-rotary',
			phoneNumber: null,
			loading: false,
			done: false,
		}
	},
	methods: {
		setPhoneNumber() {
			// check if phone number is valid
			if (!this.isPhoneNumber) {
				this.$q.notify({
					group: 'userInputError',
					type: 'negative',
					message: 'This is not a telephone number, sir',
					timeout: 5000,
				})
				return
			}
			if (process.env.DEV) { console.log("[DEBUG] Phone number looks valid: " + this.phoneNumber) }

			this.loading = true

			// check if phone number is already set and has to be changed
			if (typeof this.gatewayType('phone') == 'object' && 'gatewayId' in this.gatewayType('phone')) {
				if (process.env.DEV) { console.log("[DEBUG] there's already an active phone gateway: ID#" + this.gatewayType('phone').gatewayId) }
				this.$q.notify({
					group: 'userQuestion',
					type: 'warning',
					message: 'You are about to change you existing phone number. This will not qualify for another free test call. Do you want to proceed?',
					timeout: 50000,
					actions: [
						{
							label: 'Yes, change phone number',
							color: 'white',
							icon: 'fa-light fa-circle-check',
							handler: () => this.savePhoneNumber(),
						},
					]
				})
				this.$api.delete('user/gateways', { data: { 'gateway_id': this.gatewayType('phone').gatewayId } })
			} else {
				this.savePhoneNumber()
			}
		},

		savePhoneNumber() {
			this.$api
				.post('user/gateways', {type: 'phone', value: this.phoneNumber})
				.then((result) => {
					setTimeout(() => {
						this.loading = false
						this.done = true
						this.phoneNumber = null
						if (process.env.DEV) { console.log("[DEBUG] created new phone gateway: " + this.phoneNumber) }
					}, 500)
					this.fetchGateways()
				})
				.catch((error) => {
					this.$q.notify({
						group: 'apiError',
						type: 'negative',
						message: 'Something went wrong',
						timeout: 60000,
					})
				})
		},

		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
		})
	},
	computed: {
		isPhoneNumber: function () {
			return String(this.phoneNumber)
				.match(/^\+(?:[0-9] ?){6,14}[0-9]$/)
		},
		isEmailAddress(string) {
			return String(string)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		},
		darkMode: function () {
			return this.$q.dark.isActive
		},
		...mapGetters({
			isDemo: 'account/isDemo',
			userId: 'account/userId',
			hasGatewayType: 'notifications/hasGatewayType',
			gatewayType: 'notifications/gatewayType',
			settingValue: 'settings/value',
		}),
	}
}
</script>

<style>

</style>
