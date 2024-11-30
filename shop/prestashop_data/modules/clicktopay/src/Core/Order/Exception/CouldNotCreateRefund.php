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

namespace ClickToPay\Module\Core\Order\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotCreateRefund extends ClickToPayException
{
    public static function invalidRefundRequest(int $refundedAmount): self
    {
        return new static(
            sprintf('Failed to refund amount. Given amount (%s) is invalid', $refundedAmount),
            ExceptionCode::ORDER_REFUND_AMOUNT_IS_INVALID
        );
    }
}
