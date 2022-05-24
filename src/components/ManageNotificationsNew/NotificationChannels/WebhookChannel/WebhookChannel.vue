<template>
	<q-item>
		<q-item-section avatar top>
			<q-icon name="fa-light fa-cloud" color="primary" />
		</q-item-section>
		<q-item-section>
			<q-item-label>
				Web Hook
				<q-badge rounded color="warning" text-color="white">
					<q-icon
						name="fa-solid fa-circle-xmark"
						size="14px"
					/> &nbsp;not set up yet
				</q-badge>
			</q-item-label>
			<q-item-label caption>For the nerds</q-item-label>
		</q-item-section>
		<q-item-section side top>
			<q-btn flat dense rounded icon="fa-light fa-circle-plus" class="q-pt-none" />
		</q-item-section>
	</q-item>
</template>

<script>
export default {
	name: 'WebhookChannel',
	components: {

  },
}
</script>

<style>

</style>
