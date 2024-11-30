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

class ClickToPayOrder extends ObjectModel
{
    public $id_clicktopay_order;

    public $id_internal;

    public $id_external;

    public $id_gateway_external;

    public $id_shop;

    public static $definition = [
        'table' => 'clicktopay_orders',
        'primary' => 'id_clicktopay_order',
        'fields' => [
            'id_internal' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],
            'id_external' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'id_gateway_external' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'id_shop' => ['type' => self::TYPE_INT, 'validate' => 'isUnsignedId'],
        ],
    ];
}
