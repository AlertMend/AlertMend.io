import HelmetModule from 'react-helmet-async'
import type {
  HelmetProps,
  HelmetData as HelmetDataType,
  HelmetProviderProps,
} from 'react-helmet-async'
import type { ComponentType } from 'react'

const helmetModule = HelmetModule as {
  Helmet: ComponentType<HelmetProps>
  HelmetProvider: ComponentType<HelmetProviderProps>
  HelmetData: typeof HelmetDataType
}

export const Helmet = helmetModule.Helmet
export const HelmetProvider = helmetModule.HelmetProvider
export const HelmetData = helmetModule.HelmetData

