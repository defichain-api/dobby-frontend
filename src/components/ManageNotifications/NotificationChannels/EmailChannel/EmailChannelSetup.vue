<template>
	<q-dialog
		persistent
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<q-card :class="{ 'bg-dark text-white': darkMode }">
			<q-bar class="bg-primary-dark">
				<q-space />

				<q-btn dense flat icon="close" color="white" v-close-popup>
					<q-tooltip class="bg-primary text-white">Close</q-tooltip>
				</q-btn>
			</q-bar>
			<div class="q-pa-md">
				<div class="text-center">
					<q-avatar :icon="emailIcon" color="primary" text-color="white" size="xl" />
				</div>
				<div class="text-h5 q-my-md text-center">
					Get notified via Email
				</div>
				<q-separator />
				<p class="text-body1 q-mt-md">
					Dobby remembers the old days when email was the hot thing in the brand-new Internet.
					If you've been born after the year 2000, you might not have such an emotional connection to this ancient stuff.
					But hey, it's better than carrier pigeons. (But way less cooler than owls!)
				</p>
				<p>
					Anyway, you can get notified via email. Set it up here and you're good to go.
				</p>

				<p v-if="hasGatewayType('mail')">
					You currently receive email notifications at <span class="text-h6 text-primary">{{ gatewayType('mail').value }}</span>
				</p>

				<p v-if="hasGatewayType('mail')">
					You can change that email address to another one:
				</p>

				<p>
					<q-input
						type="email"
						outlined
						label="something like socks@defichain-dobby.com"
						v-model="emailAddress"
					/>
					</p>
					<p>
					<q-input
						type="email"
						outlined
						label="repeat email address"
						v-model="emailAddressRepeat"
					/>
				</p>

				<p>
					<q-btn
						unelevated
						rounded
						class="full-width"
						:icon="emailIcon"
						label="Set Email Address"
						color="primary"
						@click="setEmailAddress()"
						:loading="loading"
						:disable="emailAddress != emailAddressRepeat || emailAddress == null"
					/>
				</p>

				<p v-if="done">
					Done! You should have received an email.
				</p>

			</div>
		</q-card>
	</q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
	name: 'EmailChannelSetup',
	data() {
		return {
			sentTestMessage: false,
			receivedTestMessage: null,
			showContact: false,
			emailIcon: 'fa-light fa-envelope',
			emailAddress: null,
			emailAddressRepeat: null,
			loading: false,
			done: false,
		}
	},
	methods: {
		isEmailAddress(string) {
			return String(string)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		},
		setEmailAddress() {
			// check if email address is valid
			if (!this.isEmailAddress(this.emailAddress)) {
				this.$q.notify({
					group: 'userInputError',
					type: 'negative',
					message: 'This is not an email addess, sir',
					timeout: 5000,
				})
				return
			}
			if (process.env.DEV) { console.log("[DEBUG] email address looks valid: " + this.emailAddress) }

			this.loading = true

			if (typeof this.gatewayType('mail') == 'object' && 'gatewayId' in this.gatewayType('mail')) {
				if (process.env.DEV) { console.log("[DEBUG] there's already an active email gateway: ID#" + this.gatewayType('mail').gatewayId + " | removing gateway") }
				this.$api.delete('user/gateways', { data: { 'gateway_id': this.gatewayType('mail').gatewayId } })
			}


			// make API call to set new email notification gateway
			this.$api
				.post('user/gateways', {type: 'mail', value: this.emailAddress})
				.then((result) => {
					setTimeout(() => {
						this.loading = false
						this.done = true
						this.testEmailChannel()
						this.emailAddress = null
						this.emailAddressRepeat = null
						if (process.env.DEV) { console.log("[DEBUG] created new email gateway: " + this.emailAddress) }
					}, 1500)
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

		testEmailChannel() {
			this.$api.post("/user/gateways/test", { 'type': 'mail' })
				.then((result) => {
					this.$q.notify({
						group: 'gatewayTest',
						type: 'positive',
						message: 'Dobby should have said hello at ' + this.gatewayType('mail').value + ' :)',
					})
				})
		},

		toTelegramGroup() {
			openURL(process.env.TELEGRAM_GROUP_LINK)
		},

		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
		})
	},
	computed: {
		darkMode: function () {
			return this.$q.dark.isActive
		},
		...mapGetters({
			isDemo: 'account/isDemo',
			userId: 'account/userId',
			hasGatewayType: 'notifications/hasGatewayType',
			gatewayType: 'notifications/gatewayType',
		}),
	}
}
</script>

<style>

</style>
