<template>
	<q-card flat>

		<q-card-section>
			<div class="row items-center no-wrap">
					<div class="col">
							<div class="text-primary text-h6">{{ $t('Show/Hide Sensible Data') }}</div>
					</div>
					<transition appear enter-active-class="animated flipInY" leave-active-class="animated flipOutY" :duration="2000">
						<div class="col-auto" v-show="savingDone">
							<span class="text-body">
								saved
								<q-icon class="q-ml-sm" name="fa-light fa-cloud-check" size="sm" color="positive" />
							</span>
						</div>
					</transition>
			</div>
			<div class="text q-mt-sm">{{ $t('When hidden, currency amounts are replaced with socks') }} 🧦</div>
		</q-card-section>

		<q-card-section class="q-pt-none text-center row">
			<div class="col-4 q-mt-md text-right" :class="{'text-grey-6': mode != false}">
				Show
			</div>
			<q-toggle
				class="col-3"
				v-model="mode"
				size="xl"
				checked-icon="fas fa-socks"
				unchecked-icon="fas fa-eye"
				color="primary"
				:keep-color="true"
			/>
			<div class="col-5 q-mt-md text-left" :class="{'text-grey-6': mode != true}">
				Hide
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PrivacySetting',
	data() {
		return {
			saving: false,
			savingDone: false,
		}
	},
	computed: {
		mode: {
			get: function () {
				return this.$store.getters['settings/value']('uiPrivacyEnabled')
			},
			set: function (mode) {
				this.saving = true
				this.$store
					.dispatch('settings/setToAccount', { key: 'uiPrivacyEnabled', value: mode })
					.then(() => {
						this.saving = false
						this.savingDone = true
				})
			}
		}
	},
	watch: {
		savingDone(newVal) {
			if (newVal == true) {
				setTimeout(() => {
					this.savingDone = false
				}, 2000)
			}
		},
	},
})
</script>

<style lang="sass" scoped>

</style>
