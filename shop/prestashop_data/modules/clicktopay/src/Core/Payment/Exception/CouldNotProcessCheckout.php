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

namespace ClickToPay\Module\Core\Payment\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotProcessCheckout extends ClickToPayException
{
    public static function failedToFindCart(int $cartId): self
    {
        return new static(
            sprintf('Failed to find cart by ID %s', $cartId),
            ExceptionCode::PAYMENT_FAILED_TO_FIND_CART,
            null,
            [
                'cart_id' => $cartId,
            ]
        );
    }

    public static function failedToLockCart(\Throwable $exception, int $cartId): self
    {
        return new static(
            sprintf('Failed to lock Cart. Cart ID %s', $cartId),
            ExceptionCode::PAYMENT_FAILED_TO_LOCK_CART,
            $exception,
            [
                'cart_id' => $cartId,
            ]
        );
    }

    public static function failedToValidateOrder(\Throwable $exception, int $cartId): self
    {
        return new static(
            sprintf('Failed to validate order. Cart ID %s', $cartId),
            ExceptionCode::PAYMENT_FAILED_TO_VALIDATE_ORDER,
            $exception,
            [
                'cart_id' => $cartId,
            ]
        );
    }

    public static function failedToAddOrderMapping(\Throwable $exception, string $externalOrderId, int $internalOrderId): self
    {
        return new static(
            sprintf(
                'Failed to add order mapping. External order ID %s, internal order ID %s',
                $externalOrderId,
                $internalOrderId
            ),
            ExceptionCode::PAYMENT_FAILED_TO_ADD_ORDER_MAPPING,
            $exception,
            [
                'external_order_id' => $externalOrderId,
                'internal_order_id' => $internalOrderId,
            ]
        );
    }
}
