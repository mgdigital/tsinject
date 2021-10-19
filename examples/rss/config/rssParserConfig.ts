import type { RSSConfig, RSSParserConfig } from '../types'

const rssParserConfig = (rssConfig: RSSConfig): RSSParserConfig => ({
  timeout: rssConfig.timeout,
  maxRedirects: rssConfig.maxRedirects
})

export default rssParserConfig
