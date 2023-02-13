<template>
	<div class="vh-100 d-flex justify-content-center align-items-center">
		<div class="col-md-4 p-5 rounded-3 border">
			<h2 class="text-center mb-4 text-primary">Iniciar Sesión</h2>
			<form @submit.prevent="submitLogin">
				<div class="mb-3">
					<label for="inputUsername" class="form-label">Nombre de usuario:</label>
					<input type="text" class="form-control border border-secondary" id="inputUsername"
						v-model="credentials.username">
				</div>
				<div class="mb-3">
					<label for="inputPassword" class="form-label">Contraseña:</label>
					<input type="password" class="form-control border border-secondary" id="inputPassword"
						v-model="credentials.password">
				</div>
				<div class="d-grid">
					<p class="text-danger" v-if="credentials.error">{{ credentials.error }}</p>
					<button class="btn btn-primary" type="submit">Continuar</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { AxiosError } from 'axios';
import { reactive } from 'vue';
import { useAuthStore } from '../js/auth';

const credentials = reactive({
	username: null,
	password: null,
	error: false,
});

const authStore = useAuthStore();

async function submitLogin() {
	try {
		await authStore.login(credentials.username, credentials.password);
		location.replace('/dashboard');
	} catch (e) {
		if (e instanceof AxiosError) {
			credentials.error = e.response.data.detail;
		}
		console.error(e);
	}
}
</script>

<style lang="scss" scoped>

</style>