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

class ClickToPayRefundsTableInstallCommand implements InstallCommandInterface
{
    public function getName(): string
    {
        return \ClickToPayRefund::$definition['table'];
    }

    public function getCommand(): string
    {
        return 'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . bqSQL(\ClickToPayRefund::$definition['table']) . '` (
                `id_clicktopay_refund` INT(10) unsigned NOT NULL AUTO_INCREMENT,
                `refunded_amount` INT(10) NOT NULL,
                `id_order` INT(10) NOT NULL,
                `id_shop` INT(10) NOT NULL,
                `refund_transaction_token` VARCHAR(64) NOT NULL,
                `transaction_gateway_id` VARCHAR(64) NOT NULL,
            PRIMARY KEY(`id_clicktopay_refund`, `id_order`, `id_shop`)
        ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8;';
    }
}
