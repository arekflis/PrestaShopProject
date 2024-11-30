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

class JWT
{
    public static function sign(string $base64pcks12Key, string $base64Passphrase, array $data): ?string
    {
        if (!openssl_pkcs12_read(base64_decode($base64pcks12Key), $certInfo, base64_decode($base64Passphrase))) {
            return '';
        }

        // Create token header as a JSON string
        $filteredData = array_filter($data);
        $header = json_encode(['typ' => 'JWT', 'alg' => 'RS256']);
        // Create token payload as a JSON string
        $payload = json_encode($filteredData);
        // Encode Header to Base64Url String
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        // Encode Payload to Base64Url String
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        openssl_sign($base64UrlHeader . '.' . $base64UrlPayload, $signature, $certInfo['pkey'], 'sha256WithRSAEncryption');

        // Encode Signature to Base64Url String
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }

    public static function encode(string $base64pcks12Key, string $base64Passphrase, array $headers, array $data): string
    {
        if (!openssl_pkcs12_read(base64_decode($base64pcks12Key), $certInfo, base64_decode($base64Passphrase))) {
            return '';
        }

        // Create token header as a JSON string
        $filteredData = array_filter($data);

        // Create token header as a JSON string
        $header = json_encode(array_merge([
            'alg' => 'RS256',
            'typ' => 'JWT',
        ], $headers));

        $timestamp = time();

        // Create token payload as a JSON string
        $payload = json_encode(array_merge([
            'nbf' => $timestamp,
            'iat' => $timestamp,
            'exp' => strtotime('+1 day', $timestamp),
        ], $filteredData));

        // Encode Header to Base64Url String
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

        // Encode Payload to Base64Url String
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        openssl_sign($base64UrlHeader . '.' . $base64UrlPayload, $signature, $certInfo['pkey'], 'sha256WithRSAEncryption');

        // Encode Signature to Base64Url String
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        // Create JWT
        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }
}
