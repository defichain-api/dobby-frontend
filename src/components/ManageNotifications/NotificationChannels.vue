<template>
	<q-list padding :class="{'bg-white' : !this.$q.dark.isActive, 'bg-dark': this.$q.dark.isActive}" class="rounded-borders">

		<!-- Header Section -->
		<q-item>
			<q-item-section>
				<q-item-label header class="q-pl-none">Notification Channels</q-item-label>
				<q-slide-transition>
					<q-item-label caption v-show="showHelp || !hasGateways">
						These are the services, Dobby is able to send you messages with.
						Please set them up by tapping on the <q-icon size="xs" name="fa-light fa-circle-plus" class="q-pt-none" /> icon on the right hand side of the channel you'd like to use.
						After a channel's initial setup, you can attach it to the notification triggers you like.
					</q-item-label>
				</q-slide-transition>
			</q-item-section>
			<q-item-section side top>
				<q-btn @click="showHelp = !showHelp" flat dense rounded icon="fa-light fa-circle-question" />
			</q-item-section>
		</q-item>

		<!-- Available Channels -->
		<TelegramChannel />
		<PhoneChannel />
		<EmailChannel />
		<WebhookChannel />

	</q-list>
</template>

<script>
import { ref } from 'vue'
import { computed }  from 'vue'
import { useStore } from 'vuex'

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
	setup() {
		const store = useStore()
		const showHelp = ref(false)

		return {
			showHelp: showHelp,
			hasGateways: computed(() => store.getters['notifications/hasGateways']),
		}
	},
}
</script>

<style>

</style>
