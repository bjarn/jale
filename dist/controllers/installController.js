"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const colors_1 = require("kleur/colors");
const listr2_1 = require("listr2");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const dnsmasq_1 = tslib_1.__importDefault(require("../services/dnsmasq"));
const mailhog_1 = tslib_1.__importDefault(require("../services/mailhog"));
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const fallbackServer_1 = require("../templates/fallbackServer");
const console_1 = require("../utils/console");
const database_1 = require("../utils/database");
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
const optionalService_1 = require("../utils/optionalService");
const phpFpm_1 = require("../utils/phpFpm");
const sudo_1 = require("../utils/sudo");
const tools_1 = require("../utils/tools");
class InstallController {
    constructor() {
        this.questions = [
            {
                type: 'input',
                name: 'tld',
                message: 'Enter a tld',
                default: 'test',
                validate: (input) => {
                    return input !== '';
                }
            },
            {
                type: 'list',
                name: 'template',
                message: 'Default Nginx Template',
                choices: ['shopware6', 'laravel', 'magento2', 'magento1'],
                default: 'laravel',
                validate: (input) => {
                    return input !== '';
                }
            },
            {
                type: 'checkbox',
                name: 'phpVersions',
                message: 'Choose one or more PHP versions',
                choices: ['php@8.1', 'php@8.0', 'php@7.4', 'php@7.3', 'php@7.2', 'php@7.1'],
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
                choices: ['wp-cli', 'magerun', 'magerun2', 'drush', 'expose']
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
                console_1.emptyLine();
                this.install(answers);
            })
                .catch((err) => {
                console_1.error(`Something went wrong during the installation: ${err.message}`);
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
            task: () => {
                const config = {
                    tld: answers.tld,
                    defaultTemplate: answers.template,
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled('dnsmasq');
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled('nginx');
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
            const phpInstallTasks = [];
            phpVersions.forEach((phpVersion, index) => {
                phpInstallTasks.push({
                    title: `Install ${phpVersion}`,
                    task: (ctx, task) => task.newListr([
                        {
                            title: `Installing ${phpVersion}`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                if (phpVersion == 'php@8.1')
                                    phpVersion = 'php';
                                const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled(phpVersion);
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled(database);
                        if (isInstalled)
                            return `${database} is already installed.`;
                    }),
                    task: (database_1.getDatabaseByName(database)).install
                },
                {
                    title: `Configure ${database}`,
                    task: (database_1.getDatabaseByName(database)).configure
                },
                {
                    title: `Restart ${database}`,
                    task: (database_1.getDatabaseByName(database)).restart
                }
            ])
        });
        // TODO: make Mailhog configurable. Currently required due to php config which has mailhog set for sendmail.
        this.installMailhog = () => ({
            title: 'Install Mailhog',
            task: (ctx, task) => task.newListr([
                {
                    title: 'Installing Mailhog',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled('mailhog');
                        if (isInstalled)
                            return 'Mailhog is already installed.';
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
            const optionalServicesTasks = [];
            answers.optionalServices.forEach((serviceName) => {
                const service = optionalService_1.getOptionalServiceByname(serviceName);
                optionalServicesTasks.push({
                    title: `Install ${service.service}`,
                    task: (ctx, task) => task.newListr([
                        {
                            title: `Installing ${service.service}`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                            skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                const isInstalled = yield OS_1.default.getInstance().packageManager.packageIsInstalled(service.service);
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
        this.installTools = (answers) => {
            const toolsTasks = [];
            answers.apps.forEach((toolName) => {
                const tool = tools_1.getToolByName(toolName);
                toolsTasks.push({
                    title: `Install ${tool.name}`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore this is valid, however, the types are kind of a mess? not sure yet.
                    skip: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const isInstalled = yield tool.isInstalled();
                        if (isInstalled)
                            return `${tool.name} is already installed.`;
                    }),
                    task: tool.install
                });
            });
            return {
                title: 'Install Tools and Apps',
                task: (ctx, task) => task.newListr(toolsTasks, { concurrent: false })
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
            yield filesystem_1.ensureDirectoryExists(`${jale_1.jaleHomeDir}/server/`);
            yield fs.writeFileSync(jale_1.jaleFallbackServer, fallbackServer_1.fallbackIndex);
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
                this.installOptionalServices(answers),
                this.installTools(answers)
            ]);
            try {
                // We're all set. Let's configure Jale.
                yield tasks.run();
                console.log('\n✨ Successfully installed Jale, Just Another Local Environment! ✅\n');
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.default = InstallController;
//# sourceMappingURL=installController.js.map