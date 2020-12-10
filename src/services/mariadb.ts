import Mysql from './mysql'

class Mariadb extends Mysql {
    versionName = ''

    service = 'mariadb'
}

export default Mariadb