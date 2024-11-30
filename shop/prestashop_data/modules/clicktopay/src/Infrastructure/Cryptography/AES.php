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

namespace ClickToPay\Module\Infrastructure\Cryptography;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AES
{
    public static function decrypt(string $key, string $iv, string $tag, string $base64Data): string
    {
        return openssl_decrypt(
            base64_decode($base64Data),
            'aes-256-gcm',
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
    }
}
