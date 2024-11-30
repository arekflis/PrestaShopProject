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

namespace ClickToPay\Module\Core\Shared\Verification;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Clock\ClockInterface;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use DateInterval;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CanDisplayPaymentOptionDefaultBanner
{
    private $configuration;
    private $module;
    private $clock;
    private $globalShopContext;

    public function __construct(
        Configuration $configuration,
        ModuleFactory $moduleFactory,
        ClockInterface $clock,
        GlobalShopContextInterface $globalShopContext
    ) {
        $this->configuration = $configuration;
        $this->module = $moduleFactory->getModule();
        $this->clock = $clock;
        $this->globalShopContext = $globalShopContext;
    }

    public function verify(): bool
    {
        if ($this->isDefaultPaymentOption()) {
            return false;
        }

        if (!$this->hasPassedDismissalPeriod()) {
            return false;
        }

        return true;
    }

    private function areHooksRegistered(): bool
    {
        if (\Hook::getIdByName(Config::PAYMENT_OPTION_HOOK_NAME) && !\Hook::isModuleRegisteredOnHook($this->module, Config::PAYMENT_OPTION_HOOK_NAME, $this->globalShopContext->getShopId())) {
            return false;
        }

        if (\Hook::getIdByName(Config::PAYMENT_OPTION_EU_HOOK_NAME) && !\Hook::isModuleRegisteredOnHook($this->module, Config::PAYMENT_OPTION_EU_HOOK_NAME, $this->globalShopContext->getShopId())) {
            return false;
        }

        return true;
    }

    private function isDefaultPaymentOption(): bool
    {
        if (!$this->areHooksRegistered()) {
            return false;
        }

        $paymentOptionModuleHook = \Hook::getModulesFromHook(\Hook::getIdByName(Config::PAYMENT_OPTION_HOOK_NAME), (int) $this->module->id);

        if (!empty($paymentOptionModuleHook) && (int) $paymentOptionModuleHook[0]['m.position'] > 1) {
            return false;
        }

        if (\Hook::getIdByName(Config::PAYMENT_OPTION_EU_HOOK_NAME)) {
            $paymentOptionEuModuleHook = \Hook::getModulesFromHook(\Hook::getIdByName(Config::PAYMENT_OPTION_EU_HOOK_NAME), (int) $this->module->id);

            if (!empty($paymentOptionEuModuleHook) && (int) $paymentOptionEuModuleHook[0]['m.position'] > 1) {
                return false;
            }
        }

        return true;
    }

    /** NOTE: `If the merchant chooses “not now” the module could remind again after a month, up till 3 months.` */
    private function hasPassedDismissalPeriod(): bool
    {
        if (!$previousConfigurationValue = $this->configuration->get(Config::CLICKTOPAY_BANNER_DISMISSED)) {
            return true;
        }

        $dismissInformation = json_decode($previousConfigurationValue, true);

        // NOTE: incorrect data structure.
        if (!isset($dismissInformation['dismissed_times']) || !isset($dismissInformation['dismissed_at'])) {
            $this->configuration->delete(Config::CLICKTOPAY_BANNER_DISMISSED);

            return true;
        }

        $months = $dismissInformation['dismissed_times'] ?: 1;

        $months = min($months, 3);

        $dismissedDate = $this->clock->get((string) $dismissInformation['dismissed_at']);
        $currentDate = $this->clock->getNow();

        $dismissedDate->add(new DateInterval("P{$months}M"));

        return $currentDate > $dismissedDate;
    }
}
