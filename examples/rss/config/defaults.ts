import knownFeeds from './knownFeeds'

export const feed = knownFeeds[Object.keys(knownFeeds)[0]]
export const maxRedirects = 3
export const timeout = 10000
