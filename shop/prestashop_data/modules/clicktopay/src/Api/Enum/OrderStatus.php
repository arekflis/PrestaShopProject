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

namespace ClickToPay\Module\Api\Enum;

if (!defined('_PS_VERSION_')) {
    exit;
}

class OrderStatus
{
    public const CANCELLED = 'cancelled';
    public const FULLY_REFUNDED = 'fully_refunded';
    public const PARTIALLY_REFUNDED = 'partial_refunded';
}
