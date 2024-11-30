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

namespace ClickToPay\Module\Core\Tools\Action;

use Module;

if (!defined('_PS_VERSION_')) {
    exit;
}

class IsModuleEnabled
{
    public function run(string $moduleName): bool
    {
        return Module::isInstalled($moduleName) && Module::isEnabled($moduleName);
    }
}
