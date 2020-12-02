import * as fs from 'fs'
import {homedir} from 'os'
import {Config} from '../models/config'
import {ensureDirectoryExists} from './filesystem'

/**
 * Get the location of the home directory of Jale.
 */
const jaleHomeDir: string = `${homedir()}/.jale`

/**
 * Get the location of the Jale configuration.
 */
const jaleConfigPath: string = `${jaleHomeDir}/config.json`

/**
 * Get the location of the Jale log directory.
 */
const jaleLogsPath: string = `${jaleHomeDir}/log`

/**
 * Get the location of the Jale log directory.
 */
const jaleSitesPath: string = `${jaleHomeDir}/sites`

/**
 * Get the location of the fallback server of Jale.
 */
const jaleFallbackServer: string = `${jaleHomeDir}/server/index.php`

/**
 * Get the location of the Nginx apps vhost directory.
 */
const jaleNginxAppsPath: string = `/usr/local/etc/nginx/jale/apps`

/**
 * Ensure the Jale home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the Jale home directory.
 */
async function ensureHomeDirExists(): Promise<false | string> {
    return ensureDirectoryExists(jaleHomeDir)
}

async function getConfig(): Promise<Config> {
    let rawConfig: string = await fs.readFileSync(jaleConfigPath, 'utf-8')
    return JSON.parse(rawConfig)
}

export {
    jaleHomeDir,
    jaleConfigPath,
    jaleLogsPath,
    jaleSitesPath,
    jaleFallbackServer,
    jaleNginxAppsPath,
    ensureHomeDirExists,
    getConfig
}