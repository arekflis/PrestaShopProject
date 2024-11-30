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

namespace ClickToPay\Module\Core\Payment\DTO;

if (!defined('_PS_VERSION_')) {
    exit;
}

class UpdateCheckoutProgressData
{
    /** @var int */
    private $cartId;
    /** @var bool */
    private $customerInformationStepCompleted;
    /** @var bool */
    private $addressStepCompleted;
    /** @var bool */
    private $shippingStepCompleted;
    /** @var bool */
    private $paymentStepCompleted;

    private function __construct(
        int $cartId,
        bool $customerInformationStepCompleted,
        bool $addressStepCompleted,
        bool $shippingStepCompleted,
        bool $paymentStepCompleted
    ) {
        $this->cartId = $cartId;
        $this->customerInformationStepCompleted = $customerInformationStepCompleted;
        $this->addressStepCompleted = $addressStepCompleted;
        $this->shippingStepCompleted = $shippingStepCompleted;
        $this->paymentStepCompleted = $paymentStepCompleted;
    }

    public function getCartId(): int
    {
        return $this->cartId;
    }

    public function setCartId(int $cartId): void
    {
        $this->cartId = $cartId;
    }

    public function isCustomerInformationStepCompleted(): bool
    {
        return $this->customerInformationStepCompleted;
    }

    public function setCustomerInformationStepCompleted(bool $customerInformationStepCompleted): void
    {
        $this->customerInformationStepCompleted = $customerInformationStepCompleted;
    }

    public function isAddressStepCompleted(): bool
    {
        return $this->addressStepCompleted;
    }

    public function setAddressStepCompleted(bool $addressStepCompleted): void
    {
        $this->addressStepCompleted = $addressStepCompleted;
    }

    public function isShippingStepCompleted(): bool
    {
        return $this->shippingStepCompleted;
    }

    public function setShippingStepCompleted(bool $shippingStepCompleted): void
    {
        $this->shippingStepCompleted = $shippingStepCompleted;
    }

    public function isPaymentStepCompleted(): bool
    {
        return $this->paymentStepCompleted;
    }

    public function setPaymentStepCompleted(bool $paymentStepCompleted): void
    {
        $this->paymentStepCompleted = $paymentStepCompleted;
    }

    public static function create(
        int $cartId,
        bool $customerInformationStepCompleted,
        bool $addressStepCompleted,
        bool $shippingStepCompleted,
        bool $paymentStepCompleted
    ): self {
        return new self(
            $cartId,
            $customerInformationStepCompleted,
            $addressStepCompleted,
            $shippingStepCompleted,
            $paymentStepCompleted
        );
    }
}
