<template>
  <q-card flat>

    <q-card-section>
    <div class="text-primary text-h6">{{ $t('Your Time Zone') }}</div>
    </q-card-section>
    <q-card-section class="q-pt-none text-center row">
      <q-select
        outlined
        v-model="timezone"
        :options="filteredTimeZones"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        emit-value
        @filter="filterTimeZones"
        class="full-width"
      />
    </q-card-section>

  </q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'TimeZoneSetting',
  data() {
    return {
      timezone: null,
      availableTimeZones: [],
      filteredTimeZones: [],
      firstSet: true,
    }
  },
  created() {
    this.getAvailableTimeZones().finally(() => {
      this.timezone = this.settingValue('timezone')
    })
  },
  methods: {
    filterTimeZones(val, update) {
      if (val == '') {
        update(() => {this.filteredTimeZones = this.availableTimeZones})
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filteredTimeZones = this.availableTimeZones.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    getAvailableTimeZones() {
      return this.$api
        .get("/list/timezones")
        .then((result) => {
          let timeZoneList = []
          Object.entries(result.data.timezones).forEach((value) => {
            timeZoneList.push({
              label: value[1],
              value: value[0],
            })

          })
          this.availableTimeZones = timeZoneList
        })
    },
  },
  watch: {
    timezone(timezone) {

      // Don't dispatch when first occurence setting a value because this is the initial setting
      if (this.firstSet) {
        this.firstSet = false
        return
      }

      this.$store.dispatch('settings/setToAccount', { key: 'timezone', value: timezone })
    }
  },
  computed: {
    ...mapGetters({
      settingValue: 'settings/value',
    }),
  },
})
</script>

<style lang="sass">

</style>
