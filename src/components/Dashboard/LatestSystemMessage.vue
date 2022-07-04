<template>
	<q-card flat :class="bgColor" v-if="latestSeenMessage < latestMessage?.identifier && show && !requestRunning">
		<q-inner-loading
			:showing="requestRunning"
			color="primary"
		/>
		<q-card-section class="q-py-sm">
			<div class="text-body1 text-white"><q-icon name="fa-light fa-flag" class="q-mr-sm" />Latest Message from Dobby</div>
		</q-card-section>
		<q-separator inset />
		<q-card-section class="text-white" v-if="messages?.length > 0" v-html="latestMessage.message" />
		<q-card-actions align="around">
			<q-btn flat color="white" icon="fa-light fa-message-lines" to="system-messages" label="See All Messages" />
			<q-btn flat color="white" icon="fa-light fa-circle-check" label="Got It!" @click="latestSeenMessage = latestMessage.identifier; show = false;" />
		</q-card-actions>
	</q-card>
</template>

<script>
import {mapGetters} from 'vuex'
import { LocalStorage } from 'quasar'

export default {
	name: "LatestSystemMessage",
	data() {
		return {
			show: true,
		}
	},
	methods: {
		discard() {
			LocalStorage.set('latestSeenBroadcastMessageId', this.latestMessage.identifier)
		},
	},
	computed: {
		latestSeenMessage: {
			cache: false,
			get() {
				const id = LocalStorage.getItem('latestSeenBroadcastMessageId')
				return (id != null) ? id : 0
			},
			set() {
				LocalStorage.set('latestSeenBroadcastMessageId', this.latestMessage.identifier)
			}
		},
		latestMessage() {
			return this.messages[0]
		},
		bgColor() {
			const messageType = this.latestMessage?.type
			if (messageType == 'error') return 'bg-negative'
			if (messageType == 'warning') return 'bg-warning'
			if (messageType == 'info') return 'bg-info'
			return 'bg-dark'
		},
		...mapGetters({
			requestRunning: 'requestRunning',
			messages: 'systemMessages/messages',
		}),
	},
}
</script>

<style>

</style>
