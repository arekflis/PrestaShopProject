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

namespace ClickToPay\Module\Infrastructure\Verification;

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

class HasCompiledAssets
{
    private $module;

    public function __construct(
        ModuleFactory $moduleFactory
    ) {
        $this->module = $moduleFactory->getModule();
    }

    public function verify(): bool
    {
        if (!file_exists($this->module->getLocalPath() . '/views/js/front/payment/index.js')) {
            return false;
        }

        return true;
    }
}
