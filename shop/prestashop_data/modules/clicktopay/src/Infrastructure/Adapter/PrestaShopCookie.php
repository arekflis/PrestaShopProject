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

namespace ClickToPay\Module\Infrastructure\Adapter;

use Context as PrestashopContext;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PrestaShopCookie
{
    public function set($id, $value): void
    {
        PrestashopContext::getContext()->cookie->{$id} = $value;
    }

    /**
     * @param $id
     *
     * @return false|string
     */
    public function get($id)
    {
        return PrestashopContext::getContext()->cookie->{$id};
    }

    public function clear($id): void
    {
        if (isset(PrestashopContext::getContext()->cookie->{$id})) {
            unset(PrestashopContext::getContext()->cookie->{$id});
        }
    }
}
