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
        :name="message.type"
        avatar="/img/dobby-logo-white-border.png"
				text-html
        :text="[message.message, moment(message.startTime).format('MMMM Do YYYY, h:mm:ss a') + ' - ' + moment(message.endTime).format('MMMM Do YYYY, h:mm:ss a')]"
        sent
        stamp="7 minutes ago"
				:bg-color="bgColor(message.type)"
      />
			<!--
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['doing fine, how r you?']"
        stamp="4 minutes ago"
      />
			-->
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
		bgColor(messageType) {
			if (messageType == 'error') return 'negative'
			if (messageType == 'warning') return 'warning'
			if (messageType == 'info') return 'info'
			if (messageType == 'default') return ''
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
