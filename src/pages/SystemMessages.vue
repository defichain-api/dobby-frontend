<template>
	<div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
			<!--
      <q-chat-message
        label="Sunday, 19th"
      />
			-->

      <q-chat-message
				v-for="message in messages"
				:key="message.startTime"
        :name="message.type.toUpperCase() + ':'"
        avatar="/img/dobby-logo-white-border.png"
				text-html
        :text="getText(message)"
        sent
        :stamp="moment(message.startTime).fromNow()"
				:bg-color="bgColor(message.type)"
				text-color="white"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: "SystemMessages",
	created() {
		this.moment = moment
		this.$store.dispatch('setHeadline', { text: 'Important Messages', icon: 'fa-light fa-message-lines'})
		this.$store.dispatch('notifications/fetch')
	},
	methods: {
		getText(message) {
			let text= []
			text.push(message.message)
			if (message.endTime) {
				text.push(moment(message.startTime).format('MMMM Do YYYY, hh:mm:ss a') + ' - ' + moment(message.endTime).format('MMMM Do YYYY, hh:mm:ss a'))
			} else {
				text.push(moment(message.startTime).format('MMMM Do YYYY, hh:mm:ss a'))
			}
			return text
		},
		bgColor(messageType) {
			if (messageType == 'error') return 'negative'
			if (messageType == 'warning') return 'warning'
			if (messageType == 'info') return 'info'
			if (messageType == 'default') return 'dark'
		},
	},
	computed: {
		...mapGetters({
			messages: 'systemMessages/messages'
		})
	}
}
</script>

<style>

</style>
