<template>
	<q-item>
		<q-item-section avatar top>
			<q-avatar
				icon="fa-brands fa-telegram"
				color="telegram"
				size="lg"
				text-color="white"
			/>
		</q-item-section>

		<q-item-section>
			<q-item-label>
				Telegram
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
			<q-item-label caption>Recommended. Receive messages in Telegram.</q-item-label>
		</q-item-section>

		<q-item-section side top>
			<q-btn v-if="!channelActive" @click="showTelegramChannelSetup = true" flat dense round icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-brands fa-telegram" icon-color="telegram">
				<TestChannel
					v-if="hasGatewayType('telegram')"
					:label="$t('Send Test Message')"
					channel="telegram"
					:color="($q.dark.channelActive) ? 'primary' : 'accent'"
					icon="fa-light fa-paper-plane"
					rounded
					outline
					class="full-width"
				/>
				<RemoveChannel
					:label="$t('Remove Channel')"
					:channelId="gatewayType('telegram').gatewayId"
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
	<TelegramChannelSetup v-model="showTelegramChannelSetup" />
</template>

<script>
import { mapGetters } from 'vuex'

import TelegramChannelSetup from 'components/ManageNotificationsNew/NotificationChannels/TelegramChannel/TelegramChannelSetup.vue'
import ChannelOptionsMenu from 'components/ManageNotificationsNew/NotificationChannels/ChannelOptionsMenu.vue'
import TestChannel from 'components/ManageNotificationsNew/NotificationChannels/TestChannel.vue'
import RemoveChannel from 'components/ManageNotificationsNew/NotificationChannels/RemoveChannel.vue'

export default {
	name: 'TelegramChannel',
	components: {
		TelegramChannelSetup,
		ChannelOptionsMenu,
		TestChannel,
		RemoveChannel,
  },
	data() {
		return {
			showTelegramChannelSetup: false,
		}
	},
	computed: {
		channelActive: function() {
			return this.hasGatewayType('telegram')
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
