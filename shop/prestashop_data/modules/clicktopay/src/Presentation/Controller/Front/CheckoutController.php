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

use ClickToPay\Module\Core\Payment\DTO\CheckoutData;
use ClickToPay\Module\Core\Payment\Processor\CheckoutProcessor;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\Response;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CheckoutController
{
    public const FILE_NAME = 'CheckoutController';

    private $logger;
    private $module;
    private $checkoutProcessor;
    /** @var OrderRepositoryInterface */
    private $orderRepository;

    public function __construct(
        LoggerInterface $logger,
        ModuleFactory $moduleFactory,
        CheckoutProcessor $checkoutProcessor,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->logger = $logger;
        $this->module = $moduleFactory->getModule();
        $this->checkoutProcessor = $checkoutProcessor;
        $this->orderRepository = $orderRepository;
    }

    public function execute(Request $request): Response
    {
        $data = CheckoutData::fromRequest($request);

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

            return Response::respond(
                $this->module->l('Order already exists.', self::FILE_NAME),
                Response::HTTP_OK
            );
        }

        try {
            $this->action($data);
        } catch (\Throwable $exception) {
            $this->logger->error('Failed to process checkout.', [
                'context' => [
                    'cart_id' => $data->getCartId(),
                    'transaction_token' => $data->getTransactionToken(),
                ],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            return Response::respond($this->module->l('Failed to process checkout', self::FILE_NAME), Response::HTTP_BAD_REQUEST);
        }

        return Response::respond('', Response::HTTP_OK);
    }

    /**
     * @throws ClickToPayException
     */
    private function action(CheckoutData $data): void
    {
        $this->checkoutProcessor->run(
            $data->getCartId(),
            $data->getTransactionToken(),
            $data->getTransactionTotal(),
            $data->getGatewayTransactionId()
        );
    }
}
