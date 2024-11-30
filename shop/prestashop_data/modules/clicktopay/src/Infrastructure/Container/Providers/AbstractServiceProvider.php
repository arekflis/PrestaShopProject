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

namespace ClickToPay\Module\Infrastructure\Container\Providers;

use League\Container\Container;

if (!defined('_PS_VERSION_')) {
    exit;
}

abstract class AbstractServiceProvider
{
    protected $bindings = [];

    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function provide(): void
    {
        foreach ($this->bindings as $key => $service) {
            $this->container->add($key, function () use ($service) {
                return $this->container->get($service);
            });
        }

        $this->register();
    }

    abstract public function register(): void;
}
