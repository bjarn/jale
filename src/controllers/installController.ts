import inquirer from 'inquirer'
import {white} from 'kleur/colors'
import CliController from './cliController'

class InstallController extends CliController {

    private readonly questions = [
        {
            type: 'input',
            name: 'domain',
            message: 'Enter a domain',
            default: 'test',
            validate: (input: string) => {
                return input !== ''
            }
        },
        {
            type: 'checkbox',
            name: 'phpVersions',
            message: 'Choose one or more Php versions',
            choices: ['php@7.1', 'php@7.2', 'php@7.3', 'php@7.4', 'php@8.0'],
            validate: (input: string) => {
                return input !== ''
            }
        },
        {
            type: 'list',
            name: 'database',
            message: 'Choose a database',
            choices: ['mysql@8.0', 'mysql@5.7', 'mysql@5.6', 'mariadb'],
            validate: (input: string) => {
                return input !== ''
            }
        },
        {
            type: 'checkbox',
            name: 'optionalServices',
            message: 'Optional services',
            choices: ['redis', 'elasticsearch', 'mailhog']
        },
        {
            type: 'checkbox',
            name: 'apps',
            message: 'Tools and apps',
            choices: ['wp-cli', 'magerun', 'magerun2', 'drush']
        }
    ]

    execute(): boolean {
        console.log(white('✨ Thanks for using Sheepdog! Let\'s get you started quickly.\n'))

        inquirer
            .prompt(this.questions)
            .then(answers => {
                // Use user feedback for... whatever!!
            })
            .catch(error => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else went wrong
                }
            })

        return true
    }

}

export default InstallController