<template>
	<q-card flat>
		<q-card-section>
			<p class="text-center">
				When collateral ratio turns near to...
			</p>
			<div class="row">
				<!--
				<q-input
					dense
					debounce="250"
					outlined
					type="text"
					class="col-2"
					v-model="triggerRatio"
				/>
				<div class="col-1" />
				-->
				<q-slider
					class="q-mx-sm"
					label
					label-always
					switch-label-side
					v-model="triggerRatio"
					:label-value="triggerRatio + '%'"
					:min="151"
					:max="350"
				/>
			</div>
		</q-card-section>
		<div class="full-width text-center">
				<q-icon name="fa-light fa-arrow-down" size="md"></q-icon>
			</div>
		<q-card-section >
			<p class="text-center">
				Receive a message via...
			</p>
			<q-list>
				<q-item v-for="gateway in gateways" :key="gateway.gatewayId" class="q-pa-none">
					<q-item-section avatar>
						<q-avatar
							:icon="gatewayTypes2GatewayData[gateway.type].icon"
							:color="(gatewayStates[gateway.type]) ? gatewayTypes2GatewayData[gateway.type].color : 'grey-7'"
							text-color="white"
							size="md"
						/>
					</q-item-section>
					<q-item-section>
						<q-item-label
							class="text-body1"
							:class="{'text-grey-7': !gatewayStates[gateway.type]}"
						>
							{{gatewayTypes2GatewayData[gateway.type].name}}
						</q-item-label>
					</q-item-section>
					<q-item-section avatar>
						<q-toggle
							v-model="gatewayStates[gateway.type]"
							icon="fa-light fa-check"
							:color="gatewayTypes2GatewayData[gateway.type].color"
							size="xl"
							unchecked-icon="fa-light fa-xmark"
							dense
						/>
					</q-item-section>
				</q-item>

			</q-list>
		</q-card-section>
		<q-card-actions class="row q-mb-md" align="center">
			<q-btn class="col-2" rounded outline icon="fa-light fa-trash" size="md" color="negative" />
			<q-btn class="col-9" rounded outline color="primary" @click="save()" :loading="saving">
				<span v-if="!savingComplete">
					<q-icon name="fa-light fa-floppy-disk" /><span class="q-ml-sm">Save</span>
				</span>
				<span v-if="savingComplete">
					<q-icon name="fa-light fa-check" />
				</span>
			</q-btn>
		</q-card-actions>
	</q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	props: {
		trigger: {
			required: true,
			type: Object,
		},
	},
	data() {
		return {
			saving: false,
			savingComplete: false,

			triggerRatio: this.trigger.ratio,
			gatewayTypes2GatewayData: {
				telegram: {
					name: 'Telegram',
					icon: 'fa-brands fa-telegram',
					color: 'telegram',
				},
				phone: {
					name: 'Phone',
					icon: 'fa-light fa-phone-rotary',
					color: 'primary',
				},
				mail: {
					name: 'Email',
					icon: 'fa-light fa-envelope',
					color: 'primary',
				},
				webhook: {
					name: 'Webhook',
					icon: 'fa-light fa-cloud',
					color: 'primary',
				},
			},
			gatewayStates: {
				'telegram': this.gatewayTypeActive('telegram'),
				'phone': this.gatewayTypeActive('phone'),
				'mail': this.gatewayTypeActive('mail'),
				'webhook': this.gatewayTypeActive('webhook'),
			},
		}
	},
	methods: {
		gatewayTypeActive(gatewayType) {
			return this.trigger.gateways.filter(val => val.type == gatewayType).length > 0
		},
		save() {
			this.saving = true
			this.updateTrigger({
				triggerId: this.trigger.triggerId,
				ratio: this.triggerRatio,
				gateways: this.activeGatewayIds,
			}).then(() => {
				setTimeout(() => {
					this.saving = false
					this.savingComplete = true
					setTimeout(() => this.savingComplete = false, 1500)
				}, 500)
			})
		},
		...mapActions({
			updateTrigger: 'notifications/updateTrigger',
		})
	},
	computed: {
		activeGatewayIds: function() {
			return this.gateways
				.filter(gateway => this.gatewayStates[gateway.type] == true)
				.map(gateway => gateway.gatewayId)
		},
		...mapGetters({
			gateways: 'notifications/gateways',
			privacy: 'settings/privacy',
		}),
	},
}
</script>

<style>

</style>
