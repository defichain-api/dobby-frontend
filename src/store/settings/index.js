import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export default {
	namespaced: true,
	state: {
		/*
		{
			"uiTheme": "dark", // dark, light, auto
			"language": "de", // en, de
			"uiPrivacyEnabled": false,
			"uiDashboardHealthSummaryEnabled": false,
			"uiDashboardCollateralInfoEnabled": true,
			"uiDashboardCollateralWaypointsEnabled": false,
			"summaryInterval": "daily_2x",
			"timezone": "Europe/Berlin"

			"depositAddress": "8Q95shiR4uJv****atA8VHiEEAwc4Syj1W", // used for phone credits
			"depositInfoMail": "my@email.de", // info email address for credit deposit
			"currentRatioEnabled": true, // default: false
		}
		*/

		settings: {
			uiTheme: 'auto',
      language: 'en',

      uiPrivacyEnabled: false,
      uiDashboardHealthSummaryEnabled: true,
			uiDashboardCollateralInfoEnabled: true,
			uiDashboardCollateralWaypointsEnabled: true,
      uiDashboardCardsAsCarousel: 'auto',

      timezone: "Europe/London",

			triggerMultipleInfo: 1.5,
			triggerMultipleWarning: 1.25,
		},
		numberFormats: {
			currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 },
			currencyNoDecimals: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
			twoDecimals: { minimumFractionDigits:2, maximumFractionDigits: 2 },
    },
    savingSettingsToAccount: false,
	},
	getters: {
		value: (state) => (key) => {
			return state.settings[key]
		},
		numberFormats: (state) => {
			return state.numberFormats
    },
    savingSettingsToAccount: (state) => {
      return state.savingSettingsToAccount
    }
	},
	actions: {
		initFromLocalStorage ({ commit }) {
			let settings = LocalStorage.getItem(process.env.LOCAL_STORAGE_SETTINGS_KEY)

			// iterate over all settings keys found in local storage and store them in vuex
			if (settings && Object.keys(settings).length > 0) {
				Object.entries(settings).forEach((value) => {
					commit('set', { key: value[0], value: value[1] })
				})
			}
    },

		set({ commit }, data) {
			commit('set', data)
    },

    setToAccount({ commit }, data) {
      commit('indicateSavingSettingsToAccount')
      return new Promise((resolve, reject) => {
        commit('set', data)
        api.put("/user/settings", {
          [data.key]: data.value
        })
          .then(() => resolve())
          .catch(() => reject(new Error('something went wrong while saving')))
          .finally(() => commit('doneSavingSettingsToAccount'))
      })
    },
	},
	mutations: {
		set (state, data) {
			state.settings = { ...state.settings, [data.key]: data.value }
			// write setting to local storage
      LocalStorage.set(process.env.LOCAL_STORAGE_SETTINGS_KEY, state.settings)
      if (process.env.DEV) {
        console.log("[DEBUG] Saving setting to local storage: " + data.key + " = " + data.value)
      }
    },
    indicateSavingSettingsToAccount(state) {
      state.savingSettingsToAccount = true
    },
    doneSavingSettingsToAccount(state) {
      state.savingSettingsToAccount = false
    }
	},
}
