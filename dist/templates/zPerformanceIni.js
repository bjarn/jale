"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const zPerformanceIni = `; Add TIMEZONE string for replacing with machine timezone
date.timezone = "${Intl.DateTimeFormat().resolvedOptions().timeZone}"

; Max execution time per request
max_execution_time = 300

; Max memory per instance
memory_limit = 4G

;The maximum size of an uploaded file.
upload_max_filesize = 128M

;Sets max size of post data allowed. This setting also affects file upload. To upload large files, this value must be larger than upload_max_filesize
post_max_size = 128M

session.auto_start = off
session.gc_probability = 0
suhosin.session.cryptua = off

; Disable garbage collector
zend.enable_gc = off

; Use mailhog for sending emails
sendmail_path = ${OS_1.default.getInstance().usrLocalDir}/bin/MailHog sendmail test@test

[opcache]
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 2048
opcache.interned_strings_buffer = 20
opcache.file_cache=1
opcache.max_accelerated_files = 80000
opcache.max_wasted_percentage = 5
opcache.use_cwd = 1
opcache.validate_timestamps = 1
opcache.revalidate_freq = 0
opcache.file_update_protection = 2
opcache.revalidate_path = 0
opcache.save_comments = 1
opcache.load_comments = 1
opcache.fast_shutdown = 1
opcache.enable_file_override = 0
opcache.optimization_level = 0xffffffff
opcache.inherited_hack = 1
opcache.blacklist_filename = ""
opcache.max_file_size = 0
opcache.consistency_checks = 0
opcache.force_restart_timeout = 180
opcache.error_log = ""
opcache.log_verbosity_level = 1
opcache.preferred_memory_model = ""
opcache.protect_memory = 0
apc.cache_by_default = false

[apcu]
apc.enabled=0
apc.shm_size=512M
apc.ttl=7200
apc.mmap_file_mask=/tmp/apc.XXXXXX
apc.enable_cli=1

[xdebug]
xdebug.mode=debug
xdebug.client_host=localhost
xdebug.client_port=9000
xdebug.start_with_request=yes
xdebug.discover_client_host=0
xdebug.idekey=PHPSTORM
xdebug.max_nesting_level=-1
xdebug.var_display_max_depth=10
`;
exports.default = zPerformanceIni;
//# sourceMappingURL=zPerformanceIni.js.map