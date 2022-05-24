<template>
  <div class="q-pa-md q-gutter-md">
		<NotificationChannels />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import NotificationChannels from 'components/ManageNotificationsNew/NotificationChannels.vue'

export default {
  name: 'ManageNotifications',
  components: {
    NotificationChannels,
  },
	data() {
		return {
			showHelp: false,
		}
	},
  created() {
    this.$store.dispatch('setHeadline', { text: 'Dobby likes to talk', icon: 'fal fa-bells'})
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
