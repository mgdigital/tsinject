export type DateProvider = () => Date

export type UUIDGenerator = () => string

export type ServerRunner = (port: number) => Promise<void>
