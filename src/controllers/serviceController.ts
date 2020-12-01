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
import {getDatabaseByName, getLinkedDatabase} from '../utils/database'
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
                    if (service instanceof Mysql) {
                        const linkedDatabase = await getLinkedDatabase()
                        if (linkedDatabase === service)
                            await service.start()
                        continue
                    }
                    if (service instanceof PhpFpm) {
                        const linkedPhpVersion = await getLinkedPhpVersion()
                        if (linkedPhpVersion === service)
                            await service.start()
                        continue
                    }
                    await service.start()
                    return true
                } catch (e) {
                    return false // TODO: Silently fail for now. Add error logging.
                }
            }
            console.log(`Successfully started all Sheepdog services.`)
        }

        for (const service of this.allServices) {
            if (service.service === serviceName) {
                try {
                    await service.start()
                    console.log(`Successfully started ${serviceName}.`)
                    return true
                } catch (e) {
                    return false // TODO: Catch error.
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}.`)

        return false
    }

    executeStop = async (serviceName: string | undefined): Promise<boolean> => {
        if (!serviceName) {
            for (const service of this.allServices) {
                try {
                    if (service instanceof Mysql) {
                        const linkedDatabase = await getLinkedDatabase()
                        if (linkedDatabase === service)
                            await service.start()
                        continue
                    }
                    if (service instanceof PhpFpm) {
                        const linkedPhpVersion = await getLinkedPhpVersion()
                        if (linkedPhpVersion === service)
                            await service.start()
                        continue
                    }
                    await service.stop()
                    return true
                } catch (e) {
                    return false // TODO: Silently fail for now. Add error logging.
                }
            }
            console.log(`Successfully stop all Sheepdog services.`)
        }

        for (const service of this.allServices) {
            if (service.service === serviceName) {
                try {
                    await service.stop()
                    console.log(`Successfully stopped ${serviceName}.`)
                    return true
                } catch (e) {
                    return false // TODO: Catch error.
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}.`)

        return false
    }

    executeRestart = async (serviceName: string | undefined): Promise<boolean> => {
        if (!serviceName) {
            for (const service of this.allServices) {
                try {
                    if (service instanceof Mysql) {
                        const linkedDatabase = await getLinkedDatabase()
                        if (linkedDatabase === service)
                            await service.start()
                        continue
                    }
                    if (service instanceof PhpFpm) {
                        const linkedPhpVersion = await getLinkedPhpVersion()
                        if (linkedPhpVersion === service)
                            await service.start()
                        continue
                    }
                    await service.restart()
                    return true
                } catch (e) {
                    return false // TODO: Silently fail for now. Add error logging.
                }
            }
            console.log(`Successfully restarted all Sheepdog services.`)
        }

        for (const service of this.allServices) {
            if (service.service === serviceName) {
                try {
                    await service.restart()
                    console.log(`Successfully restarted ${serviceName}.`)
                    return true
                } catch (e) {
                    return false // TODO: Catch error.
                }
            }
        }

        console.warn(`Invalid service: ${serviceName}.`)

        return false
    }

}

export default ServiceController