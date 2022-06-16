<template>
	<q-item :clickable="!channelActive" @click="$refs['options'].$el.click()">
		<q-item-section avatar top>
			<q-avatar
				icon="fa-light fa-cloud"
				color="primary"
				size="lg"
				text-color="white"
			/>
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
			<q-btn ref="options" v-if="!channelActive" @click="showWebhookChannelSetup = true" flat dense round icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-light fa-cloud" icon-color="primary">
				<TestChannel
					:label="$t('Send Test Message')"
					channel="webhook"
					:color="(darkMode) ? 'white' : 'primary'"
					rounded
					outline
					icon="fa-light fa-cloud-rainbow"
					class="full-width"
				/>
				<q-btn
					:label="$t('Change Address')"
					rounded
					outline
					icon="fa-light fa-pen-to-square"
					class="full-width"
					:color="(darkMode) ? 'white' : 'primary'"
					@click="showWebhookChannelSetup = true"
				/>
				<RemoveChannel
					:label="$t('Remove Channel')"
					:channelId="gatewayType('webhook').gatewayId"
					color="warning"
					flat
					rounded
					outline
					icon="fa-light fa-circle-trash"
					class="full-width q-mt-md"
					size="sm"
				/>
			</ChannelOptionsMenu>
		</q-item-section>
	</q-item>
	<WebhookChannelSetup v-model="showWebhookChannelSetup" />
</template>

<script>
import { mapGetters } from 'vuex'

import WebhookChannelSetup from 'components/ManageNotifications/NotificationChannels/WebhookChannel/WebhookChannelSetup.vue'
import ChannelOptionsMenu from 'components/ManageNotifications/NotificationChannels/ChannelOptionsMenu.vue'
import TestChannel from 'components/ManageNotifications/NotificationChannels/TestChannel.vue'
import RemoveChannel from 'components/ManageNotifications/NotificationChannels/RemoveChannel.vue'

export default {
	name: 'WebhookChannel',
	components: {
		WebhookChannelSetup,
		ChannelOptionsMenu,
		TestChannel,
		RemoveChannel,
  },
	data() {
		return {
			showWebhookChannelSetup: false,
		}
	},
	computed: {
		darkMode: function () {
			return this.$q.dark.isActive
		},
		channelActive: function() {
			return this.hasGatewayType('webhook')
		},
		...mapGetters({
			gatewayType: 'notifications/gatewayType',
			hasGatewayType: 'notifications/hasGatewayType',
		}),
	}
}
</script>

<style>

</style>
