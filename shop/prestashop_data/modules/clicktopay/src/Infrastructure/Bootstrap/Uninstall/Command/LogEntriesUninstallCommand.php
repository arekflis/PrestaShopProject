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

use ClickToPay\Module\Infrastructure\Logger\Logger;

if (!defined('_PS_VERSION_')) {
    exit;
}

class LogEntriesUninstallCommand implements UninstallCommandInterface
{
    public function getName(): string
    {
        return \PrestaShopLogger::$definition['table'];
    }

    public function getCommand(): string
    {
        return '
            DELETE FROM `' . _DB_PREFIX_ . bqSQL($this->getName()) . '`
            WHERE object_type = "' . pSQL(Logger::LOG_OBJECT_TYPE) . '"
        ';
    }
}
