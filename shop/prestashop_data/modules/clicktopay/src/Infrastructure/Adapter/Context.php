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

namespace ClickToPay\Module\Infrastructure\Adapter;

use Configuration as PrestashopConfiguration;
use Context as PrestashopContext;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Context
{
    public function getCart(): \Cart
    {
        return PrestashopContext::getContext()->cart;
    }

    public function getShopId(): int
    {
        return (int) PrestashopContext::getContext()->shop->id;
    }

    public function getLanguageId(): int
    {
        return (int) PrestashopContext::getContext()->language->id;
    }

    public function getLanguageIso(): string
    {
        return (string) PrestashopContext::getContext()->language->iso_code ?: 'en';
    }

    public function getLanguageCode(): string
    {
        return (string) PrestashopContext::getContext()->language->language_code ?: 'en';
    }

    /**
     * @return string
     */
    public function getLocale(): string
    {
        if (method_exists(PrestashopContext::getContext()->language, 'getLocale')) {
            return (string) PrestashopContext::getContext()->language->getLocale();
        }

        return (string) PrestashopContext::getContext()->language->locale;
    }

    public function getCurrencyIso(): string
    {
        if (!PrestashopContext::getContext()->currency) {
            return '';
        }

        return (string) PrestashopContext::getContext()->currency->iso_code;
    }

    public function getCountryIso(): string
    {
        if (!PrestashopContext::getContext()->country) {
            return '';
        }

        return (string) PrestashopContext::getContext()->country->iso_code;
    }

    public function getCurrency(): ?\Currency
    {
        return PrestashopContext::getContext()->currency;
    }

    public function getCustomerId(): int
    {
        if (!PrestashopContext::getContext()->customer) {
            return 0;
        }

        return (int) PrestashopContext::getContext()->customer->id;
    }

    public function getCustomer(): ?\Customer
    {
        return PrestashopContext::getContext()->customer;
    }

    public function isCustomerLoggedIn(): bool
    {
        if (!PrestashopContext::getContext()->customer) {
            return false;
        }

        return (bool) PrestashopContext::getContext()->customer->isLogged();
    }

    public function getShopDomain(): string
    {
        return (string) PrestashopContext::getContext()->shop->domain;
    }

    public function getShopName(): string
    {
        return (string) PrestashopContext::getContext()->shop->name;
    }

    public function getAdminLink($controllerName, array $params = []): string
    {
        /* @noinspection PhpMethodParametersCountMismatchInspection - its valid for PS1.7 */
        return (string) PrestashopContext::getContext()->link->getAdminLink($controllerName, true, [], $params);
    }

    public function getModuleLink(
        $module,
        $controller = 'default',
        array $params = [],
        $ssl = null,
        $idLang = null,
        $idShop = null,
        $relativeProtocol = false
    ): string {
        return (string) PrestashopContext::getContext()->link->getModuleLink(
            $module,
            $controller,
            $params,
            $ssl,
            $idLang,
            $idShop,
            $relativeProtocol
        );
    }

    public function getSmarty(): \Smarty
    {
        return PrestashopContext::getContext()->smarty;
    }

    public function getComputingPrecision()
    {
        if (method_exists(PrestashopContext::getContext(), 'getComputingPrecision')) {
            return PrestashopContext::getContext()->getComputingPrecision();
        } else {
            return PrestashopConfiguration::get('PS_PRICE_DISPLAY_PRECISION');
        }
    }

    public function getPageLink(
        $controller,
        $ssl = null,
        $idLang = null,
        $request = null,
        $requestUrlEncode = false,
        $idShop = null,
        $relativeProtocol = false
    ): string {
        return (string) PrestashopContext::getContext()->link->getPageLink(
            $controller,
            $ssl,
            $idLang,
            $request,
            $requestUrlEncode,
            $idShop,
            $relativeProtocol
        );
    }

    public function getController()
    {
        return PrestashopContext::getContext()->controller;
    }

    public function updateCustomer(\Customer $customer): void
    {
        PrestashopContext::getContext()->updateCustomer($customer);
    }

    public function getThemeName(): string
    {
        return PrestashopContext::getContext()->shop->theme_name;
    }
}
