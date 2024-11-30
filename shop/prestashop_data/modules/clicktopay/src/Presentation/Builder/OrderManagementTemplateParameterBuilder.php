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

namespace ClickToPay\Module\Presentation\Builder;

use ClickToPay\Module\Core\Shared\Repository\ClickToPayRefundRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Utility\MoneyCalculator;
use Order;

if (!defined('_PS_VERSION_')) {
    exit;
}

class OrderManagementTemplateParameterBuilder
{
    /**
     * @var \ClickToPay
     */
    private $module;

    /**
     * @var ClickToPayRefundRepositoryInterface
     */
    private $clickToPayRefundRepository;

    /**
     * @var GlobalShopContextInterface
     */
    private $globalShopContext;

    /**
     * @var MoneyCalculator
     */
    private $moneyCalculator;

    public function __construct(
        ModuleFactory $moduleFactory,
        ClickToPayRefundRepositoryInterface $clickToPayRefundRepository,
        GlobalShopContextInterface $globalShopContext,
        MoneyCalculator $moneyCalculator
    ) {
        $this->module = $moduleFactory->getModule();
        $this->clickToPayRefundRepository = $clickToPayRefundRepository;
        $this->globalShopContext = $globalShopContext;
        $this->moneyCalculator = $moneyCalculator;
    }

    /**
     * @return array
     */
    public function buildParams(Order $order): array
    {
        if ($order->module !== $this->module->name) {
            return [];
        }

        $orderId = (int) $order->id;

        $refundedAmount = $this->clickToPayRefundRepository->getRefundedAmount(
            $orderId,
            $this->globalShopContext->getShopId()
        );

        $paid = $this->moneyCalculator->calculateIntoInteger((float) $order->total_paid);
        $remaining = $this->moneyCalculator->calculateIntoFloat($paid - $refundedAmount);

        return [
            'id' => $orderId,
            'canRefund' => $remaining > 0,
            'refundedAmountInCents' => $refundedAmount,
            'refundedAmountFormatted' => number_format($this->moneyCalculator->calculateIntoFloat($refundedAmount), 2, '.', ''),
            'maxAllowedRefund' => number_format($remaining, 2, '.', ''),
            'currencySymbol' => (new \Currency($order->id_currency))->symbol,
        ];
    }
}
