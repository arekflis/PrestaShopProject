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

use ClickToPay\Module\Api\Enum\OrderStatus;
use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Order\Exception\CouldNotCreateRefund;
use ClickToPay\Module\Core\Order\Handler\Status\InternalOrderStatusHandler;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayRefundRepository;
use ClickToPay\Module\Infrastructure\Adapter\PrestaShopCookie;
use ClickToPay\Module\Infrastructure\Adapter\Tools;
use ClickToPay\Module\Infrastructure\Controller\AbstractAdminController as ModuleAdminController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use ClickToPay\Module\Infrastructure\Utility\MoneyCalculator;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminClickToPayOrderController extends ModuleAdminController
{
    const FILE_NAME = 'order';

    public function postProcess()
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        /* @var PrestaShopCookie $cookie */
        $cookie = $this->module->getService(PrestaShopCookie::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        /** @var Tools $tools */
        $tools = $this->module->getService(Tools::class);

        if ($tools->getValue('action') === 'refund') {
            $internalOrderId = (int) $tools->getValue('orderId');
            $refundedInCents = (int) $tools->getValue('amount');

            try {
                $this->refundOrder($internalOrderId, $refundedInCents);

                $this->ajaxResponse(JsonResponse::success(['success' => true], JsonResponse::HTTP_OK));
            } catch (CouldNotCreateRefund $exception) {
                $errors[$internalOrderId] = $this->module->l('Refund order lines failed. View error logs for more information.', self::FILE_NAME);

                $cookie->set(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS, json_encode($errors));

                $logger->error('Failed to refund order', [
                    'context' => [],
                    'exceptions' => ExceptionUtility::getExceptions($exception),
                ]);

                $this->ajaxResponse(JsonResponse::error($this->module->l('Unknown error occurred', self::FILE_NAME), JsonResponse::HTTP_INTERNAL_SERVER_ERROR));
            }
        }

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));
    }

    private function refundOrder(int $internalOrderId, int $refundedInCents): void
    {
        /* @var PrestaShopCookie $cookie */
        $cookie = $this->module->getService(PrestaShopCookie::class);

        /** @var InternalOrderStatusHandler $internalOrderStatusHandler */
        $internalOrderStatusHandler = $this->module->getService(InternalOrderStatusHandler::class);

        if ($refundedInCents <= 0) {
            throw CouldNotCreateRefund::invalidRefundRequest($refundedInCents);
        }

        $order = new Order($internalOrderId);

        /** @var Tools $tools */
        $tools = $this->module->getService(Tools::class);

        /** @var MoneyCalculator $moneyCalculator */
        $moneyCalculator = $this->module->getService(MoneyCalculator::class);
        $paidInCents = $moneyCalculator->calculateIntoInteger($order->getTotalPaid());

        if ($paidInCents <= $refundedInCents) {
            $internalOrderStatusHandler->handle($internalOrderId, OrderStatus::FULLY_REFUNDED);
        } else {
            $internalOrderStatusHandler->handle($internalOrderId, OrderStatus::PARTIALLY_REFUNDED);
        }

        /** @var ClickToPayRefundRepository $refundRepository * */
        $refundRepository = $this->module->getService(ClickToPayRefundRepository::class);
        $refundRepository->createRefund(
            $refundedInCents,
            $tools->getValue('orderId'),
            $this->context->shop->id,
            (string) $tools->getValue('gatewayTransactionId'),
            (string) $tools->getValue('refundTransactionToken')
        );

        // NOTE: set success message after page load
        $cookie->set(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_REFUNDED, true);
    }
}
