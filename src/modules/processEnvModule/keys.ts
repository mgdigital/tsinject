export const processEnv: unique symbol = Symbol('processEnv')

export type ProcessEnvServiceMap = {
  [processEnv]: NodeJS.ProcessEnv
}
