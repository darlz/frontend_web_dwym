import { createApp } from 'vue'
import { createPinia } from 'pinia';

import 'bootstrap';
import './styles.scss';

import App from './App.vue'
import router from './js/router';

import { useAuthStore } from '@/js/auth'

createApp(App)
	.use(router)
	.use(createPinia())
	.mount('#app')

router.beforeEach((to) => {
	const authStore = useAuthStore();
	console.log(authStore.isAuthenticated);
	if (to.meta.requiresAuth && !(authStore.isAuthenticated)) {
		return '/';
	}
})
