<template>
	<q-card flat :class="{ 'bg-dark text-white': darkMode }">
		<q-bar v-if="dialog">
			<q-space />

			<q-btn dense flat icon="close" v-close-popup>
				<q-tooltip class="bg-white text-primary">Close</q-tooltip>
			</q-btn>
		</q-bar>
		<q-item>
				<q-item-section>
					<q-item-label header class="text-h6 q-pl-none q-py-none" :class="{'text-black': !darkMode, 'text-white': darkMode}">Set Up Phone Calls <q-icon :name="icon" color="primary" /></q-item-label>
				</q-item-section>
				<q-item-section side top v-if="this.phoneNumber">
					<q-btn @click="showDescription = !showDescription" flat dense rounded icon="fa-light fa-circle-question" />
				</q-item-section>
			</q-item>

		<q-card-section>

			<q-slide-transition>
				<div v-show="descriptionVisible">
					<p class="text-body1">
						Dobby can call you. That's very useful during the night when most iOS smart phones don't show notifictaions - But they'll let calls go through.
					</p>

					<p>
						Dobby Call is a premium service because Dobby has to pay a fee to his phone provider to make calls. To make things easy, Dobby accepts DFI as a pre-paid payment. Thankfully, DeFiChains master node community accepted Dobby's Community Fund Proposal which helps bringing the <b>fees to a lower level</b> and make <b>a free test call</b> to ensure everything is working properly. You can fund your account with some DFI after setting up Dobby Call.
					</p>
				</div>
			</q-slide-transition>

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
					v-model="depositInfoMail"
					class="q-mt-md"
					debounce="500"
				>
					<template v-slot:append>
						<q-btn class="text-caption" no-caps dense flat @click="showWhyEmail = !showWhyEmail">
							why?
						</q-btn>
					</template>
				</q-input>
			</p>

			<q-slide-transition>
				<q-item-label v-if="showWhyEmail">
						<div class="text-h6">
							Why do I have to provide an Email address?
						</div>
						<p>
							Because Dobby may have to reach out to you for some important reason.
							Especially when your funds are getting too low. We just don't want to rely
							on Telegram for such an important topic.
						</p>
				</q-item-label>
			</q-slide-transition>
		</q-card-section>

		<q-card-section class="q-py-none">
			<q-item tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="consent" color="accent" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dobby Call is not free</q-item-label>
          <q-item-label caption>
            I understand that Dobby Call is a premium feature which will cost <b>{{ callPrice }} DFI/call</b>. I also understand that calls will not be done until I fund my Dobby account with some pre-paid DFI. Refunds are not possible.
          </q-item-label>
        </q-item-section>
      </q-item>
		</q-card-section>
		<q-card-section>
			<p>
				<q-btn
					unelevated
					rounded
					class="full-width"
					:icon="icon"
					label="Set phone number & Email"
					color="primary"
					@click="setPhoneNumber(); setDepositInfoMail()"
					:loading="loading"
					:disable="!consent || !isPhoneNumber || !isEmailAddress"
				/>
			</p>

			<q-slide-transition>
				<p v-if="done" class="text-center">
					Data has been saved successfully.
				</p>
			</q-slide-transition>
		</q-card-section>
	</q-card>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'PhoneChannelSetup',
	props: {
		dialog: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			consent: false, // has the user accepted that Dobby Call is not a free service?
			icon: 'fa-light fa-phone-rotary',
			newPhoneNumber: null,
			newDepositInfoMail: null,
			loading: false,
			done: false,
			showDescription: false,
			showWhyEmail: false,
			callPrice: process.env.CALL_PRICE,
		}
	},
	methods: {
		/**
		 * Manage saving of the phone number the user wants to set
		 *
		 * Do some checks and also delete an old phone gateway if the number has been changed
		 */
		setPhoneNumber() {
			// do nothing when nothing has changed
			if (this.configuredPhoneNumber == this.phoneNumber) return

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

		/**
		 * Write phone number to API
		 */
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

		setDepositInfoMail() {
			// do nothing when nothing has changed
			if (this.settingValue('depositInfoMail') == this.depositInfoMail) return
			this.loading = true

			this.$store.dispatch('settings/setToAccount', { key: 'depositInfoMail', value: this.depositInfoMail }).then(() => setTimeout(() => {
				this.loading = false
				this.done = true
				setTimeout(() => this.done = false, 1500)
			}, 500))
		},

		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
		})
	},
	computed: {
		/**
		 * Determines if the description is visible
		 *
		 * This is used to hide the description if phone gateway is already set up. To
		 * not clutter the user with unnecessary information.
		 */
		descriptionVisible: {
			get: function () {
				if (this.showDescription) return true
				return (this.phoneNumber == false)
			},
			set: function () {

			}
		},

		/**
		 * Determines if the phone number has been set via config or as a local new value
		 */
		phoneNumber: {
			get: function () {
				if (this.newPhoneNumber != null) return this.newPhoneNumber

				return this.gatewayType('phone')?.value ?? false
			},
			set(newVal) {
				this.newPhoneNumber = newVal
			},
		},

		/**
		 * Determines if the mail address has been set via config or as a local new value
		 */
		depositInfoMail: {
			get: function (){
				if (this.newDepositInfoMail != null) return this.newDepositInfoMail

				return this.settingValue('depositInfoMail')
			},
			set: function (newVal){
				this.newDepositInfoMail = newVal
			}
		},

		/**
		 * Checks if this.phoneNumber could be a phone number
		 */
		isPhoneNumber: function () {
			return String(this.phoneNumber)
				.match(/^\+(?:[0-9] ?){6,14}[0-9]$/)
		},

		/**
		 * Checks if this.depositInfoMail could be an email address
		 */
		isEmailAddress(string) {
			return String(this.depositInfoMail)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		},

		/**
		 * Is dark mode active?
		 */
		darkMode: function () {
			return this.$q.dark.isActive
		},

		...mapGetters({
			isDemo: 'account/isDemo',
			userId: 'account/userId',
			hasGatewayType: 'notifications/hasGatewayType',
			gatewayType: 'notifications/gatewayType',
			settingValue: 'settings/value',
			configuredPhoneNumber: 'notifications/phoneNumber',
		}),
	}
}
</script>

<style>

</style>
