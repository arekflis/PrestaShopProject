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

namespace ClickToPay\Module\Presentation\Presenter\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

final class CouldNotPresentPaymentOption extends ClickToPayException
{
    public static function paymentFormAssetsAreMissing(): self
    {
        return new static(
            'Payment form assets are missing. Ensure that assets have been built.',
            ExceptionCode::PAYMENT_FORM_ASSETS_ARE_MISSING,
            null
        );
    }
}
