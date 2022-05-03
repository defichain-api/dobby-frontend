<template>
	<q-card flat>
		<q-inner-loading
			:showing="requestRunning"
			color="primary"
		/>
		<q-card-section class="q-py-sm">
			<div class="text-body1"><q-icon name="fal fa-hourglass-half" class="q-mr-sm" />Next Price Tick in...</div>
		</q-card-section>
		<q-separator inset />
		<q-card-section class="row q-py-sm text-center">
			<div class="col-5">
				<div class="text-primary text-h4 q-mt-sm"><span style="font-size:0.7em">~</span>{{ nextTick.minutes_left }}<span style="font-size:0.7em"> min</span></div>
			</div>
			<div class="col-3">
				<div>at block</div>
				<div v-if="nextTick.block_height" class="text-primary text-body1">{{ nextTick.block_height.toLocaleString(locale, {maximumFractionDigits: 0}) }}</div>
			</div>
			<div class="col-4">
				<div>last tick</div>
				<div class="text-primary text-body1">{{ moment(nextTick.time).format('LT') }}</div>
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: 'NextPriceTicker',
	created() {
		this.moment = moment
	},
	computed: {
		locale: function() {
			return this.$root.$i18n.locale
		},
		...mapGetters({
			requestRunning: 'requestRunning',
			nextTick: 'chain/nextTick',
		}),
	}
}
</script>

<style>

</style>
