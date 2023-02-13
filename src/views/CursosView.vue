<template>
	<h1 class="text-center">Cursos</h1>
	<ErrorComponent v-if="state.api.error" :content="state.api.error.toString()" />

	<!-- Agregar un nuevo curso -->
	<section>
		<form class="p-3" @submit.prevent="submitForm">
			<div class="row">
				<div class="mb-3">
					<label for="inputName" class="form-label">Nombre del curso:</label>
					<input type="text" class="form-control border border-secondary" id="inputName"
						v-model="state.form.nombre">
				</div>
				<div class="mb-3">
					<label for="inputName" class="form-label">Descripcion del curso:</label>
					<textarea type="text" class="form-control border border-secondary" id="inputName"
						v-model="state.form.descripcion"></textarea>
				</div>
			</div>
			<button class="btn btn-primary" type="submit">Registrar Curso</button>
		</form>
	</section>

	<!-- Mostrar diferentes cursos -->
	<section>
		<div v-if="state.api.loading" class="d-flex justify-content-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
		</div>
		<CursoComponent v-else class="m-1" v-for="item in state.api.data" :key="item.id" :curso="item"
			@matricular="emitMatricular" @editar="onEdit" />
	</section>

	<!-- Seleccionar matricula -->
	<div class="modal" tabindex="-1" id="selectModal" v-if="state.currentModal === 0">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Matricular a un estudiante</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>Seleccione el estudiante que va a matricular:</p>
					<div class="col">
						<div class="list-group" id="list-tab" role="tablist">
							<a v-for="item in state.api.aux" :key="item.id"
								class="list-group-item list-group-item-action" :id="`${item.username}`"
								data-bs-toggle="list" href="#" @click="selectUser(item.id)" role="tab"
								aria-controls="list-home">
								{{ item.first_name }} {{ item.last_name }}</a>
						</div>
					</div>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" @click="matricular">Matricular</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal" tabindex="-1" id="editModal" v-if="state.currentModal === 1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Modificar Usuario</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="p-3" @submit.prevent="updateCurso">
						<div class="mb-3 row">
							<label for="editInputName" class="form-label">Nombre de usuario:</label>
							<input type="text" class="form-control border border-secondary" id="editInputName"
								v-model="state.edit.cursoinfo.nombre">
						</div>
						<div class="mb-3 row">
							<label for="editInputDescripcion" class="form-label">Correo electrónico:</label>
							<textarea class="form-control border border-secondary" id="editInputDescripcion"
								v-model="state.edit.cursoinfo.descripcion"></textarea>
						</div>
						<button class="btn btn-primary" type="submit">Actualizar Curso</button>
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
import { nextTick, onMounted, reactive } from 'vue';
import { Modal } from 'bootstrap'
import axios, { AxiosError } from 'axios';
import ErrorComponent from '@/components/ErrorComponent.vue';
import CursoComponent from '@/components/CursoComponent.vue';

import { useAuthStore } from '@/js/auth';
const authStore = useAuthStore();

const state = reactive({
	currentModal: 0,
	registro: {
		usuario: null,
		curso: null
	},
	form: {
		nombre: null,
		descripcion: null
	},
	api: {
		loading: true,
		data: null,
		aux: null,
		error: null
	},
	edit: {
		id: null,
		error: null,
		cursoinfo: {
			nombre: null,
			descripcion: null
		}
	}
});

onMounted(async () => {
	try {
		state.api.data = await (await axios.get(api.cursos, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } })).data;
		state.api.aux = await (await axios.get(api.usuarios, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } })).data

		state.api.aux.forEach(e => { delete e.cursos; delete e.password });

		for (var i in state.api.data) {
			if (!state.api.data[i].estudiantes.empty) {
				state.api.data[i].estudiantes = await Promise.all(
					state.api.data[i].estudiantes.map(async e => {
						return state.api.aux.filter(u => (u.id == e))[0];
					})
				)
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
		await axios.post(api.cursos, state.form, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.api.error = e;
		console.error(e);
	}
}

function onEdit(id) {
	state.edit.id = id;
	state.edit.cursoinfo = Object.assign({}, state.api.data.filter(e => (e.id == id))[0]);
	delete state.edit.cursoinfo.id;
	delete state.edit.cursoinfo.estudiantes;
	state.currentModal = 1;
	nextTick(() => new Modal('#editModal', {}).show());
}

function emitMatricular(idCurso) {
	state.registro.curso = idCurso;
	state.currentModal = 0;
	nextTick(() => new Modal('#selectModal', {}).show());
}

function selectUser(id) {
	state.registro.usuario = id;
}

async function matricular() {
	try {
		await axios.post(api.registros, state.registro, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.api.error = e;
		console.error(e);
	}
}

async function updateCurso() {
	console.log("UPDATE!");
	try {
		await axios.put(`${api.cursos}${state.edit.id}/`, state.edit.cursoinfo, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
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