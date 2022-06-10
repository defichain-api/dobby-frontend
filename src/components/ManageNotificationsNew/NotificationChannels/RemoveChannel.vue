<template>
	<q-btn
		:rounded="rounded"
		:outline="outline"
		:label="label"
		:color="color"
		:unelevated="unelevated"
		@click="askForPermission()"
		:icon="icon"
		:disable="loading"
	/>

</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'RemoveChannel',
	props: {
		channelId: {
			type: Number,
			required: true,
		},
		label: {
			required: true,
		},
		color: {
			required: true,
		},
		icon: {
			required: false,
		},
		rounded: {
			default: false
		},
		outline: {
			default: false
		},
		unelevated: {
			default: false
		},
	},
	data() {
		return {
			loading: false,
		}
	},
	methods: {
		askForPermission: function () {
			this.loading = true
			this.$q.notify({
				group: 'gatewayRemove',
				type: 'warning',
				message: 'Channel has been removed. You no longer receive messages there.',
				actions: [
					{
						label: 'yes, remove',
						color: 'white',
						icon: 'fa-light fa-circle-trash',
						handler: () => this.removeChannel(),
					},
				]
			})
		},
		removeChannel: function () {
			this.$api.delete("/user/gateways", {data: { "gateway_id": this.channelId }})
				.then((result) => {
					this.loading = false
					this.fetchGateways()
					this.$q.notify({
						group: 'gatewayRemove',
						type: 'positive',
						message: 'Channel has been removed. You no longer receive messages there.',
					})
				})
		},
		...mapActions({
			fetchGateways: 'notifications/fetchGateways',
		})
	}
}
</script>
