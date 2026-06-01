import { defineConfig } from 'vite';
import {plugin as markdown, Mode} from 'vite-plugin-markdown';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [markdown({mode: [Mode.HTML]}), cloudflare()]
})