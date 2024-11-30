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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Tools\Exception\CouldNotUpdatePaymentOptionHook;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

class UpdatePaymentHookPositionAction
{
    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function run(bool $isDefaultPaymentOption): void
    {
        try {
            if ($isDefaultPaymentOption) {
                $this->module->updatePosition(\Hook::getIdByName(Config::PAYMENT_OPTION_HOOK_NAME), false, 1);

                if (\Hook::getIdByName(Config::PAYMENT_OPTION_EU_HOOK_NAME)) {
                    $this->module->registerHook(Config::PAYMENT_OPTION_EU_HOOK_NAME);

                    $this->module->updatePosition(\Hook::getIdByName(Config::PAYMENT_OPTION_EU_HOOK_NAME), false, 1);
                }
            } else {
                $this->module->unregisterHook(Config::PAYMENT_OPTION_EU_HOOK_NAME);
            }
        } catch (\Throwable $exception) {
            CouldNotUpdatePaymentOptionHook::failedToUpdatePaymentOptionHook($exception);
        }
    }
}
