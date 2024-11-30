<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   ISC
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Core\Payment\Action;

use ClickToPay\Module\Core\Payment\DTO\CreateAddressData;
use ClickToPay\Module\Core\Payment\Exception\CouldNotCreateAddress;
use ClickToPay\Module\Core\Shared\Repository\CountryRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\StateRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CreateAddressAction
{
    public const FILE_NAME = 'CreateAddressAction';

    /** @var CountryRepositoryInterface */
    private $countryRepository;
    /** @var \ClickToPay */
    private $module;
    /** @var StateRepositoryInterface */
    private $stateRepository;

    public function __construct(
        CountryRepositoryInterface $countryRepository,
        ModuleFactory $moduleFactory,
        StateRepositoryInterface $stateRepository
    ) {
        $this->countryRepository = $countryRepository;
        $this->module = $moduleFactory->getModule();
        $this->stateRepository = $stateRepository;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(CreateAddressData $addressData): \Address
    {
        $address = new \Address();

        $address->firstname = $addressData->getGivenName() ?? '';
        $address->lastname = $addressData->getFamilyName() ?? '';
        $address->address1 = $addressData->getStreetAddress() ?? '';
        $address->address2 = $addressData->getStreetAddress2();
        $address->postcode = $addressData->getPostalCode();
        $address->phone = $addressData->getPhone();
        $address->phone_mobile = $addressData->getPhone();
        $address->city = $addressData->getCity() ?? '';
        $address->id_country = $this->getCountryId($addressData->getCountry());
        $address->id_customer = $addressData->getCustomerId();
        $address->id_state = $this->getStateId($addressData->getState() ?? '');
        $address->alias = $this->module->l('Click To Pay Address', self::FILE_NAME);

        try {
            $address->save();
        } catch (\Throwable $exception) {
            throw CouldNotCreateAddress::unknownError($exception);
        }

        return $address;
    }

    /**
     * @throws CouldNotCreateAddress
     */
    private function getCountryId(string $isoCode): int
    {
        /** @var \Country|null $country */
        $country = $this->countryRepository->findOneBy([
            'iso_code' => $isoCode,
            'active' => true,
        ]);

        if ($country === null) {
            throw CouldNotCreateAddress::inactiveCountry($isoCode);
        }

        return (int) $country->id;
    }

    /**
     * @throws CouldNotCreateAddress
     */
    private function getStateId(string $isoCode): int
    {
        /** @var \State|null $state */
        $state = $this->stateRepository->findOneBy([
            'iso_code' => strtolower(strtoupper($isoCode)),
        ]);

        if ($state === null) {
            return 0;
        }

        if (!$state->active) {
            throw CouldNotCreateAddress::inactiveAddressState($isoCode);
        }

        return (int) $state->id;
    }
}
