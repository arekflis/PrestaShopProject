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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install;

use ClickToPay;
use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Translator\OrderStateTranslator;
use Language;
use OrderState;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ConfigurationInstaller implements InstallerInterface
{
    /**
     * @var ClickToPay
     */
    private $module;

    public function __construct(ClickToPay $module)
    {
        $this->module = $module;
    }

    public function init(): void
    {
        \Configuration::updateValue(Config::CLICKTOPAY_ORDER_STATE_PENDING, \Configuration::get('PS_OS_PAYMENT'));
        // When installing Mastercard module, default days to keep logs is 14 days
        \Configuration::updateValue(Config::DAYS_TO_KEEP_LOGS, 14);

        // Default values
        \Configuration::updateValue(Config::CLICKTOPAY_CARDS_SUPPORTED, '');
        \Configuration::updateValue(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION, 0);
        \Configuration::updateValue(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE, 0);
        \Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, 'sign-up');

        \Configuration::updateValue(Config::CLICKTOPAY_DEBUG_MODE, '0');
        $this->installOrderStates();
    }

    /**
     * Creates custom click to pay order states for refunds if needed and adjusts configuration
     */
    private function installOrderStates(): void
    {
        /** @var GlobalShopContextInterface $shopContext */
        $shopContext = $this->module->getService(GlobalShopContextInterface::class);
        /** @var Configuration $configuration */
        $configuration = $this->module->getService(Configuration::class);
        $shopId = $shopContext->getShopId();
        $languages = Language::getLanguages(false, $shopId);

        $partialRefundConfig = Config::CLICKTOPAY_ORDER_STATE_PARTIALLY_REFUNDED;
        $partialRefundStateId = (int) $configuration->get($partialRefundConfig, $shopId);
        $partialRefundState = new OrderState($partialRefundStateId, null, $shopId);
        $partialRefundState->color = '#8d00ab';
        $partialRefundState->deleted = false;
        $this->setOrderStateNames($languages, $partialRefundConfig, $partialRefundState);
        $partialRefundState->save();
        $configuration->set($partialRefundConfig, $partialRefundState->id, $shopId);

        $fullRefundConfig = Config::CLICKTOPAY_ORDER_STATE_REFUNDED;
        $fullRefundStateId = (int) $configuration->get($fullRefundConfig, $shopId);
        $fullRefundState = new OrderState($fullRefundStateId, null, $shopId);
        $fullRefundState->color = '#680044';
        $fullRefundState->deleted = false;
        $this->setOrderStateNames($languages, $fullRefundConfig, $fullRefundState);
        $fullRefundState->save();
        $configuration->set($fullRefundConfig, $fullRefundState->id, $shopId);
    }

    private function setOrderStateNames(array $languages, string $configName, OrderState $orderState): void
    {
        $orderState->module_name = ClickToPay::NAME;

        $names = OrderStateTranslator::translate($configName);

        foreach ($languages as $language) {
            $orderState->name[$language['id_lang']] = isset($names[$language['iso_code']]) ? pSQL($names[$language['iso_code']]) : pSQL($names['en']);
        }
    }
}
