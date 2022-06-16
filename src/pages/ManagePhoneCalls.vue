<template>
	<div v-if="!hasPhoneGateway" class="q-pa-md q-gutter-md">
		<PhoneSetup  />
	</div>
	<div v-else class="q-pa-md q-gutter-md">
		<PhoneStatus />
		<PhoneBalances v-if="hasPhoneGateway" />
		<PhoneTransactions v-if="hasPhoneGateway" />
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import PhoneStatus from "components/ManagePhoneCalls/PhoneStatus.vue"
import PhoneSetup from "components/ManagePhoneCalls/PhoneSetup.vue"
import PhoneBalances from "components/ManagePhoneCalls/PhoneBalances.vue"
import PhoneTransactions from "components/ManagePhoneCalls/PhoneTransactions.vue"

export default defineComponent({
	name: 'ManagePhoneCalls',
	components: {
		PhoneStatus,
		PhoneSetup,
		PhoneBalances,
		PhoneTransactions,
	},
	created() {
		this.$store.dispatch('setHeadline', { text: 'Dobby can call you', icon: 'fa-light fa-phone-rotary'})
		this.$store.dispatch('notifications/fetch')
	},
	computed: {
		hasPhoneGateway: function () {
			return this.hasGatewayType('phone')
		},
		...mapGetters({
			hasGatewayType: 'notifications/hasGatewayType',
			betaFeatureEnabled: 'settings/betaFeatureEnabled',
			isDev: 'settings/isDev',
		})
	},
})
</script>
