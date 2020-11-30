import {existsSync} from "fs"
import {mkdir} from "fs/promises"

/**
 * Ensure the given path exists, then return a string or false when failed.
 * @param path
 */
async function ensureDirectoryExists(path: string): Promise<false | string> {
    if (!existsSync(path)) {
        try {
            await mkdir(path, {mode: 0o755})
            return path
        } catch (e) {
            console.log(e.message)
            return false
        }
    }

    return path
}

export {
    ensureDirectoryExists
}