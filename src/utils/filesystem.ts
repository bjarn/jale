import {existsSync, mkdirSync} from 'fs'
import {error} from './console'

/**
 * Ensure the given path exists, then return a string or false when failed.
 * @param path
 */
async function ensureDirectoryExists(path: string): Promise<false | string> {
    if (!existsSync(path)) {
        try {
            await mkdirSync(path, {mode: 0o755})
            return path
        } catch (e) {
            error(e.message)
            return false
        }
    }

    return path
}

export {
    ensureDirectoryExists
}