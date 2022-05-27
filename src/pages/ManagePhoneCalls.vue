<template>
	<div class="q-pa-md row items-start q-gutter-md">
		Manage Phone Calls
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
	name: 'ManagePhoneCalls',
	data () {
		return {

		}
	},
	computed: {
		locale: function() {
			return this.$root.$i18n.locale
		},
		privacy() {
			return this.settingValue('uiPrivacyEnabled')
		},
		...mapGetters({
			vaults: 'account/vaults',
			userId: 'account/userId',
			settingValue: 'settings/value',
		}),
	},
})
</script>

<style lang="sass">

</style>
