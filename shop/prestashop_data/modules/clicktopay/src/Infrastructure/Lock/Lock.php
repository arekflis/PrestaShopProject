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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Exception\CouldNotHandleLocking;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Lock
{
    /** @var LockInterface */
    private $lock;

    public function __construct(LockFactory $lockFactory)
    {
        $this->lock = $lockFactory->create();
    }

    /**
     * @throws CouldNotHandleLocking
     */
    public function create(string $resource, int $ttl = Config::LOCK_TIME_TO_LIVE, bool $autoRelease = true): void
    {
        if ($this->lock->exists()) {
            throw CouldNotHandleLocking::lockExists();
        }

        $this->lock->create($resource, $ttl, $autoRelease);
    }

    /**
     * @throws CouldNotHandleLocking
     */
    public function acquire(bool $blocking = false): bool
    {
        if (!$this->lock->exists()) {
            throw CouldNotHandleLocking::lockOnAcquireIsMissing();
        }

        return $this->lock->acquire($blocking);
    }

    /**
     * @throws CouldNotHandleLocking
     */
    public function release(): void
    {
        if (!$this->lock->exists()) {
            throw CouldNotHandleLocking::lockOnReleaseIsMissing();
        }

        $this->lock->release();
    }

    public function __destruct()
    {
        try {
            $this->release();
        } catch (CouldNotHandleLocking $exception) {
            return;
        }
    }
}
