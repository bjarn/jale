class Darwin implements Client {

    operatingSystem: string = "Darwin" // uname
    packageManager: PackageManager = new Homebrew
    services: any = null

}