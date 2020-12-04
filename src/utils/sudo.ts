import execa from 'execa'

function requireSudo(): execa.ExecaChildProcess {
    return execa('sudo', ['-v'])
}

export {
    requireSudo
}