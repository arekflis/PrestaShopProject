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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Tools\Action\UpdatePaymentHookPositionAction;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayBannerModuleFrontController extends AbstractFrontController
{
    public const FILE_NAME = 'banner';

    /** @var ClickToPay */
    public $module;

    public function displayAjaxDismiss(): void
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Configuration $configuration */
        $configuration = $this->module->getService(\ClickToPay\Module\Infrastructure\Adapter\Configuration::class);

        $previousConfigurationValue = $configuration->get(Config::CLICKTOPAY_BANNER_DISMISSED);

        $dismissedTimes = 1;

        if ($previousConfigurationValue) {
            $dismissedTimes = json_decode($previousConfigurationValue, true)['dismissed_times'] + 1;
        }

        $configuration->set(Config::CLICKTOPAY_BANNER_DISMISSED, json_encode([
            'dismissed_at' => (new DateTime('now'))->format('Y-m-d H:i:s'),
            'dismissed_times' => $dismissedTimes,
        ]));

        $logger->debug(sprintf('%s - Controller ended', self::FILE_NAME));

        $this->ajaxResponse(JsonResponse::success([]));
    }

    public function displayAjaxSetDefault(): void
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Configuration $configuration */
        $configuration = $this->module->getService(\ClickToPay\Module\Infrastructure\Adapter\Configuration::class);

        /** @var UpdatePaymentHookPositionAction $updatePaymentHookPositionAction */
        $updatePaymentHookPositionAction = $this->module->getService(UpdatePaymentHookPositionAction::class);
        $updatePaymentHookPositionAction->run(true);
        Configuration::updateValue(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION, true);

        $configuration->delete(Config::CLICKTOPAY_BANNER_DISMISSED);

        $logger->debug(sprintf('%s - Controller ended', self::FILE_NAME));

        $this->ajaxResponse(JsonResponse::success([]));
    }
}
