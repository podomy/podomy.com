// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	trailingSlash: 'ignore',
	markdown: {
		shikiConfig: {
			theme: 'github-light',
		},
	},
});
