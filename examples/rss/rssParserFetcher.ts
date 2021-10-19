import type { RSSFeedFetcher, RSSParserInstance } from './types'

const rssParserFetcher = (
  parser: RSSParserInstance,
  url: string
): RSSFeedFetcher => async () =>
  await parser.parseURL(url)

export default rssParserFetcher
