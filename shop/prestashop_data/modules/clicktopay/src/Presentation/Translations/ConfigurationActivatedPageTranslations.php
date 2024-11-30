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

namespace ClickToPay\Module\Presentation\Translator;

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ConfigurationActivatedPageTranslations extends AbstractTranslations
{
    public const FILE_NAME = 'ConfigurationActivatedPageTranslations';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translations(): array
    {
        return $this->htmlDecode([
            'Configuration.Activated.clickToPayIsActivated' => $this->module->l('Click to Pay is activated', self::FILE_NAME),
            'Configuration.Activated.clickToPayIsNowAvailable' => $this->module->l('Click to Pay is now available as a payment method for your shoppers to enjoy fast, secure checkouts.', self::FILE_NAME),
            'Configuration.Activated.important' => $this->module->l('Important:', self::FILE_NAME),
            'Configuration.Activated.welcomeToClickToPay' => $this->module->l('Welcome to Click to Pay!', self::FILE_NAME),
            'Configuration.Activated.deleteTheJson' => $this->module->l('Delete the "Json" file now for security reasons; it holds sensitive data.', self::FILE_NAME),
            'Configuration.Activated.yourAccountIsNowActive' => $this->module->l('Your account is now active. You can update the module settings at any time, as needed. Sandbox mode also available for testing.', self::FILE_NAME),
            'Configuration.Activated.done' => $this->module->l('Done', self::FILE_NAME),
        ]);
    }
}
