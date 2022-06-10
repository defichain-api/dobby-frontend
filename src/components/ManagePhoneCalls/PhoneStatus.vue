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

		<q-card-section class="row no-wrap" v-if="canReceiveTestCall && !testCallDone">
			<div class="column flex flex-center">
				<q-icon
					size="55px"
					class="q-pr-none"
					name="fa-light fa-phone-volume"
					color="primary"
				/>
			</div>
			<q-separator vertical class="q-mx-md " />

			<div class="column flex flex-left text-body1">

				<p>
					Test if Dobby can call you.
				</p>

				<p v-if="!testCallRunning && freeCallAvailable">
					You are eligible to receive a single free test call.
				</p>

				<p v-if="!testCallRunning && !freeCallAvailable">
					This test call will cost <b class="text-primary">{{ testCallPrice }} DFI</b>
					<q-item tag="label">
						<q-item-section avatar top>
							<q-checkbox v-model="consent" color="accent" />
						</q-item-section>
						<q-item-section>
							<q-item-label caption>I understand and want to pay <b class="text-primary">{{ testCallPrice }}</b> DFI for this test call</q-item-label>
						</q-item-section>
					</q-item>

				</p>
				<p v-if="testCallRunning">
					Ring, ring... <q-spinner />
				</p>

				<TestChannel
					:label="(freeCallAvailable) ? 'Call me now for free' : 'Receive test call now'"
					@click="testCallRunning = true"
					v-show="!testCallRunning && !testCallDone"
					:disable="!freeCallAvailable && !consent"
					channel="phone"
					color="primary"
					unelevated
					rounded
					outline
					class="full-width"
				/>

				<q-btn
					v-if="testCallRunning"
					label="I received a call"
					unelevated
					rounded
					outline
					color="primary"
					class="full-width"
					@click="testCallRunning = false; testCallDone = true;"
				/>

			</div>

		</q-card-section>

		<q-separator inset />

		<q-card-section>
			<q-btn
				label="Change phone number"
				@click="showSetup = !showSetup"
				unelevated
				rounded
				outline
				class="full-width"
				icon="fa-light fa-pen-to-square"
			/>
			<q-dialog
				persistent
				maximized
				transition-show="slide-up"
				transition-hide="slide-down"
				v-model="showSetup"
			>
				<PhoneSetup dialog />
			</q-dialog>
		</q-card-section>

	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import PhoneSetup from "components/ManagePhoneCalls/PhoneSetup.vue"
import TestChannel from 'components/ManageNotificationsNew/NotificationChannels/TestChannel.vue'

export default {
	name: 'PhoneStatus',
	components: {
		PhoneSetup,
		TestChannel,
	},
	data() {
		return {
			showSetup: false,
			testCallRunning: false,
			testCallDone: false,
			consent: false,
		}
	},
	computed: {
		privacy() {
			return this.settingValue('uiPrivacyEnabled')
		},
		...mapGetters({
			settingValue: 'settings/value',
			phoneNumber: 'notifications/phoneNumber',
			canReceiveCall: 'notifications/phoneCanReceiveCall',
			freeCallAvailable: 'notifications/phoneFreeCallAvailable',
			canReceiveTestCall: 'notifications/phoneCanReceiveTestCall',
			phoneBalance: 'notifications/phoneBalance',
			testCallPrice: 'notifications/phoneCostTestCall',
		}),
	}
}
</script>
