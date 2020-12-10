import Nginx from '../services/nginx'
import {getConfig} from '../utils/jale'

class SecureController {

    execute = async (status: string | undefined): Promise<void> => {
        if (status !== undefined && (status !== 'on' && status !== 'off')) {
            console.log('Invalid status. Please use \'on\' or \'off\'.')
            return
        }

        const config = await getConfig()
        const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${project}.${config.domain}`

        const restartNginx = false


        if (restartNginx)
            await (new Nginx()).reload()
    }
}

export default SecureController