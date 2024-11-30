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

use ClickToPay\Module\Core\Shared\Repository\AddressRepository;
use ClickToPay\Module\Core\Shared\Repository\AddressRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CartRepository;
use ClickToPay\Module\Core\Shared\Repository\CartRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayCartRepository;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayCartRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayOrderRepository;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayOrderRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayRefundRepository;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayRefundRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CountryRepository;
use ClickToPay\Module\Core\Shared\Repository\CountryRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CurrencyRepository;
use ClickToPay\Module\Core\Shared\Repository\CurrencyRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CustomerRepository;
use ClickToPay\Module\Core\Shared\Repository\CustomerRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\GenderRepository;
use ClickToPay\Module\Core\Shared\Repository\GenderRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\LanguageRepository;
use ClickToPay\Module\Core\Shared\Repository\LanguageRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\OrderRepository;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\OrderStateRepository;
use ClickToPay\Module\Core\Shared\Repository\OrderStateRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\StateRepository;
use ClickToPay\Module\Core\Shared\Repository\StateRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\TabRepository;
use ClickToPay\Module\Core\Shared\Repository\TabRepositoryInterface;
use ClickToPay\Module\Infrastructure\Logger\Repository\ClickToPayLogRepository;
use ClickToPay\Module\Infrastructure\Logger\Repository\ClickToPayLogRepositoryInterface;
use ClickToPay\Module\Infrastructure\Logger\Repository\PrestashopLoggerRepository;
use ClickToPay\Module\Infrastructure\Logger\Repository\PrestashopLoggerRepositoryInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class RepositoryServiceProvider extends AbstractServiceProvider
{
    public $bindings = [
        CurrencyRepositoryInterface::class => CurrencyRepository::class,
        PrestashopLoggerRepositoryInterface::class => PrestashopLoggerRepository::class,
        ClickToPayLogRepositoryInterface::class => ClickToPayLogRepository::class,
        TabRepositoryInterface::class => TabRepository::class,
        LanguageRepositoryInterface::class => LanguageRepository::class,
        OrderRepositoryInterface::class => OrderRepository::class,
        CustomerRepositoryInterface::class => CustomerRepository::class,
        ClickToPayCartRepositoryInterface::class => ClickToPayCartRepository::class,
        AddressRepositoryInterface::class => AddressRepository::class,
        CountryRepositoryInterface::class => CountryRepository::class,
        GenderRepositoryInterface::class => GenderRepository::class,
        StateRepositoryInterface::class => StateRepository::class,
        OrderStateRepositoryInterface::class => OrderStateRepository::class,
        CartRepositoryInterface::class => CartRepository::class,
        ClickToPayRefundRepositoryInterface::class => ClickToPayRefundRepository::class,
        ClickToPayOrderRepositoryInterface::class => ClickToPayOrderRepository::class,
    ];

    public function register(): void
    {
    }
}
