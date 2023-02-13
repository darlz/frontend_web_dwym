<template>
	<ErrorComponent v-if="state.error" title="Error en acción" :content="state.error" />
	<div v-else class="card text-bg-light mb-3" style="max-width: 24em;">
		<div class="card-header">{{ props.usuario.username }}</div>
		<div class="card-body">
			<h5 class="card-title">{{ props.usuario.first_name }} {{ props.usuario.last_name }}</h5>
			<b>{{ props.usuario.email }}</b>
			<ul class="list-group my-2">
				<li class="list-group-item" v-for="item in props.usuario.cursos" :key="item.id">{{ item.nombre }}
					<button class="btn ms-2 btn-sm btn-danger rounded-pill"
						@click.prevent="deleteRegistro(item.id)">Retirar</button>
				</li>
			</ul>
			<div class="row mt-3">
				<a href="#" class="col btn btn-primary mx-2" @click.prevent="onEdit">Editar</a>
				<a href="#" class="col btn btn-danger mx-2" @click.prevent="deleteUsuario">Borrar</a>
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

const emit = defineEmits(['editUser'])

const state = reactive({
	error: false
});

const props = defineProps({
	usuario: Object
})

function onEdit() {
	emit('editUser', props.usuario.id)
}


async function deleteRegistro(curso) {
	try {
		await axios.delete(api.registros, { data: { "usuario": props.usuario.id, "curso": curso }, headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
		location.reload();
	} catch (e) {
		if (e instanceof AxiosError && e.response.status == 401) {
			authStore.logout();
		}
		state.error = e;
	}
}

async function deleteUsuario() {
	try {
		await axios.delete(`${api.usuarios}${props.usuario.id}/`, { headers: { 'Authorization': `Bearer ${authStore.jwtToken}` } });
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