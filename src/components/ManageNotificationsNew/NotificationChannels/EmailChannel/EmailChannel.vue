<template>
	<q-item :clickable="!channelActive" @click="$refs['options'].$el.click()">
		<q-item-section avatar top>
			<q-avatar
				icon="fa-light fa-envelope"
				color="primary"
				size="lg"
				text-color="white"
			/>
		</q-item-section>

		<q-item-section>
			<q-item-label>
				Email
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
			<q-item-label caption>Born before the year 2000? Dobby got you covered.</q-item-label>
		</q-item-section>

		<q-item-section side top>
			<q-btn ref="options" v-if="!channelActive" @click="showEmailChannelSetup = true" flat dense round icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-light fa-envelope" icon-color="primary">
				<TestChannel
					:label="$t('Send Test Message')"
					channel="mail"
					icon="fa-light fa-mailbox"
					:color="(darkMode) ? 'white' : 'primary'"
					rounded
					outline
					class="full-width"
				/>
				<q-btn
					:label="$t('Change Address')"
					rounded
					outline
					icon="fa-light fa-pen-to-square"
					class="full-width"
					:color="(darkMode) ? 'white' : 'primary'"
					@click="showEmailChannelSetup = true"
				/>
				<RemoveChannel
					:label="$t('Remove Channel')"
					:channelId="gatewayType('mail').gatewayId"
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
	<EmailChannelSetup v-model="showEmailChannelSetup" />
</template>

<script>
import { mapGetters } from 'vuex'

import EmailChannelSetup from 'components/ManageNotificationsNew/NotificationChannels/EmailChannel/EmailChannelSetup.vue'
import ChannelOptionsMenu from 'components/ManageNotificationsNew/NotificationChannels/ChannelOptionsMenu.vue'
import TestChannel from 'components/ManageNotificationsNew/NotificationChannels/TestChannel.vue'
import RemoveChannel from 'components/ManageNotificationsNew/NotificationChannels/RemoveChannel.vue'

export default {
	name: 'EmailChannel',
	components: {
		EmailChannelSetup,
		ChannelOptionsMenu,
		TestChannel,
		RemoveChannel,
  },
	data() {
		return {
			showEmailChannelSetup: false,
		}
	},
	computed: {
		darkMode: function () {
			return this.$q.dark.isActive
		},
		channelActive: function() {
			return this.hasGatewayType('mail')
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
