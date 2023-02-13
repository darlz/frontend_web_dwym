<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<span class="navbar-brand text-primary">Proyecto Desarrollo Web y Móvil</span>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
				aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
					<li v-for="path in routes" class="nav-item">
						<!-- Link -->
						<router-link class="nav-link" :class="$route.name == path.name ? 'active' : null"
							:to="`${baseRoute}/${path.path}`" :aria-current="$route.name == path.name">{{ path.name }}
						</router-link>
					</li>
					<span class="w-10 me-2"></span>
					<li class="nav-item"><a href="#" class="btn btn-outline-danger" @click.prevent="eraseToken">Cerrar
							Sesión</a></li>
				</ul>
			</div>
		</div>
	</nav>

</template>

<script setup>
import router from '@/js/router';
import { useAuthStore } from '@/js/auth';

const authStore = useAuthStore();

let routes = router.options.routes;
const baseRoute = '/dashboard';
routes = (routes.filter(e => (e.path === baseRoute)))[0].children;

function eraseToken() {
	authStore.logout();
	location.reload();
}

</script>

<style lang="scss" scoped>

</style>