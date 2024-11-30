<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   ISC
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Infrastructure\Verification;

use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use PrestaShop\PrestaShop\Core\Addon\Module\ModuleManagerBuilder;

if (!defined('_PS_VERSION_')) {
    exit;
}

class HasRequiredDependencies
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function verify(): bool
    {
        $moduleManagerBuilder = ModuleManagerBuilder::getInstance();

        if (!$moduleManagerBuilder) {
            $this->logger->error('Failed to retrieve module manager builder.', [
                'context' => [],
            ]);

            return false;
        }

        $moduleManager = $moduleManagerBuilder->build();

        if (
            !($moduleManager->isInstalled('ps_mbo') || $moduleManager->isEnabled('ps_mbo'))
            || !($moduleManager->isInstalled('ps_accounts') || $moduleManager->isEnabled('ps_accounts'))
            || !($moduleManager->isInstalled('ps_eventbus') || $moduleManager->isEnabled('ps_eventbus'))
        ) {
            return false;
        }

        return true;
    }
}
