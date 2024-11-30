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

namespace ClickToPay\Module\Core\Order\Handler\Status;

use ClickToPay\Module\Api\Enum\OrderStatus;
use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Order\Action\ChangeOrderStatusAction;
use ClickToPay\Module\Core\Order\Exception\CouldNotChangeOrderStatus;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Provider\MandatoryConfigProvider;

if (!defined('_PS_VERSION_')) {
    exit;
}

class InternalOrderStatusHandler implements InternalOrderStatusHandlerInterface
{
    private $changeOrderStatusAction;

    /**
     * @var MandatoryConfigProvider
     */
    private $mandatoryConfigProvider;

    public function __construct(
        ChangeOrderStatusAction $changeOrderStatusAction,
        Configuration $configuration,
        GlobalShopContextInterface $globalShopContext,
        MandatoryConfigProvider $mandatoryConfigProvider
    ) {
        $this->changeOrderStatusAction = $changeOrderStatusAction;
        $this->mandatoryConfigProvider = $mandatoryConfigProvider;
    }

    /**
     * @throws ClickToPayException
     */
    public function handle(int $internalOrderId, string $transactionStatus): void
    {
        if ($transactionStatus === 'succeeded') {
            $this->changeOrderStatusAction->run(
                $internalOrderId,
                (int) _PS_OS_PAYMENT_
            );

            return;
        }

        if ($transactionStatus === OrderStatus::PARTIALLY_REFUNDED) {
            $this->changeOrderStatusAction->run(
                $internalOrderId,
                $this->mandatoryConfigProvider->getConfiguredOrderState(Config::CLICKTOPAY_ORDER_STATE_PARTIALLY_REFUNDED)
            );

            return;
        }

        if ($transactionStatus === OrderStatus::FULLY_REFUNDED) {
            $this->changeOrderStatusAction->run(
                $internalOrderId,
                $this->mandatoryConfigProvider->getConfiguredOrderState(Config::CLICKTOPAY_ORDER_STATE_REFUNDED)
            );

            return;
        }

        throw CouldNotChangeOrderStatus::unhandledOrderStatus($transactionStatus);
    }
}
