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

namespace ClickToPay\Module\Core\Payment\Action;

use ClickToPay\Module\Core\Payment\Exception\CouldNotAddOrderMapping;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\EntityManager\EntityManagerInterface;
use ClickToPay\Module\Infrastructure\EntityManager\ObjectModelUnitOfWork;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AddOrderMappingAction
{
    private $logger;
    private $globalShopContext;
    private $entityManager;

    public function __construct(
        LoggerInterface $logger,
        GlobalShopContextInterface $globalShopContext,
        EntityManagerInterface $entityManager
    ) {
        $this->logger = $logger;
        $this->globalShopContext = $globalShopContext;
        $this->entityManager = $entityManager;
    }

    /**
     * @throws CouldNotAddOrderMapping
     */
    public function run(int $internalId, string $externalId, string $gatewayTransactionId)
    {
        $this->logger->debug(sprintf('%s - Function called', __METHOD__));

        try {
            $order = new \ClickToPayOrder();
            $order->id_internal = $internalId;
            $order->id_external = $externalId;
            $order->id_gateway_external = $gatewayTransactionId;

            $order->id_shop = $this->globalShopContext->getShopId();
            $this->entityManager->persist($order, ObjectModelUnitOfWork::UNIT_OF_WORK_SAVE);
            $this->entityManager->flush();
        } catch (\Throwable $exception) {
            throw CouldNotAddOrderMapping::unknownError($exception);
        }

        $this->logger->debug(sprintf('%s - Function ended', __METHOD__));
    }
}
