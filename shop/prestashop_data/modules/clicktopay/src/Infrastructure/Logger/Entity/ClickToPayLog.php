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

class ClickToPayLog extends ObjectModel
{
    public $id_clicktopay_log;

    public $id_log;

    public $id_shop;

    public $request;

    public $response;

    public $context;

    public $date_add;

    public static $definition = [
        'table' => 'clicktopay_logs',
        'primary' => 'id_clicktopay_log',
        'fields' => [
            'id_log' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],
            'id_shop' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],
            'request' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'response' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'context' => ['type' => self::TYPE_STRING, 'validate' => 'isString'],
            'date_add' => ['type' => self::TYPE_DATE, 'validate' => 'isDate'],
        ],
    ];
}
