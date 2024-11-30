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

namespace ClickToPay\Module\Core\Tools\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotUpdatePaymentOptionHook extends ClickToPayException
{
    public static function failedToUpdatePaymentOptionHook(\Throwable $exception): self
    {
        return new static(
            'Failed to update payment option hook',
            ExceptionCode::PAYMENT_OPTION_HOOK_UPDATE_FAILURE,
            $exception
        );
    }
}
