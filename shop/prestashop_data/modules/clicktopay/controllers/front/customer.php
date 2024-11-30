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
use ClickToPay\Module\Core\Shared\Repository\AddressRepository;
use ClickToPay\Module\Core\Shared\Repository\CountryRepository;
use ClickToPay\Module\Core\Shared\Repository\CustomerRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\StateRepository;
use ClickToPay\Module\Core\Tools\Action\IsModuleEnabled;
use ClickToPay\Module\Core\Tools\Action\ValidateOpcModuleCompatibilityAction;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Controller\AbstractFrontController;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayCustomerModuleFrontController extends AbstractFrontController
{
    public const FILE_NAME = 'customer';
    private const SPAIN_ISO_CODE = 'ES';

    /** @var ClickToPay */
    public $module;

    public function displayAjaxGetCustomerInformation(): void
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $logger->debug(sprintf('%s - Controller called', self::FILE_NAME));

        /** @var Context $context */
        $context = $this->module->getService(Context::class);

        $this->ajaxResponse(JsonResponse::create([
            'customer' => $this->getCustomer((int) $context->getCart()->id_customer),
            'billingAddress' => $this->getExternalAddress((int) $context->getCart()->id_address_invoice),
            'shippingAddress' => $this->getExternalAddress((int) $context->getCart()->id_address_delivery),
        ]));
    }

    public function getCustomer(int $idCustomer): ?array
    {
        /** @var CustomerRepositoryInterface $customerRepository * */
        $customerRepository = $this->module->getService(CustomerRepositoryInterface::class);

        /** @var \Customer $customer */
        $customer = $customerRepository->findOneBy(['id_customer' => (int) $idCustomer]);

        if (!$customer) {
            return null;
        }

        return [
            'firstName' => $customer->firstname,
            'lastName' => $customer->lastname,
            'email' => $customer->email,
        ];
    }

    /**
     * @param int $idAddress
     *
     * @return array|null
     */
    public function getExternalAddress(int $idAddress): ?array
    {
        /** @var ValidateOpcModuleCompatibilityAction $validateOpcModuleCompatibilityAction * */
        $validateOpcModuleCompatibilityAction = $this->module->getService(ValidateOpcModuleCompatibilityAction::class);

        /** @var IsModuleEnabled $isModuleEnabled * */
        $isModuleEnabled = $this->module->getService(IsModuleEnabled::class);

        /** @var AddressRepository $addressRepository * */
        $addressRepository = $this->module->getService(AddressRepository::class);

        /** @var Address $address */
        $address = $addressRepository->findOneBy(['id_address' => (int) $idAddress]);

        if (!$address) {
            return null;
        }

        /** @var StateRepository $stateRepository * */
        $stateRepository = $this->module->getService(StateRepository::class);

        /** @var State $state */
        $state = $stateRepository->findOneBy(['id_state' => (int) $address->id_state]);
        $stateIsoCode = $state->iso_code ?? '';

        /** @var CountryRepository $countryRepository * */
        $countryRepository = $this->module->getService(CountryRepository::class);

        /** @var Country $country */
        $country = $countryRepository->findOneBy(['id_country' => (int) $address->id_country]);

        // Spain state name required for transaction and parsed from postal code
        if ($country->iso_code === self::SPAIN_ISO_CODE) {
            $stateIsoCode = Config::getSpainStateNameByPostalCode($address->postcode);
        }

        $phoneNumber = $address->phone;

        if ($validateOpcModuleCompatibilityAction->run() && !$isModuleEnabled->run('thecheckout')) {
            $phoneNumber = $address->phone_mobile;
        }

        return [
            'line1' => $address->address1,
            'line2' => $address->address2,
            'city' => $address->city,
            'state' => $stateIsoCode,
            'countryCode' => $country->iso_code ?? '',
            'zip' => $address->postcode,
            'phoneNumber' => $phoneNumber,
        ];
    }
}
