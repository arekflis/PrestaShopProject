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

declare(strict_types=1);

use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPaySuccessModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'success';

    public function postProcess(): void
    {
        $request = Request::createFromGlobals();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $validation = (new Validator())->make($request->all(), [
            'cartId' => 'required',
            'moduleId' => 'required',
            'orderId' => 'required',
            'secureKey' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $redirectLink = $this->context->link->getPageLink(
                'order',
                true,
                null,
                [
                    'step' => 1,
                ]
            );

            Tools::redirect($redirectLink);
        }

        $cart = new Cart($request->get('cartId'));

        if ($cart->secure_key !== $request->get('secureKey')) {
            $redirectLink = $this->context->link->getPageLink(
                'order',
                true,
                null,
                [
                    'step' => 1,
                ]
            );

            Tools::redirect($redirectLink);
        }

        $orderLink = $this->context->link->getPageLink(
            'order-confirmation',
            true,
            null,
            [
                'id_cart' => $request->get('cartId'),
                'id_module' => $request->get('moduleId'),
                'id_order' => $request->get('orderId'),
                'key' => $request->get('secureKey'),
            ]
        );

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));

        Tools::redirect($orderLink);
    }
}
