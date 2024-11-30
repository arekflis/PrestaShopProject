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
use ClickToPay\Module\Core\Shared\Repository\ClickToPayOrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

final class OrderManagementAssetLoader
{
    public const TRANSLATION_ID = 'OrderManagementAssetLoader';

    private $module;
    private $configuration;
    private $context;
    /** @var ClickToPayOrderRepositoryInterface */
    private $clickToPayOrderRepository;

    public function __construct(ModuleFactory $moduleFactory, Configuration $configuration, Context $context, ClickToPayOrderRepositoryInterface $clickToPayOrderRepository)
    {
        $this->module = $moduleFactory->getModule();
        $this->configuration = $configuration;
        $this->context = $context;
        $this->clickToPayOrderRepository = $clickToPayOrderRepository;
    }

    public function register(\AdminController $controller, int $orderId): void
    {
        $externalOrder = $this->clickToPayOrderRepository->findOneBy(['id_internal' => $orderId]);

        $previousJsDef = isset(\Media::getJsDef()['clicktopay']) ? \Media::getJsDef()['clicktopay'] : [];

        \Media::addJsDef([
            'clicktopay' => array_merge($previousJsDef, [
                'orderUrl' => $this->context->getAdminLink('AdminClickToPayOrder'),
                'orderId' => $orderId,
                'eventOrigin' => Config::getSdkEventOrigin(),
                'confirmations' => [
                    'refundOrder' => $this->module->l('Are you sure you want to refund this order?', self::TRANSLATION_ID),
                    'cancelOrder' => $this->module->l('Are you sure you want to cancel this order?', self::TRANSLATION_ID),
                ],
                'errors' => [
                    'belowMinimumAllowedRefundAmount' => $this->module->l('Refund amount cannot be lower than the transaction value', self::TRANSLATION_ID),
                    'aboveMaximumAllowedRefundAmount' => $this->module->l('Refund amount cannot be higher than the transaction value', self::TRANSLATION_ID),
                    'somethingWentWrong' => $this->module->l('Something went wrong. please try again later', self::TRANSLATION_ID),
                ],
                'merchantReferenceId' => $this->configuration->get(Config::CLICKTOPAY_MERCHANT_ID),
                'gatewayTransactionId' => $externalOrder->id_gateway_external,
                'transactionCurrency' => $this->context->getCurrency()->iso_code,
                'locale' => str_replace('-', '_', $this->context->getLocale()) ?: 'en_US',
            ]),
        ]);

        $controller->addCSS($this->module->getLocalPath() . 'views/css/admin/hook/order_management.css');
        $controller->addJs($this->module->getLocalPath() . 'views/js/admin/hook/order_management.js');
    }
}
