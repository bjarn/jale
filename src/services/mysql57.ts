import Mysql from './mysql'

class Mysql57 extends Mysql {
    versionName: string = '5.7'

    service: string = `mysql@${this.versionName}`
}

export default Mysql57