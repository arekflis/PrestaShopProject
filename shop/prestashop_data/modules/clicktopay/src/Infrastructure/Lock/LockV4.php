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

use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\Store\FlockStore;

if (!defined('_PS_VERSION_')) {
    exit;
}

class LockV4 implements LockInterface
{
    /** @var LockFactory Factory */
    private $lockFactory;
    /** @var ?LockInterface */
    private $lock;

    public function __construct()
    {
        $this->lockFactory = new LockFactory(new FlockStore());
    }

    public function exists(): bool
    {
        return !empty($this->lock);
    }

    public function create(string $resource, int $ttl, bool $autoRelease): void
    {
        $this->lock = $this->lockFactory->createLock($resource, $ttl, $autoRelease);
    }

    public function acquire(bool $blocking): bool
    {
        return $this->lock->acquire($blocking);
    }

    public function release(): void
    {
        $this->lock->release();

        $this->lock = null;
    }
}
