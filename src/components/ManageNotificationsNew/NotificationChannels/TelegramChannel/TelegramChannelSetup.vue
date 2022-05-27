<template>
	<q-dialog
		persistent
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<q-card :class="{ 'bg-dark text-white': darkMode }">
			<q-bar>
				<q-space />

				<q-btn dense flat icon="close" v-close-popup>
					<q-tooltip class="bg-white text-primary">Close</q-tooltip>
				</q-btn>
			</q-bar>
			<div class="q-pa-md">
				<div class="text-h5 q-mb-md">
					<span v-if="!connectedTelegramGateway">Get notified via Telegram</span>
					<span v-else>Connected to Telegram</span>
					&nbsp;<q-icon name="fab fa-telegram" color="telegram" />
				</div>
				<p class="text-body1" v-if="!connectedTelegramGateway">
					Dobby kindly asks you to connect him to your Telegram account, so that he'll be able to send you
					messages.
				</p>
				<p class="caption text-weight-light" v-if="!connectedTelegramGateway">
					This is how it works:
					<ol>
						<li>Tap on the button below to open Telegram</li>
						<li>Once in Telegram, tap on the 'start' button to connect Dobby's Telegram bot with your Telegram account</li>
						<li>Wait for the message that your account has been connected</li>
						<li>Return to this app</li>
					</ol>
				</p>

				<q-btn
					v-if="!waitingForTelegramGateway && !connectedTelegramGateway && !isDemo"
					unelevated
					class="full-width"
					icon="fab fa-telegram"
					label="Connect to Telegram now"
					color="primary"
					@click="checkForTelegramGateway(); openTelegram(); waitingForTelegramGateway = true;"
				/>

				<q-card flat v-if="waitingForTelegramGateway" class="bg-accent text-white">
					<q-card-section class="row">
						<div class="col-3 q-pa-sm q-pl-none text-center">
							<q-icon name="fad fa-cauldron" size="xl"/>
						</div>
						<div class="col-9 q-pa-sm q-pl-md" style="border-left: 1px solid rgba(255,255,255,0.5);">
							Waiting for you to connect your Telegram account to the Dobby Telegram Bot
						</div>
					</q-card-section>

					<q-linear-progress indeterminate color="primary" style="height:10px" class="q-mt-sm" />
				</q-card>

				<q-card flat v-if="connectedTelegramGateway" class="bg-positive text-white">

					<q-card-section class="row no-wrap">
						<div class="column flex flex-center">
							<q-icon name="fad fa-badge-check" size="xl"/>
						</div>
						<q-separator vertical class="q-mx-md" style="background-color: rgba(255,255,255,0.5);" />
						<div class="column flex flex-center q-gutter-sm q-py-md q-pl-sm">
							Yay, Dobby is happy! Everything went just fine. His Telegram bot is now authorized to send you messages.
						</div>
					</q-card-section>

				</q-card>

				<div flat v-if="connectedTelegramGateway">
					<q-slide-transition>
						<q-card-section class="container q-px-none" v-if="receivedTestMessage == null">
							<div class="row">
								<div class="col-12 text-body1 text-center">
									Please let Dobby send you a test message:
								</div>
							</div>
							<div class="row q-my-md">
								<TestChannel
									v-if="hasGatewayType('telegram')"
									label="Test Telegram"
									channel="telegram"
									color="telegram"
									icon="fab fa-telegram-plane"
									rounded
									unelevated
									class="full-width"
									@click="sentTestMessage = true"
								/>
							</div>
							<div class="row" v-if="sentTestMessage">
								<div class="col-12 text-center">
									Have you received a message from Dobby in Telegram?
								</div>
							</div>
							<div class="row" v-if="sentTestMessage">
								<div class="col-8 q-pa-sm">
									<q-btn
										outline
										rounded
										dense
										icon="fal fa-check"
										class="full-width"
										@click="receivedTestMessage = true; showContact = false;"
										label="yes" />
								</div>
								<div class="col-4 q-pa-sm">
									<q-btn
										outline
										rounded
										dense
										icon="fal fa-check"
										class="full-width"
										@click="showContact = true"
										label="no" />
								</div>
							</div>
						</q-card-section>
					</q-slide-transition>

					<q-slide-transition>
						<q-card-section v-if="showContact">
							<div class="row">
								<div class="col-12 text-body1 text-center">
									Oh. Please retry.
								</div>
							</div>
							<div class="row" v-if="sentTestMessage">
								<div class="col-12 text-center">
									If the second try does not work either, please ask for support in <br /><q-btn outline rounded @click="toTelegramGroup()">Dobby's Telegram group</q-btn>
								</div>
							</div>
						</q-card-section>
					</q-slide-transition>

					<q-slide-transition>
						<q-card-section v-if="receivedTestMessage" class="container">
							<div class="row">
								That's it! You can now make some notifications triggers :)
								<q-btn
									rounded
									dense
									color="accent"
									class="full-width q-mt-md"
									label="ok, got it"
									v-close-popup
								/>
							</div>
						</q-card-section>
					</q-slide-transition>

				</div>
			</div>
		</q-card>
	</q-dialog>
</template>

<script>
import TestChannel from 'components/ManageNotifications/NotificationChannels/TestChannel.vue'

import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
	name: 'ConnectTelegramChannel',
	components: {
		TestChannel,
	},
	data() {
		return {
			waitingForTelegramGateway: false,
			waitingForTelegramLoop: null,
			connectedTelegramGateway: false,
			sentTestMessage: false,
			receivedTestMessage: null,
			showContact: false,
		}
	},
	methods: {
		openTelegram() {
			openURL(process.env.TELEGRAM_BOT_LINK + '?start=' + this.userId)
		},
		toTelegramGroup() {
			openURL(process.env.TELEGRAM_GROUP_LINK)
		},
		checkForTelegramGateway() {
			this.waitingForTelegramLoop = setInterval(() => {
				this.fetchGateways()
					.then(() => {
						if (this.hasGatewayType('telegram')) {
							clearTimeout(this.waitingForTelegramLoop)
							this.waitingForTelegramGateway = false
							this.connectedTelegramGateway = true
						}
				})
			}, 2500)
		},
		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
		})
	},
	computed: {
		darkMode: function () {
			return this.$q.dark.isActive
		},
		...mapGetters({
			isDemo: 'account/isDemo',
			userId: 'account/userId',
			hasGatewayType: 'notifications/hasGatewayType',
		}),
	}
}
</script>

<style>

</style>
