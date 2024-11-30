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

namespace ClickToPay\Module\Core\Payment\Processor;

use ClickToPay\Module\Api\Enum\OrderStatus;
use ClickToPay\Module\Core\Order\Handler\Status\InternalOrderStatusHandler;
use ClickToPay\Module\Core\Payment\Action\AddOrderMappingAction;
use ClickToPay\Module\Core\Payment\Action\ValidateOrderAction;
use ClickToPay\Module\Core\Payment\DTO\ValidateOrderData;
use ClickToPay\Module\Core\Payment\Exception\CouldNotProcessCheckout;
use ClickToPay\Module\Core\Shared\Repository\CartRepositoryInterface;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Utility\MoneyCalculator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CheckoutProcessor
{
    private $validateOrderAction;
    private $addOrderMappingAction;
    private $internalOrderStatusHandler;
    private $moneyCalculator;
    private $cartRepository;

    public function __construct(
        ValidateOrderAction $validateOrderAction,
        AddOrderMappingAction $addOrderMappingAction,
        InternalOrderStatusHandler $internalOrderStatusHandler,
        MoneyCalculator $moneyCalculator,
        CartRepositoryInterface $cartRepository
    ) {
        $this->validateOrderAction = $validateOrderAction;
        $this->addOrderMappingAction = $addOrderMappingAction;
        $this->internalOrderStatusHandler = $internalOrderStatusHandler;
        $this->moneyCalculator = $moneyCalculator;
        $this->cartRepository = $cartRepository;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(int $cartId, string $transactionToken, int $transactionAmount, string $gatewayTransactionId): void
    {
        /** @var \Cart|null $cart */
        $cart = $this->cartRepository->findOneBy([
            'id_cart' => $cartId,
        ]);

        if (!$cart) {
            throw CouldNotProcessCheckout::failedToFindCart($cartId);
        }

        try {
            $internalOrder = $this->validateOrderAction->run(ValidateOrderData::create(
                (int) $cart->id_customer,
                (int) $cart->id,
                $this->moneyCalculator->calculateIntoFloat($transactionAmount),
                'ClickToPay',
                $transactionToken,
                $gatewayTransactionId
            ));
        } catch (\Throwable $exception) {
            throw CouldNotProcessCheckout::failedToValidateOrder($exception, $cart->id);
        }

        try {
            $this->addOrderMappingAction->run(
                (int) $internalOrder->id,
                (string) $transactionToken,
                (string) $gatewayTransactionId
            );
        } catch (\Throwable $exception) {
            $this->internalOrderStatusHandler->handle((int) $internalOrder->id, OrderStatus::CANCELLED);

            throw CouldNotProcessCheckout::failedToAddOrderMapping($exception, $transactionToken, $internalOrder->id);
        }
    }
}
