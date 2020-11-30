import * as fs from 'fs'
import {existsSync} from 'fs'
import {mkdir} from 'fs/promises'
import {homedir} from 'os'
import {Config} from '../models/config'
import {ensureDirectoryExists} from './filesystem'

/**
 * Get the location of the home directory of Sheepdog.
 */
let sheepdogHomeDir: string = `${homedir()}/.sheepdog`

/**
 * Get the location of the Sheepdog configuration.
 */
let sheepdogConfigPath: string = `${sheepdogHomeDir}/config.json`

/**
 * Get the location of the Sheepdog log directory.
 */
let sheepdogLogsPath: string = `${sheepdogHomeDir}/log`

/**
 * Get the location of the Sheepdog log directory.
 */
let sheepdogSitesPath: string = `${sheepdogHomeDir}/sites`

/**
 * Get the location of the fallback server of Sheepdog.
 */
let sheepdogFallbackServer: string = `${sheepdogHomeDir}/server/index.php`

/**
 * Ensure the Sheepdog home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the sheepdog home directory.
 */
async function ensureHomeDirExists(): Promise<false | string> {
    return ensureDirectoryExists(sheepdogHomeDir)
}

async function getConfig(): Promise<Config> {
    let rawConfig: string = await fs.readFileSync(sheepdogConfigPath, 'utf-8')
    return JSON.parse(rawConfig)
}

export {
    sheepdogHomeDir,
    sheepdogConfigPath,
    sheepdogLogsPath,
    sheepdogSitesPath,
    sheepdogFallbackServer,
    ensureHomeDirExists,
    getConfig
}