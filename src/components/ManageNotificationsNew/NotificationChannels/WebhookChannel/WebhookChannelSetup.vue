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
					<q-tooltip class="bg-primary text-whitee">Close</q-tooltip>
				</q-btn>
			</q-bar>
			<div class="q-pa-md">
				<div class="text-center">
					<q-avatar :icon="webhookIcon" color="primary" text-color="white" size="xl" />
				</div>
				<div class="text-h5 q-my-md text-center">
					Get notified via Webhook
				</div>
				<q-separator />
				<p class="text-body1 q-mt-md">
					Dobby is able to push notifications to any URL you provide. These messages contain a JSON object and all neccessary data.
					If you have no clue what this means, you won't need a webhook notification and can ignore this notification channel.
				</p>

				<p>
					See the official Dobby Repo for a documentation of what Dobby will send you to your webhook URL: <a class="text-primary" style="cursor: pointer;" @click="openUrl('https://github.com/defichain-api/dobby')">https://github.com/defichain-api/dobby <q-icon name="fa-light fa-arrow-up-right-from-square" /></a>
				</p>

				<p v-if="hasGatewayType('webhook')">
					You currently receive notifications at <span class="text-h6 text-primary">{{ gatewayType('webhook').value }}</span>
				</p>

				<p v-if="hasGatewayType('webhook')">
					You can change that URL to another one:
				</p>

				<p>
					<q-input
						type="text"
						outlined
						label="Webhook URL"
						v-model="webhookUrl"
					/>
				</p>

				<p class="text-center">
					<q-btn
						unelevated
						rounded
						class="full-width q-mb-sm"
						:icon="webhookIcon"
						label="Set webhook URL"
						color="primary"
						@click="setwebhookUrl()"
						:loading="loading"
						:disable="webhookUrl == null"
					/>
					(Dobby will send a test message immediatly)
				</p>

				<p v-if="done">
					Done! You should have received a test message.
				</p>

			</div>
		</q-card>
	</q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
	name: 'WebhookChannelSetup',
	data() {
		return {
			sentTestMessage: false,
			receivedTestMessage: null,
			showContact: false,
			webhookIcon: 'fa-light fa-cloud',
			webhookUrl: null,
			loading: false,
			done: false,
		}
	},
	methods: {
		isUrl(string) {
			return String(string)
				.toLowerCase()
				.match(
					/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
				)
		},
		setwebhookUrl() {
			// check if email address is valid
			if (!this.isUrl(this.webhookUrl)) {
				this.$q.notify({
					group: 'userInputError',
					type: 'negative',
					message: 'This is not an URL, sir',
					timeout: 5000,
				})
				return
			}
			if (process.env.DEV) { console.log("[DEBUG] URL looks valid: " + this.webhookUrl) }

			this.loading = true

			if (typeof this.gatewayType('webhook') == 'object' && 'gatewayId' in this.gatewayType('webhook')) {
				if (process.env.DEV) { console.log("[DEBUG] there's already an active webhook gateway: ID#" + this.gatewayType('webhook').gatewayId + " | removing gateway") }
				this.$api.delete('user/gateways', { data: { 'gateway_id': this.gatewayType('webhook').gatewayId } })
			}

			// make API call to set new email notification gateway
			this.$api
				.post('user/gateways', {type: 'webhook', value: this.webhookUrl})
				.then((result) => {
					setTimeout(() => {
						this.loading = false
						this.done = true
						setTimeout(() => this.done = false, 5000)
						this.testWebhookChannel()
						this.webhookUrl = null
						this.webhookUrlRepeat = null
						if (process.env.DEV) { console.log("[DEBUG] created new webhook gateway: " + this.webhookUrl) }
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

		testWebhookChannel() {
			this.$api.post("/user/gateways/test", { 'type': 'webhook' })
				.then((result) => {
					this.$q.notify({
						group: 'gatewayTest',
						type: 'positive',
						message: 'Dobby should have said hello at ' + this.gatewayType('webhook').value + ' :)',
					})
				})
		},

		openUrl(url) {
			openURL(url)
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
