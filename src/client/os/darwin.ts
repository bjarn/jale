class Darwin implements Client {

    operatingSystem: string = "darwin"
    packageManager: PackageManager = new Homebrew
    services: any = null

}