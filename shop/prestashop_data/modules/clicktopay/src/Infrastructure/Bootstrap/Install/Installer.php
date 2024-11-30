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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install;

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotInstallModule;
use PrestaShopLogger;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Installer implements InstallerInterface
{
    private $configurationInstaller;
    private $databaseTableInstaller;
    private $hookInstaller;

    public function __construct(
        ConfigurationInstaller $configurationInstaller,
        DatabaseTableInstaller $databaseTableInstaller,
        HookInstaller $hookInstaller
    ) {
        $this->configurationInstaller = $configurationInstaller;
        $this->databaseTableInstaller = $databaseTableInstaller;
        $this->hookInstaller = $hookInstaller;
    }

    /**
     * @return void
     *
     * @throws CouldNotInstallModule
     */
    public function init(): void
    {
        try {
            PrestaShopLogger::addLog('Click to Pay configurations install started', 1, null, 'ClickToPay', 1);
            $this->configurationInstaller->init();
            PrestaShopLogger::addLog('Click to Pay database tables install started', 1, null, 'ClickToPay', 1);
            $this->databaseTableInstaller->init();
            PrestaShopLogger::addLog('Click to Pay hooks install started', 1, null, 'ClickToPay', 1);
            $this->hookInstaller->init();
        } catch (CouldNotInstallModule $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw CouldNotInstallModule::unknownError($exception);
        }
    }
}
