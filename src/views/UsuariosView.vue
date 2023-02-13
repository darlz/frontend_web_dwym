<template>
	<h1 class="text-center">Usuarios</h1>
	<ErrorComponent v-if="state.api.error != null" :content="state.api.error.toString()" />

	<!-- Agregar un nuevo usuario -->
	<section>
		<form class="p-3" @submit.prevent="submitForm">
			<div class="row">
				<div class="mb-3 col-3">
					<label for="inputUsername" class="form-label">Nombre de usuario:</label>
					<input type="text" class="form-control border border-secondary" id="inputUsername"
						v-model="state.form.username">
				</div>
				<div class="mb-3 col-4">
					<label for="inputEmail" class="form-label">Correo electrónico:</label>
					<input type="email" class="form-control border border-secondary" id="inputEmail"
						v-model="state.form.email">
				</div>
				<div class="mb-3 col-3">
					<label for="inputFirstname" class="form-label">Primer nombre:</label>
					<input type="text" class="form-control border border-secondary" id="inputFirstname"
						v-model="state.form.first_name">
				</div>
				<div class="mb-3 col-3">
					<label for="inputLastname" class="form-label">Segundo nombre:</label>
					<input type="text" class="form-control border border-secondary" id="inputLastname"
						v-model="state.form.last_name">
				</div>
				<div class="mb-3 col-6">
					<label for="inputPassword" class="form-label">Contraseña:</label>
					<input type="password" class="form-control border border-secondary" id="inputPassword"
						v-model="state.form.password">
				</div>
			</div>
			<button class="btn btn-primary" type="submit">Registrar Usuario</button>
		</form>
	</section>

	<!-- Listado de usuarios -->
	<section>
		<div v-if="state.api.loading" class="d-flex justify-content-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
		</div>
		<UsuarioComponent v-else class="m-1" v-for="item in state.api.data" :key="item.id" :usuario="item"
			@editUser="onEdit" />
	</section>

	<div class="modal" tabindex="-1" id="editModal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Modificar Usuario</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="p-3" @submit.prevent="updateUser">
						<div class="row">
							<div class="mb-3 col">
								<label for="editInputUsername" class="form-label">Nombre de usuario:</label>
								<input type="text" class="form-control border border-secondary" id="editInputUsername"
									v-model="state.edit.userinfo.username">
							</div>
							<div class="mb-3 col">
								<label for="editInputEmail" class="form-label">Correo electrónico:</label>
								<input type="email" class="form-control border border-secondary" id="editInputEmail"
									v-model="state.edit.userinfo.email">
							</div>
						</div>
						<div class="row">
							<div class="mb-3 col">
								<label for="editInputFirstname" class="form-label">Primer nombre:</label>
								<input type="text" class="form-control border border-secondary" id="editInputFirstname"
									v-model="state.edit.userinfo.first_name">
							</div>
							<div class="mb-3 col">
								<label for="editInputLastname" class="form-label">Segundo nombre:</label>
								<input type="text" class="form-control border border-secondary" id="editInputLastname"
									v-model="state.edit.userinfo.last_name">
							</div>

						</div>
						<div class="row">
							<div class="mb-3 col">
								<label for="editInputPassword" class="form-label">Contraseña:</label>
								<input type="password" class="form-control border border-secondary"
									id="editInputPassword" v-model="state.edit.userinfo.password">
							</div>
						</div>
						<button class="btn btn-primary" type="submit">Actualizar Usuario</button>
					</form>

					<h3 v-if="state.edit.error">Ha ocurrido un error:</h3>
					<pre class="text-danger">{{ state.edit.error }}</pre>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup>
import { api } from '@/js/api';
import { onMounted, reactive } from 'vue';
import { Modal } from 'bootstrap';
import axios, { AxiosError } from 'axios';
import ErrorComponent from '@/components/ErrorComponent.vue';
import UsuarioComponent from '@/components/UsuarioComponent.vue';

import { useAuthStore } from '@/js/auth';
const authStore = useAuthStore();

const state = reactive({
	api: {
		loading: true,
		data: null,
		aux: null,
		error: null
	},
	form: {
		username: null,
		email: null,
		password: null,
		first_name: null,
		last_name: null
	},
	edit: {
		id: null,
		error: null,
		userinfo: {
			username: null,
			email: null,
			password: null,
			first_name: null,
			last_name: null
		}
	}
});

function onEdit(id) {
	state.edit.id = id;
	state.edit.userinfo = state.api.data.filter(e => (e.id == id))[0];
	delete state.edit.userinfo.id;
	delete state.edit.userinfo.cursos;
	new Modal('#editModal', {}).show();
}

onMounted(async () => {
	try {
		state.api.data = await (await axios.get(api.usuarios, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } })).data;
		state.api.aux = await (await axios.get(api.cursos, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } })).data;
		state.api.data.forEach(e => { delete e.password });

		for (var i in state.api.data) {
			if (!state.api.data[i].cursos.empty) {
				state.api.data[i].cursos = await Promise.all(state.api.data[i].cursos.map(async e => {
					return state.api.aux.filter(u => (u.id == e))[0];
				}))
			}
		}
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.api.error = e;
		console.error(e);
	} finally {
		state.api.loading = false;
	}
});

async function submitForm() {
	try {
		await axios.post(api.usuarios, state.form, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.api.error = e;
		console.error(e);
	}
}

async function updateUser() {
	console.log("UPDATE!");
	try {
		await axios.put(`${api.usuarios}${state.edit.id}/`, state.edit.userinfo, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.edit.error = e.response.data;
		console.error(e);
	}
}
</script>

<style lang="scss" scoped>

</style>