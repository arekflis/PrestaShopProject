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

namespace ClickToPay\Module\Presentation\Loader;

use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Utility\VersionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CustomerFormTemplateLoader
{
    public const TRANSLATION_ID = 'CustomerFormTemplateLoader';

    /**
     * @var \ClickToPay
     */
    private $module;

    /**
     * @var Context
     */
    private $context;

    public function __construct(ModuleFactory $moduleFactory, Context $context)
    {
        $this->module = $moduleFactory->getModule();
        $this->context = $context;
    }

    public function load(\FrontController $controller): void
    {
        $isNewRegistrationController = ((bool) VersionUtility::isPsVersionGreaterOrEqualTo('8.0.0') && $controller instanceof \RegistrationControllerCore);

        $isOrderController = $controller instanceof \OrderControllerCore
            || (isset($controller->php_self) && $controller->php_self === 'order');

        if (!(
            $isOrderController
                || $controller instanceof \AuthControllerCore
                || $controller instanceof \IdentityControllerCore
                || $isNewRegistrationController
        )) {
            return;
        }

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        $controller->registerJavascript(
            'c2p-additional-info',
            'modules/' . $this->module->name . '/views/js/front/partials/c2p-additional-info.js'
        );

        $controller->registerStylesheet(
            'phone-field-input',
            'modules/' . $this->module->name . '/views/css/front/phone-field.css'
        );

        $this->context->getSmarty()->assign(
            [
                'clicktopay' => [
                    'iconPath' => $this->module->getPathUri() . 'views/img/mastercard-c2p-logo-dark.svg',
                ],
            ]
        );

        \Media::addJsDef([
            'clicktopay' => array_merge($previousJsDef, [
                'click2payAdditionalPhoneInfoTemplate' => $this->module->fetch($this->module->getLocalPath() . '/views/templates/front/partials/additional_c2p_phone_info.tpl'),
                'click2payAdditionalMailInfoTemplate' => $this->module->fetch($this->module->getLocalPath() . '/views/templates/front/partials/additional_c2p_mail_info.tpl'),
                'currentCountryCode' => $this->context->getCountryIso(),
                'newPhoneLabelValue' => $this->module->l('Mobile Phone', self::TRANSLATION_ID),
            ]),
        ]);
    }
}
