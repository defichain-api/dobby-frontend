<template>
  <q-card flat style="max-width: 350px;">

    <q-card-section>
      <div class="text-primary text-h6">
        {{ $t('Your Time Zone') }}
      </div>
      <div class="q-mt-sm">
        Choose your time zone to let Dobby know when you've got night and day.
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none text-center row">
      <q-select
        outlined
        v-model="currentSetting"
        :options="filteredOptions"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        emit-value
        @filter="filterAvailableOptions"
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
      settingName: 'timezone',
      currentSetting: null,
      availableOptions: [],
      filteredOptions: [],
      firstSet: true,
    }
  },
  created() {
    this.getAvailableTimeZones().finally(() => {
      this.currentSetting = this.settingValue(this.settingName)
    })
  },
  methods: {
    filterAvailableOptions(val, update) {
      if (val == '') {
        update(() => {this.filteredOptions = this.availableOptions})
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.availableOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1 || v.value.toLowerCase().indexOf(needle) > -1)
      })
    },
    getAvailableTimeZones() {
      return this.$api
        .get("/list/timezones")
        .then((result) => {
          let optionsList = []
          Object.entries(result.data.timezones).forEach((value) => {
            optionsList.push({
              label: value[1],
              value: value[0],
            })

          })
          this.availableOptions = optionsList
        })
    },
  },
  watch: {
    currentSetting(newSetting) {

      // Don't dispatch when setting a value first because this is the initial setting
      if (this.firstSet) {
        this.firstSet = false
        return
      }

      this.$store.dispatch('settings/setToAccount', { key: this.settingName, value: newSetting })
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
