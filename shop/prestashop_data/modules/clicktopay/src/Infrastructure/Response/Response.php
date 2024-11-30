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

namespace ClickToPay\Module\Infrastructure\Response;

use Symfony\Component\HttpFoundation\Response as BaseResponse;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Response extends BaseResponse
{
    /**
     * @param mixed $data
     */
    public function __construct($data = null, int $status = 200, array $headers = [])
    {
        parent::__construct($data, $status, $headers);
    }

    public static function respond(string $message, int $status = 200): self
    {
        return new self($message, $status);
    }
}
