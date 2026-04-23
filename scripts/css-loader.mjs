// Node ESM loader hook that intercepts .css and .module.css imports during
// the prerender step so tsx can run the React tree without exploding.
// CSS module class names are returned as a Proxy that yields the requested key
// as a string (e.g. styles.foo === 'foo'), which is enough for renderToString
// because we don't actually need the real hashed names server-side.

export function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return {
      shortCircuit: true,
      url: 'data:text/css,',
      format: 'module',
    };
  }
  return nextResolve(specifier, context);
}

const cssModuleProxy = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return cssModuleProxy;
      if (typeof prop === 'string') return prop;
      return undefined;
    },
  },
);

export async function load(url, context, nextLoad) {
  if (url.startsWith('data:text/css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source:
        'const proxy = new Proxy({}, { get(_, prop) { if (prop === "__esModule") return true; if (prop === "default") return proxy; if (typeof prop === "string") return prop; return undefined; } });\nexport default proxy;\n',
    };
  }
  return nextLoad(url, context);
}

// Re-export for clarity in case future code needs the proxy.
export { cssModuleProxy };
