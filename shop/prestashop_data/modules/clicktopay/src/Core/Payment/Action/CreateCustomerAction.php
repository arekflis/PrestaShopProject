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

use ClickToPay\Module\Core\Payment\DTO\CreateCustomerData;
use ClickToPay\Module\Core\Payment\Exception\CouldNotCreateCustomer;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CreateCustomerAction
{
    private $logger;

    public function __construct(
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(CreateCustomerData $createCustomerData): \Customer
    {
        $this->logger->debug(sprintf('%s - Function called', __METHOD__));

        $customer = new \Customer();

        $customer->email = $createCustomerData->getEmail();
        $customer->firstname = $createCustomerData->getFirstName();
        $customer->lastname = $createCustomerData->getLastName();
        $customer->is_guest = true;
        $customer->id_default_group = (int) \Configuration::get('PS_GUEST_GROUP');

        if (class_exists('PrestaShop\PrestaShop\Core\Crypto\Hashing')) {
            $crypto = new \PrestaShop\PrestaShop\Core\Crypto\Hashing();

            $customer->passwd = $crypto->hash(
                time() . _COOKIE_KEY_,
                _COOKIE_KEY_
            );
        } else {
            $customer->passwd = md5(time() . _COOKIE_KEY_);
        }

        try {
            $customer->save();
        } catch (\Throwable $exception) {
            throw CouldNotCreateCustomer::unknownError($exception);
        }

        $this->logger->debug(sprintf('%s - Function ended', __METHOD__));

        return $customer;
    }
}
