import knownFeeds from './knownFeeds'

const rssUrlFromEnv = (env: NodeJS.ProcessEnv): string => {
  const envValue = env.RSS_FEED
  if (envValue === undefined) {
    return knownFeeds[Object.keys(knownFeeds)[0]]
  }
  if (envValue in knownFeeds) {
    return knownFeeds[envValue]
  }
  return envValue
}

export default rssUrlFromEnv
