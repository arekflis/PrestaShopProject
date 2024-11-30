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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Payment\DTO\ValidateOrderData;
use ClickToPay\Module\Core\Payment\Exception\CouldNotValidateOrder;
use ClickToPay\Module\Core\Shared\Repository\CustomerRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ValidateOrderAction
{
    private $logger;
    private $module;
    private $configuration;
    private $globalShopContext;
    private $customerRepository;
    private $orderRepository;

    public function __construct(
        ModuleFactory $moduleFactory,
        LoggerInterface $logger,
        Configuration $configuration,
        GlobalShopContextInterface $globalShopContext,
        CustomerRepositoryInterface $customerRepository,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->module = $moduleFactory->getModule();
        $this->logger = $logger;
        $this->configuration = $configuration;
        $this->globalShopContext = $globalShopContext;
        $this->customerRepository = $customerRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * @throws CouldNotValidateOrder
     */
    public function run(ValidateOrderData $data): ?\Order
    {
        $this->logger->debug(sprintf('%s - Function called', __METHOD__));

        try {
            /** @var \Customer|null $customer */
            $customer = $this->customerRepository->findOneBy([
                'id_customer' => $data->getCustomerId(),
                'id_shop' => $this->globalShopContext->getShopId(),
            ]);
        } catch (\Throwable $exception) {
            throw CouldNotValidateOrder::unknownError($exception);
        }

        if (!$customer) {
            throw CouldNotValidateOrder::failedToFindCustomer($data->getCustomerId());
        }

        try {
            $this->module->validateOrder(
                $data->getCartId(),
                $this->configuration->get(
                    Config::CLICKTOPAY_ORDER_STATE_PENDING,
                    $this->globalShopContext->getShopId()
                ),
                $data->getOrderTotal(),
                $data->getPaymentMethod(),
                null,
                [
                    'transaction_id' => $data->getGatewayTransactionId(),
                ],
                null,
                false,
                $customer->secure_key
            );
        } catch (\Throwable $exception) {
            throw CouldNotValidateOrder::unknownError($exception);
        }

        $this->logger->debug(sprintf('%s - Function ended', __METHOD__));

        /** @var ?\Order $order */
        $order = $this->orderRepository->findOneBy([
            'id_cart' => $data->getCartId(),
            'id_shop' => $this->globalShopContext->getShopId(),
        ]);

        return $order;
    }
}
