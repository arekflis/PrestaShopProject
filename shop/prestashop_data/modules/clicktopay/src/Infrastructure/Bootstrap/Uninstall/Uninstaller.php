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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Uninstall;

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotUninstallModule;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Uninstaller implements UninstallerInterface
{
    private $databaseTableUninstaller;
    private $configurationUninstaller;

    public function __construct(
        DatabaseTableUninstaller $databaseTableUninstaller,
        ConfigurationUninstaller $configurationUninstaller
    ) {
        $this->databaseTableUninstaller = $databaseTableUninstaller;
        $this->configurationUninstaller = $configurationUninstaller;
    }

    /**
     * @throws CouldNotUninstallModule
     * @throws ClickToPayException
     */
    public function init(): void
    {
        try {
            $this->databaseTableUninstaller->init();
            $this->configurationUninstaller->init();
        } catch (CouldNotUninstallModule $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw CouldNotUninstallModule::unknownError($exception);
        }
    }
}
