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

namespace ClickToPay\Module\Core\Shared\Repository;

use ClickToPay\Module\Infrastructure\Repository\CollectionRepository;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AddressRepository extends CollectionRepository implements AddressRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(\Address::class);
    }

    /**
     * @param int $customerId
     *
     * @return array
     *
     * @throws \PrestaShopDatabaseException
     */
    public function getAddressesByCustomerId(int $customerId): array
    {
        $query = new \DbQuery();
        $query->select('*')->from('address')->where('id_customer = ' . $customerId);

        $result = \Db::getInstance()->executeS($query);

        return !empty($result) ? $result : [];
    }
}
