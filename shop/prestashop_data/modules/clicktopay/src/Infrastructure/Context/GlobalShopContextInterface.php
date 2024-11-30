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

if (!defined('_PS_VERSION_')) {
    exit;
}

/**
 * Gets shop context data
 */
interface GlobalShopContextInterface
{
    public function getShopId(): int;

    public function getLanguageId(): int;

    public function getLanguageIso(): string;

    public function getCurrencyIso(): string;

    public function getCurrency(): ?\Currency;

    public function getShopDomain(): string;

    public function getShopName(): string;

    public function isShopSingleShopContext(): bool;
}
