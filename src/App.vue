<template>
	<router-view v-slot="{ Component }">
		<!--
		<transition
			enter-active-class="animated fadeIn"
			leave-active-class="animated fadeOut"
			appear
		>
		-->
		<transition name="fade">
			<component :is="Component" />
		</transition>
	</router-view>
</template>
<script>
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
	name: 'App',
	data() {
		return {
			autoReload: null,
		}
	},
	created() {
		// FIRST THING TO DO ============================================================
		// Read settings from local storage and write it to the vuex store
		this.$store.dispatch("account/initFromLocalStorage")
		//this.$store.dispatch("settings/initFromLocalStorage")

		// PROCEED WITH OTHER STUFF =====================================================

		// set dark mode setting
		this.$q.dark.set(this.getSettingValue('uiTheme'))

		this.setupAxiosInterceptors()

		// Load user's vaults when there's a userId set in local storage
		if (this.userId && this.userId != null && this.userId != '') {
			if (process.env.DEV) { console.log("[DEBUG] initializing with dobby account " + this.userId) }

			// Set auth header for API communication
			this.$api.defaults.headers.common['x-user-auth'] = this.userId

			// Receive user data from Dobby API and store it in vuex store
			this.loadUserData
				.then(() => {
					// set dark mode setting
					this.$q.dark.set(this.getSettingValue('uiTheme'))
				})
				.catch((error) => {
					// TODO show information that user's accound was not found
					//this.$router.push({ name: 'setup' })
				})

			// Fetch user's notifications
			this.loadUserNotifications

			// Fetch latest Chain Data
			this.fetchChainData

			// Fetch system messages / broadcasts
			this.$store.dispatch('systemMessages/fetch')
			this.autoReload = setInterval(() => {
				if (process.env.DEV) { console.log("[DEBUG] Fetching broadcast messages from API") }
				this.$store.dispatch('systemMessages/fetch')
			}, 60 * 1000)
		}
	},
	methods: {
		setupAxiosInterceptors() {
			this.$api.interceptors.request.use((request) =>{
				this.$store.commit('requestStart', request.method.toUpperCase() + " " + request.url)
				return request
			}, (error) => {
				this.dataRefreshError()
				return Promise.reject(error)
			})
			this.$api.interceptors.response.use((response) => {
				this.$store.commit('requestDone', response.config.method.toUpperCase() + " " + response.config.url)
				this.$store.commit('apiResponded')
				return response
			}, (error) => {
				if (error.response.status === 401) {
					this.$q.notify({
						group: 'userError',
						type: 'negative',
						message: 'Your user key is incorrect',
						timeout: 60000,
						actions: [
							{ label: 'Go to Login', color: 'white', icon: 'fal fa-sign-in', handler: () => {
								this.$router.push({name:'setup'})
								this.$store.dispatch('account/logout')
							}}
						]
					})
				}
				else if (error.response.status === 422) {
					this.$q.notify({
						group: 'userError',
						type: 'negative',
						timeout: 10000,
						message: 'Whoops Dobby was unable to write to his API! Response Error: HTTP ' + error.response.status + ': ' + JSON.stringify(error.response.data.errors)
					})
				}
				else {
					this.dataRefreshError(error.response.statusText)
				}
				return Promise.reject(error)
			})
		},
		dataRefreshError(message) {
			this.$store.commit('noApiResponse')
			if (!message) {
					message = 'Whoops. Looks like the Dobby API does not respond :/'
			}
			this.$q.notify({
				group: 'dataRefreshError',
				type: 'negative',
				message: message,
			})
		}
	},
	watch: {
		vaults: function(vaults) {
			let vaultCollRatios = ''
			vaults.forEach(vault => {
				vaultCollRatios += `[${vault.name} ${Math.round(vault.nextCollateralRatio)}%] `
			})
			vaultCollRatios = vaultCollRatios.slice(0, -1)
			document.title = `${vaultCollRatios} -	DeFiChain Dobby`
		}
	},
	computed: {
		...mapGetters({
			userId: 'account/userId',
			getSettingValue: 'settings/value',
			vaults: 'account/vaults',
		}),
		...mapActions({
			loadUserData: 'account/loadUserData',
			loadUserNotifications: 'notifications/fetch',
			fetchChainData: 'chain/fetch',
		})
	}
})
</script>
