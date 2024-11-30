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

namespace ClickToPay\Module\Core\Config;

use ClickToPay\Module\Infrastructure\Utility\NumberUtility;
use ClickToPay\Module\Infrastructure\Utility\VersionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Config
{
    public const ENV_DEV = 'DEV';
    public const ENV_STAGE = 'STAGE';
    public const ENV_MTF = 'MTF';
    public const ENV_PROD = 'PROD';
    public const CLICKTOPAY_ENV = 'PROD';

    public const CLICKTOPAY_DEBUG_MODE = 'CLICKTOPAY_DEBUG_MODE';
    public const CLICKTOPAY_ORDER_STATE_PENDING = 'CLICKTOPAY_ORDER_STATE_PENDING';
    public const CLICKTOPAY_CHANNEL_ID = '37982382-7e48-48fc-846f-9afc6b16b22b';
    public const DAYS_TO_KEEP_LOGS = 'CLICKTOPAY_DAYS_TO_KEEP_LOGS';

    public const PS_CURRENCY_DEFAULT = 'PS_CURRENCY_DEFAULT';

    public const CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE = 'CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE';
    public const CLICKTOPAY_CARDS_SUPPORTED = 'CLICKTOPAY_CARDS_SUPPORTED';
    public const CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION = 'CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION';
    public const CLICKTOPAY_PAYMENT_GATEWAY_DETAILS = 'CLICKTOPAY_PAYMENT_GATEWAY_DETAILS';
    public const CLICKTOPAY_CONFIGURATION_TIMESTAMP = 'CLICKTOPAY_CONFIGURATION_TIMESTAMP';
    public const CLICKTOPAY_IS_3DS_ENABLED = 'CLICKTOPAY_IS_3DS_ENABLED';
    public const CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE = 'CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE';
    public const CLICKTOPAY_MERCHANT_ID = 'CLICKTOPAY_MERCHANT_ID';
    public const CLICKTOPAY_KEY_ID = 'CLICKTOPAY_KEY_ID';
    public const CLICKTOPAY_KEY_ALIAS = 'CLICKTOPAY_KEY_ALIAS';
    public const CLICKTOPAY_THEME = 'CLICKTOPAY_THEME';
    public const CLICKTOPAY_PRIVATE_KEY = 'CLICKTOPAY_PRIVATE_KEY';
    public const CLICKTOPAY_KEY_PHRASE = 'CLICKTOPAY_KEY_PHRASE';
    public const CLICKTOPAY_HAS_VISITED_WELCOME_PAGE = 'CLICKTOPAY_HAS_VISITED_WELCOME_PAGE';
    public const CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS = 'CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS';
    public const CLICKTOPAY_BANNER_DISMISSED = 'CLICKTOPAY_BANNER_DISMISSED';
    public const CLICKTOPAY_ORDER_STATE_REFUNDED = 'CLICKTOPAY_ORDER_STATE_REFUNDED';
    public const CLICKTOPAY_ORDER_STATE_PARTIALLY_REFUNDED = 'CLICKTOPAY_ORDER_STATE_PARTIALLY_REFUNDED';

    public const HOOK_LIST = [
        'paymentOptions',
        'displayPaymentEU',
        'actionFrontControllerSetMedia',
        'actionAdminControllerSetMedia',
        'displayAdminOrder',
        'displayAdminOrderSide',
        'displayHeader',
        'displayExpressCheckout',
        'displayAdminAfterHeader',
        'displayDashboardTop',
    ];

    // NOTE: Add OPC module tech name if payment option is compatible
    public const CLICKTOPAY_OPC_MODULE_LIST = [
        'onepagecheckoutps',
        'thecheckout',
    ];

    public const PAYMENT_OPTION_HOOK_NAME = 'paymentOptions';
    public const PAYMENT_OPTION_EU_HOOK_NAME = 'displayPaymentEU';

    public const CSS_COMPONENT_ASSET_SCRIPT = 'https://src.mastercard.com/srci/integration/components/src-ui-kit/src-ui-kit.css';

    public const CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS = 'CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS';
    public const CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_CANCELED = 'CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_CANCELED';
    public const CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_REFUNDED = 'CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_REFUNDED';

    public const LOG_SEVERITY_LEVEL_INFORMATIVE = 1;
    public const LOG_SEVERITY_LEVEL_WARNING = 2;
    public const LOG_SEVERITY_LEVEL_ERROR = 3;
    public const LOG_SEVERITY_LEVEL_MAJOR = 4;

    public const PRESTASHOP_CLOUDSYNC_CDC = 'https://assets.prestashop3.com/ext/cloudsync-merchant-sync-consent/latest/cloudsync-cdc.js';

    public const LOCK_TIME_TO_LIVE = 60;

    public const THE_CHECKOUT_OPC_SEPARATE_PAGE_PARAM = 'p3i';

    public static function getSdkUrl(): string
    {
        switch (self::CLICKTOPAY_ENV) {
            case self::ENV_MTF:
                return 'https://mtf.shoppingcartplugin.mastercard.com/js/isv-plugin-consumer-sdk.js';
            case self::ENV_STAGE:
                return 'https://stage.shoppingcartplugin.mastercard.com/js/isv-plugin-consumer-sdk.js';
            case self::ENV_PROD:
                return 'https://shoppingcartplugin.mastercard.com/js/isv-plugin-consumer-sdk.js';
            default:
                return 'https://dev.shoppingcartplugin.mastercard.com/js/isv-plugin-consumer-sdk.js';
        }
    }

    public static function getAdminSdkUrl(): string
    {
        switch (self::CLICKTOPAY_ENV) {
            case self::ENV_MTF:
                return 'https://mtf.shoppingcartplugin.mastercard.com/js/isv-plugin-merchant-sdk.js';
            case self::ENV_STAGE:
                return 'https://stage.shoppingcartplugin.mastercard.com/js/isv-plugin-merchant-sdk.js';
            case self::ENV_PROD:
                return 'https://shoppingcartplugin.mastercard.com/js/isv-plugin-merchant-sdk.js';
            default:
                return 'https://dev.shoppingcartplugin.mastercard.com/js/isv-plugin-merchant-sdk.js';
        }
    }

    public static function getSdkEventOrigin(): string
    {
        switch (self::CLICKTOPAY_ENV) {
            case self::ENV_MTF:
                return 'https://mtf.shoppingcartplugin.mastercard.com';
            case self::ENV_STAGE:
                return 'https://stage.shoppingcartplugin.mastercard.com';
            case self::ENV_PROD:
                return 'https://shoppingcartplugin.mastercard.com';
            default:
                return 'https://dev.shoppingcartplugin.mastercard.com';
        }
    }

    public static function getPsAccountsVersion(): string
    {
        if (VersionUtility::isPsVersionGreaterOrEqualTo('8.1.0')) {
            return '7.0.0';
        }

        if (VersionUtility::isPsVersionGreaterOrEqualTo('8.0.0')) {
            return '6.0.0';
        }

        return '5.0.0';
    }

    /**
     * @param string $postalCode
     *
     * @return string
     */
    public static function getSpainStateNameByPostalCode(string $postalCode): string
    {
        $numericPostCode = NumberUtility::parseNumber($postalCode) ?? '00000';

        // Spain state region recognised by first two post code numbers
        $postCodeRegion = substr($numericPostCode, 0, 2);

        $postalCodeMap = [
            '01' => 'Álava',
            '02' => 'Albacete',
            '03' => 'Alicante',
            '04' => 'Almería',
            '05' => 'Ávila',
            '06' => 'Badajoz',
            '07' => 'Balearic Islands',
            '08' => 'Barcelona',
            '09' => 'Burgos',
            '10' => 'Cáceres',
            '11' => 'Cádiz',
            '12' => 'Castellón',
            '13' => 'Ciudad Real',
            '14' => 'Córdoba',
            '15' => 'A Coruña',
            '16' => 'Cuenca',
            '17' => 'Girona',
            '18' => 'Granada',
            '19' => 'Guadalajara',
            '20' => 'Gipuzkoa',
            '21' => 'Huelva',
            '22' => 'Huesca',
            '23' => 'Jaén',
            '24' => 'León',
            '25' => 'Lleida',
            '26' => 'La Rioja',
            '27' => 'Lugo',
            '28' => 'Madrid',
            '29' => 'Málaga',
            '30' => 'Murcia',
            '31' => 'Navarre',
            '32' => 'Ourense',
            '33' => 'Asturias',
            '34' => 'Palencia',
            '35' => 'Las Palmas',
            '36' => 'Pontevedra',
            '37' => 'Salamanca',
            '38' => 'Santa Cruz de Tenerife',
            '39' => 'Cantabria',
            '40' => 'Segovia',
            '41' => 'Seville',
            '42' => 'Soria',
            '43' => 'Tarragona',
            '44' => 'Teruel',
            '45' => 'Toledo',
            '46' => 'Valencia',
            '47' => 'Valladolid',
            '48' => 'Biscay',
            '49' => 'Zamora',
            '50' => 'Zaragoza',
            '51' => 'Ceuta',
            '52' => 'Melilla',
        ];

        return $postalCodeMap[$postCodeRegion] ?? '';
    }
}
