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

use Symfony\Component\Filesystem\LockHandler;

if (!defined('_PS_VERSION_')) {
    exit;
}

class LockV2 implements LockInterface
{
    /** @var ?LockHandler */
    private $lock;

    public function exists(): bool
    {
        return !empty($this->lock);
    }

    public function create(string $resource, int $ttl, bool $autoRelease): void
    {
        $this->lock = new LockHandler($resource);
    }

    public function acquire(bool $blocking): bool
    {
        return $this->lock->lock($blocking);
    }

    public function release(): void
    {
        $this->lock->release();

        $this->lock = null;
    }
}
