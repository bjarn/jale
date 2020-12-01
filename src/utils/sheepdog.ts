import * as fs from 'fs'
import {homedir} from 'os'
import {Config} from '../models/config'
import {ensureDirectoryExists} from './filesystem'

/**
 * Get the location of the home directory of Sheepdog.
 */
const sheepdogHomeDir: string = `${homedir()}/.sheepdog`

/**
 * Get the location of the Sheepdog configuration.
 */
const sheepdogConfigPath: string = `${sheepdogHomeDir}/config.json`

/**
 * Get the location of the Sheepdog log directory.
 */
const sheepdogLogsPath: string = `${sheepdogHomeDir}/log`

/**
 * Get the location of the Sheepdog log directory.
 */
const sheepdogSitesPath: string = `${sheepdogHomeDir}/sites`

/**
 * Get the location of the fallback server of Sheepdog.
 */
const sheepdogFallbackServer: string = `${sheepdogHomeDir}/server/index.php`

/**
 * Get the location of the Nginx apps vhost directory.
 */
const sheepdogNginxAppsPath: string = `/usr/local/etc/nginx/sheepdog/apps`

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
    sheepdogNginxAppsPath,
    ensureHomeDirExists,
    getConfig
}