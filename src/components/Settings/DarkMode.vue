<template>
  <q-card flat>

    <q-card-section>
      <div class="row items-center no-wrap">
          <div class="col">
              <div class="text-primary text-h6">{{ $t('Color Theme') }}</div>
          </div>
          <transition appear enter-active-class="animated flipInY" leave-active-class="animated flipOutY" :duration="2000">
            <div class="col-auto" v-show="savingDone">
              <span class="text-body">
                saved
                <q-icon class="q-ml-sm" name="fa-light fa-cloud-check" size="sm" color="positive" />
              </span>
            </div>
          </transition>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none text-center row">
      <div class="col-4 text-right q-mt-md" :class="{'text-grey-6': mode != false}">
        Light
      </div>
      <q-toggle
        class="col-3 text-center"
        toggle-indeterminate
        indeterminate-value="auto"
        v-model="this.$q.dark.mode"
        size="xl"
        icon="fal fa-hat-wizard"
        checked-icon="fal fa-moon-stars"
        unchecked-icon="fal fa-sun"
        color="primary"
        :keep-color="true"
      />
      <div class="col-5 text-left q-mt-md" :class="{'text-grey-6': mode != true}">
        Dark
      </div>
      <div class="text-center full-width" :class="{'text-grey-6': mode != 'auto'}">{{ $t('Determined by device\'s system settings') }}</div>
    </q-card-section>

  </q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'DarkModeSetting',
  data() {
    return {
      saving: false,
      savingDone: false,
    }
  },
  watch: {
    mode(mode) {
      let setting = mode
      if (mode === true) {
        setting = 'dark'
      }
      if (mode === false) {
        setting = 'light'
      }
      this.saving = true
      this.$store
        .dispatch('settings/setToAccount', { key: 'uiTheme', value: setting })
        .then(() => {
          this.saving = false
          this.savingDone = true
        })
      this.$q.dark.set(mode)
    },
    savingDone(newVal) {
      if (newVal == true) {
        setTimeout(() => {
          this.savingDone = false
        }, 2000)
      }
    },
  },
  computed: {
    ...mapGetters({
      settingValue: 'settings/value',
    }),
    mode() {
      return this.$q.dark.mode
    }
  },
})
</script>

<style lang="sass">

</style>
