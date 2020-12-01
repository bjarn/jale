import commander from 'commander'
import fs from 'fs'
import path from 'path'

export default function (program: typeof commander) {
    const commands: Dict = {}
    const loadPath = path.dirname(__filename)

    // Loop through command files
    fs.readdirSync(loadPath).filter(function (filename) {
        return (/\.js$/.test(filename) && filename !== 'index.js')
    }).forEach(function (filename) {
        let name = filename.substr(0, filename.lastIndexOf('.'))

        // Require command
        let command = require(path.join(loadPath, filename))

        // Initialize command
        commands[name] = command.default(program)
    })

    return commands
}