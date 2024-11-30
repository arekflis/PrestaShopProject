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

namespace ClickToPay\Module\Infrastructure\Utility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ExceptionUtility
{
    public static function getExceptions(\Throwable $exception)
    {
        if (method_exists($exception, 'getExceptions')) {
            return $exception->getExceptions();
        }

        return [self::toArray($exception)];
    }

    public static function toArray(\Throwable $exception): array
    {
        if (method_exists($exception, 'getContext')) {
            $context = $exception->getContext();
        } else {
            $context = [];
        }

        return [
            'message' => (string) $exception->getMessage(),
            'code' => (int) $exception->getCode(),
            'file' => (string) $exception->getFile(),
            'line' => (int) $exception->getLine(),
            'context' => $context,
        ];
    }
}
