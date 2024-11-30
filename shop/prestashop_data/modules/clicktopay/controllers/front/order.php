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
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Presentation\Controller\Front\GetOrderDetailsController;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayOrderModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'order';

    public function displayAjaxGetOrderDetails(): string
    {
        $this->checkApplicationCredentials();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $request = Request::createFromGlobals();

        $validation = (new Validator())->make($request->all(), [
            'cart_id' => 'required|integer',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        $lockResult = $this->applyLock(sprintf(
            '%s',
            $request->get('cart_id')
        ));

        if (!$lockResult->isSuccessful()) {
            $this->ajaxResponse(JsonResponse::error(
                $lockResult->getContent(),
                $lockResult->getStatusCode()
            ));
        }

        /** @var GetOrderDetailsController $getOrderDetailsController */
        $getOrderDetailsController = $this->module->getService(GetOrderDetailsController::class);

        try {
            $response = $getOrderDetailsController->execute($request);
        } catch (\Throwable $exception) {
            $this->releaseLock();

            $this->ajaxResponse(JsonResponse::error(
                $this->module->l('Unknown error occurred', self::FILE_NAME),
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            ));
        }

        $this->releaseLock();

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));

        $this->ajaxResponse($response);
    }
}
