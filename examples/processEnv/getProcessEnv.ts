const getProcessEnv = (): NodeJS.ProcessEnv =>
  Object.freeze({ ...process.env })

export default getProcessEnv
