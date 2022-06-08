<template>
	<q-card flat v-for="(triggerList, vaultId) in triggersByVault" :key="vaultId">

		<q-card-section v-if="vault(vaultId)">
			<div class="row items-center no-wrap">
				<div class="col text-h6 ellipsis">
					<q-icon name="fa-light fa-box-usd" size="sm" class="q-mr-sm" />
					<span v-if="vault(vaultId).name.length > 0">{{ vault(vaultId).name }}</span>
					<span v-else>
						<span v-if="!privacy">{{ vaultId }}</span>
						<span v-else class="text-body1">🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦</span>
					</span>
				</div>

				<div class="col-auto">
					<q-btn
						label="trigger"
						color="grey-7"
						flat
						dense
						rounded
						icon="fa-light fa-circle-plus"
					/>
				</div>
			</div>
		</q-card-section>

		<q-card-section v-if="triggerList.length == 0">
			No Triggers --> make some
		</q-card-section>
		<q-card-section v-if="triggerList.length > 0" class="q-px-none q-pt-none">
			<q-list>
				<!--

					[
						{ "triggerId": 4, "ratio": 152, "type": "info", "vaultId": "33619a6f9ede32d007cbcd1732fef80595df2a5d563a9558f00cfa08648b7708", "gateways": [ { "gatewayId": 2, "type": "telegram", "value": "710979903" } ] },
						{ "triggerId": 3, "ratio": 151, "type": "warning", "vaultId": "33619a6f9ede32d007cbcd1732fef80595df2a5d563a9558f00cfa08648b7708", "gateways": [ { "gatewayId": 2, "type": "telegram", "value": "710979903" } ] }
					]

				-->

				<q-expansion-item
					v-for="trigger in triggerList"
					:key="trigger.triggerId"
				>
					<template v-slot:header>
						<q-item-section avatar>
							<q-avatar color="accent" text-color="white" font-size="1rem" class="text-center" size="lg">
								<span style="line-height:0.7em; padding-top: 8px;">
									{{ trigger.ratio }}<br/>
									<span style="font-size:0.8rem;">%</span>
								</span>
							</q-avatar>
						</q-item-section>
						<q-item-section side>
							<q-icon class="fa-light fa-arrow-right" />
						</q-item-section>
						<q-item-section no-wrap>
							<div class="row">

								<transition-group enter-active-class="animated flipInY" leave-active-class="animated flipOutY">
									<span v-for="gateway in trigger.gateways" :key="gateway.gatewayId" class="q-mr-sm">
										<q-avatar
											v-if="gateway.type == 'telegram'"
											key="telegram"
											size="md"
											dense
											color="telegram"
											text-color="white"
											icon="fa-brands fa-telegram"
										/>

										<q-avatar
											v-if="gateway.type == 'phone'"
											key="phone"
											size="md"
											color="primary"
											text-color="white"
											icon="fa-light fa-phone-rotary"
										/>

										<q-avatar
											v-if="gateway.type == 'mail'"
											key="mail"
											size="md"
											color="primary"
											text-color="white"
											icon="fa-light fa-envelope"
										/>

										<q-avatar
											v-if="gateway.type == 'webhook'"
											key="webhook"
											size="md"
											color="primary"
											text-color="white"
											icon="fa-light fa-cloud"
										/>
									</span>
								</transition-group>
							</div>
						</q-item-section>
					</template>

					<NotificationTriggerDetail :trigger="trigger" />

					<q-separator inset />

				</q-expansion-item>

			</q-list>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'

import NotificationTriggerDetail from 'src/components/ManageNotificationsNew/NotificationTriggers/NotificationTriggerDetails.vue'

export default {
	components: {
		NotificationTriggerDetail,
	},
	data() {
		return {

		}
	},
	methods: {
		/**
		 * returns a specific vault, found by it's id
		 */
		vault: function(vaultId) {
			return this.vaults.find(vault => vault.vaultId == vaultId) || false
		},

		markerLabel: (val) => {
			if (val%50 == 0) {
				console.log(val + ' %')
				return val + ' %'
			}
			return ''
		},

		markerLabelList: (min, max) => {

		}
	},
	computed: {
		/**
		 * Arranges triggers to vaults
		 */
		triggersByVault: function() {
			let vaultTriggers = {}
			this.triggers.forEach(function (trigger) {
				if (typeof vaultTriggers[trigger.vaultId] == 'undefined') {
					vaultTriggers[trigger.vaultId] = []
				}
				vaultTriggers[trigger.vaultId].push(trigger)
				vaultTriggers[trigger.vaultId].sort(( a, b ) => {
					if ( a.ratio < b.ratio ){return 1}
					if ( a.ratio > b.ratio ){return -1}
					return 0;
				})
			})
			return vaultTriggers
		},
		...mapGetters({
			vaults: 'account/vaults',
			triggers: 'notifications/triggers',
			gateways: 'notifications/gateways',
			privacy: 'settings/privacy',
		}),
	},

}
</script>

<style>

</style>
