import { api } from 'boot/axios'

export default {
	namespaced: true,
	state: {
		messages: []
	},
	getters: {
		messages: (state) => state.messages
	},
	actions: {
		/**
		 * Loads all neccessary data
		 */
		fetch({
			dispatch
		}) {
			dispatch('fetchMessages')
		},

		/**
		 * Call Dobby API for all broadcast messages
		 */
		fetchMessages({
			commit
		}) {
			return api.get("/broadcast/list")
				.then((result) => {
					commit('setMessages', result.data.messages)
				})
		},
	},

	mutations: {
		/**
		 * Set broadcast messages
		 */
		setMessages(state, messages) {
			state.messages = messages
		},

	},
}
