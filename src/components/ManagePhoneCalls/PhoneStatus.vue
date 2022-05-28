<template>
	<q-card flat>
		<q-card-section>
			<div class="text-h6">Calling at
				<span v-if="!privacy">{{ phoneNumber }}</span>
				<span v-else>🧦🧦🧦🧦🧦🧦🧦🧦🧦</span>
			</div>
		</q-card-section>
		<q-card-section v-if="canReceiveCall" class="text-body1 row no-wrap">
			<div class="column flex flex-center">
				<q-icon
					size="55px"
					class="q-pr-none"
					name="fa-light fa-heart-circle-check"
					color="positive"
				/>
			</div>
			<q-separator vertical class="q-mx-md " />
			<div class="column flex flex-center">
				You can receive calls.
			</div>
		</q-card-section>

		<q-card-section v-else class="bg-negative text-white text-body1 row no-wrap">
			<div class="column flex flex-center">
				<q-icon
					size="55px"
					class="q-pr-none"
					name="fa-light fa-bomb"
					color="white"
				/>
			</div>
			<q-separator vertical class="q-mx-md " />
			<div class="column flex flex-left">
				You cannot receive calls from Dobby because
				<span v-if="phoneBalance < 0.5">your balance is too low</span>
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'PhoneStatus',
	computed: {
		privacy() {
			return this.settingValue('uiPrivacyEnabled')
		},
		...mapGetters({
			settingValue: 'settings/value',
			phoneNumber: 'notifications/phoneNumber',
			canReceiveCall: 'notifications/phoneCanReceiveCall',
			phoneBalance: 'notifications/phoneBalance',
		}),
	}
}
</script>
