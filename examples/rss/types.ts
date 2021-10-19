import type RSSParser from 'rss-parser'

export type RSSConfig = {
  url: string
  headers?: Record<string, string>
  maxRedirects?: number
  timeout?: number
}

export type RSSBaseFields = {
  title: string
}

export type RSSParserConfig = RSSParser.ParserOptions<RSSBaseFields, RSSBaseFields>

export type RSSParserInstance = RSSParser<RSSBaseFields, RSSBaseFields>

export type RSSOutput = RSSParser.Output<RSSBaseFields> & RSSBaseFields

export type RSSFeedFetcher = () => Promise<RSSOutput>
