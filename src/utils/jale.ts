import * as fs from 'fs'
import {homedir} from 'os'
import {Config} from '../models/config'
import {ensureDirectoryExists} from './filesystem'

/**
 * Get the location of the home directory of Jale.
 */
const jaleHomeDir = `${homedir()}/.jale`

/**
 * Get the location of the Jale configuration.
 */
const jaleConfigPath = `${jaleHomeDir}/config.json`

/**
 * Get the location of the Jale log directory.
 */
const jaleLogsPath = `${jaleHomeDir}/log`

/**
 * Get the location of the Jale sites directory.
 */
const jaleSitesPath = `${jaleHomeDir}/sites`

/**
 * Get the location of the Jale certificates directory.
 */
const jaleSslPath = `${jaleHomeDir}/ssl`

/**
 * Get the location of the fallback server of Jale.
 */
const jaleFallbackServer = `${jaleHomeDir}/server/index.php`

/**
 * Get the location of the Nginx apps vhost directory.
 */
const jaleNginxAppsPath = '/usr/local/etc/nginx/jale/apps'

/**
 * Get the location of the Nginx app templates vhost directory.
 */
const jaleNginxAppTemplatesPath = '/usr/local/etc/nginx/jale/templates'

/**
 * Ensure the Jale home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the Jale home directory.
 */
async function ensureHomeDirExists(): Promise<false | string> {
    return ensureDirectoryExists(jaleHomeDir)
}

function getConfig(): Config {
    const rawConfig: string = fs.readFileSync(jaleConfigPath, 'utf-8')
    return JSON.parse(rawConfig)
}

export {
    jaleHomeDir,
    jaleConfigPath,
    jaleLogsPath,
    jaleSslPath,
    jaleSitesPath,
    jaleFallbackServer,
    jaleNginxAppsPath,
    jaleNginxAppTemplatesPath,
    ensureHomeDirExists,
    getConfig
}