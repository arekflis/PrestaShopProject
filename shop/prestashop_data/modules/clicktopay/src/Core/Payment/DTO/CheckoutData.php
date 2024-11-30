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

use ClickToPay\Module\Infrastructure\Request\Request;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CheckoutData
{
    /** @var int */
    private $cartId;
    /** @var string */
    private $transactionToken;
    /** @var int */
    private $transactionTotal;
    /** @var string */
    private $gatewayTransactionId;

    private function __construct(int $cartId, string $transactionToken, int $transactionTotal, string $gatewayTransactionId)
    {
        $this->cartId = $cartId;
        $this->transactionToken = $transactionToken;
        $this->transactionTotal = $transactionTotal;
        $this->gatewayTransactionId = $gatewayTransactionId;
    }

    public function getCartId(): int
    {
        return $this->cartId;
    }

    public function getTransactionToken(): string
    {
        return $this->transactionToken;
    }

    public function getTransactionTotal(): int
    {
        return $this->transactionTotal;
    }

    public function getGatewayTransactionId(): string
    {
        return $this->gatewayTransactionId;
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            (int) $request->get('cart_id'),
            (string) $request->get('transaction_token'),
            (int) $request->get('transaction_amount'),
            (string) $request->get('gateway_transaction_id')
        );
    }
}
