import { api } from 'boot/axios'

export default {
	namespaced: true,

	// ----------------------------------------------------------------------------------

	state: {
		settings: {
			uiTheme: 'auto',
			language: 'en',

			uiPrivacyEnabled: null,
			uiDashboardHealthSummaryEnabled: null,
			uiDashboardCollateralInfoEnabled: null,
			uiDashboardCollateralWaypointsEnabled: null,
			uiDashboardCardsAsCarousel: null,

			timezone: null,
			summaryInterval: null,

			triggerMultipleInfo: 1.5,
			triggerMultipleWarning: 1.25,

			depositFromAddress: null,
			depositInfoMail: null,
		},
		enabledBetaFeatures: [],
		numberFormats: {
			currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 },
			currencyNoDecimals: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
			twoDecimals: { minimumFractionDigits:2, maximumFractionDigits: 2 },
			noDecimals: { maximumFractionDigits: 0 },
		},
		savingSettingsToAccount: false,
	},

	// ----------------------------------------------------------------------------------

	getters: {
		value: (state) => (key) => {
			return state.settings[key]
		},
		numberFormats: (state) => {
			return state.numberFormats
		},
		savingSettingsToAccount: (state) => {
			return state.savingSettingsToAccount
		},
		betaFeatureEnabled: (state) => (featureName) => {
			return state.enabledBetaFeatures.includes(featureName)
		},
		isDev: () => {
			return process.env.DEV
		}
	},

	// ----------------------------------------------------------------------------------

	actions: {
		set({ commit }, data) {
			commit('set', data)
		},

		setToAccount({ commit }, data) {
			commit('indicateSavingSettingsToAccount')
			return new Promise((resolve, reject) => {
				commit('set', data)
				api.put("/user/settings", {[data.key]: data.value})
					.then(() => {
						if (process.env.DEV) { console.log("[DEBUG] Synced setting to account: " + data.key + " = " + data.value)}
						resolve()
					})
					.catch(() => reject(new Error('something went wrong while saving')))
					.finally(() => commit('doneSavingSettingsToAccount'))
			})
		},

		setEnabledBetaFeatures({ commit }, data) {
			commit('setEnabledBetaFeatures', data)
		}
	},

	// ----------------------------------------------------------------------------------

	mutations: {
		set (state, data) {
			state.settings = { ...state.settings, [data.key]: data.value }
			if (process.env.DEV) {
				console.log("[DEBUG] Setting written to vuex: " + data.key + ' = ' + data.value)
			}
		},
		indicateSavingSettingsToAccount(state) {
			state.savingSettingsToAccount = true
		},
		doneSavingSettingsToAccount(state) {
			state.savingSettingsToAccount = false
		},
		setEnabledBetaFeatures(state, data) {
			state.enabledBetaFeatures = data
		}
	},
}
