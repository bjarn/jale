class Homebrew implements PackageManager {
    alias: string = 'brew'
    name: string = 'Homebrew'
    path: string = '/usr/local/bin/brew'

    installCommand: string = 'install'
    removeCommand: string = 'remove'
    updateCommand: string = 'update'
    upgradeCommand: string = 'upgrade'
}