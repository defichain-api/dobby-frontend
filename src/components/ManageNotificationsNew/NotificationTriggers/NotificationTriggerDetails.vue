<template>
	<q-card flat>
		<q-card-section>
			<p class="text-center">
				When collateral ratio turns near to...
			</p>
			<div class="row">
				<q-slider
					class="q-mx-sm"
					label
					label-always
					switch-label-side
					v-model="triggerRatio"
					:label-value="triggerRatio + '%'"
					:min="vault(vaultId).loanScheme.minCollateral +1"
					:max="vault(vaultId).loanScheme.minCollateral * 3"
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
			<q-btn
				v-if="!createNewTrigger"
				class="col-2"
				rounded
				outline
				icon="fa-light fa-trash"
				size="md"
				color="negative"
				@click="remove()"
			/>
			<q-btn
				class="col-9 q-mb-sm"
				rounded
				outline
				color="primary"
				@click="(createNewTrigger) ? create() : update()"
				:loading="saving"
				:disable="activeGatewayIds.length == 0 || savingComplete"
			>
				<span v-if="!savingComplete">
					<q-icon name="fa-light fa-floppy-disk" />
					<span v-if="createNewTrigger" class="q-ml-sm">Create trigger</span>
					<span v-else class="q-ml-sm">Save</span>
				</span>
				<span v-if="savingComplete">
					<q-icon name="fa-light fa-check" />
				</span>
			</q-btn>
			<span v-if="createNewTrigger" class="text-center">You can add multiple trigger by simply changing the values and save again</span>
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
		createNewTrigger: {
			required: false,
			type: Boolean,
		},
		vaultId: {
			required: true,
			type: String,
		}
	},
	data() {
		return {
			saving: false,
			savingComplete: false,
			creatingComplete: false,

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
		create() {
			this.saving = true
			this.createTrigger({
				vaultId: this.vaultId,
				ratio: this.triggerRatio,
				gateways: this.activeGatewayIds,
				type: 'info',
			}).then(() => {
				setTimeout(() => {
					this.saving = false
					this.savingComplete = true
					setTimeout(() => this.savingComplete = false, 1500)
				}, 500)
			})
		},
		update() {
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
		remove() {
			this.removeTrigger(this.trigger.triggerId)
		},
		...mapActions({
			createTrigger: 'notifications/createTrigger',
			updateTrigger: 'notifications/updateTrigger',
			removeTrigger: 'notifications/removeTrigger',
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
			vault: 'account/vault',
		}),
	},
}
</script>

<style>

</style>
