<template>
	<div class="container q-ml-none">
		<div class="row items-start">
			<div class="col-xs-12 col-md-8 col-lg-6 col-xl-4 q-pl-md">
				<q-list padding :class="{'bg-white' : !this.$q.dark.isActive, 'bg-dark': this.$q.dark.isActive}" class="rounded-borders">
					<q-expansion-item
						ref="expander"
						v-model="expanded"
					>
						<!-- Header Section -->
						<template v-slot:header>
							<q-item-section>
								Notification Channels
							</q-item-section>
							<q-item-section side>
								<q-chip dense color="accent" size="sm" class="text-white">
									<q-avatar color="positive" text-color="white" size="xs">{{gateways.length}}</q-avatar>
									active
								</q-chip>
							</q-item-section>
						</template>
						<q-item class="q-mb-md">
							<q-item-section>
									<q-item-label caption>
										These are the communictaion services, Dobby is able to send you messages with.
										Please set them up by tapping on the <q-icon size="xs" name="fa-light fa-circle-plus" class="q-pt-none" /> icon on the right hand side of the channel you'd like to use.
										After a channel's initial setup, you can attach it to the notification triggers you like.
									</q-item-label>
							</q-item-section>
						</q-item>
						<!-- Available Channels -->
						<TelegramChannel />
						<PhoneChannel />
						<EmailChannel />
						<WebhookChannel />
					</q-expansion-item>
				</q-list>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import TelegramChannel from "components/ManageNotifications/NotificationChannels/TelegramChannel/TelegramChannel.vue"
import PhoneChannel from "components/ManageNotifications/NotificationChannels/PhoneChannel/PhoneChannel.vue"
import EmailChannel from "components/ManageNotifications/NotificationChannels/EmailChannel/EmailChannel.vue"
import WebhookChannel from "components/ManageNotifications/NotificationChannels/WebhookChannel/WebhookChannel.vue"

export default {
	name: 'NotificationChannels',
	components: {
		TelegramChannel,
		PhoneChannel,
		EmailChannel,
		WebhookChannel,
  },
	data() {
		return {
			expanded: false
		}
	},
	watch: {
		requestRunning(running) {
			if (running) return

			if (this.gateways.length == 0) {
				this.expanded = true
			}
		},
	},
	computed: {
		...mapGetters({
			requestRunning: 'requestRunning',
			hasGateways: 'notifications/hasGateways',
			gateways: 'notifications/gateways',
		}),
	},
}
</script>

<style>

</style>
