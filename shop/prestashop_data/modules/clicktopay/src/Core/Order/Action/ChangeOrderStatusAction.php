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

namespace ClickToPay\Module\Core\Order\Action;

use ClickToPay\Module\Core\Order\Exception\CouldNotChangeOrderStatus;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ChangeOrderStatusAction
{
    private $logger;
    private $orderRepository;
    private $globalShopContext;

    public function __construct(
        LoggerInterface $logger,
        OrderRepositoryInterface $orderRepository,
        GlobalShopContextInterface $globalShopContext
    ) {
        $this->logger = $logger;
        $this->orderRepository = $orderRepository;
        $this->globalShopContext = $globalShopContext;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(int $orderId, int $orderStatusId)
    {
        $this->logger->debug(sprintf('%s - Function called', __METHOD__));

        try {
            /** @var \Order|null $order */
            $order = $this->orderRepository->findOneBy([
                'id_order' => $orderId,
                'id_shop' => $this->globalShopContext->getShopId(),
            ]);
        } catch (\Exception $exception) {
            throw CouldNotChangeOrderStatus::unknownError($exception);
        }

        if (!$order) {
            throw CouldNotChangeOrderStatus::failedToFindOrder($orderId);
        }

        try {
            if ((int) $order->getCurrentState() !== (int) $orderStatusId) {
                $order->setCurrentState($orderStatusId);
                $order->update();
            }
        } catch (\Exception $exception) {
            throw CouldNotChangeOrderStatus::unknownError($exception);
        }

        $this->logger->debug(sprintf('%s - Function ended', __METHOD__));
    }
}
