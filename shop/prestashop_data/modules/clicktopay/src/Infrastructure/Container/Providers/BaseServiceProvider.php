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

use ClickToPay;
use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\ConfigurationInstaller;
use ClickToPay\Module\Infrastructure\Cache\CacheInterface;
use ClickToPay\Module\Infrastructure\Cache\FilesystemCache;
use ClickToPay\Module\Infrastructure\Clock\Clock;
use ClickToPay\Module\Infrastructure\Clock\ClockInterface;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContext;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\EntityManager\EntityManagerInterface;
use ClickToPay\Module\Infrastructure\EntityManager\ObjectModelEntityManager;
use ClickToPay\Module\Infrastructure\Logger\Formatter\LogFormatter;
use ClickToPay\Module\Infrastructure\Logger\Formatter\LogFormatterInterface;
use ClickToPay\Module\Infrastructure\Logger\Logger;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Notification\Handler\CookieNotificationHandler;
use ClickToPay\Module\Infrastructure\Notification\Handler\NotificationHandlerInterface;
use ClickToPay\Module\Infrastructure\Translator\AdminLegacyModuleTabTranslator;
use ClickToPay\Module\Infrastructure\Translator\AdminLegacyTranslator;
use ClickToPay\Module\Infrastructure\Translator\AdminModuleTabTranslatorInterface;
use ClickToPay\Module\Infrastructure\Translator\AdminTranslatorInterface;
use ClickToPay\Module\Infrastructure\Translator\ExceptionLegacyTranslator;
use ClickToPay\Module\Infrastructure\Translator\ExceptionTranslatorInterface;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;
use PrestaShop\PsAccountsInstaller\Installer\Installer as PsAccountsInstaller;

if (!defined('_PS_VERSION_')) {
    exit;
}

/**
 * Load base services here which are usually required
 */
final class BaseServiceProvider extends AbstractServiceProvider
{
    public $bindings = [
        GlobalShopContextInterface::class => GlobalShopContext::class,
        ClockInterface::class => Clock::class,
        EntityManagerInterface::class => ObjectModelEntityManager::class,
        LogFormatterInterface::class => LogFormatter::class,
        LoggerInterface::class => Logger::class,
        AdminModuleTabTranslatorInterface::class => AdminLegacyModuleTabTranslator::class,
        NotificationHandlerInterface::class => CookieNotificationHandler::class,
        ExceptionTranslatorInterface::class => ExceptionLegacyTranslator::class,
        AdminTranslatorInterface::class => AdminLegacyTranslator::class,
        CacheInterface::class => FilesystemCache::class,
    ];

    public function register(): void
    {
        $configurationInstaller = $this->container->add(ConfigurationInstaller::class, ConfigurationInstaller::class);

        if (method_exists($configurationInstaller, 'addArgument')) {
            $configurationInstaller->addArgument(ClickToPay::getInstanceByName(ClickToPay::NAME));
        } else {
            $configurationInstaller->withArgument(ClickToPay::getInstanceByName(ClickToPay::NAME));
        }

        $psAccountContainer = $this->container->add(PsAccountsInstaller::class, PsAccountsInstaller::class);
        if (method_exists($psAccountContainer, 'addArgument')) {
            $psAccountContainer->addArgument(Config::getPsAccountsVersion());
        } else {
            $psAccountContainer->withArgument(Config::getPsAccountsVersion());
        }

        $psAccountFacadeContainer = $this->container->add(PsAccounts::class, PsAccounts::class);
        if (method_exists($psAccountFacadeContainer, 'addArgument')) {
            $psAccountFacadeContainer->addArgument(PsAccountsInstaller::class);
        } else {
            $psAccountFacadeContainer->withArgument(PsAccountsInstaller::class);
        }
    }
}
