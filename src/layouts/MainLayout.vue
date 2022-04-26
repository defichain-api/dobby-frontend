<template>
  <q-layout view="hHh lpR fFf" :class="{'bg-blue-grey-2': !$q.dark.isActive }">
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="3px"
      skip-hijack
    />
    <q-header class="q-py-xs bg-primary-dark" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="fas fa-bars"
        />

        <q-btn flat no-caps no-wrap class="q-ml-xs">
          <q-icon :name="this.$store.getters.headline.icon" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold text-h6">
            {{ this.$store.getters.headline.text }}
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <q-spinner
          color="white"
          size="2.5em"
          v-if="requestRunning"
        />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat>
            <q-avatar size="35px" class="text-caption">
              <q-icon name="far fa-hat-wizard" style="font-size: 1.5em" />
            </q-avatar>
            <q-menu
              transition-show="jump-left"
              transition-hide="jump-right"
            >
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Quick Settings</div>
                  <q-toggle
                    label="Color Scheme"
                    v-model="uiTheme"
                    toggle-indeterminate
                    indeterminate-value="auto"
                    indeterminate-icon="fas fa-adjust"
                    checked-icon="fas fa-moon"
                    unchecked-icon="fas fa-sun"
                  />
                  <q-toggle
                    v-model="privacy"
                    label="Hide sensible data"
                    checked-icon="fas fa-socks"
                    unchecked-icon="fas fa-eye"
                  />
                  <q-btn class="q-mt-sm" to="settings" dense rounded outline icon="fa-light fa-sliders" :label="$t('All Settings')" v-close-popup />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <q-icon name="far fa-hat-wizard" />
                  </q-avatar>
                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!--
      show-if-above
    -->
    <q-drawer
      v-model="leftDrawerOpen"

      behavior="mobile"
      :width="250"
    >
      <!--<q-scroll-area class="fit">-->
        <q-list>
          <q-item-label header class="text-weight-bold text-uppercase text-center">
            <q-img
              src="/img/dobby-logo-white-border.png"
              spinner-color="white"
              style="height: 40px; max-width: 40px"
              class="q-mr-sm"
            />
          </q-item-label>

          <q-separator inset class="q-mt-ms q-mb-xs" />

          <q-item v-for="link in links1" :key="link.text" v-ripple clickable :to="link.to">
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}
              </q-item-label>
            </q-item-section>
            <q-badge v-if="link.badge && link.badge > 0" color="accent" floating>
              {{ link.badge }}
            </q-badge>
          </q-item>

          <q-separator inset class="q-mt-ms q-mb-xs" />

          <q-item v-for="link in links2" :key="link.text" v-ripple clickable :to="link.to">
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}
              </q-item-label>
            </q-item-section>
            <q-badge v-if="link.badge && link.badge > 0" color="accent" floating>
              {{ link.badge }}
            </q-badge>
          </q-item>

          <q-separator inset class="q-mt-ms q-mb-xs" />

          <q-item v-for="link in links3" :key="link.text" :to="link.to" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-mt-md q-mb-lg" />

          <div class="q-px-md text-grey-9">
            <div class="items-center q-gutter-x-sm q-gutter-y-xs text-grey drawer-footer">
                <div class="row">
                  <div class="col-3">Version:</div>
                  <div class="col-auto">{{ version }}</div>
                </div>
                <div class="row">
                  <div class="col-3">Build:</div>
                  <div class="col-auto">{{ release }}</div>
                </div>
                <div class="row">
                  <div class="col-3">Date:</div>
                  <div class="col-auto">{{ releaseDate }}</div>
                </div>
            </div>
          </div>
        </q-list>
      <!--</q-scroll-area>-->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export default {
  name: 'MainLayout',

  setup () {
    const $q = useQuasar()
    const leftDrawerOpen = ref(false)
    const bar = ref(null)
    const uiTheme = ref($q.dark.isActive)
    const store = useStore()
    const privacy = ref(store.getters['settings/value']('uiPrivacyEnabled'))
    const version = process.env.VERSION
    const release = process.env.CURRENT_RELEASE
    const releaseDate = process.env.RELEASE_DATE

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function logout () {
      store.dispatch('account/logout')
    }

    watch(uiTheme, (uiTheme) => {
      $q.dark.set(uiTheme)
      store.dispatch('settings/setToAccount', { key: 'uiTheme', value: uiTheme })
    })

    watch(privacy, (privacyActive) => {
      store.dispatch('settings/setToAccount', { key: 'uiPrivacyEnabled', value: privacyActive })
    })

    return {
      leftDrawerOpen,
      bar,
      uiTheme,
      privacy,
      version,
      release,
      releaseDate,

      toggleLeftDrawer,
      logout,

      requestRunning: computed(() => store.getters["requestRunning"]),

      autoReload: true,
      links1: [
        { icon: 'fab fa-fort-awesome-alt', text: 'Dashboard', to: "dashboard" },
      ],
     links2: [
        { icon: 'fal fa-bells', text: 'Manage Notifications', to: 'manage-notifications' },
        //{ icon: 'fal fa-bells', text: 'Manage Notifications 3.0', to: 'manage-notifications-new' },
        { icon: 'fal fa-archive', text: 'Manage Vaults', to: 'manage-vaults' },
      ],
      links3: [
        { icon: 'fal fa-sliders-h', text: 'Settings', to: 'settings' },
        { icon: 'fal fa-question-circle', text: 'WTF?!', to: 'wtf' },
        { icon: 'fal fa-chart-bar', text: 'Statistics', to: 'statistics' },
        //{ icon: 'fal fa-comments', text: 'Send feedback', to: 'feedback' }
      ],
    }
  }
}
</script>

<style lang="sass">
.drawer-footer
    font-weight: 500
    font-size: .75rem
</style>
