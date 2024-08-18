import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import swiper from '@swiper/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  integrations: [swiper()],
  integrations: [tailwind()]
});