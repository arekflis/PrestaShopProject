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

use ClickToPay\Module\Core\Payment\Processor\ExpressCheckoutProcessor;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayExpressCheckoutModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'expressCheckout';

    /** @var ClickToPay */
    public $module;

    public function postProcess(): void
    {
        $request = Request::createFromGlobals();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        /** @var Context $context */
        $context = $this->module->getService(Context::class);

        /** @var ExpressCheckoutProcessor $expressCheckoutProcessor */
        $expressCheckoutProcessor = $this->module->getService(ExpressCheckoutProcessor::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $validation = (new Validator())->make($request->all(), [
            'address' => 'array|max:1',
            'address.*.zip_code' => 'required',
            'address.*.state' => '',
            'address.*.city' => 'required',
            'address.*.country_code' => 'required',
            'address.*.line1' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $logger->debug(sprintf('Validation has failed in [%s]', self::FILE_NAME), [
                'context' => [
                    'errors' => $validation->errors()->toArray(),
                ],
            ]);

            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        $lockResult = $this->applyLock(sprintf(
            '%s-%s',
            $context->getCart()->secure_key,
            $context->getCart()->id
        ));

        if (!$lockResult->isSuccessful()) {
            $this->ajaxResponse(JsonResponse::error(
                $lockResult->getContent(),
                $lockResult->getStatusCode()
            ));
        }

        // TODO add controller
        // TODO DTO
        try {
            $expressCheckoutProcessor->run((array) $request->get('address'));
        } catch (Throwable $exception) {
            $logger->error('Failed to process express checkout', [
                'context' => [
                    'cart_id' => $this->context->cart->id,
                    'exceptions' => ExceptionUtility::getExceptions($exception),
                ],
            ]);

            $this->ajaxResponse(JsonResponse::error($this->module->l('Failed to process express checkout, try again.', self::FILE_NAME), JsonResponse::HTTP_BAD_REQUEST));
        }

        $this->releaseLock();

        $logger->debug(sprintf('%s - Controller ended', self::FILE_NAME));

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_CREATED));
    }
}
