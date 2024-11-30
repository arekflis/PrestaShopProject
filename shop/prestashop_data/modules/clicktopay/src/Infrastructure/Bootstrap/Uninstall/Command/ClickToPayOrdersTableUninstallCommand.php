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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayOrdersTableUninstallCommand implements UninstallCommandInterface
{
    public function getName(): string
    {
        return \ClickToPayOrder::$definition['table'];
    }

    public function getCommand(): string
    {
        return 'DROP TABLE IF EXISTS `' . _DB_PREFIX_ . bqSQL(\ClickToPayOrder::$definition['table']) . '`;';
    }
}
