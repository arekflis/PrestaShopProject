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

namespace ClickToPay\Module\Infrastructure\Cache;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface CacheInterface extends \Psr\SimpleCache\CacheInterface
{
    /**
     * Get an item from the session, or store the default value.
     *
     * @return mixed
     */
    public function remember(string $key, ?int $seconds, \Closure $callback);
}
