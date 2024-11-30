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

final class Clock implements ClockInterface
{
    public function getNowUnixTs(): int
    {
        return time();
    }

    public function getNow(): \DateTime
    {
        return new \DateTime();
    }

    public function get($date): \DateTime
    {
        return new \DateTime($date);
    }

    public function formatDate(\DateTime $dateTime, string $format = 'Y-m-d H:i:s'): string
    {
        return $dateTime->format($format);
    }
}
