import type { HighResTimer } from '../highResTime/types'
import type { ILogger } from '../logging/types'
import type { RSSFeedFetcher } from '../rss/types'
import type { DemoRunner } from './types'

const demoRunner = (
  startTimer: HighResTimer,
  rssFeedFetcher: RSSFeedFetcher,
  logger: ILogger
): DemoRunner => async () => {
  const getDuration = startTimer()
  const feed = await rssFeedFetcher()
  const duration = getDuration()
  logger.info(
    `Got latest headlines for "${feed.title}" in ${duration} microseconds`,
    {
      title: feed.title,
      url: feed.feedUrl,
      duration
    }
  )
  for (const item of feed.items) {
    logger.info(
      item.title,
      {
        url: item.link
      }
    )
  }
}

export default demoRunner
