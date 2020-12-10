import Mysql from './mysql'

class Mysql80 extends Mysql {
    versionName = '8.0'

    service = `mysql@${this.versionName}`
}

export default Mysql80