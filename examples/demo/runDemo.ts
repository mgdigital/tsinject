import container from './container'
import * as keys from './keys'

const demoRunner = container.get(keys.demoRunner)

demoRunner()
