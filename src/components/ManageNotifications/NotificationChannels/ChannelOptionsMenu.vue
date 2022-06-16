<template>
	<q-btn flat dense round icon="fa-light fa-circle-ellipsis-vertical" class="q-pt-none">
		<q-menu
			auto-close
			transition-show="jump-down"
			transition-hide="jump-up"
			class="q-pa-md"
			anchor="bottom end"
			self="top right"
		>
			<div class="row no-wrap">
				<div class="column flex flex-center">
					<q-avatar
						:icon="icon"
						:color="iconColor"
						size="xl"
						text-color="white"
					/>
				</div>
				<q-separator vertical class="q-mx-md" />
				<div class="column flex flex-center q-gutter-sm">
					<slot></slot>
				</div>
			</div>
		</q-menu>
	</q-btn>
</template>

<script>
export default {
	props: {
		'icon': {
			type: String,
			required: true,
		},
		iconColor: {
			type: String,
			default: 'white',
			required: false,
		},
	}
}
</script>

<style>

</style>
