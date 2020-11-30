import Mysql from './mysql'

class Mariadb extends Mysql {
    versionName: string = ''

    service: string = `mariadb`
}

export default Mariadb