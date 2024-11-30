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
use ClickToPay\Module\Core\Shared\Repository\AddressRepository;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayCartRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CountryRepository;
use ClickToPay\Module\Core\Shared\Repository\StateRepository;
use ClickToPay\Module\Core\Tools\Action\IsModuleEnabled;
use ClickToPay\Module\Core\Tools\Action\ValidateOpcModuleCompatibilityAction;
use ClickToPay\Module\Infrastructure\Adapter\CartHelper;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Provider\CardMarksProvider;
use ClickToPay\Module\Infrastructure\Utility\JWT;
use ClickToPay\Module\Infrastructure\Utility\StringUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PaymentFormAssetLoader
{
    private const FILE_NAME = 'PaymentFormAssetLoader';
    private const AMOUNT_PRECISION = 2;
    private const DECIMAL_SEPERATOR = '.';
    private const SPAIN_ISO_CODE = 'ES';

    /**
     * @var Context
     */
    private $context;

    /**
     * @var \ClickToPay
     */
    private $module;

    /**
     * @var Configuration
     */
    private $configuration;

    /**
     * @var StateRepository
     */
    private $stateRepository;

    /**
     * @var CountryRepository
     */
    private $countryRepository;

    /**
     * @var AddressRepository
     */
    private $addressRepository;
    /** @var LoggerInterface */
    private $logger;
    /** @var ClickToPayCartRepositoryInterface */
    private $clickToPayCartRepository;
    /** @var GlobalShopContextInterface */
    private $globalShopContext;
    /** @var ValidateOpcModuleCompatibilityAction */
    private $validateOpcModuleCompatibilityAction;
    /** @var IsModuleEnabled */
    private $isModuleEnabled;

    public function __construct(
        Context $context,
        ModuleFactory $moduleFactory,
        Configuration $configuration,
        StateRepository $stateRepository,
        CountryRepository $countryRepository,
        AddressRepository $addressRepository,
        LoggerInterface $logger,
        ClickToPayCartRepositoryInterface $clickToPayCartRepository,
        GlobalShopContextInterface $globalShopContext,
        ValidateOpcModuleCompatibilityAction $validateOpcModuleCompatibilityAction,
        IsModuleEnabled $isModuleEnabled
    ) {
        $this->context = $context;
        $this->module = $moduleFactory->getModule();
        $this->configuration = $configuration;
        $this->stateRepository = $stateRepository;
        $this->countryRepository = $countryRepository;
        $this->addressRepository = $addressRepository;
        $this->logger = $logger;
        $this->clickToPayCartRepository = $clickToPayCartRepository;
        $this->globalShopContext = $globalShopContext;
        $this->validateOpcModuleCompatibilityAction = $validateOpcModuleCompatibilityAction;
        $this->isModuleEnabled = $isModuleEnabled;
    }

    public function register(\FrontController $controller): void
    {
        // NOTE: due to hookHeader we need to use this in all pages.
        $controller->registerStylesheet('clicktopay-common', 'modules/' . $this->module->name . '/views/css/front/common.css');
        $controller->registerStylesheet('clicktopay-fonts', 'modules/' . $this->module->name . '/views/css/front/fonts.css');

        $isOrderController = $controller instanceof \OrderControllerCore
            || (isset($controller->php_self) && $controller->php_self === 'order');

        if (!(
                $isOrderController
            || $controller instanceof \CartControllerCore
            || $controller instanceof \ClickToPayCheckoutModuleFrontController)
            || !CartHelper::hasProducts(\Context::getContext()->cart->id)
        ) {
            return;
        }

        if (!\Configuration::get(Config::CLICKTOPAY_PRIVATE_KEY)) {
            $this->logger->debug('Missing private key');

            return;
        }

        if (!\Configuration::get(Config::CLICKTOPAY_KEY_PHRASE)) {
            $this->logger->debug('Missing key phrase');

            return;
        }

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        $controller->registerStylesheet('clicktopay-variables', 'modules/' . $this->module->name . '/views/css/front/variables.css');

        $controller->registerStylesheet('clicktopay-error-modal', 'modules/' . $this->module->name . '/views/css/front/error_modal.css');

        $controller->registerStylesheet('clicktopay-shipping-address', 'modules/' . $this->module->name . '/views/css/front/shipping_address.css');

        $controller->registerStylesheet('clicktopay-payment-form', 'modules/' . $this->module->name . '/views/css/front/payment_form.css');
        $controller->registerStylesheet('clicktopay-card-input-form', 'modules/' . $this->module->name . '/views/css/front/card_input_form.css');
        $controller->registerStylesheet('clicktopay-id-lookup-form', 'modules/' . $this->module->name . '/views/css/front/id_lookup_form.css');
        $controller->registerStylesheet('clicktopay-card-list-form', 'modules/' . $this->module->name . '/views/css/front/card_list_form.css');
        $controller->registerStylesheet('clicktopay-card-loading', 'modules/' . $this->module->name . '/views/css/front/card_loading.css');
        $controller->registerStylesheet('clicktopay-card-footer', 'modules/' . $this->module->name . '/views/css/front/card_footer.css');

        $cart = \Context::getContext()->cart;
        $customerId = $cart->id_customer;
        $customer = new \Customer($customerId);

        $isGuest = true;
        if ((int) $customer->id) {
            $isGuest = (bool) $customer->is_guest;
        }

        // NOTE: needs to be \Tools due to it being parsed to null with adapter as it's empty string.
        $isSeparatePage =
            \Tools::getValue(Config::THE_CHECKOUT_OPC_SEPARATE_PAGE_PARAM) === '';

        $isFallbackPage = $controller instanceof \ClickToPayCheckoutModuleFrontController;

        $isOnePageCheckout = $this->validateOpcModuleCompatibilityAction->run() && !$isSeparatePage;

        /** @var \ClickToPayCart|null $clickToPayCart */
        $clickToPayCart = $this->clickToPayCartRepository->findOneBy([
            'id_cart' => (int) $cart->id,
            'id_shop' => $this->globalShopContext->getShopId(),
        ]);

        /** @var CardMarksProvider $cardsProvider */
        $cardsProvider = $this->module->getService(CardMarksProvider::class);
        $theme = $this->configuration->get(Config::CLICKTOPAY_THEME);
        $this->context->getSmarty()->assign([
            'clicktopay' => [
                'isDarkTheme' => $theme === 'dark',
                'theme' => $theme,
                'cards' => json_encode($cardsProvider->getOrderedCardMarks()),
                'isOnePageCheckout' => $isOnePageCheckout,
            ],
        ]);

        \Media::addJsDef([
            'clicktopay' => array_merge($previousJsDef, [
                'name' => $this->module->name,
                'env' => Config::CLICKTOPAY_ENV,
                'jwtToken' => 'Bearer ' . JWT::encode(
                    \Configuration::get(Config::CLICKTOPAY_PRIVATE_KEY),
                    \Configuration::get(Config::CLICKTOPAY_KEY_PHRASE),
                    ['kid' => $this->configuration->get(Config::CLICKTOPAY_KEY_ID)],
                    [
                        'iss' => $this->configuration->get(Config::CLICKTOPAY_MERCHANT_ID),
                        'aud' => 'c2p',
                        'sub' => $this->configuration->get(Config::CLICKTOPAY_KEY_ID),
                        'jti' => StringUtility::random(),
                    ]
                ),
                'merchantReferenceId' => $this->configuration->get(Config::CLICKTOPAY_MERCHANT_ID),
                'srcMark' => $this->module->fetch($this->module->getLocalPath() . '/views/templates/front/partials/src_mark.tpl'),
                'cards' => $cardsProvider->getOrderedCardMarks(),
                'customer' => [
                    'firstName' => (string) $customer->firstname,
                    'lastName' => (string) $customer->lastname,
                    'email' => (string) $customer->email,
                    'is_guest' => $isGuest,
                    'phone_number' => $this->getPhoneNumber($cart->id_address_delivery),
                    'billingAddress' => $this->getExternalAddress($cart->id_address_invoice),
                    'shippingAddress' => $this->getExternalAddress($cart->id_address_delivery),
                ],
                'usePhoneNumberPrefix' => $this->isModuleEnabled->run('thecheckout') ? !$this->configuration->getAsBoolean('TC_show_call_prefix') : true,

                'isDefaultPaymentOption' => $this->configuration->getAsBoolean(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION),

                'partnerId' => $this->configuration->get(Config::CLICKTOPAY_KEY_ID),

                'isExpressCheckout' => $clickToPayCart && $clickToPayCart->id && $clickToPayCart->express_checkout,

                'isOnePageCheckout' => $isOnePageCheckout,
                'isFallbackPage' => $isFallbackPage,
                'themeName' => $this->context->getThemeName(),
                'orderRedirectUrl' => $this->context->getPageLink(
                    'order',
                    true
                ),
                'locale' => str_replace('-', '_', $this->context->getLocale()) ?: 'en_US',
                'signUrl' => $this->context->getModuleLink($this->module->name, 'sign'),
                'get_order_details_url' => $this->context->getModuleLink(
                    $this->module->name,
                    'order',
                    [
                        'action' => 'GetOrderDetails',
                        'ajax' => 1,
                        'cart_id' => (int) \Context::getContext()->cart->id,
                    ]
                ),
                'expressCheckoutUrl' => $this->context->getModuleLink($this->module->name, 'expressCheckout', ['ajax' => 1]),
                'customer_information_url' => $this->context->getModuleLink(
                    $this->module->name,
                    'customer',
                    [
                        'action' => 'GetCustomerInformation',
                        'ajax' => 1,
                    ],
                    true
                ),

                'payment_url' => $this->context->getModuleLink(
                    $this->module->name,
                    'payment',
                    [],
                    true
                ),
                'translations' => [
                    'notYourCard' => $this->module->l('Not your card?', self::FILE_NAME),
                    'notYourCards' => $this->module->l('Not your cards?', self::FILE_NAME),
                ],
                'errors' => [
                    'somethingWentWrong' => [
                        'title' => $this->module->l('Something went wrong', self::FILE_NAME),
                        'message' => sprintf($this->module->l('Please return to %s and check out another way', self::FILE_NAME), $this->context->getShopName()),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'somethingWentWrongUseDifferentCard' => [
                        'title' => $this->module->l('Something went wrong', self::FILE_NAME),
                        'message' => sprintf($this->module->l('Please try again or use a different card.', self::FILE_NAME), $this->context->getShopName()),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'internetConnectionLost' => [
                        'title' => $this->module->l('It looks like you\'re offline', self::FILE_NAME),
                        'message' => $this->module->l('Please check your internet connection and try again.', self::FILE_NAME),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'somethingWentWrongWithThisCard' => [
                        'title' => $this->module->l('Something went wrong with this card', self::FILE_NAME),
                        'message' => $this->module->l('This card is currently not available within Click to Pay. Please use a different card or check out another way', self::FILE_NAME),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'invalidEmail' => [
                        'title' => $this->module->l('Invalid email', self::FILE_NAME),
                        'message' => $this->module->l('Confirm your email and try again', self::FILE_NAME),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'invalidPhoneNumber' => [
                        'title' => $this->module->l('Invalid phone number', self::FILE_NAME),
                        'message' => $this->module->l('Confirm your phone number and try again', self::FILE_NAME),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                    'threeDsFailed' => [
                        'title' => $this->module->l('Unable to authorize', self::FILE_NAME),
                        'message' => $this->module->l('Please try again or use a different card.', self::FILE_NAME),
                        'btn' => $this->module->l('Okay', self::FILE_NAME),
                    ],
                ],
            ]),
        ]);
    }

    /**
     * @param int $idAddress
     *
     * @return array|null
     */
    private function getExternalAddress(int $idAddress): ?array
    {
        /** @var \Address $address */
        $address = $this->addressRepository->findOneBy(['id_address' => (int) $idAddress]);

        if (!$address) {
            return null;
        }

        /** @var \State $state */
        $state = $this->stateRepository->findOneBy(['id_state' => (int) $address->id_state]);
        $stateIsoCode = $state->iso_code ?? '';

        /** @var \Country $country */
        $country = $this->countryRepository->findOneBy(['id_country' => (int) $address->id_country]);

        // Spain state name required for transaction and parsed from postal code
        if ($country->iso_code === self::SPAIN_ISO_CODE) {
            $stateIsoCode = Config::getSpainStateNameByPostalCode($address->postcode);
        }

        return [
            'line1' => $address->address1,
            'line2' => $address->address2,
            'city' => $address->city,
            'state' => $stateIsoCode,
            'countryCode' => $country->iso_code ?? '',
            'zip' => $address->postcode,
        ];
    }

    /**
     * @param int $idAddress
     *
     * @return string|null
     */
    private function getPhoneNumber(int $idAddress): ?string
    {
        /** @var \Address $address */
        $address = $this->addressRepository->findOneBy(['id_address' => (int) $idAddress]);

        if ($address) {
            return $address->phone_mobile ?: $address->phone;
        }

        return null;
    }
}
