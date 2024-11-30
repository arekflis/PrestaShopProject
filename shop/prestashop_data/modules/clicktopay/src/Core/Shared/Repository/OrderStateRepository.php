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

class OrderStateRepository extends CollectionRepository implements OrderStateRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(\OrderState::class);
    }

    public function getOrderStates(int $langId): array
    {
        $query = new \DbQuery();

        $query
            ->select('osl.name, os.id_order_state')
            ->from('order_state', 'os')
            ->leftJoin(
                'order_state_lang',
                'osl',
                'os.id_order_state = osl.id_order_state AND osl.id_lang = ' . $langId
            )
            ->where('os.deleted = 0');

        $result = \Db::getInstance()->executeS($query);

        return !empty($result) ? $result : [];
    }
}
