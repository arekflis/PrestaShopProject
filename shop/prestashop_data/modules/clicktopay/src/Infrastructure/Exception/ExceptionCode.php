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

namespace ClickToPay\Module\Infrastructure\Exception;

if (!defined('_PS_VERSION_')) {
    exit;
}

// NOTE class to define most used exception codes for our development.
class ExceptionCode
{
    // API related codes should start with 1***
    public const API_FAILED_TO_GET_SUCCESSFUL_RESPONSE = 1001;
    public const API_FAILED_TO_CREATE_REQUEST = 1002;

    // Configuration related codes should start with 2***
    public const CONFIGURATION_UNSUPPORTED_CURRENCY = 2003;
    public const CONFIGURATION_MERCHANT_IS_NOT_LOGGED_IN = 2004;

    // Payment related codes starts from 5***

    public const PAYMENT_FAILED_TO_FIND_CUSTOMER = 5001;
    public const PAYMENT_FAILED_TO_FIND_CART = 5007;
    public const PAYMENT_FAILED_TO_LOCK_CART = 5008;
    public const PAYMENT_FAILED_TO_VALIDATE_ORDER = 5011;
    public const PAYMENT_FAILED_TO_ADD_ORDER_MAPPING = 5013;

    public const PAYMENT_FORM_ASSETS_ARE_MISSING = 5014;

    public const PAYMENT_INACTIVE_COUNTRY = 5015;
    public const PAYMENT_INACTIVE_ADDRESS_STATE = 5016;

    // Infrastructure related code should start with 6***
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_DATABASE_TABLE = 6001;
    public const INFRASTRUCTURE_FAILED_TO_UNINSTALL_DATABASE_TABLE = 6003;
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_MODULE_TAB = 6005;
    public const INFRASTRUCTURE_FAILED_TO_UNINSTALL_MODULE_TAB = 6006;
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_ORDER_STATE = 6007;

    public const INFRASTRUCTURE_FAILED_TO_INSTALL_MBO_INSTALLER = 6008;
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_DEPENDENCIES = 6009;
    public const INFRASTRUCTURE_FAILED_TO_RETRIEVE_MODULE_MANAGER_BUILDER = 6010;
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_PRESTASHOP_ACCOUNTS = 6011;
    public const INFRASTRUCTURE_FAILED_TO_INSTALL_PRESTASHOP_EVENT_BUS = 6012;
    public const INFRASTRUCTURE_LOCK_EXISTS = 6013;
    public const INFRASTRUCTURE_LOCK_ON_ACQUIRE_IS_MISSING = 6014;
    public const INFRASTRUCTURE_LOCK_ON_RELEASE_IS_MISSING = 6015;
    public const PAYMENT_OPTION_HOOK_UPDATE_FAILURE = 6016;

    // Order related codes starts from 7***
    public const ORDER_FAILED_TO_FIND_ORDER = 7001;
    public const ORDER_UNHANDLED_TRANSACTION_STATUS = 7002;
    public const ORDER_VERIFICATION_FAILED = 7003;
    public const ORDER_STATUS_IS_INVALID = 7005;
    public const ORDER_REFUND_AMOUNT_IS_INVALID = 7011;
    public const ORDER_FAILED_TO_RETRIEVE_ORDER = 7012;

    // Tools related codes starts from 8***
    public const TOOLS_FAILED_TO_PRUNE_RECORDS = 8001;

    // Any other unhandled codes should start with 9***
    public const UNKNOWN_ERROR = 9001;
}
