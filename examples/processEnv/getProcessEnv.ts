const getProcessEnv = () =>
  Object.freeze({ ...process.env })

export default getProcessEnv
