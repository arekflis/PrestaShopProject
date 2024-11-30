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

namespace ClickToPay\Module\Presentation\Loader;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use PrestaShop\Module\PsEventbus\Service\PresenterService;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PrestaShopIntegrationAssetLoader
{
    /**
     * @var \ClickToPay|null
     */
    private $module;

    /**
     * @var Context
     */
    private $context;

    /** @var LoggerInterface */
    private $logger;

    public function __construct(ModuleFactory $module, Context $context, LoggerInterface $logger)
    {
        $this->module = $module->getModule();
        $this->context = $context;
        $this->logger = $logger;
    }

    public function load(): void
    {
        $this->loadPsAccounts();
        $this->loadCloudSync();
    }

    private function loadPsAccounts(): void
    {
        /** @var PsAccounts $accountsFacade */
        $accountsFacade = $this->module->getService(PsAccounts::class);

        $psAccountsPresenter = $accountsFacade->getPsAccountsPresenter();
        $psAccountsService = $accountsFacade->getPsAccountsService();

        $this->context->getSmarty()->assign('clicktopay', [
            'url' => [
                'psAccountsCdnUrl' => $psAccountsService->getAccountsCdn(),
            ],
        ], true);

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        \Media::addJsDef([
            'contextPsAccounts' => $psAccountsPresenter->present(),
            'clicktopay' => array_merge($previousJsDef, [
                'isPsAccountsLinked' => $psAccountsService->isAccountLinked(),
            ]),
        ]);
    }

    private function loadCloudSync(): void
    {
        $eventbusModule = \Module::getInstanceByName('ps_eventbus');

        if (!$eventbusModule) {
            $this->logger->alert('Module ps_eventbus not found');

            return;
        }
        /** @var PresenterService $eventbusPresenterService */
        $eventbusPresenterService = $eventbusModule->getService(PresenterService::class);

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        \Media::addJsDef([
            'contextPsEventbus' => $eventbusPresenterService->expose($this->module, ['info']),
            'clicktopay' => array_merge($previousJsDef, [
                'url' => [
                    'cloudSyncPathCDC' => Config::PRESTASHOP_CLOUDSYNC_CDC,
                ],
            ]),
        ]);
    }
}
