<?php return array (
  'parameters' => 
  array (
    'database_host' => getenv('DB_SERVER') ?: 'admin-mysql_db',
    'database_port' => '',
    'database_name' => getenv('DB_NAME') ?: 'BE_19348',
    'database_user' => getenv('DB_USER') ?: 'root',
    'database_password' => getenv('DB_PASSWD') ?: 'student',
    'database_prefix' => 'ps_',
    'database_engine' => 'InnoDB',
    'mailer_transport' => 'smtp',
    'mailer_host' => '127.0.0.1',
    'mailer_user' => NULL,
    'mailer_password' => NULL,
    'secret' => '4DMq2bKyVctIENLZowkzZcmZg4m3Rv3hPrPYpE50iBpsESq1qQAWZtZrvAK0mdET',
    'ps_caching' => 'CacheMemcache',
    'ps_cache_enable' => true,
    'ps_creation_date' => '2024-10-23',
    'locale' => 'pl-PL',
    'use_debug_toolbar' => true,
    'cookie_key' => 'O38xZ2tP8dLARXVIteGTAcCJf9IBNMPg8ZGURSbTDO0VYk4JfuxsmZ7BLdB5hmDB',
    'cookie_iv' => 'K980bf5iuXg3B9W6055Q3UMT7S4f1f5Q',
    'new_cookie_key' => 'def00000970d0bf2aca012439e042d5d72433bd4ebfeab1be1a1022940edd79ba60622e8fbe4eb014d8cfbaaabacc76efe5f59e23bd4e3a052b01fcd0653f2c3d493d66f',

  ),
);
