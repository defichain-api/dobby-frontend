<template>
	<q-card flat v-if="!hasGateways">
		<q-card-section>
			Please set up at least one notification channel to manage your notification triggers.
		</q-card-section>
	</q-card>

	<div class="container q-ml-none">
		<div class="row items-start">
			<div class="col-xs-12 col-md-8 col-lg-6 q-pl-md col-xl-4">
				<q-card flat v-if="vaultsWithoutTriggers.length > 0 && hasGateways" class="bg-warning text-white">
					<q-card-section>
						<div class="text-h6"><q-icon name="fa-light fa-circle-exclamation" size="lg"/> You will not receive messages for some vaults</div>
					</q-card-section>
					<q-card-section class="q-mt-none">
						There are some vaults which do not have notification triggers set. Please add some:
					</q-card-section>
					<q-card-section>

						<div v-for="vault in vaultsWithoutTriggers" :key="vault.vaultId" class="col" @click="scrollToVault(vault.vaultId)">
							<div class="row items-center no-wrap">
								<div class="col text-h6 ellipsis">
									<q-icon name="fa-light fa-box-usd" size="sm" class="q-mr-sm" />
									<span v-if="!privacy">
										<span v-if="vault.name.length > 0">{{ vault.name }}</span>
										<span v-else>{{ vault.vaultId }}</span>
									</span>
									<span v-else class="text-body1">
										🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦🧦
									</span>
								</div>

								<div class="col-auto">
									<q-btn outline rounded @click="scrollToVault(vault.vaultId)" icon="fa-light fa-arrow-right" size="sm" />
								</div>
							</div>
						</div>

					</q-card-section>
				</q-card>
			</div>
		</div>
	</div>
	<div class="container q-ml-none">
		<div class="row items-start">
			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pl-md q-mb-md" v-for="(triggerList, vaultId) in triggersByVault" :key="vaultId">
				<q-card flat :ref="vaultId" >
				<!-- <q-card class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-4" flat v-for="(triggerList, vaultId) in triggersByVault" :key="vaultId" :ref="vaultId"> -->
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

							<div class="col-auto" v-if="hasGateways">
								<q-btn
									label="trigger"
									:color="(triggerList.length == 0) ? 'warning' : 'grey-7'"
									flat
									dense
									rounded
									icon="fa-light fa-circle-plus"
									@click="showCreateNewTriggerDialog[vaultId] = true"
								/>
							</div>
						</div>
					</q-card-section>

					<q-card-section v-if="triggerList.length == 0 && hasGateways" class="bg-warning text-right text-white text-body1 q-pr-lg">
						No triggers set. Add some <q-icon name="fa-light fa-arrow-up" size="lg" />
					</q-card-section>
					<q-card-section v-else class="q-px-none q-pt-none">
						<q-list>
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
														color="green"
														text-color="white"
														icon="fa-light fa-envelope"
													/>

													<q-avatar
														v-if="gateway.type == 'webhook'"
														key="webhook"
														size="md"
														color="accent"
														text-color="white"
														icon="fa-light fa-cloud"
													/>
												</span>
											</transition-group>
										</div>
									</q-item-section>
								</template>

								<NotificationTriggerDetails :trigger="trigger" :vaultId="vaultId" />

								<q-separator inset />
							</q-expansion-item>

						</q-list>
					</q-card-section>
					<q-dialog
						v-model="showCreateNewTriggerDialog[vaultId]"
						persistent
						maximized
						transition-show="slide-up"
						transition-hide="slide-down"
					>
						<q-card :class="{ 'bg-dark text-white': darkMode }">
							<q-bar class="bg-primary-dark">
								<q-space />
								<q-btn dense flat icon="close" color="white" v-close-popup>
									<q-tooltip class="bg-primary text-white">Close</q-tooltip>
								</q-btn>
							</q-bar>
							<NotificationTriggerDetails
								style="max-width: 400px; margin: 0 auto;"
								:trigger="{ratio: Math.floor(vault(vaultId).loanScheme.minCollateral * 1.5), gateways: []}"
								createNewTrigger
								:vaultId="vaultId"
							/>
						</q-card>
					</q-dialog>
				</q-card>
			</div>
		</div>
		<div class="row items-start">
			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pl-md q-mb-md">
				<InterestRateWarning />
			</div>
		</div>
		<div class="row items-start">
			<div class="col-12 q-ml-md q-mb-md text-h6">Settings</div>
			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pl-md q-mb-md">
				<TimeZone />
			</div>
			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pl-md q-mb-md">
				<SummaryInterval />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import NotificationTriggerDetails from 'src/components/ManageNotifications/NotificationTriggers/NotificationTriggerDetails.vue'
import InterestRateWarning from 'src/components/ManageNotifications/InterestRateWarning.vue'
import TimeZone from 'components/Settings/TimeZone.vue'
import SummaryInterval from 'components/Settings/SummaryInterval.vue'

export default {
	components: {
		NotificationTriggerDetails,
		InterestRateWarning,
		TimeZone,
		SummaryInterval,
	},
	data() {
		return {
			showCreateNewTriggerDialog: [],
		}
	},
	methods: {
		scrollToVault: function(vaultId) {
			this.$refs[vaultId][0].$el.scrollIntoView({behavior: "smooth"})
		}

	},
	computed: {
		/**
		 * Arranges triggers to vaults
		 */
		triggersByVault: function() {
			let vaultTriggers = {}

			// make a list of available vaults
			this.vaults.map(vault => vault.vaultId).forEach((vaultId) => {
				vaultTriggers[vaultId] = []
			})

			// fill available triggers into vault list
			this.triggers.forEach(function (trigger) {
				vaultTriggers[trigger.vaultId].push(trigger)
				vaultTriggers[trigger.vaultId].sort(( a, b ) => {
					if ( a.ratio < b.ratio ){return 1}
					if ( a.ratio > b.ratio ){return -1}
					return 0;
				})
			})
			return vaultTriggers
		},
		vaultsWithoutTriggers: function () {
			if (Object.keys(this.triggersByVault).length < 1) return []
			return this.vaults.filter((vault) => {
				return (vault.vaultId in this.triggersByVault && this.triggersByVault[vault.vaultId].length < 1)
			})
		},
		darkMode: function () {
			return this.$q.dark.isActive
		},
		...mapGetters({
			vaults: 'account/vaults',
			vault: 'account/vault',
			triggers: 'notifications/triggers',
			hasGateways: 'notifications/hasGateways',
			gateways: 'notifications/gateways',
			privacy: 'settings/privacy',
		}),
	},

}
</script>

<style>

</style>
