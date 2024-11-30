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

class CouldNotChangeOrderStatus extends ClickToPayException
{
    public static function unhandledOrderStatus(string $transactionStatus): self
    {
        return new self(
            sprintf('Unhandled transaction status (%s)', $transactionStatus),
            ExceptionCode::ORDER_UNHANDLED_TRANSACTION_STATUS,
            null,
            [
                'transaction_status' => $transactionStatus,
            ]
        );
    }

    public static function failedToFindOrder(int $orderId): self
    {
        return new self(
            sprintf('Failed to find order %s', $orderId),
            ExceptionCode::ORDER_FAILED_TO_FIND_ORDER,
            null,
            [
                'order_id' => $orderId,
            ]
        );
    }
}
