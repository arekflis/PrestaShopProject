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

namespace ClickToPay\Module\Infrastructure\Context;

use ClickToPay\Module\Infrastructure\Adapter\Context;

if (!defined('_PS_VERSION_')) {
    exit;
}

final class GlobalShopContext implements GlobalShopContextInterface
{
    private $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function getShopId(): int
    {
        return $this->context->getShopId();
    }

    public function getLanguageId(): int
    {
        return $this->context->getLanguageId();
    }

    public function getLanguageIso(): string
    {
        return $this->context->getLanguageIso();
    }

    public function getCurrencyIso(): string
    {
        return $this->context->getCurrencyIso();
    }

    public function getCurrency(): ?\Currency
    {
        return $this->context->getCurrency();
    }

    public function getShopDomain(): string
    {
        return $this->context->getShopDomain();
    }

    public function getShopName(): string
    {
        return $this->context->getShopName();
    }

    public function isShopSingleShopContext(): bool
    {
        return \Shop::getContext() === \Shop::CONTEXT_SHOP;
    }
}
