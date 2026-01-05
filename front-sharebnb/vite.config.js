import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// After setting-up a backend, this can automoate the copying process of the built files:
	build: {
		outDir: '../back-sharebnb/public',
		emptyOutDir: true,
	},
	// Ensure we use remote services (backend API) instead of local services
	define: {
		'import.meta.env.VITE_LOCAL': 'false'
	}
})
