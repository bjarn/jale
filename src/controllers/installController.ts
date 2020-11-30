import * as fs from 'fs'
import inquirer from 'inquirer'
import {white} from 'kleur/colors'
import {Listr, ListrTask} from 'listr2'
import {Config, Database} from '../models/config'
import Dnsmasq from '../services/dnsmasq'
import Mailhog from '../services/mailhog'
import Nginx from '../services/nginx'
import {clearConsole} from '../utils/console'
import {getDatabaseByName} from '../utils/database'
import {ensureDirectoryExists} from '../utils/filesystem'
import {client} from '../utils/os'
import {getPhpFpmByName} from '../utils/phpFpm'
import {ensureHomeDirExists, sheepdogConfigPath, sheepdogLogsPath} from '../utils/sheepdog'
import {requireSudo} from '../utils/sudo'

class InstallController {

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
            message: 'Choose one or more PHP versions',
            choices: ['php@8.0', 'php@7.4', 'php@7.3', 'php@7.2', 'php@7.1'],
            validate: (input: string[]) => {
                return input.length >= 1
            }
        },
        {
            type: 'list',
            name: 'database',
            message: 'Choose a database',
            choices: ['mysql@8.0', 'mysql@5.7', 'mariadb'],
            validate: (input: string[]) => {
                return input.length >= 1
            }
        },
        {
            type: 'checkbox',
            name: 'optionalServices',
            message: 'Optional services',
            choices: ['redis', 'elasticsearch']
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
        clearConsole()
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
            this.installMailhog(),
            {
                title: 'Install PHP-FPM',
                task: (ctx, task): Listr =>
                    task.newListr(
                        this.installPhpFpm(answers.phpVersions)
                    )
            },
            this.installDatabase(answers.database)
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

        phpVersions.forEach((phpVersion: string, index) => {
            phpInstallTasks.push({
                title: `Install ${phpVersion}`,
                task: (ctx, task): Listr =>
                    task.newListr([
                        {
                            title: `Installing ${phpVersion}`,
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: async (ctx): Promise<string | boolean> => {
                                if (phpVersion == 'php@8.0') phpVersion = 'php'
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
                            title: `Link ${phpVersion}`,
                            enabled: (): boolean => index === 0,
                            task: (getPhpFpmByName(phpVersion)).linkPhpVersion
                        },
                        {
                            title: `Restart ${phpVersion}`,
                            enabled: (): boolean => index === 0,
                            task: (getPhpFpmByName(phpVersion)).restart
                        },
                        {
                            title: `Stop ${phpVersion}`,
                            enabled: (): boolean => index !== 0,
                            task: (getPhpFpmByName(phpVersion)).stop
                        }
                    ])
            })
        })

        return phpInstallTasks
    }

    private installDatabase = (database: string): ListrTask => ({
        title: 'Install Database',
        task: (ctx, task): Listr =>
            task.newListr([
                {
                    title: `Installing ${database}`,
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: async (ctx): Promise<string | boolean> => {
                        const isInstalled = await client().packageManager.packageIsInstalled(database)

                        if (isInstalled) return `${database} is already installed.`
                    },
                    task: (getDatabaseByName(database)).install
                },
                {
                    title: 'Configure ${database}',
                    task: (getDatabaseByName(database)).configure
                },
                {
                    title: 'Restart ${database}',
                    task: (getDatabaseByName(database)).restart
                }
            ])
    })

    // TODO: make Mailhog configurable. Currently required due to php config which has mailhog set for sendmail.
    private installMailhog = (): ListrTask => ({
        title: 'Install Mailhog',
        task: (ctx, task): Listr =>
            task.newListr([
                {
                    title: `Installing Mailhog`,
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: async (ctx): Promise<string | boolean> => {
                        const isInstalled = await client().packageManager.packageIsInstalled('mailhog')

                        if (isInstalled) return `Mailhog is already installed.`
                    },
                    task: (new Mailhog).install
                },
                {
                    title: 'Configure Mailhog',
                    task: (new Mailhog).configure
                },
                {
                    title: 'Restart Mailhog',
                    task: (new Mailhog).restart
                }
            ])
    })
}

export default InstallController