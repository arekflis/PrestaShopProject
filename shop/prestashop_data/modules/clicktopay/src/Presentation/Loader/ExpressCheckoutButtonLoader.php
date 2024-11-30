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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Provider\CardMarksProvider;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ExpressCheckoutButtonLoader
{
    private const THEME_CLASSIC = 'classic';
    private const THEME_DARK = 'dark';

    /**
     * @var \ClickToPay|null
     */
    private $module;

    /**
     * @var Configuration
     */
    private $configuration;

    /**
     * @var Context
     */
    private $smarty;

    public function __construct(ModuleFactory $module, Configuration $configuration, Context $context)
    {
        $this->module = $module->getModule();
        $this->configuration = $configuration;
        $this->smarty = $context->getSmarty();
    }

    /**
     * @param \FrontController $controller
     *
     * @return string
     */
    public function getTemplate(\FrontController $controller, \Customer $customer): string
    {
        if (!$controller instanceof \CartControllerCore) {
            return '';
        }

        /** @var CardMarksProvider $cardsProvider */
        $cardsProvider = $this->module->getService(CardMarksProvider::class);

        $this->smarty->assign([
            'clicktopay' => [
                'showC2PButton' => $customer->isLogged() && !empty($customer->getAddresses($customer->id_lang)),
                'cards' => $cardsProvider->getOrderedCardMarks(),
                'isDarkTheme' => $this->configuration->get(Config::CLICKTOPAY_THEME) === 'dark',
                'iconDirPath' => $this->module->getPathUri() . 'views/img/',
            ],
        ]);

        return $this->module->fetch($this->module->getLocalPath() . '/views/templates/front/partials/express_checkout_button.tpl');
    }

    /**
     * @param \FrontController $controller
     *
     * @return void
     */
    public function load(\FrontController $controller): void
    {
        if (!$controller instanceof \CartControllerCore) {
            return;
        }

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        \Media::addJsDef([
            'clicktopay' => array_merge($previousJsDef, [
                'isFasterCheckoutButtonActive' => $this->configuration->getAsBoolean(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE),
                'isDefaultPaymentOption' => $this->configuration->getAsBoolean(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION),
                'expressCheckoutButtonTheme' => $this->configuration->get(Config::CLICKTOPAY_THEME) === self::THEME_CLASSIC ? self::THEME_DARK : self::THEME_CLASSIC,
                'visaClassicLogoPath' => $this->module->getPathUri() . 'views/img/visa-classic_logo.svg',
                'mastercardLogoPath' => $this->module->getPathUri() . 'views/img/mastercard_logo.svg',
                'visaDarkLogoPath' => $this->module->getPathUri() . 'views/img/visa-dark_logo.svg',
                'discoverLogoPath' => $this->module->getPathUri() . 'views/img/discover_logo.svg',
                'amexLogoPath' => $this->module->getPathUri() . 'views/img/amex_logo.svg',
            ]),
        ]);

        $controller->registerStylesheet(
            'clicktopay-common-css',
            'modules/clicktopay/views/css/front/common.css'
        );

        $controller->registerStylesheet(
            'clicktopay-express-btn-css',
            'modules/clicktopay/views/css/front/express_checkout_btn.css'
        );
    }
}
