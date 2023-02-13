import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from '@/js/api';
import { useStorage } from "@vueuse/core";
import axios from "axios";

export const useAuthStore = defineStore('auth', () => {
	const jwtToken = ref(useStorage('jwtToken', null), []);
	const isAuthenticated = ref(useStorage('isAuthenticated', false), []);

	async function login(username, password) {
		if (username == null || password == null) {
			console.error("Credenciales inválidas");
			throw { response: { data: { detail: "Debes proveer un usuario y una contraseña" } } }
		}

		console.log("Obteniendo token JWT")
		const tokens = (await axios.post(api.login, { "username": username, "password": password })).data

		jwtToken.value = tokens.access;
		isAuthenticated.value = true;
	}

	function logout() {
		jwtToken.value = null;
		isAuthenticated.value = false;
	}

	return { jwtToken, login, logout, isAuthenticated }
});