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

namespace ClickToPay\Module\Core\Customer\Action;

use ClickToPay\Module\Core\Customer\DTO\CreateAddressRequestData;
use ClickToPay\Module\Infrastructure\Adapter\Context;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CreateAddressAction
{
    /**
     * @var Context
     */
    private $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    /**
     * @param CreateAddressRequestData $createAddressRequestData
     *
     * @return void
     */
    public function run(CreateAddressRequestData $createAddressRequestData): void
    {
        $address = new \Address();
        $customer = $this->context->getCustomer();

        $address->firstname = $customer->firstname;
        $address->lastname = $customer->lastname;
        $address->id_customer = $customer->id;
        $address->address1 = $createAddressRequestData->getLine1();
        $address->alias = 'My address';
        $address->city = $createAddressRequestData->getCity();
        $country = \Country::getByIso($createAddressRequestData->getCountryCode());
        $address->id_country = (int) $country;
        $address->postcode = $createAddressRequestData->getZip();

        if (!empty($createAddressRequestData->getState())) {
            $address->id_state = \State::getIdByName($createAddressRequestData->getState());
        }

        $address->save();
    }
}
