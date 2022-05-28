<template>
	<q-item>
		<q-item-section avatar top>
			<q-icon name="fa-light fa-phone-rotary" color="primary" />
		</q-item-section>
		<q-item-section>
			<q-item-label>
				Phone Call
				<q-badge rounded color="positive" text-color="white">
					<q-icon
						name="fa-solid fa-circle-check"
						size="14px"
					/> &nbsp;active
				</q-badge>
			</q-item-label>
			<q-item-label caption>Dobby will call you. Especially useful during the night.</q-item-label>
			<q-item-label caption></q-item-label>
		</q-item-section>
		<q-item-section side top>
			<q-btn flat dense rounded icon="fa-light fa-circle-ellipsis-vertical" class="q-pt-none">
				<q-menu
					fit
					auto-close
					transition-show="jump-down"
					transition-hide="jump-up"
				>
					<div class="row no-wrap q-pa-md">
						<div class="column flex flex-center q-pa-md">
							<q-avatar size="50px">
								<q-icon name="fa-light fa-phone-rotary" color="primary" />
							</q-avatar>
						</div>
						<q-separator vertical inset class="q-mx-lg" />
						<div class="column">
							<q-btn class="q-mt-sm" :color="($q.dark.isActive) ? 'primary' : 'accent'" rounded outline icon="fa-light fa-gear" :label="$t('Configure')" v-close-popup />
							<q-btn class="q-mt-sm" :color="($q.dark.isActive) ? 'primary' : 'accent'" rounded outline icon="fa-light fa-phone-volume" :label="$t('Test Call')" v-close-popup />
						</div>
					</div>
				</q-menu>
			</q-btn>
		</q-item-section>
	</q-item>
</template>

<script>
export default {
	name: 'PhoneChannel',
	components: {

  },
}
</script>

<style>

</style>
