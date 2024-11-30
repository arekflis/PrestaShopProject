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

namespace ClickToPay\Module\Infrastructure\Container;

use ClickToPay\Module\Infrastructure\Container\Providers\BaseServiceProvider;
use ClickToPay\Module\Infrastructure\Container\Providers\RepositoryServiceProvider;
use League\Container\ReflectionContainer;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Container
{
    public static $instance;

    public static function getInstance(): \League\Container\Container
    {
        if (is_null(self::$instance)) {
            $container = new \League\Container\Container();

            $container->delegate(new ReflectionContainer());

            (new BaseServiceProvider($container))->provide();
            (new RepositoryServiceProvider($container))->provide();

            self::$instance = $container;
        }

        return self::$instance;
    }
}
