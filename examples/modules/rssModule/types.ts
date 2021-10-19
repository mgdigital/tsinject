import type { RSSConfig, RSSFeedFetcher, RSSParserConfig, RSSParserInstance } from '../../rss/types'
import type * as keys from './keys'

export type RSSServices = {
  [keys.rssConfig]: RSSConfig
  [keys.rssParserConfig]: RSSParserConfig
  [keys.rssParser]: RSSParserInstance
  [keys.rssFeedFetcher]: RSSFeedFetcher
}
