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
if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayCart extends ObjectModel
{
    public $id_clicktopay_cart;

    public $id_cart;
    public $express_checkout;

    public $id_shop;

    public static $definition = [
        'table' => 'clicktopay_carts',
        'primary' => 'id_clicktopay_cart',
        'fields' => [
            'id_cart' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],
            'express_checkout' => ['type' => self::TYPE_BOOL, 'validate' => 'isBool'],
            'id_shop' => ['type' => self::TYPE_INT, 'validate' => 'isUnsignedId'],
        ],
    ];
}
