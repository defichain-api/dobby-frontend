<template>
	<q-item>
		<q-item-section avatar top>
			<q-icon name="fa-light fa-envelope" color="primary" />
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
			<q-btn v-if="!channelActive" @click="showEmailChannelSetup = true" flat dense rounded icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-light fa-envelope" icon-color="primary">
				<TestChannel
					:label="$t('Send Test Message')"
					channel="mail"
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
					@click="showEmailChannelSetup = true"
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

export default {
	name: 'EmailChannel',
	components: {
		EmailChannelSetup,
		ChannelOptionsMenu,
		TestChannel,
  },
	data() {
		return {
			showEmailChannelSetup: false,
		}
	},
	computed: {
		channelActive: function() {
			return this.hasGatewayType('mail')
		},
		...mapGetters({
			hasGatewayType: 'notifications/hasGatewayType',
		}),
	}
}
</script>

<style>

</style>
