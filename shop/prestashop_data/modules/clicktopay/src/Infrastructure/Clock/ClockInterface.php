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

namespace ClickToPay\Module\Infrastructure\Clock;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface ClockInterface
{
    public function getNowUnixTs(): int;

    public function getNow(): \DateTime;

    public function get($date): \DateTime;

    public function formatDate(\DateTime $dateTime, string $format = 'Y-m-d H:i:s'): string;
}
