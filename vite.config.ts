import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tanstackRouter({
			target: "react",
			tmpDir: ".tanstack/router-spa-tmp",
			routeTreeFileFooter: [
				"import type { getRouter } from './router.tsx'",
				"declare module '@tanstack/react-router' {",
				"  interface Register {",
				"    router: ReturnType<typeof getRouter>",
				"  }",
				"}",
			],
		}),
		tailwindcss(),
		viteReact(),
	],
});

export default config;
