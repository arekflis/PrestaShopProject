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

namespace ClickToPay\Module\Infrastructure\Logger;

if (!defined('_PS_VERSION_')) {
    exit;
}

// NOTE only should be used for tests
final class NullLogger implements LoggerInterface
{
    public function emergency($message, array $context = [])
    {
        return null;
    }

    public function alert($message, array $context = [])
    {
        return null;
    }

    public function critical($message, array $context = [])
    {
        return null;
    }

    public function error($message, array $context = [])
    {
        return null;
    }

    public function warning($message, array $context = [])
    {
        return null;
    }

    public function notice($message, array $context = [])
    {
        return null;
    }

    public function info($message, array $context = [])
    {
        return null;
    }

    public function debug($message, array $context = [])
    {
        return null;
    }

    public function log($level, $message, array $context = [])
    {
        return null;
    }
}
