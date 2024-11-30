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

use ClickToPay\Module\Core\Customer\Action\CreateAddressAction;
use ClickToPay\Module\Core\Customer\DTO\CreateAddressRequestData;
use ClickToPay\Module\Core\Shared\Repository\AddressRepository;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use Rakit\Validation\Validator;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayAddressModuleFrontController extends AbstractFrontController
{
    public const FILE_NAME = 'address';

    /** @var ClickToPay */
    public $module;

    public function postProcess(): void
    {
        $request = Request::createFromGlobals();

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        $validation = (new Validator())->make($request->all(), [
            'city' => 'required',
            'countryCode' => 'required',
            'zip' => 'required',
            'state' => 'nullable',
            'line1' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $logger->debug(sprintf('Validation has failed in %s', self::FILE_NAME), [
                'context' => [
                    'errors' => $validation->errors()->toArray(),
                ],
            ]);

            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_BAD_REQUEST));
        }

        /** @var Context $context */
        $context = $this->module->getService(Context::class);

        // TODO Not secured controller. If customer context could be compromised in any way, intruder could create malicious addresses.

        // TODO Customer could be guest without any data at this point. Investigate whole express checkout logic first.
        if ($context->getCustomerId() < 1) {
            $this->ajaxResponse(JsonResponse::error(
                $this->module->l('Not logged in customer', self::FILE_NAME),
                JsonResponse::HTTP_UNAUTHORIZED
            ));
        }

        $lockResult = $this->applyLock(sprintf(
            '%s-%s',
            $context->getCustomer()->secure_key,
            $context->getCustomerId()
        ));

        if (!$lockResult->isSuccessful()) {
            $this->ajaxResponse(JsonResponse::error(
                $lockResult->getContent(),
                $lockResult->getStatusCode()
            ));
        }

        /** @var AddressRepository $addressRepository */
        $addressRepository = $this->module->getService(AddressRepository::class);

        $addressCreated = false;

        if (!$addressRepository->getAddressesByCustomerId($context->getCustomerId())) {
            $createAddressRequestData = CreateAddressRequestData::createFromRequest($request);

            /** @var CreateAddressAction $createAddressAction */
            $createAddressAction = $this->module->getService(CreateAddressAction::class);

            $createAddressAction->run($createAddressRequestData);

            $addressCreated = true;
        }

        $this->releaseLock();

        $logger->debug(sprintf('%s - Controller action ended', self::FILE_NAME));

        $this->ajaxResponse(JsonResponse::success(
            ['addressCreated' => $addressCreated],
            JsonResponse::HTTP_OK
        ));
    }
}
