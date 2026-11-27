import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({site:'https://runchengxie.github.io',base:'/a-study-in-small-caps',integrations:[react()],output:'static'});
