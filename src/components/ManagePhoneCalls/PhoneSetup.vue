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
				<div class="text-center" :class="{'q-ml-xl': configuredPhoneNumber != 'not set' }">
					<q-avatar :icon="icon" color="primary" text-color="white" size="xl" />
				</div>
			</q-item-section>
			<q-item-section side top v-if="configuredPhoneNumber != 'not set'">
				<q-btn @click="showDescription = !showDescription" flat dense rounded icon="fa-light fa-circle-question" />
			</q-item-section>
		</q-item>

		<q-item class="q-pt-none">
			<q-item-section>
				<div class="text-h5 q-mb-md q-mt-sm text-center">
					Get called by Dobby
				</div>
				<q-separator />
			</q-item-section>
		</q-item>

		<q-card-section>

			<q-slide-transition>
				<div v-show="descriptionVisible">
					<p class="text-body1">
						Dobby can call you. That's very useful during the night when most iOS smart phones don't show notifictaions - But they'll let calls push through.
					</p>

					<p>
						Dobby Call is a premium service because Dobby has to pay a fee to his phone provider to make calls. To make things easy, Dobby accepts DFI as a pre-paid payment. Thankfully, DeFiChains master node community accepted Dobby's Community Fund Proposal which helps bringing the <b>fees to a lower level</b> and make <b>a free test call</b> to ensure everything is working properly. You can fund your account with some DFI after setting up Dobby Call.
					</p>

					<q-separator class="q-my-md"/>
				</div>
			</q-slide-transition>

			<p v-if="hasGatewayType('phone')">
				You currently receive calls at <span class="text-h6 text-primary">{{ gatewayType('phone').value }}</span>
			</p>

			<p v-if="hasGatewayType('phone')">
				You can change that number to another one, as well as your email address.
			</p>
			<p v-if="hasGatewayType('phone') && !freeCallAvailable">
				Please note: <i class="text-primary">Changing your phone number will not qualify for another free test call.</i>
			</p>

			<p class="q-mb-none">
				<q-input
					type="tel"
					outlined
					label="your phone number incl. county code"
					:hint="(phoneNumber.length == 0) ? 'something like +4913371337 or +1420691337' : ''"
					v-model="phoneNumber"
				/>
				<q-input
					type="email"
					outlined
					label="email address"
					:hint="(!isEmailAddress(depositInfoMail)) ? 'something like dobby@defichain-dobby.com' : ''"
					v-model="depositInfoMail"
					class="q-mt-md q-pb-none"
					debounce="500"
				>
					<template v-slot:append>
						<q-btn class="text-caption" no-caps dense flat @click="showWhyEmail = !showWhyEmail">
							why email?
						</q-btn>
					</template>
				</q-input>
			</p>

			<q-slide-transition>
				<q-item-label v-if="showWhyEmail" class="q-mt-md">
						<div class="text-h6">
							Why do I have to provide an Email address?
						</div>
						<p class="q-mt-sm">
							Because Dobby may have to reach out to you for some important reason.
							Especially when your funds are getting too low. We just don't want to
							rely on Telegram for such an important topic. You'll also receive an
							email when new funds have been transferred to your call balance.
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

				let message = `You are about to change your existing phone number from ${this.configuredPhoneNumber} to ${this.phoneNumber}.`
				message = (this.freeCallAvailable) ? message : message + ' Since you already recieved a free test call, this will not qualify for new one. Do you want to proceed?'

				if (process.env.DEV) { console.log("[DEBUG] there's already an active phone gateway: ID#" + this.gatewayType('phone').gatewayId) }

				this.$q.notify({
					group: 'userQuestion',
					type: 'warning',
					message: message,
					timeout: 50000,
					actions: [
						{
							label: 'Yes, change phone number',
							color: 'white',
							icon: 'fa-light fa-circle-check',
							handler: () => {
								this.$api.delete('user/gateways', { data: { 'gateway_id': this.gatewayType('phone').gatewayId } })
								this.savePhoneNumber()
							},
						},
					],
					onDismiss: () => {
						this.loading = false
					}
				})
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
						//this.phoneNumber = ''
						if (process.env.DEV) { console.log("[DEBUG] created new phone gateway: " + this.phoneNumber) }
					}, 500)
					this.fetchGateways()
					this.fetchPhoneData()
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

		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
			fetchPhoneData: 'notifications/fetchPhoneData',
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
				console.log(this.configuredPhoneNumber)
				return (this.configuredPhoneNumber == 'not set')
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

				return this.gatewayType('phone')?.value ?? ''
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
			callPrice: 'notifications/phoneCostCall',
			freeCallAvailable: 'notifications/phoneFreeCallAvailable',
		}),
	}
}
</script>

<style>

</style>
