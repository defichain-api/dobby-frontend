import { LocalStorage } from 'quasar'

export default {
	namespaced: true,
	state: {
		/*
		{
			"uiTheme": "dark", // dark, light, auto
			"language": "de", // en, de
			"summaryInterval": "daily_2x",
			"depositAddress": "8Q95shiR4uJv****atA8VHiEEAwc4Syj1W", // used for phone credits
			"depositInfoMail": "my@email.de", // info email address for credit deposit
			"currentRatioEnabled": true, // default: false
			"uiPrivacyEnabled": false,
			"uiDashboardHealthSummaryEnabled": false,
			"uiDashboardCollateralInfoEnabled": true,
			"uiDashboardCollateralWaypointsEnabled": false,
			"timezone": "Europe/Berlin"
		}
		*/

		settings: {
			uiTheme: 'auto',
			language: 'en',


			uiPrivacyEnabled: false,

			triggerMultipleInfo: 1.5,
			triggerMultipleWarning: 1.25,
			'dashboardCardsInfo.healthSummary': true,
			'dashboardCardsInfo.collateralInfo': true,
			'dashboardCardsInfo.collateralWaypoints': true,
			dashboardCardsAsCarousel: 'auto',
		},
		numberFormats: {
			currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 },
			currencyNoDecimals: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
			twoDecimals: { minimumFractionDigits:2, maximumFractionDigits: 2 },
		},
	},
	getters: {
		value: (state) => (key) => {
			return state.settings[key]
		},
		numberFormats: (state) => {
			return state.numberFormats
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
	},
	mutations: {
		set (state, data) {
			state.settings = { ...state.settings, [data.key]: data.value }
			// write setting to local storage
			LocalStorage.set(process.env.LOCAL_STORAGE_SETTINGS_KEY, state.settings)
		},
	},
}
