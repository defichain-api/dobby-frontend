import { api } from 'boot/axios'

export default {
	namespaced: true,

	state: {
		gateways: [],
		triggers: [],
		phone: {
			//balanceDfi: 0,
			phoneNumber: null,
			canReceiveCall: null,
			testCall: {
				freeCallAvailable: null,
				canReceiveTestCall: null,
			},
		},
		paymentTransactions: null,
	},

	getters: {
		/**
		 * Returns the user's gateways, stored locally
		 */
		gateways: (state) => {
			return state.gateways
		},

		/**
		 * Returns true when there's at least one gateway configured
		 */
		hasGateways: (state) => {
			return state.gateways.length > 0
		},

		/**
		 * Returns true if a specific gateway has been set
		 */
		hasGatewayType: (state) => (gatewayType) => {
			return state.gateways.some(function(gateway) {
				return gateway.type == gatewayType;
			});
		},

		/**
		 * Returns a particular gateway type
		 */
		gatewayType: (state) => (gatewayType) => {
			return state.gateways.find(gateway => gateway.type == gatewayType);
		},

		/**
		 * Returns true when there's at least one gateway configured
		 */
		hasTriggers: (state) => {
			return state.triggers.length > 0
		},

		/**
		 * Returns the user's triggers, stored locally
		 */
		triggers: (state) => {
			return state.triggers
		},

		/**
		 * returns a specific trigger, found by it's id
		 */
		trigger: (state) => (triggerId) => {
			return state.triggers.find(trigger => trigger.triggerId == triggerId);
		},

		vaultTriggers: (state) => (vaultId = false) => {
			let vaultTriggers = {}
			state.triggers.forEach(function (trigger) {
				if (typeof vaultTriggers[trigger.vaultId] == 'undefined') {
					vaultTriggers[trigger.vaultId] = []
				}
				vaultTriggers[trigger.vaultId].push(trigger)
				vaultTriggers[trigger.vaultId].sort(( a, b ) => {
					if ( a.ratio < b.ratio ){return -1}
					if ( a.ratio > b.ratio ){return 1}
					return 0;
				})
			})
			if (vaultId) {
				return vaultTriggers[vaultId] || {}
			} else {
				return vaultTriggers
			}
		},

		phoneData: (state) => {
			return state.phone
		},

		hasPhoneNumber: (state) => {
			return state.phone.phoneNumber != 'not set'
		},

		phoneNumber: (state) => {
			return state.phone.phoneNumber
		},

		phoneBalance: (state) => {
			return state.phone.balanceDfi
		},

		phoneCanReceiveCall: (state) => {
			return state.phone.canReceiveCall
		},

		phoneFreeCallAvailable: (state) => {
			return state.phone.testCall.freeCallAvailable
		},

		phoneCanReceiveTestCall: (state) => {
			return state.phone.testCall.canReceiveTestCall
		},

		phoneDeposits: (state) => {
			return (state.paymentTransactions == null) ? [] : state.paymentTransactions.deposits
		},

		phonePayments: (state) => {
			return (state.paymentTransactions == null) ? [] : state.paymentTransactions.payments
		},
	},

	actions: {
		/**
		 * Loads the user's gateways and triggers from Dobby API
		 */
		fetch({ dispatch }) {
			dispatch('fetchGateways')
			dispatch('fetchTriggers')
			dispatch('fetchPhoneData')
			dispatch('fetchPaymentTransactions')
		},

		/**
		 * Call Dobby API für a list of user's gateways
		 */
		fetchGateways({ commit }) {
			return api.get("/user/gateways")
				.then((result) => {
					commit('setGateways', result.data.data)
				})
		},

		/**
		 * Call Dobby API für a list of user's notifictaion triggers
		 */
		fetchTriggers({ commit }) {
			return api.get("/user/notification")
				.then((result) => {
					commit('setTriggers', result.data.data)
				})
		},

		/**
		 * Call Dobby API für a list of user's phone status
		 */
		fetchPhoneData({
			commit
		}) {
			return api.get("/user/payment/state")
				.then((result) => {
					commit('setPhoneData', result.data)
				})
		},

		/**
		 * Call Dobby API für a list of user's phone status
		 */
		fetchPaymentTransactions({
			commit
		}) {
			return api.get("/user/payment/transactions")
				.then((result) => {
					commit('setPaymentTransactions', result.data)
				})
		},

		/**
		 * Add a new notification trigger and reload
		 */
		addTrigger({ dispatch }, data) {
			/*
			api.post("/user/notification", triggerConfig)
				.then((result) => {
					dispatch('fetchTriggers')
				})
				.catch((error) => {
					console.log(error)
				})
			*/
		},

		/**
		 * Replace trigger's properties with new values
		 */
		updateTrigger({ dispatch, getters }, data) {
			let combinedTriggerData = { ...getters.trigger(data.triggerId), ...data }

			if (!('gateways' in data)) {
				let gatewayIds = []
				combinedTriggerData.gateways.forEach((gateway) => {
					gatewayIds.push(gateway.gatewayId)
				})
				combinedTriggerData.gateways = gatewayIds
			}

			api.put("/user/notification", combinedTriggerData)
				.then(() => {
					dispatch('fetchTriggers')
				})
				.catch((error) => {
					console.log(error)
				})
		},

		/**
		 * Remove a trigger
		 */
		deleteTrigger({ dispatch }, triggerId) {
			const payload = { "triggerId": triggerId }
			api.delete("/user/notification", { data: payload })
				.then(() => {
					dispatch('fetchTriggers')
				})
				.catch((error) => {
					console.log(error)
				})

		}
	},

	mutations: {
		/**
		 * Call Dobby API für a list of user's gateways
		 */
		setGateways(state, gateways) {
			state.gateways = gateways
		},

		/**
		 * Call Dobby API für a list of user's notifictaion triggers
		 */
		setTriggers(state, triggers) {
			state.triggers = triggers
		},

		/**
		 * Call Dobby API für a list of user's notifictaion triggers
		 */
		setPhoneData(state, data) {
			state.phone = data
		},

		/**
		 * Call Dobby API für a list of user's notifictaion triggers
		 */
		setPaymentTransactions(state, data) {
			state.paymentTransactions = data
		},

	},
}
