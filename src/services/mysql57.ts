import Mysql from './mysql'

class Mysql57 extends Mysql {
    versionName = '5.7'

    service = `mysql@${this.versionName}`
}

export default Mysql57