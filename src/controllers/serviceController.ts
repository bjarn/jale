import Dnsmasq from '../services/dnsmasq'
import Elasticsearch from '../services/elasticsearch'
import Mailhog from '../services/mailhog'
import Mariadb from '../services/mariadb'
import Mysql from '../services/mysql'
import Mysql57 from '../services/mysql57'
import Mysql80 from '../services/mysql80'
import Nginx from '../services/nginx'
import PhpFpm from '../services/phpFpm'
import PhpFpm72 from '../services/phpFpm72'
import PhpFpm73 from '../services/phpFpm73'
import PhpFpm74 from '../services/phpFpm74'
import PhpFpm80 from '../services/phpFpm80'
import Redis from '../services/redis'
import Service from '../services/service'
import {getLinkedDatabase} from '../utils/database'
import {getLinkedPhpVersion} from '../utils/phpFpm'

class ServiceController {
    allServices: Service[] = [
        new Dnsmasq(),
        new Elasticsearch(),
        new Mailhog(),
        new Nginx(),
        new Mariadb(),
        new Mysql80(),
        new Mysql57(),
        new PhpFpm80(),
        new PhpFpm74(),
        new PhpFpm73(),
        new PhpFpm72(),
        new Redis()
    ]

    executeStart = async (serviceName: string | undefined): Promise<boolean> => {
        if (!serviceName) {
            for (const service of this.allServices) {
                try {
                    await this.controlService(service, 'start')
                } catch (e) {
                    console.log(`Failed to start ${service.service}: ${e.message}`)
                }
            }
            console.log(`Successfully started all Jale services`)
            return true
        }

        for (const service of this.allServices) {
            if (service.service.includes(serviceName)) {
                try {
                    if (!(await this.controlService(service, 'start'))) {
                        continue
                    }
                    console.log(`Successfully started ${serviceName}`)
                    return true
                } catch (e) {
                    console.log(`Failed to start ${service.service}: ${e.message}`)
                    return false
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}`)
        return false
    }

    executeStop = async (serviceName: string | undefined): Promise<boolean> => {
        if (!serviceName) {
            for (const service of this.allServices) {
                try {
                    await this.controlService(service, 'stop')
                } catch (e) {
                    console.log(`Failed to stop ${service.service}: ${e.message}`)
                }
            }

            console.log(`Successfully stopped all Jale services`)
            return true
        }

        for (const service of this.allServices) {
            if (service.service.includes(serviceName)) {
                try {
                    if (!(await this.controlService(service, 'stop'))) {
                        continue
                    }
                    console.log(`Successfully stopped ${serviceName}`)
                    return true
                } catch (e) {
                    console.log(`Failed to stop ${service.service}: ${e.message}`)
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}`)

        return false
    }

    executeRestart = async (serviceName: string | undefined): Promise<boolean> => {
        if (!serviceName) {
            for (const service of this.allServices) {
                try {
                    await this.controlService(service, 'restart')
                } catch (e) {
                    console.log(`Failed to restarted ${service.service}: ${e.message}`)
                }
            }
            console.log(`Successfully restarted all Jale services`)
            return true
        }

        for (const service of this.allServices) {
            if (service.service.includes('restart')) {
                try {
                    if (!(await this.controlService(service, 'restart'))) {
                        continue
                    }
                    console.log(`Successfully restarted ${serviceName}`)
                    return true
                } catch (e) {
                    console.log(`Failed to restarted ${service.service}: ${e.message}`)
                    return false
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}`)
        return false
    }

    /**
     * Convenience method to start, stop or restart a service. It also checks if you are restarting PHP or MySQL.
     * @param service
     * @param action
     */
    controlService = async (service: Service, action: 'start' | 'stop' | 'restart'): Promise<boolean> => {
        if (service instanceof Mysql) {
            const linkedDatabase = await getLinkedDatabase()
            if (linkedDatabase.service !== service.service) {
                return false
            }
        }

        if (service instanceof PhpFpm) {
            const linkedPhpVersion = await getLinkedPhpVersion()
            if (linkedPhpVersion.service !== service.service) {
                return false
            }
        }

        switch (action) {
            case 'start':
                console.log(`Starting ${service.service}...`)
                await service.start()
                break
            case 'stop':
                console.log(`Stopping ${service.service}...`)
                await service.stop()
                break
            case 'restart':
                console.log(`Retarting ${service.service}...`)
                await service.restart()
                break
        }

        return true
    }

}

export default ServiceController