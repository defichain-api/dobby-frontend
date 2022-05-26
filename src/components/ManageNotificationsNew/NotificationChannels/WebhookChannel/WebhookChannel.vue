<template>
	<q-item>
		<q-item-section avatar top>
			<q-icon name="fa-light fa-cloud" color="primary" />
		</q-item-section>

		<q-item-section>
			<q-item-label>
				Webhook
				<q-badge v-if="channelActive" rounded color="positive" text-color="white">
					<q-icon
						name="fa-solid fa-circle-check"
						size="14px"
					/> &nbsp;active
				</q-badge>
				<q-badge v-else rounded color="warning" text-color="white">
					<q-icon
						name="fa-solid fa-circle-xmark"
						size="14px"
					/> &nbsp;not set up yet
				</q-badge>
			</q-item-label>
			<q-item-label caption>For the nerds</q-item-label>
		</q-item-section>

		<q-item-section side top>
			<q-btn v-if="!channelActive" @click="showWebhookChannelSetup = true" flat dense rounded icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-light fa-cloud" icon-color="primary">
				<TestChannel
					:label="$t('Send Test Message')"
					channel="webhook"
					:color="($q.dark.channelActive) ? 'primary' : 'accent'"
					rounded
					outline
					class="full-width"
				/>
				<q-btn
					:label="$t('Change Address')"
					rounded
					outline
					class="full-width"
					:color="($q.dark.channelActive) ? 'primary' : 'accent'"
					@click="showWebhookChannelSetup = true"
				/>
			</ChannelOptionsMenu>
		</q-item-section>
	</q-item>
	<WebhookChannelSetup v-model="showWebhookChannelSetup" />
</template>

<script>
import { mapGetters } from 'vuex'

import WebhookChannelSetup from 'components/ManageNotificationsNew/NotificationChannels/WebhookChannel/WebhookChannelSetup.vue'
import ChannelOptionsMenu from 'components/ManageNotificationsNew/NotificationChannels/ChannelOptionsMenu.vue'
import TestChannel from 'components/ManageNotificationsNew/NotificationChannels/TestChannel.vue'

export default {
	name: 'WebhookChannel',
	components: {
		WebhookChannelSetup,
		ChannelOptionsMenu,
		TestChannel,
  },
	data() {
		return {
			showWebhookChannelSetup: false,
		}
	},
	computed: {
		channelActive: function() {
			return this.hasGatewayType('webhook')
		},
		...mapGetters({
			hasGatewayType: 'notifications/hasGatewayType',
		}),
	}
}
</script>

<style>

</style>
