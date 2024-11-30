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

if (!defined('_PS_VERSION_')) {
    exit;
}

use ClickToPay\Module\Core\Config\Config;
use Module;

class ValidateOpcModuleCompatibilityAction
{
    public function run(): bool
    {
        foreach (Config::CLICKTOPAY_OPC_MODULE_LIST as $opcModule) {
            if (Module::isInstalled($opcModule) && Module::isEnabled($opcModule)) {
                return true;
            }
        }

        return false;
    }
}
