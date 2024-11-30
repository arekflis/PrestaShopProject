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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\CartHelper;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayCheckoutModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'checkout';

    /** @var ClickToPay */
    public $module;

    public function initContent(): void
    {
        parent::initContent();

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Configuration $configuration */
        $configuration = $this->module->getService(\ClickToPay\Module\Infrastructure\Adapter\Configuration::class);

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Context $context */
        $context = $this->module->getService(\ClickToPay\Module\Infrastructure\Adapter\Context::class);

        if (!CartHelper::hasProducts($context->getCart()->id)) {
            Tools::redirect('cart');
        }

        if (!(int) $context->getCart()->id_address_delivery || !(int) $context->getCart()->id_address_invoice) {
            Tools::redirect($this->context->link->getPageLink(
                'order',
                true,
                null,
                [
                    'step' => 1,
                ]
            ));
        }

        $theme = $configuration->get(Config::CLICKTOPAY_THEME);

        $context->getSmarty()->assign('clicktopay', [
            'cart_id' => $context->getCart()->id,
            'secure_key' => $context->getCart()->secure_key,
            'brands' => $configuration->get(Config::CLICKTOPAY_CARDS_SUPPORTED),
            'icons' => [
                'dropdownArrowIcon' => $this->module->getPathUri() . 'views/img/dropdown-arrow-' . $theme . '.svg',
                'checkmarkIcon' => $this->module->getPathUri() . 'views/img/checkmark.svg',
                'c2pIcon' => $this->module->getPathUri() . 'views/img/c2p-' . $theme . '.svg',
                'loading' => $theme === 'dark' ? $this->module->getPathUri() . 'views/img/loading-dark.gif' : $this->module->getPathUri() . 'views/img/loading.gif',
            ],
            'payment_option_action' => '',
            'address' => null,
            'isSeparatePage' => Tools::getValue(Config::THE_CHECKOUT_OPC_SEPARATE_PAGE_PARAM) === '',
        ]);

        $this->setTemplate('../../../modules/' . $this->module->name . '/views/templates/front/checkout.tpl');
    }
}
