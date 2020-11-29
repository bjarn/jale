import * as fs from 'fs'
import {existsSync} from 'fs'
import {mkdir} from 'fs/promises'
import {homedir} from 'os'
import {Config} from '../models/config'

/**
 * Get the location of the home directory of Sheepdog.
 */
let sheepdogHomeDir: string = `${homedir()}/.sheepdog`

/**
 * Get the location of the Sheepdog configuration.
 */
let sheepdogConfigPath: string = `${sheepdogHomeDir}/config.json`

/**
 * Ensure the Sheepdog home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the sheepdog home directory.
 */
async function ensureHomeDirExists(): Promise<boolean | string> {
    if (!existsSync(sheepdogHomeDir)) {
        try {
            await mkdir(sheepdogHomeDir, {mode: 0o755})
            return sheepdogHomeDir
        } catch (e) {
            console.log(e.message)
            return false
        }
    }

    return sheepdogHomeDir
}

async function getConfig(): Promise<Config> {
    let rawConfig: string = await fs.readFileSync(sheepdogConfigPath, 'utf-8')
    return JSON.parse(rawConfig)
}

export {
    sheepdogHomeDir,
    sheepdogConfigPath,
    ensureHomeDirExists,
    getConfig
}