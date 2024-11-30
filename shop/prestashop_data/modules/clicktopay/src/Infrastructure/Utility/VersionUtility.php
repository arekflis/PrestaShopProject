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

namespace ClickToPay\Module\Infrastructure\Utility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class VersionUtility
{
    public static function isPsVersionLessThan($version): ?int
    {
        return version_compare(_PS_VERSION_, $version, '<');
    }

    public static function isPsVersionGreaterThan($version): ?int
    {
        return version_compare(_PS_VERSION_, $version, '>');
    }

    public static function isPsVersionGreaterOrEqualTo($version): ?int
    {
        return version_compare(_PS_VERSION_, $version, '>=');
    }

    public static function isPsVersionLessThanOrEqualTo($version): ?int
    {
        return version_compare(_PS_VERSION_, $version, '<=');
    }

    public static function isPsVersionEqualTo($version): ?int
    {
        return version_compare(_PS_VERSION_, $version, '=');
    }

    public static function current(): string
    {
        return _PS_VERSION_;
    }
}
