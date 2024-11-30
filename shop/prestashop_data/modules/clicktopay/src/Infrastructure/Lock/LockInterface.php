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

namespace ClickToPay\Module\Infrastructure\Lock;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface LockInterface
{
    public function exists(): bool;

    public function create(string $resource, int $ttl, bool $autoRelease): void;

    public function acquire(bool $blocking): bool;

    public function release(): void;
}
