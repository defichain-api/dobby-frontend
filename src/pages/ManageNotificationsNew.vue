<template>
  <div class="q-pa-md q-gutter-md">
		<NotificationChannels />
		<Notifications />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import NotificationChannels from 'components/ManageNotificationsNew/NotificationChannels.vue'
import Notifications from 'components/ManageNotificationsNew/Notifications.vue'

export default {
  name: 'ManageNotifications',
  components: {
    NotificationChannels,
		Notifications,
  },
	data() {
		return {
			showHelp: false,
		}
	},
  created() {
    this.$store.dispatch('setHeadline', { text: 'Dobby likes to talk', icon: 'fa-light fa-bells'})
    this.$store.dispatch('notifications/fetch')
  },
  computed: {
    ...mapGetters({
      gateways: 'notifications/gateways',
    }),
  }
}
</script>

<style>

</style>
