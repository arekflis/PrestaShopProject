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

use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Notification\Notifications\ErrorNotification;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Presentation\Controller\Front\CheckoutController;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayPaymentModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'payment';

    const ORDER_PAGE_REDIRECT_DESTINATION = 'order';

    /** @var ClickToPay */
    public $module;

    public function initContent(): void
    {
        parent::initContent();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $request = Request::createFromGlobals();

        $cart = Context::getContext()->cart;

        $request->request->set('cart_id', (int) $cart->id);

        $validation = (new Validator())->make($request->all(), [
            'transaction_token' => 'required',
            'transaction_amount' => 'required',
            'cart_id' => 'required',
            'gateway_transaction_id' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $this->addNotification(ErrorNotification::create(
                $this->module->l('Validation failed for checkout. Contact support.', self::FILE_NAME)
            ));

            $this->redirectWithNotifications($this->getControllerLink(self::ORDER_PAGE_REDIRECT_DESTINATION));
        }

        $lockResult = $this->applyLock(sprintf(
            '%s-%s',
            (int) $cart->id,
            (string) $cart->secure_key
        ));

        if (!$lockResult->isSuccessful()) {
            $this->redirectWithNotifications($this->getControllerLink(self::ORDER_PAGE_REDIRECT_DESTINATION));
        }

        /** @var CheckoutController $checkoutController */
        $checkoutController = $this->module->getService(CheckoutController::class);

        try {
            $result = $checkoutController->execute($request);
        } catch (Throwable $exception) {
            $this->releaseLock();

            $this->addNotification(ErrorNotification::create($this->module->l('Unknown error occurred', self::FILE_NAME)));

            $this->redirectWithNotifications($this->getControllerLink(self::ORDER_PAGE_REDIRECT_DESTINATION));

            return;
        }

        $this->releaseLock();

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));

        if (!$result->isSuccessful()) {
            $this->addNotification(ErrorNotification::create($result->getContent()));

            $this->redirectWithNotifications($this->getControllerLink(self::ORDER_PAGE_REDIRECT_DESTINATION));
        }

        $this->redirectWithNotifications(
            $this->context->link->getModuleLink(
                $this->module->name,
                'success',
                [
                    'cartId' => $cart->id,
                    'secureKey' => $cart->secure_key,
                    'orderId' => Order::getIdByCartId($cart->id),
                    'moduleId' => $this->module->id,
                ],
                true
            )
        );
    }
}
