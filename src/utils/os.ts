import Darwin from '../client/os/darwin'

function client(): Client {
    switch (process.platform) {
        case 'darwin':
            return new Darwin
        default:
            return new Darwin // TODO: Catch unsupported OS. Currently just returning MacOS stuff as we're just creating a POC.
    }
}

export {
    client
}