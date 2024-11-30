<?php

namespace ClickToPay\Module\Infrastructure\Adapter;

use ObjectModel;
use PrestaShopCollection;

/**
 * Stores methods which may not exist in Cart object model between different prestashop versions
 */
class PrestashopCollectionHelper
{
    /**
     * Doesn't exist in 1.7.2
     *
     * @return ObjectModel|false
     */
    public static function getLast(PrestashopCollection $collection)
    {
        $collection->getAll();
        if (!count($collection)) {
            return false;
        }

        return $collection[count($collection) - 1];
    }
}
