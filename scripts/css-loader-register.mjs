// Registers the CSS-stripping loader hook for the prerender process.
import { register } from 'node:module';

register('./css-loader.mjs', import.meta.url);
