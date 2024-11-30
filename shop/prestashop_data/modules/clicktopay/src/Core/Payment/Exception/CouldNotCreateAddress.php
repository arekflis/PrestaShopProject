<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   ISC
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Core\Payment\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotCreateAddress extends ClickToPayException
{
    public static function inactiveCountry(string $isoCode): self
    {
        return new static(
            sprintf('Inactive country (ISO code - %s)', $isoCode),
            ExceptionCode::PAYMENT_INACTIVE_COUNTRY,
            null,
            [
                'ISO code' => $isoCode,
            ]
        );
    }

    public static function inactiveAddressState(string $isoCode): self
    {
        return new static(
            sprintf('Inactive address state (ISO code - %s)', $isoCode),
            ExceptionCode::PAYMENT_INACTIVE_ADDRESS_STATE,
            null,
            [
                'ISO code' => $isoCode,
            ]
        );
    }
}
