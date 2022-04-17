<template>
  <div class="q-pa-md q-gutter-md">

    <ManageTriggers />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ManageTriggers from 'src/components/ManageNotifications/ManageTriggers.vue'

export default {
  name: 'ManageNotifications',
  components: {
    ManageTriggers,
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
