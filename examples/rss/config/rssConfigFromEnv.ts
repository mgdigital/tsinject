import rssUrlFromEnv from './rssUrlFromEnv'
import type { RSSConfig } from '../types'
import * as defaults from './defaults'
import * as envVars from './envVars'

const rssConfigFromEnv = (env: NodeJS.ProcessEnv): RSSConfig => {
  const config = {
    url: rssUrlFromEnv(env),
    maxRedirects: env[envVars.maxRedirects] === undefined
      ? defaults.maxRedirects
      : Number(env[envVars.maxRedirects]),
    timeout: env[envVars.timeout] === undefined
      ? defaults.timeout
      : Number(env[envVars.timeout])
  }
  console.log(config)
  return config
}

export default rssConfigFromEnv
