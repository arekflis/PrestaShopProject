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

namespace ClickToPay\Module\Core\Payment\DTO;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ValidateOrderData
{
    private $customerId;
    private $cartId;
    private $orderTotal;
    private $paymentMethod;
    private $transactionToken;
    private $gatewayTransactionId;

    private function __construct(
        int $customerId,
        int $cartId,
        float $orderTotal,
        string $paymentMethod,
        string $transactionToken,
        string $gatewayTransactionId
    ) {
        $this->customerId = $customerId;
        $this->cartId = $cartId;
        $this->orderTotal = $orderTotal;
        $this->paymentMethod = $paymentMethod;
        $this->transactionToken = $transactionToken;
        $this->gatewayTransactionId = $gatewayTransactionId;
    }

    public function getCustomerId(): int
    {
        return $this->customerId;
    }

    public function getCartId(): int
    {
        return $this->cartId;
    }

    public function getOrderTotal(): float
    {
        return $this->orderTotal;
    }

    public function getPaymentMethod(): string
    {
        return $this->paymentMethod;
    }

    public function getTransactionToken(): string
    {
        return $this->transactionToken;
    }

    public function getGatewayTransactionId(): string
    {
        return $this->gatewayTransactionId;
    }

    public static function create(
        int $customerId,
        int $cartId,
        float $orderTotal,
        string $paymentMethod,
        string $transactionToken,
        string $gatewayTransactionId
    ): self {
        return new self(
            $customerId,
            $cartId,
            $orderTotal,
            $paymentMethod,
            $transactionToken,
            $gatewayTransactionId
        );
    }
}
