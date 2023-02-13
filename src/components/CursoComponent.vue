<template>
	<ErrorComponent v-if="state.error" title="Error en acción" :content="state.error" />
	<div v-else class="card text-bg-light mb-3" style="max-width: 20rem;">
		<div class="card-body">
			<h5 class="card-title">{{ props.curso.nombre }}</h5>
			<p class="card-text">{{ props.curso.descripcion }}</p>
			<b>Usuarios Registrados:</b>
			<ul class="list-group my-2">
				<li class="list-group-item" v-for="item in props.curso.estudiantes" :key="item.id">{{ item.first_name }}
					{{ item.last_name }}
					<button class="btn ms-2 btn-sm btn-danger rounded-pill"
						@click.prevent="deleteRegistro(item.id)">Retirar</button>
				</li>
				<li class="list-group-item">
					<a class="btn btn-success rounded-pill" href="#" @click.prevent="onMatricular">Matricular
						Usuario</a>
				</li>
			</ul>

			<div class="row mt-3">
				<a href="#" class="col btn btn-primary mx-2" @click.prevent="onEditar">Editar</a>
				<a href="#" class="col btn btn-danger mx-2" @click.prevent="deleteCurso">Borrar</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import { api } from '@/js/api'
import axios, { AxiosError } from 'axios';
import ErrorComponent from './ErrorComponent.vue';

import { useAuthStore } from '@/js/auth';
const authStore = useAuthStore();

const state = reactive({
	error: false
});


const props = defineProps({
	curso: Object
})

const emit = defineEmits(['matricular', 'editar'])

function onMatricular() {
	emit('matricular', props.curso.id)
}

function onEditar() {
	emit('editar', props.curso.id)
}

async function deleteRegistro(estudiante) {
	try {
		await axios.delete(api.registros, { data: { "usuario": estudiante, "curso": props.curso.id }, headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.error = e;
	}
}

async function deleteCurso() {
	try {
		await axios.delete(`${api.cursos}${props.curso.id}/`, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.error = e;
	}
}

</script>

<style lang="scss" scoped>

</style>