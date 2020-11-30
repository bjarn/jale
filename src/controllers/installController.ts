import * as fs from 'fs'
import inquirer from 'inquirer'
import {white} from 'kleur/colors'
import {Listr, ListrTask} from 'listr2'
import {Config, Database} from '../models/config'
import Dnsmasq from '../services/dnsmasq'
import Nginx from '../services/nginx'
import {ensureDirectoryExists} from '../utils/filesystem'
import {client} from '../utils/os'
import {getPhpFpmByName} from '../utils/phpFpm'
import {ensureHomeDirExists, sheepdogConfigPath, sheepdogLogsPath} from '../utils/sheepdog'
import {requireSudo} from '../utils/sudo'
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
            validate: (input: string[]) => {
                return input.length >= 1
            }
        },
        {
            type: 'list',
            name: 'database',
            message: 'Choose a database',
            choices: ['mysql@8.0', 'mysql@5.7', 'mysql@5.6', 'mariadb'],
            validate: (input: string[]) => {
                return input.length >= 1
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

    /**
     * Execute the installation process.
     */
    execute = async (): Promise<boolean> => {
        console.log(white('✨ Thanks for using Sheepdog! Let\'s get you started quickly.\n'))

        await requireSudo()

        inquirer
            .prompt(this.questions)
            .then(answers => {
                this.install(answers)
            })
            .catch(error => {
                console.log('Something went wrong. However, this version is just a proof of concept and the error handling sucks. Sorry, again.')
            })

        return true
    }

    /**
     * Start the installation of Sheepdog.
     *
     * @param answers
     * @private
     */
    private async install(answers: any) {
        await ensureHomeDirExists()
        await ensureDirectoryExists(sheepdogLogsPath)

        const tasks = new Listr([
            this.configureSheepdog(answers),
            this.installDnsMasq(),
            this.installNginx(),
            {
                title: 'Install Php-Fpm',
                task: (ctx, task): Listr =>
                    task.newListr(
                        this.installPhpFpm(answers.phpVersions)
                    )
            }
        ])

        try {
            // We're all set. Let's configure Sheepdog. Ruff.
            await tasks.run()
            console.log(`\n✨ Successfully installed Sheepdog! ✅\n`)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * Configure Sheepdog by parsing the answers and creating a configuration file.
     *
     * @param answers
     * @private
     */
    private configureSheepdog = (answers: any): ListrTask => ({
        title: 'Configure Sheepdog',
        task: (ctx, task): void => {
            let config = <Config>{
                domain: answers.domain,
                database: <Database>{password: 'root'},
                services: null // TODO: Make services configurable.
            }

            return fs.writeFileSync(sheepdogConfigPath, JSON.stringify(config, null, 2))
        }
    })


    //
    // Service installation functions
    //

    private installDnsMasq = (): ListrTask => ({
        title: 'Install Dnsmasq',
        task: (ctx, task): Listr =>
            task.newListr([
                {
                    title: 'Installing DnsMasq',
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: async (ctx): Promise<string | boolean> => {
                        const isInstalled = await client().packageManager.packageIsInstalled('dnsmasq')

                        if (isInstalled) return 'Dnsmasq is already installed.'
                    },
                    task: (new Dnsmasq).install
                },
                {
                    title: 'Configure DnsMasq',
                    task: (new Dnsmasq).configure
                },
                {
                    title: 'Restart DnsMasq',
                    task: (new Dnsmasq).restart
                }
            ])
    })

    private installNginx = (): ListrTask => ({
        title: 'Install Nginx',
        task: (ctx, task): Listr =>
            task.newListr([
                {
                    title: 'Installing Nginx',
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: async (ctx): Promise<string | boolean> => {
                        const isInstalled = await client().packageManager.packageIsInstalled('nginx')

                        if (isInstalled) return 'Nginx is already installed.'
                    },
                    task: (new Nginx).install
                },
                {
                    title: 'Configure Nginx',
                    task: (new Nginx).configure
                },
                {
                    title: 'Restart Nginx',
                    task: (new Nginx).restart
                }
            ])
    })

    private installPhpFpm = (phpVersions: string[]): ListrTask[] => {
        let phpInstallTasks: ListrTask[] = []

        phpVersions.forEach((phpVersion: string) => {
            phpInstallTasks.push({
                title: `Install ${phpVersion}`,
                task: (ctx, task): Listr =>
                    task.newListr([
                        {
                            title: `Installing ${phpVersion}`,
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: async (ctx): Promise<string | boolean> => {
                                const isInstalled = await client().packageManager.packageIsInstalled(phpVersion)

                                if (isInstalled) return `${phpVersion} is already installed.`
                            },
                            task: (getPhpFpmByName(phpVersion)).install
                        },
                        {
                            title: `Configure ${phpVersion}`,
                            task: (getPhpFpmByName(phpVersion)).configure
                        },
                        {
                            title: `Restart ${phpVersion}`,
                            task: (getPhpFpmByName(phpVersion)).restart
                        }
                    ])
            })
        })

        return phpInstallTasks
    }

}

export default InstallController