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

namespace ClickToPay\Module\Infrastructure\Translator;

use ClickToPay\Module\Infrastructure\Bootstrap\ModuleTabs;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminLegacyModuleTabTranslator implements AdminModuleTabTranslatorInterface
{
    public function translate(string $key)
    {
        return isset($this->getTranslations()[$key]) ? $this->getTranslations()[$key] : $key;
    }

    private function getTranslations(): array
    {
        return [
            ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME => [
                'en' => 'Configuration',
                'en-US' => 'Configuration',
            ],
            ModuleTabs::LOGS_MODULE_TAB_CONTROLLER_NAME => [
                'en' => 'Logs',
                'en-US' => 'Logs',
            ],
        ];
    }
}
