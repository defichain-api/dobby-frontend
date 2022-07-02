<template>
	<q-card flat>
		<q-card-section class="q-pb-none">
			<div class="text-h6">Messages Delivered</div>
		</q-card-section>
		<q-card-section class="q-pb-none text-body1">
			Yesterday
		</q-card-section>
		<q-card-section class="container text-center">
			<div class="row">
				<div class="col-4 text-left">
					<div class="text-h4 text-primary">{{ this.latest.messages.sum_messages.toLocaleString(locale) }}</div>
					<div class="text-caption">Total Sent</div>
				</div>
				<div class="col-2">
					<q-avatar color="telegram" font-size="0.6em" text-color="white" size="md" icon="fa-brands fa-telegram-plane" />
					<div class="text-body1 text-primary">{{ this.latest.messages?.gateways?.telegram?.toLocaleString(locale) }}</div>
				</div>
				<div class="col-2">
					<q-avatar color="primary" font-size="0.6em" text-color="white" size="md" icon="fa-light fa-phone-rotary" />
					<div class="text-body1 text-primary">{{ this.latest.messages?.gateways?.phone?.toLocaleString(locale) || 0 }}</div>
				</div>
				<div class="col-2 ">
					<q-avatar color="green" font-size="0.6em" text-color="white" size="md" icon="fa-light fa-mailbox" />
					<div class="text-body1 text-primary">{{ this.latest.messages?.gateways?.mail?.toLocaleString(locale) }}</div>
				</div>
				<div class="col-2 ">
					<q-avatar color="accent" font-size="0.5em" text-color="white" size="md" icon="fa-light fa-cloud" />
					<div class="text-body1 text-primary">{{ this.latest.messages?.gateways?.webhook?.toLocaleString(locale) }}</div>
				</div>
			</div>
		</q-card-section>
		<q-card-section class="container q-pt-none">
			<div class="row">
				<div class="col-12 text-overline">
					Types
				</div>
			</div>
			<div class="row">
				<div class="col-4">
					<div class="text-h5 text-primary">{{ this.latest.messages?.types?.summary?.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">Summary</div>
				</div>
				<div class="col-4">
					<div class="text-h5 text-primary">{{ this.latest.messages?.types?.trigger_warnings?.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">Warning</div>
				</div>
				<!--
				<div class="col-3">
					<div class="text-h6 text-primary">{{ this.latest.messages?.types?.may_liquidate?.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">May Liquidate</div>
				</div>
				<div class="col-3">
					<div class="text-h6 text-primary">{{ latest.messages?.types?.in_liquidation?.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">In Liquidation</div>
				</div>
				-->
			</div>
		</q-card-section>

		<q-separator inset	/>

		<q-card-section class="q-pb-none text-body1">
			Overall since Dec. 2021
		</q-card-section>
		<q-card-section class="container text-center">
			<div class="row">
				<div class="col-4 text-left">
					<div class="text-h5 text-primary">{{historySumChannels.overall.toLocaleString(locale) }}</div>
					<div class="text-caption">Total Sent</div>
				</div>
				<div class="col-2">
					<q-avatar color="telegram" font-size="0.6em" text-color="white" size="md" icon="fa-brands fa-telegram-plane" />
					<div class="text-body1 text-primary">{{ historySumChannels.telegram.toLocaleString(locale) }}</div>
				</div>
				<div class="col-2">
					<q-avatar color="primary" font-size="0.6em" text-color="white" size="md" icon="fa-light fa-phone-rotary" />
					<div class="text-body1 text-primary">{{ historySumChannels.phone.toLocaleString(locale) || 0 }}</div>
				</div>
				<div class="col-2 ">
					<q-avatar color="green" font-size="0.6em" text-color="white" size="md" icon="fa-light fa-mailbox" />
					<div class="text-body1 text-primary">{{ historySumChannels.mail.toLocaleString(locale) }}</div>
				</div>
				<div class="col-2 ">
					<q-avatar color="accent" font-size="0.5em" text-color="white" size="md" icon="fa-light fa-cloud" />
					<div class="text-body1 text-primary">{{ historySumChannels.webhook.toLocaleString(locale) }}</div>
				</div>
			</div>
		</q-card-section>
		<q-card-section class="container q-pt-none">
			<div class="row">
				<div class="col-12 text-overline">
					Types
				</div>
			</div>
			<div class="row">
				<div class="col-4">
					<div class="text-h5 text-primary">{{historySumTypes.summary.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">Summary</div>
				</div>
				<div class="col-4">
					<div class="text-h5 text-primary">{{historySumTypes.warning.toLocaleString(locale) || 0 }}</div>
					<div class="text-caption">Warning</div>
				</div>
			</div>
		</q-card-section>

		<q-separator inset	/>

		<q-card-section>
			<div class="text-body1">History</div>
		</q-card-section>
		<q-card-section>
			<area-chart :data="history" :points="false" :colors="[getColor('accent')]" :download="true" style="height: 200px;" />
		</q-card-section>
		<q-card-section>
			<line-chart :data="historyChannels" :points="false" :colors="[getColor('telegram'),  getColor('primary'), getColor('green'), getColor('accent')]" :download="true" style="height: 200px;" />
		</q-card-section>
		<q-card-actions>
        <q-space />
        <q-btn
					:label="expandedChannels ? 'show less' : 'show charts for single channels'"
          color="grey"
          rounded
          flat
          dense
          :icon-right="expandedChannels ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expandedChannels = !expandedChannels"
        />
      </q-card-actions>
		<q-slide-transition>
			<q-card-section v-show="expandedChannels">
				<div class="text-body1 q-my-md">Telegram messages</div>
				<line-chart :data="singleHistoryChannel('telegram')" :points="false" :colors="[getColor('telegram')]" :download="true" style="height: 200px;" />
				<q-separator />

				<div class="text-body1 q-my-md">Phone calls</div>
				<line-chart :data="singleHistoryChannel('phone')" :points="false" :colors="[getColor('primary')]" :download="true" style="height: 200px;" />
				<q-separator />

				<div class="text-body1 q-my-md">Email messages</div>
				<line-chart :data="singleHistoryChannel('mail')" :points="false" :colors="[getColor('green')]" :download="true" style="height: 200px;" />
				<q-separator />

				<div class="text-body1 q-my-md">Webhook messages</div>
				<line-chart :data="singleHistoryChannel('webhook')" :points="false" :colors="[getColor('accent')]" :download="true" style="height: 200px;" />
			</q-card-section>
		</q-slide-transition>
		<q-separator inset	/>
		<q-card-section>
			<!-- <line-chart :data="historyTypes" :points="false" :colors="[getColor('accent'), getColor('primary'), getColor('secondary'),  getColor('negative')]" :download="true" style="height: 200px;" /> -->
			<line-chart :data="historyTypes" :points="false" :colors="[getColor('accent'), getColor('primary')]" :download="true" style="height: 200px;" />
		</q-card-section>
		<q-card-actions>
        <q-space />
        <q-btn
					:label="expandedTypes ? 'show less' : 'show charts for single message types'"
          color="grey"
          rounded
          flat
          dense
          :icon-right="expandedTypes ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expandedTypes = !expandedTypes"
        />
      </q-card-actions>
		<q-slide-transition>
			<q-card-section v-show="expandedTypes">
				<div class="text-body1 q-my-md">Summaries</div>
				<line-chart :data="singleHistoryType('summary')" :points="false" :colors="[getColor('accent')]" :download="true" style="height: 200px;" />
				<q-separator />

				<div class="text-body1 q-my-md">Warnings</div>
				<line-chart :data="singleHistoryType('trigger_warnings')" :points="false" :colors="[getColor('primary')]" :download="true" style="height: 200px;" />
				<q-separator />

				<!--
				<div class="text-body1 q-my-md">May Liquidate</div>
				<line-chart :data="singleHistoryType('may_liquidate')" :points="false" :colors="[getColor('secondary')]" :download="true" style="height: 200px;" />
				<q-separator />

				<div class="text-body1 q-my-md">In Liquidation</div>
				<line-chart :data="singleHistoryType('in_liquidation')" :points="false" :colors="[getColor('negative')]" :download="true" style="height: 200px;" />
				-->
			</q-card-section>
		</q-slide-transition>
	</q-card>
</template>

<script>
import { colors } from 'quasar'
const { getPaletteColor } = colors

export default {
	name: 'MessagesDelivered',
	props: {
		statistics: {
			required: true,
		},
	},
	data() {
		return {
			expandedChannels: false,
			expandedTypes: false,
		}
	},
	methods: {
		getColor(name) {
			return getPaletteColor(name)
		},
		singleHistoryType(type) {
			let collection = {}
			this.statistics.forEach(function(day) {
				collection[day.date] = day.messages.types[type]
			})
			return collection
		},
		singleHistoryChannel(channel) {
			let collection = {}
			this.statistics.forEach(function(day) {
				collection[day.date] = day.messages.gateways[channel]
			})
			return collection
		}
	},
	computed: {
		latest: function() {
			return this.statistics[0]
		},
		locale: function() {
			return this.$root.$i18n.locale
		},
		historySumChannels: function() {
			let collection = {
				overall: 0,
				telegram: 0,
				phone: 0,
				mail: 0,
				webhook: 0,
			}

			this.statistics.forEach(function(day) {
				collection.telegram +=  Math.floor(day.messages.gateways.telegram)
				collection.overall +=  Math.floor(day.messages.gateways.telegram)
			})

			this.statistics.forEach(function(day) {
				collection.phone +=  Math.floor(day.messages.gateways.phone)
				collection.overall +=  Math.floor(day.messages.gateways.phone)
			})

			this.statistics.forEach(function(day) {
				collection.mail +=  Math.floor(day.messages.gateways.mail)
				collection.overall +=  Math.floor(day.messages.gateways.mail)
			})

			this.statistics.forEach(function(day) {
				collection.webhook += Math.floor( day.messages.gateways.webhook)
				collection.overall += Math.floor( day.messages.gateways.webhook)
			})

			return collection
		},
		historySumTypes: function() {
			let collection = {
				overall: 0,
				summary: 0,
				warning: 0,
			}

			this.statistics.forEach(function(day) {
				collection.summary +=  Math.floor(day.messages.types.summary)
				collection.overall +=  Math.floor(day.messages.gateways.telegram)
			})

			this.statistics.forEach(function(day) {
				collection.warning +=  Math.floor(day.messages.types.trigger_warnings)
				collection.overall +=  Math.floor(day.messages.gateways.phone)
			})

			return collection
		},
		history: function() {
			let collection = {}
			this.statistics.forEach(function(day) {
				collection[day.date] = day.messages.sum_messages
			})
			return [{name:"All messages", data: collection}]
		},
		historyChannels: function() {
			let collection = []

			let tmp = {name: 'Telegram', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.gateways.telegram
			})
			collection.push(tmp)

			tmp = {name: 'Phone', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.gateways.phone
			})
			collection.push(tmp)

			tmp = {name: 'Email', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.gateways.mail
			})
			collection.push(tmp)

			tmp = {name: 'Webhook', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.gateways.webhook
			})
			collection.push(tmp)

			return collection
		},
		historyTypes: function() {
			let collection = []

			let tmp = {name: 'Summary', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.types.summary
			})
			collection.push(tmp)

			tmp = {name: 'Warning', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.types.trigger_warnings
			})
			collection.push(tmp)

			/*
			tmp = {name: 'May Liquidate', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.types.may_liquidate
			})
			collection.push(tmp)

			tmp = {name: 'In Liquidation', data: {}}
			this.statistics.forEach(function(day) {
				tmp['data'][day.date] = day.messages.types.in_liquidation
			})
			collection.push(tmp)
			*/

			return collection
		},
	},
}
</script>

<style lang="sass" scoped>
</style>
