<template>
	<div class="card text-bg-danger mb-3" style="max-width: 18rem;">
		<div class="card-header">Excepción captada</div>
		<div class="card-body">
			<h5 class="card-title">{{ props.title }}</h5>
			<p class="card-text">{{ props.content }}</p>
		</div>
	</div>

</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		default: "Ha ocurrido un error"
	},
	content: String
});
</script>

<style lang="scss" scoped>

</style>