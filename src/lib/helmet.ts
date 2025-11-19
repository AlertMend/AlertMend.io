// Wrapper to handle react-helmet-async's different export formats
// In browser (Vite): uses ESM with named exports  
// In Node (tsx prerender): uses CommonJS with default export containing named exports
// This wrapper works in both environments by using namespace import

import * as HelmetModule from 'react-helmet-async'

// In ESM (Vite): HelmetModule has named exports directly
// In CommonJS (Node): HelmetModule.default has the named exports
const getHelmetExports = () => {
  // Check if named exports exist directly (ESM)
  if ('Helmet' in HelmetModule && HelmetModule.Helmet) {
    return {
      Helmet: HelmetModule.Helmet,
      HelmetProvider: HelmetModule.HelmetProvider,
      HelmetData: HelmetModule.HelmetData,
    }
  }
  // Otherwise, use default export (CommonJS)
  const defaultExport = (HelmetModule as any).default || HelmetModule
  return {
    Helmet: defaultExport.Helmet,
    HelmetProvider: defaultExport.HelmetProvider,
    HelmetData: defaultExport.HelmetData,
  }
}

const { Helmet, HelmetProvider, HelmetData } = getHelmetExports()

export { Helmet, HelmetProvider, HelmetData }

// Re-export types for convenience
export type { HelmetProps, HelmetData as HelmetDataType } from 'react-helmet-async'

