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

use Symfony\Component\Lock\Factory as SymfonyFactoryV3;
use Symfony\Component\Lock\LockFactory as SymfonyFactoryV4;

if (!defined('_PS_VERSION_')) {
    exit;
}

class LockFactory
{
    public function create(): LockInterface
    {
        if (class_exists(SymfonyFactoryV4::class)) {
            // Symfony 4.4+
            return new LockV4();
        }

        if (class_exists(SymfonyFactoryV3::class)) {
            // Symfony 3.4+
            return new LockV3();
        }

        // Symfony 2.8+
        return new LockV2();
    }
}
