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

class ClickToPayRefund extends ObjectModel
{
    public $id_clicktopay_refund;
    public $id_order;
    public $refunded_amount;
    public $refund_transaction_token;
    public $transaction_gateway_id;

    public $id_shop;

    public static $definition = [
        'table' => 'clicktopay_refunds',
        'primary' => 'id_clicktopay_refund',
        'fields' => [
            'refunded_amount' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],
            'id_order' => ['type' => self::TYPE_INT, 'validate' => 'isUnsignedId'],
            'id_shop' => ['type' => self::TYPE_INT, 'validate' => 'isUnsignedId'],
            'refund_transaction_token' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'transaction_gateway_id' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
        ],
    ];
}
