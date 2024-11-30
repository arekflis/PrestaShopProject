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

namespace ClickToPay\Module\Infrastructure\Logger\Formatter;

if (!defined('_PS_VERSION_')) {
    exit;
}

class LogFormatter implements LogFormatterInterface
{
    public const LOG_PREFIX = 'CLICKTOPAY_MODULE_LOG:';

    public function getMessage(string $message): string
    {
        return self::LOG_PREFIX . ' ' . $message;
    }
}
