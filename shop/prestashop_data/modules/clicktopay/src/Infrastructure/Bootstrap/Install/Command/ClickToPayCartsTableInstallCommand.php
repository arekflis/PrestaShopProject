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

class ClickToPayCartsTableInstallCommand implements InstallCommandInterface
{
    public function getName(): string
    {
        return \ClickToPayCart::$definition['table'];
    }

    public function getCommand(): string
    {
        return 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . bqSQL(\ClickToPayCart::$definition['table']) . '` (
                `id_clicktopay_cart` INT(10) unsigned NOT NULL AUTO_INCREMENT,
                `id_cart` INT(10) NOT NULL,
                `express_checkout` TINYINT(1) NOT NULL,
                `id_shop` INT(10) NOT NULL,
            PRIMARY KEY(`id_clicktopay_cart`, `id_cart`, `id_shop`)
        ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8;';
    }
}
