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

class ClickToPayOrdersTableInstallCommand implements InstallCommandInterface
{
    public function getName(): string
    {
        return \ClickToPayOrder::$definition['table'];
    }

    public function getCommand(): string
    {
        return 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . bqSQL(\ClickToPayOrder::$definition['table']) . '` (
                `id_clicktopay_order` INT(10) unsigned NOT NULL AUTO_INCREMENT,
                `id_internal` INT(10) NOT NULL,
                `id_external` VARCHAR(64) NOT NULL,
                `id_gateway_external` VARCHAR(64) NOT NULL,
                `id_shop` INT(10) NOT NULL,
            PRIMARY KEY(`id_clicktopay_order`, `id_internal`, `id_external`)
        ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8;';
    }
}
