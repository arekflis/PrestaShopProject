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

namespace ClickToPay\Module\Core\Payment\Processor;

use ClickToPay\Module\Core\Payment\Action\CreateAddressAction;
use ClickToPay\Module\Core\Payment\Action\CreateCustomerAction;
use ClickToPay\Module\Core\Payment\Action\UpdateCheckoutProgressAction;
use ClickToPay\Module\Core\Payment\Action\UpsertCartMappingAction;
use ClickToPay\Module\Core\Payment\DTO\CreateAddressData;
use ClickToPay\Module\Core\Payment\DTO\CreateCustomerData;
use ClickToPay\Module\Core\Payment\DTO\UpdateCheckoutProgressData;
use ClickToPay\Module\Core\Shared\Repository\OrderRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\PrestashopCollectionHelper;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use ClickToPay\Module\Infrastructure\Utility\StringUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ExpressCheckoutProcessor
{
    private $context;
    private $createCustomerAction;
    private $createAddressAction;
    private $logger;
    private $updateCheckoutProgressAction;
    private $upsertCartMappingAction;
    private $orderRepository;
    private $globalShopContext;

    public function __construct(
        Context $context,
        CreateCustomerAction $createCustomerAction,
        CreateAddressAction $createAddressAction,
        LoggerInterface $logger,
        UpdateCheckoutProgressAction $updateCheckoutProgressAction,
        UpsertCartMappingAction $upsertCartMappingAction,
        OrderRepositoryInterface $orderRepository,
        GlobalShopContextInterface $globalShopContext
    ) {
        $this->context = $context;
        $this->createCustomerAction = $createCustomerAction;
        $this->createAddressAction = $createAddressAction;
        $this->logger = $logger;
        $this->updateCheckoutProgressAction = $updateCheckoutProgressAction;
        $this->upsertCartMappingAction = $upsertCartMappingAction;
        $this->orderRepository = $orderRepository;
        $this->globalShopContext = $globalShopContext;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(array $address): void
    {
        // TODO DTO.
        $customer = $this->context->getCustomer();

        if (!$customer || !$customer->id) {
            $customer = $this->createCustomerAction->run(CreateCustomerData::create(
                sprintf('clicktopay-placeholder-%s@email.com', StringUtility::random(20)),
                'firstname',
                'lastname'
            ));
        }

        $this->context->updateCustomer($customer);

        $this->context->getCart()->id_address_delivery = 0;
        $this->context->getCart()->id_address_invoice = 0;
        $this->context->getCart()->save();

        $addresses = $this->getAddresses($customer, $address);

        if (!empty($addresses['shipping'])) {
            $this->context->getCart()->id_address_delivery = $addresses['shipping']->id;

            $products = $this->context->getCart()->getProducts();

            foreach ($products as $product) {
                $this->context->getCart()->setProductAddressDelivery(
                    (int) $product['id_product'],
                    (int) $product['id_product_attribute'],
                    (int) $product['id_address_delivery'],
                    (int) $addresses['shipping']->id
                );
            }
        }

        if (!empty($addresses['billing'])) {
            $this->context->getCart()->id_address_invoice = $addresses['billing']->id;
        }

        $this->context->getCart()->save();

        $this->updateCheckoutProgressAction->run(UpdateCheckoutProgressData::create(
            $this->context->getCart()->id,
            true,
            !empty($addresses['shipping']) && !empty($addresses['billing']),
            false,
            false
        ));

        $this->upsertCartMappingAction->run((int) $this->context->getCart()->id, true);
    }

    /**
     * @return array<string, \Address>
     */
    private function getAddresses(\Customer $customer, array $address): array
    {
        $customerAddresses = $customer->getSimpleAddresses();

        // NOTE: if customer does not have any address we will be creating click to pay address.
        if (count($customerAddresses ?? []) === 0 && !empty($address['country_code']) && !empty($address['city']) && !empty($address['zip_code'])) {
            try {
                $moduleAddress = $this->createAddressAction->run(CreateAddressData::create(
                    $customer->firstname,
                    $customer->lastname,
                    $address['line1'] ?? '',
                    '',
                    $address['zip_code'],
                    '',
                    $address['city'],
                    $address['country_code'],
                    $address['state'] ?? '',
                    (int) $customer->id
                ));

                return [
                    'shipping' => $moduleAddress,
                    'billing' => $moduleAddress,
                ];
            } catch (\Throwable $exception) {
                // NOTE: if address was not created, we will just redirect to address step.
                $this->logger->error('Failed to create an address', [
                    'context' => [
                        'cart_id' => $this->context->getCart()->id,
                    ],
                    'exceptions' => ExceptionUtility::getExceptions($exception),
                ]);

                return [
                    'shipping' => null,
                    'billing' => null,
                ];
            }
        }

        // NOTE: if customer has address, we will be using it.
        if (count($customerAddresses ?? []) === 1) {
            $addressData = reset($customerAddresses);

            return [
                'shipping' => new \Address($addressData['id']),
                'billing' => new \Address($addressData['id']),
            ];
        }

        // NOTE: if customer has more than one address, we will be using latest used addresses.
        if (count($customerAddresses ?? []) > 1) {
            $orders = $this->orderRepository->findAllInCollection()
                ->where('id_customer', '=', (int) $customer->id)
                ->where('id_shop', '=', $this->globalShopContext->getShopId())
                ->where('id_address_delivery', 'in', array_keys($customerAddresses))
                ->where('id_address_invoice', 'in', array_keys($customerAddresses))
                ->orderBy('id_order', 'desc');

            /** @var \Order $lastOrder */
            $lastOrder = PrestashopCollectionHelper::getLast($orders);

            if ($lastOrder && $lastOrder->id) {
                return [
                    'shipping' => new \Address($lastOrder->id_address_delivery),
                    'billing' => new \Address($lastOrder->id_address_invoice),
                ];
            } else {
                $addressData = reset($customerAddresses);

                return [
                    'shipping' => new \Address($addressData['id']),
                    'billing' => new \Address($addressData['id']),
                ];
            }
        }

        return [
            'shipping' => null,
            'billing' => null,
        ];
    }
}
