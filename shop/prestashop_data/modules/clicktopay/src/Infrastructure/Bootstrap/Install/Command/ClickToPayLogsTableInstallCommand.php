<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install\Command;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayLogsTableInstallCommand implements InstallCommandInterface
{
    public function getName(): string
    {
        return \ClickToPayLog::$definition['table'];
    }

    public function getCommand(): string
    {
        return 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . bqSQL(\ClickToPayLog::$definition['table']) . '` (
                `id_clicktopay_log` INT(10) unsigned NOT NULL AUTO_INCREMENT,
                `id_log` INT(10) NOT NULL,
                `id_shop` INT(10) NOT NULL,
                `request` MEDIUMTEXT NULL,
                `response` MEDIUMTEXT NULL,
                `context` MEDIUMTEXT NULL,
                `date_add` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(`id_clicktopay_log`, `id_log`, `id_shop`),
            INDEX(`id_log`)
        ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8;';
    }
}
