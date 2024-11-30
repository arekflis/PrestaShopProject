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

class RSA
{
    public static function encrypt(string $publicKey, string $base64Data): string
    {
        openssl_public_encrypt($base64Data, $encryptedData, $publicKey);

        return base64_encode($encryptedData);
    }

    public static function decrypt(string $privateKey, string $base64Data): string
    {
        openssl_private_decrypt(base64_decode($base64Data), $decryptedData, $privateKey);

        return base64_decode($decryptedData);
    }
}
