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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotInstallPrestaShopDependencies extends ClickToPayException
{
    public static function failedToInstallMboInstaller(): self
    {
        return new self(
            'Failed to install Mbo installer',
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_MBO_INSTALLER
        );
    }

    public static function failedToInstallDependencies(\Throwable $exception): self
    {
        return new self(
            'Failed to install Mbo installer',
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_DEPENDENCIES,
            $exception
        );
    }

    public static function failedToRetrieveModuleManagerBuilder(): self
    {
        return new self(
            'Failed to retrieve module manager builder',
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_RETRIEVE_MODULE_MANAGER_BUILDER
        );
    }

    public static function failedToInstallPrestaShopAccounts(): self
    {
        return new self(
            'Failed to install PrestaShop Accounts',
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_PRESTASHOP_ACCOUNTS
        );
    }

    public static function failedToInstallPrestaShopEventBus(): self
    {
        return new self(
            'Failed to install PrestaShop Event Bus',
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_PRESTASHOP_EVENT_BUS
        );
    }
}
