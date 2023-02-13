import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path');

console.log(`Directory = ${__dirname}`);

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'~': path.resolve(__dirname, '/node_modules'),
		},
	},

	plugins: [vue()],
})
