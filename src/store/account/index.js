import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export default {
	namespaced: true,
	state,
	//getters,
	getters: {
		userId: (state) => {
			return state.userId
		},

		vaults: (state) => {
			return state.vaults
		},

		vault: (state) => (vaultId) => {
			return state.vaults.find(vault => vault.vaultId == vaultId) || false
		},

		isDemo: (state) => {
			return process.env.DEMO_ACCOUNT_ID == state.userId
		}
	},
	mutations,
	actions,
}
