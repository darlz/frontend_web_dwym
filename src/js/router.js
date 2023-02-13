import { createRouter, createWebHistory } from 'vue-router';

const views = {
	LoginView: () => import('@/views/LoginView.vue'),
	HomeView: () => import('@/views/HomeView.vue'),
	UsuariosView: () => import('@/views/UsuariosView.vue'),
	CursosView: () => import('@/views/CursosView.vue')
}

export const routes = [
	{ path: '/', component: views.LoginView },
	{
		path: '/dashboard',
		meta: { requiresAuth: true },
		component: () => import('@/layouts/DefaultLayout.vue'),
		children: [
			{ path: '', name: 'Inicio', component: views.HomeView },
			{ path: 'usuarios', name: 'Usuarios', component: views.UsuariosView },
			{
				path: 'cursos', name: 'Cursos', component: views.CursosView,
				children: []
			},
		]
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router