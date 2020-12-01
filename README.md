# Sheepdog ![](https://img.shields.io/npm/dm/@bjarnbronsveld/sheepdog)
A blazing fast local development environment for MacOS* written in Typescript.<br />
<sup><sub>*soon to be cross-platform!</sub></sup></center>

![](https://i.imgur.com/mFfbIa5.png)

## What is Sheepdog?
Sheepdog allows you to setup a complete local development environment in just a couple of seconds.
Literally the only thing you have to do is run `sheepdog install` and you're done.

Walk through the installation steps, which allow you to select which PHP versions (multiple!) you'd like to run or which kind of database server (i.e. MySQL 5.6 or 8.0, but also MariaDB).

Sheepdog is currently still under heavy development and not ready to be used as your daily driver. However, it works but lacks error messages, useful notices and yes, might contain bugs.

Services are using optimized configs (credits to [Valet+](https://github.com/weprovide/valet-plus)) to improve the performance of your local development environment.

## Included services
The following services are currently installed by Sheepdog. Services marked with a * are optional, you can uncheck them ;-).
- Nginx
- Dnsmasq
- PHP (7.1, 7.2, 7.3, 7.4 and 8.0)
- MySQL (MySQL 5.7, 8.0 and MariaDB)
- Redis*
- Elasticsearch*

### Dev tools
The following development tools are included.
- Mailhog
- wp-cli (soon!)*
- magerun (soon!)*
- magerun2 (soon!)*
- drush

## Migrating from...?
Are you migrating from Valet or Valet+? Hold on! We'll have a migration guide ready for you soon.

Why you should be exited, you ask? Well, Sheepdog's as barebone as possible and has a different approach than services like Laravel Valet, which use a single 'server.php' file which proxies every single request. This does have advantages in terms of flexibility, however it has to load Valet and its server.php every request. That might be a bottleneck. Sheepdog just uses plain Nginx configs per site, which allows you to do everything you want to do like you're used to on real servers.