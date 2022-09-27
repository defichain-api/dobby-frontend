<template>
	<q-card flat>
		<q-card-section>
			<div class="row items-center no-wrap">
				<div class="col text-h6 ellipsis">
					<q-icon name="fa-light fa-percent" size="sm" class="q-mr-sm" />
					DUSD Interest Rates
				</div>
			</div>
		</q-card-section>

		<q-card-section class="q-pt-none q-px-none">
			<q-list separator>
				<!-- Daily Message -->
				<q-item tag="label" v-ripple>
					<q-item-section>
						<q-item-label>Daily Message</q-item-label>
						<q-item-label caption>Receive the height of DUSD interest rate in a daily Telegram message</q-item-label>
					</q-item-section>
					<q-item-section side top>
						<q-toggle color="primary" v-model="dailyMessageSetting" />
					</q-item-section>
				</q-item>

				<!-- Above Message -->
				<q-item manual-focus>
					<q-item-section>
						<q-item-label>Message When Above</q-item-label>
						<q-item-label caption>Receive a Telegram message when combined DUSD interest rate rises above...</q-item-label>
						<q-slider
							v-if="aboveEnabled"
							class="q-my-md"
							thumb-size="30px"
							v-model="aboveMessageSetting"
							:min="-80"
							:max="5"
							@change="store.dispatch('settings/setToAccount', { key: 'informDusdInterestRateAbove', value: aboveMessageSetting})"
						/>
					</q-item-section>
					<q-item-section side top>
						<q-toggle color="primary" v-model="aboveEnabled" />
						<q-input
							v-if="aboveEnabled"
							outlined
							type="number"
							v-model="aboveMessageSetting"
							dense
							style="width: 5.5em;"
							class="q-mt-lg"
							suffix="%"
						/>
					</q-item-section>
				</q-item>

			<!-- Below Message -->
				<q-item manual-focus>
					<q-item-section >
						<q-item-label>Message When Below</q-item-label>
						<q-item-label caption>Receive a Telegram message when combined DUSD interest rate falls below...</q-item-label>
						<q-slider
							v-if="belowEnabled"
							class="q-my-md"
							thumb-size="30px"
							v-model="belowMessageSetting"
							:min="-80"
							:max="5"
							@change="store.dispatch('settings/setToAccount', { key: 'informDusdInterestRateBelow', value: belowMessageSetting})"
						/>
					</q-item-section>
					<q-item-section side top>
						<q-toggle color="primary" v-model="belowEnabled" />
						<q-input
							v-if="belowEnabled"
							outlined
							type="number"
							v-model="belowMessageSetting"
							dense
							style="width: 5.5em;"
							class="q-mt-lg"
							suffix="%"
						/>
					</q-item-section>
				</q-item>
			</q-list>
		</q-card-section>
	</q-card>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from 'vuex';

export default defineComponent({
	name: "InterestRateWarnings",

	setup() {

		const store = useStore()

		const dailyMessageSetting = computed({
			get: () => store.getters['settings/value']('informDusdInterestRate'),
			set(newValue) { store.dispatch('settings/setToAccount', { key: 'informDusdInterestRate', value: newValue})}
		});

		const aboveMessageSetting = computed({
			get: () => store.getters['settings/value']('informDusdInterestRateAbove'),
			set: (newValue) => store.dispatch('settings/set', { key: 'informDusdInterestRateAbove', value: newValue})
		});

		const belowMessageSetting = computed({
			get: () => store.getters['settings/value']('informDusdInterestRateBelow'),
			set: (newValue) => store.dispatch('settings/set', { key: 'informDusdInterestRateBelow', value: newValue})
		});

		const aboveEnabled = computed({
			get: () => aboveMessageSetting.value != null,
			set: (newValue) => aboveMessageSetting.value = (newValue === true) ? -10 : null
		})

		const belowEnabled = computed({
			get: () => belowMessageSetting.value != null,
			set: (newValue) => belowMessageSetting.value = (newValue === true) ? -10 : null
		})

		return {
			store,
			dailyMessageSetting,
			aboveMessageSetting,
			belowMessageSetting,
			aboveEnabled,
			belowEnabled,
		}
	},
});
</script>

<style>

</style>
