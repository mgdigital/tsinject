import type { ContainerModule } from '@mgdigital/tsinject'
import type { ServiceMap } from './types'
import * as highResTimeModule from '../modules/highResTimeModule'
import * as loggingModule from '../modules/loggingModule'
import * as rssModule from '../modules/rssModule'
import * as keys from './keys'
import demoRunner from './demoRunner'

const demoModule: ContainerModule<
  highResTimeModule.HighResTimeServices &
  loggingModule.LoggingServices &
  rssModule.RSSServices &
  ServiceMap
> = builder => builder
  .use(highResTimeModule.default)
  .use(loggingModule.default)
  .use(rssModule.default)
  .define(
    keys.demoRunner,
    container => demoRunner(
      container.get(highResTimeModule.keys.highResTimer),
      container.get(rssModule.keys.rssFeedFetcher),
      container.get(loggingModule.keys.logger)
    )
  )

export default demoModule
