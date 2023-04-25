import { defineConfig } from 'astro/config';
import { astroImageTools } from 'astro-imagetools';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [astroImageTools, tailwind(), react(), svelte()]
});