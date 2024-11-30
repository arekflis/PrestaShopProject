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

namespace ClickToPay\Module\Presentation\Controller\Front;

use ClickToPay\Module\Core\Order\DTO\GetOrderDetailsData;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class GetOrderDetailsController
{
    const FILE_NAME = 'GetOrderDetailsController';

    private $logger;
    /** @var \ClickToPay */
    private $module;
    private $orderRepository;

    public function __construct(
        LoggerInterface $logger,
        ModuleFactory $moduleFactory,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->logger = $logger;
        $this->module = $moduleFactory->getModule();
        $this->orderRepository = $orderRepository;
    }

    public function execute(Request $request): JsonResponse
    {
        $data = GetOrderDetailsData::fromRequest($request);

        /** @var \Order|null $internalOrder */
        $internalOrder = $this->orderRepository->findOneBy([
            'id_cart' => $data->getCartId(),
        ]);

        if ($internalOrder) {
            $this->logger->error('Order already exists.', [
                'context' => [
                    'cart_id' => $data->getCartId(),
                    'internal_order_id' => $internalOrder->id,
                ],
            ]);

            return JsonResponse::error($this->module->l('Order already exists.', self::FILE_NAME), JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $response = $this->action($data);
        } catch (\Throwable $exception) {
            $this->logger->error('Failed to get order details by cart id.', [
                'context' => [
                    'cart_id' => $data->getCartId(),
                ],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            return JsonResponse::error($this->module->l('Failed to get order details by cart id', self::FILE_NAME), JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($response)) {
            return JsonResponse::error($this->module->l('Failed to get order details.', self::FILE_NAME), JsonResponse::HTTP_NOT_FOUND);
        }

        return JsonResponse::success([
            'order_details' => $response,
        ], JsonResponse::HTTP_OK);
    }

    public function action(GetOrderDetailsData $data): array
    {
        $cart = new \Cart($data->getCartId());

        $currency = new \Currency($cart->id_currency);

        return [
            'amount' => (string) number_format($cart->getOrderTotal(), 2, '.', ''),
            'currency' => (string) $currency->iso_code,
        ];
    }
}
