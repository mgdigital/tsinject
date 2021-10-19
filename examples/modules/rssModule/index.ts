import RSSParser from 'rss-parser'
import type { ContainerModule } from '@mgdigital/tsinject'
import type { RSSServices } from './types'
import * as keys from './keys'
import * as processEnvModule from '../processEnvModule'
import rssParserFetcher from '../../rss/rssParserFetcher'
import rssConfigFromEnv from '../../rss/config/rssConfigFromEnv'
import rssParserConfig from '../../rss/config/rssParserConfig'

const rssModule: ContainerModule<RSSServices> = builder => builder
  .use(processEnvModule.default)
  .define(
    keys.rssConfig,
    container => rssConfigFromEnv(
      container.get(processEnvModule.keys.processEnv)
    )
  )
  .define(
    keys.rssParserConfig,
    container => rssParserConfig(
      container.get(keys.rssConfig)
    )
  )
  .define(
    keys.rssParser,
    container => new RSSParser(
      container.get(keys.rssParserConfig)
    )
  )
  .define(
    keys.rssFeedFetcher,
    container => rssParserFetcher(
      container.get(keys.rssParser),
      container.get(keys.rssConfig).url
    )
  )

export default rssModule
export * as keys from './keys'
export * from './types'
