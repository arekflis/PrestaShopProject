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

class PendingActivationPageTranslations extends AbstractTranslations
{
    public const FILE_NAME = 'PendingActivationPageTranslations';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translations(): array
    {
        return $this->htmlDecode([
            'Configuration.Pending.setUpInProgress' => $this->module->l('Click to Pay set up is in progress', self::FILE_NAME),
            'Configuration.Pending.onceTheVerificationIsComplete' => $this->module->l('Once the verification is complete, you can proceed to activate Click to Pay and transform the checkout experience for your shoppers.', self::FILE_NAME),
            'Configuration.Pending.signIn' => $this->module->l('Sign in', self::FILE_NAME),
        ]);
    }
}
