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

namespace ClickToPay\Module\Presentation\Presenter\Option;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Shared\Repository\AddressRepository;
use ClickToPay\Module\Core\Shared\Repository\CountryRepository;
use ClickToPay\Module\Core\Tools\Action\ValidateOpcModuleCompatibilityAction;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Adapter\Tools;
use PrestaShop\PrestaShop\Core\Payment\PaymentOption;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayOption implements PaymentOptionInterface
{
    private $context;
    /** @var \ClickToPay|null */
    private $module;
    /** @var string */
    private $logo;
    /** @var string */
    private $paymentMethodName;
    /** @var string */
    private $paymentMethodIdentifier;
    /** @var AddressRepository */
    private $addressRepository;
    /** @var CountryRepository */
    private $countryRepository;
    /** @var Tools */
    private $tools;
    /** @var Configuration */
    private $configuration;
    /** @var ValidateOpcModuleCompatibilityAction */
    private $validateOpcModuleCompatibilityAction;

    public function __construct(
        Context $context,
        ModuleFactory $moduleFactory,
        AddressRepository $addressRepository,
        CountryRepository $countryRepository,
        Tools $tools,
        Configuration $configuration,
        ValidateOpcModuleCompatibilityAction $validateOpcModuleCompatibilityAction
    ) {
        $this->context = $context;
        $this->module = $moduleFactory->getModule();
        $this->addressRepository = $addressRepository;
        $this->countryRepository = $countryRepository;
        $this->tools = $tools;
        $this->configuration = $configuration;
        $this->validateOpcModuleCompatibilityAction = $validateOpcModuleCompatibilityAction;
    }

    public function setLogo(string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    public function setPaymentMethodName(string $paymentMethodName): self
    {
        $this->paymentMethodName = $paymentMethodName;

        return $this;
    }

    public function setPaymentMethodIdentifier(string $paymentMethodIdentifier): self
    {
        $this->paymentMethodIdentifier = $paymentMethodIdentifier;

        return $this;
    }

    public function getOption(): PaymentOption
    {
        $theme = $this->configuration->get(Config::CLICKTOPAY_THEME);

        $actionUrl = $this->context->getModuleLink(
            $this->module->name,
            'checkout',
            [],
            true
        );

        // NOTE: needs to be \Tools due to it being parsed to null with adapter as it's empty string.
        $isSeparatePage =
            \Tools::getValue(Config::THE_CHECKOUT_OPC_SEPARATE_PAGE_PARAM) === ''
        ;

        $isFallbackPage = $this->context->getController() instanceof \ClickToPayCheckoutModuleFrontController;

        $isOnePageCheckout = $this->validateOpcModuleCompatibilityAction->run() && !$isSeparatePage;

        $this->context->getSmarty()->assign('clicktopay', [
            'cart_id' => $this->context->getCart()->id,
            'secure_key' => $this->context->getCart()->secure_key,
            'brands' => $this->configuration->get(Config::CLICKTOPAY_CARDS_SUPPORTED),
            'icons' => [
                'dropdownArrowIcon' => $this->module->getPathUri() . 'views/img/dropdown-arrow-' . $theme . '.svg',
                'checkmarkIcon' => $this->module->getPathUri() . 'views/img/checkmark.svg',
                'c2pIcon' => $this->module->getPathUri() . 'views/img/c2p-' . $theme . '.svg',
                'loading' => $theme === 'dark' ? $this->module->getPathUri() . 'views/img/loading-dark.gif' : $this->module->getPathUri() . 'views/img/loading.gif',
            ],
            'payment_option_action' => $actionUrl,
            'address' => $this->shippingAddressBlockDataToArray($this->getShippingAddress()),
            'isOnePageCheckout' => $isOnePageCheckout,
            'isFallbackPage' => $isFallbackPage,
            'isSeparatePage' => $isSeparatePage,
            'isDarkTheme' => $theme === 'dark',
        ]);

        $paymentOption = (new PaymentOption())
            ->setLogo($this->logo)
            ->setModuleName($this->module->name)
            ->setCallToActionText($this->paymentMethodName)
            ->setAction($actionUrl);

        if (!$isOnePageCheckout || $isFallbackPage) {
            $paymentOption
                ->setForm($this->context->getSmarty()->fetch(
                    $this->module->getLocalPath() . '/views/templates/front/partials/clicktopay_info.tpl'
                ));
        }

        return $paymentOption;
    }

    public function isSupported(): bool
    {
        return !empty($this->paymentMethodIdentifier);
    }

    /**
     * @return array|null
     *
     * @throws \PrestaShopException
     */
    private function getShippingAddress(): ?\Address
    {
        $idAddress = $this->context->getCart()->id_address_delivery;

        /** @var \Address $address */
        $address = $this->addressRepository->findOneBy(['id_address' => (int) $idAddress]);

        if (!$address) {
            return null;
        }

        return $address;
    }

    /**
     * @param \Address $address
     *
     * @return array
     *
     * @throws \PrestaShopException
     */
    private function shippingAddressBlockDataToArray(?\Address $address): array
    {
        if (!$address) {
            return [];
        }

        /** @var \Country $country */
        $country = $this->countryRepository->findOneBy(['id_country' => (int) $address->id_country]);

        return [
            'firstname' => $address->firstname,
            'lastname' => $address->lastname,
            'address1' => $address->address1,
            'city' => $address->city,
            'postcode' => $address->postcode,
            'country_iso' => $country->iso_code,
            'country' => $country->name[$this->context->getLanguageId()],
            'editAddressUrl' => $this->context->getPageLink('order', true, null, 'id_address=' . $address->id . '&editAddress=delivery&token' . $this->tools->getToken(false)),
        ];
    }
}
