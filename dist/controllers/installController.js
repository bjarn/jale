"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const colors_1 = require("kleur/colors");
const listr2_1 = require("listr2");
const dnsmasq_1 = tslib_1.__importDefault(require("../services/dnsmasq"));
const mailhog_1 = tslib_1.__importDefault(require("../services/mailhog"));
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const console_1 = require("../utils/console");
const database_1 = require("../utils/database");
const filesystem_1 = require("../utils/filesystem");
const optionalService_1 = require("../utils/optionalService");
const os_1 = require("../utils/os");
const phpFpm_1 = require("../utils/phpFpm");
const jale_1 = require("../utils/jale");
const sudo_1 = require("../utils/sudo");
class InstallController {
    constructor() {
        this.questions = [
            {
                type: 'input',
                name: 'domain',
                message: 'Enter a domain',
                default: 'test',
                validate: (input) => {
                    return input !== '';
                }
            },
            {
                type: 'checkbox',
                name: 'phpVersions',
                message: 'Choose one or more PHP versions',
                choices: ['php@8.0', 'php@7.4', 'php@7.3', 'php@7.2', 'php@7.1'],
                validate: (input) => {
                    return input.length >= 1;
                }
            },
            {
                type: 'list',
                name: 'database',
                message: 'Choose a database',
                choices: ['mysql@8.0', 'mysql@5.7', 'mariadb'],
                validate: (input) => {
                    return input.length >= 1;
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
        ];
        /**
         * Execute the installation process.
         */
        this.execute = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console_1.clearConsole();
            console.log(colors_1.white('✨ Thanks for using Jale! Let\'s get you started quickly.\n'));
            yield sudo_1.requireSudo();
            inquirer_1.default
                .prompt(this.questions)
                .then(answers => {
                this.install(answers);
            })
                .catch(error => {
                console.log('Something went wrong. However, this version is just a proof of concept and the error handling sucks. Sorry, again.');
            });
            return true;
        });
        /**
         * Configure Jale by parsing the answers and creating a configuration file.
         *
         * @param answers
         * @private
         */
        this.configureJale = (answers) => ({
            title: 'Configure Jale',
            task: (ctx, task) => {
                let config = {
                    domain: answers.domain,
                    database: { password: 'root' },
                    services: null // TODO: Make services configurable.
                };
                return fs.writeFileSync(jale_1.jaleConfigPath, JSON.stringify(config, null, 2));
            }
        });
        //
        // Service installation functions
        //
        this.installDnsMasq = () => ({
            title: 'Install Dnsmasq',
            task: (ctx, task) => task.newListr([
                {
                    title: 'Installing DnsMasq',
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield os_1.client().packageManager.packageIsInstalled('dnsmasq');
                        if (isInstalled)
                            return 'Dnsmasq is already installed.';
                    }),
                    task: (new dnsmasq_1.default).install
                },
                {
                    title: 'Configure DnsMasq',
                    task: (new dnsmasq_1.default).configure
                },
                {
                    title: 'Restart DnsMasq',
                    task: (new dnsmasq_1.default).restart
                }
            ])
        });
        this.installNginx = () => ({
            title: 'Install Nginx',
            task: (ctx, task) => task.newListr([
                {
                    title: 'Installing Nginx',
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield os_1.client().packageManager.packageIsInstalled('nginx');
                        if (isInstalled)
                            return 'Nginx is already installed.';
                    }),
                    task: (new nginx_1.default).install
                },
                {
                    title: 'Configure Nginx',
                    task: (new nginx_1.default).configure
                },
                {
                    title: 'Restart Nginx',
                    task: (new nginx_1.default).restart
                }
            ])
        });
        this.installPhpFpm = (phpVersions) => {
            let phpInstallTasks = [];
            phpVersions.forEach((phpVersion, index) => {
                phpInstallTasks.push({
                    title: `Install ${phpVersion}`,
                    task: (ctx, task) => task.newListr([
                        {
                            title: `Installing ${phpVersion}`,
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                if (phpVersion == 'php@8.0')
                                    phpVersion = 'php';
                                const isInstalled = yield os_1.client().packageManager.packageIsInstalled(phpVersion);
                                if (isInstalled)
                                    return `${phpVersion} is already installed.`;
                            }),
                            task: (phpFpm_1.getPhpFpmByName(phpVersion)).install
                        },
                        {
                            title: `Configure ${phpVersion}`,
                            task: (phpFpm_1.getPhpFpmByName(phpVersion)).configure
                        },
                        {
                            title: `Link ${phpVersion}`,
                            enabled: () => index === 0,
                            task: (phpFpm_1.getPhpFpmByName(phpVersion)).linkPhpVersion
                        },
                        {
                            title: `Restart ${phpVersion}`,
                            enabled: () => index === 0,
                            task: (phpFpm_1.getPhpFpmByName(phpVersion)).restart
                        },
                        {
                            title: `Stop ${phpVersion}`,
                            enabled: () => index !== 0,
                            task: (phpFpm_1.getPhpFpmByName(phpVersion)).stop
                        }
                    ])
                });
            });
            return phpInstallTasks;
        };
        this.installDatabase = (database) => ({
            title: 'Install Database',
            task: (ctx, task) => task.newListr([
                {
                    title: `Installing ${database}`,
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield os_1.client().packageManager.packageIsInstalled(database);
                        if (isInstalled)
                            return `${database} is already installed.`;
                    }),
                    task: (database_1.getDatabaseByName(database)).install
                },
                {
                    title: 'Configure ${database}',
                    task: (database_1.getDatabaseByName(database)).configure
                },
                {
                    title: 'Restart ${database}',
                    task: (database_1.getDatabaseByName(database)).restart
                }
            ])
        });
        // TODO: make Mailhog configurable. Currently required due to php config which has mailhog set for sendmail.
        this.installMailhog = () => ({
            title: 'Install Mailhog',
            task: (ctx, task) => task.newListr([
                {
                    title: `Installing Mailhog`,
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield os_1.client().packageManager.packageIsInstalled('mailhog');
                        if (isInstalled)
                            return `Mailhog is already installed.`;
                    }),
                    task: (new mailhog_1.default).install
                },
                {
                    title: 'Configure Mailhog',
                    task: (new mailhog_1.default).configure
                },
                {
                    title: 'Restart Mailhog',
                    task: (new mailhog_1.default).restart
                }
            ])
        });
        this.installOptionalServices = (answers) => {
            let optionalServicesTasks = [];
            answers.optionalServices.forEach((serviceName) => {
                const service = optionalService_1.getOptionalServiceByname(serviceName);
                optionalServicesTasks.push({
                    title: `Install ${service.service}`,
                    task: (ctx, task) => task.newListr([
                        {
                            title: `Installing ${service.service}`,
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                const isInstalled = yield os_1.client().packageManager.packageIsInstalled(service.service);
                                if (isInstalled)
                                    return `${service.service} is already installed.`;
                            }),
                            task: service.install
                        },
                        {
                            title: `Configure ${service.service}`,
                            task: service.configure
                        },
                        {
                            title: `Restart ${service.service}`,
                            task: service.restart
                        }
                    ])
                });
            });
            return {
                title: 'Install Optional Services',
                task: (ctx, task) => task.newListr(optionalServicesTasks)
            };
        };
    }
    /**
     * Start the installation of Jale.
     *
     * @param answers
     * @private
     */
    install(answers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield jale_1.ensureHomeDirExists();
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleLogsPath);
            const tasks = new listr2_1.Listr([
                this.configureJale(answers),
                this.installDnsMasq(),
                this.installNginx(),
                this.installMailhog(),
                {
                    title: 'Install PHP-FPM',
                    task: (ctx, task) => task.newListr(this.installPhpFpm(answers.phpVersions))
                },
                this.installDatabase(answers.database),
                this.installOptionalServices(answers)
            ]);
            try {
                // We're all set. Let's configure Jale.
                yield tasks.run();
                console.log(`\n✨ Successfully installed Jale, Just Another Local Environment! ✅\n`);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.default = InstallController;
//# sourceMappingURL=installController.js.map