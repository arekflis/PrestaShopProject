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

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotInstallPrestaShopDependencies;
use Prestashop\ModuleLibMboInstaller\Installer;
use Prestashop\ModuleLibMboInstaller\Presenter;
use PrestaShop\PrestaShop\Core\Addon\Module\ModuleManagerBuilder;
use PrestaShop\PsAccountsInstaller\Installer\Installer as PsAccountsInstaller;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PrestaShopDependenciesInstall implements InstallerInterface
{
    /** @var ClickToPay */
    private $module;

    public function __construct(
        ModuleFactory $moduleFactory
    ) {
        $this->module = $moduleFactory->getModule();
    }

    /**
     * @throws CouldNotInstallPrestaShopDependencies
     */
    public function init(): void
    {
        $this->installMbo();

        try {
            $this->installDependencies();
        } catch (\Throwable $exception) {
            throw CouldNotInstallPrestaShopDependencies::failedToInstallDependencies($exception);
        }
    }

    private function installMbo()
    {
        $mboStatus = (new Presenter())->present();

        if (!$mboStatus['isInstalled']) {
            $mboInstaller = new Installer(_PS_VERSION_);

            if (!$mboInstaller->installModule()) {
                throw CouldNotInstallPrestaShopDependencies::failedToInstallMboInstaller();
            }
        }
    }

    /**
     * Install PrestaShop Integration Framework Components
     *
     * @throws \Throwable
     */
    private function installDependencies(): void
    {
        $moduleManager = ModuleManagerBuilder::getInstance();

        if (!$moduleManager) {
            throw CouldNotInstallPrestaShopDependencies::failedToRetrieveModuleManagerBuilder();
        }

        $moduleManager = $moduleManager->build();

        /* If fails do not stop installation, module dependency manager will solve this issue * */
        if (!$moduleManager->isInstalled('ps_accounts')) {
            /** @var PsAccountsInstaller $prestashopAccountsInstaller */
            $prestashopAccountsInstaller = $this->module->getService(PsAccountsInstaller::class);
            $prestashopAccountsInstaller->install();
        } elseif (!$moduleManager->isEnabled('ps_accounts')) {
            $moduleManager->enable('ps_accounts');
        }

        /* If fails do not stop installation, module dependency manager will solve this issue * */
        if (!$moduleManager->isInstalled('ps_eventbus')) {
            $moduleManager->install('ps_eventbus');
        } elseif (!$moduleManager->isEnabled('ps_eventbus')) {
            $moduleManager->enable('ps_eventbus');
            $moduleManager->upgrade('ps_eventbus');
        } else {
            $moduleManager->upgrade('ps_eventbus');
        }
    }
}
