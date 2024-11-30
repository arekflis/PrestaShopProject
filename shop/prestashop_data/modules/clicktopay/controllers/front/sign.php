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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\JWT;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPaySignModuleFrontController extends AbstractFrontController
{
    const FILE_NAME = 'sign';

    /** @var ClickToPay */
    public $module;

    public function postProcess(): void
    {
        $request = Request::createFromGlobals();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $validation = (new Validator())->make($request->all(), [
            'partner_id' => 'required',
            'correlation_id' => 'required',
            'amount' => 'required',
            'currency_code' => 'required',
            'nonce' => 'required',
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

        if (!Configuration::get(Config::CLICKTOPAY_PRIVATE_KEY)) {
            $logger->debug('Missing private key');

            return;
        }

        if (!Configuration::get(Config::CLICKTOPAY_KEY_PHRASE)) {
            $logger->debug('Missing key phrase');

            return;
        }

        $lockResult = $this->applyLock(sprintf(
            '%s',
            $request->get('partner_id')
        ));

        if (!$lockResult->isSuccessful()) {
            $this->ajaxResponse(JsonResponse::error(
                $lockResult->getContent(),
                $lockResult->getStatusCode()
            ));
        }

        // NOTE: Weird keys are required for request.
        $data = [
            'partner id' => (string) $request->get('partner_id'),
            'nonce id' => (string) $request->get('correlation_id'),
            'Transaction amount' => (string) $request->get('amount'),
            'Transaction Currency Code' => (string) $request->get('currency_code'),
            'Unique Nonce' => (string) $request->get('nonce'),
        ];

        // TODO maybe it would be good to compare secure keys for customer? Intruder could try to spam this controller and try to reverse-engineer required keys.

        $signedData = JWT::sign(
            Configuration::get(Config::CLICKTOPAY_PRIVATE_KEY),
            Configuration::get(Config::CLICKTOPAY_KEY_PHRASE),
            $data
        );

        $this->releaseLock();

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));

        if (!$signedData) {
            $this->ajaxResponse(JsonResponse::error('Could not sign data', JsonResponse::HTTP_UNAUTHORIZED));
        }

        $this->ajaxResponse(JsonResponse::success([
            'signedData' => $signedData,
        ]));
    }
}
