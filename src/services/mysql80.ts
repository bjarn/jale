import Mysql from './mysql'

class Mysql80 extends Mysql {
    versionName: string = '8.0'

    service: string = `mysql@${this.versionName}`
}

export default Mysql80