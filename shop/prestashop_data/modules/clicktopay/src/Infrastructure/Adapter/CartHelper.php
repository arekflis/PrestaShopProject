<?php

namespace ClickToPay\Module\Infrastructure\Adapter;

use Db;

/**
 * Stores methods which may not exist in Cart object model between different prestashop versions
 */
class CartHelper
{
    public static function hasProducts(?int $id): bool
    {
        if (!$id) {
            return false;
        }

        return (bool) Db::getInstance(_PS_USE_SQL_SLAVE_)->getValue(
            'SELECT 1 FROM ' . _DB_PREFIX_ . 'cart_product cp ' .
            'INNER JOIN ' . _DB_PREFIX_ . 'product p
                ON (p.id_product = cp.id_product) ' .
            'INNER JOIN ' . _DB_PREFIX_ . 'product_shop ps
                ON (ps.id_shop = cp.id_shop AND ps.id_product = p.id_product) ' .
            'WHERE cp.id_cart=' . $id
        );
    }
}
