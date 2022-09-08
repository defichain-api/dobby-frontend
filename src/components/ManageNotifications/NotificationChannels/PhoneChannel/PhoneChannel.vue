<template>
	<q-item :clickable="!channelActive" @click="$refs['options'].$el.click()">
		<q-item-section avatar top>
			<q-avatar
				icon="fa-light fa-phone-rotary"
				color="primary"
				size="lg"
				text-color="white"
			/>
		</q-item-section>
		<q-item-section>
			<q-item-label>
				Phone Call
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
			<q-item-label caption>Dobby will call you. Especially useful during the night.</q-item-label>
			<q-item-label caption></q-item-label>
		</q-item-section>
		<q-item-section side top>
			<q-btn ref="options" v-if="!channelActive" to="manage-phone-calls" flat dense round icon="fa-light fa-circle-plus" class="q-pt-none" />
			<ChannelOptionsMenu v-else icon="fa-light fa-phone-rotary" icon-color="primary">
				<q-btn
					to="manage-phone-calls"
					label="manage phone calls"
					rounded
					outline
					class="full-width"
					:color="(darkMode) ? 'white' : 'primary'"
				/>
				<RemoveChannel
					:label="$t('Remove Channel')"
					:channelId="gatewayType('phone').gatewayId"
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
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelOptionsMenu from 'components/ManageNotifications/NotificationChannels/ChannelOptionsMenu.vue'
import RemoveChannel from 'components/ManageNotifications/NotificationChannels/RemoveChannel.vue'

export default {
	name: 'PhoneChannel',
	components: {
		ChannelOptionsMenu,
		RemoveChannel,
  },
	computed: {
		darkMode: function () {
			return this.$q.dark.isActive
		},
		channelActive: function() {
			return this.hasGatewayType('phone')
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
