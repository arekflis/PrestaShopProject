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

namespace ClickToPay\Module\Presentation\Loader;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Utility\VersionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ComponentAssetLoader
{
    public function register(\FrontController $controller): void
    {
        $isNewRegistrationController = ((bool) VersionUtility::isPsVersionGreaterOrEqualTo('8.0.0') && $controller instanceof \RegistrationControllerCore);

        $isOrderController = $controller instanceof \OrderControllerCore
            || (isset($controller->php_self) && $controller->php_self === 'order');

        if (!(
            $isOrderController
            || $controller instanceof \AuthControllerCore
            || $controller instanceof \IdentityControllerCore
            || $controller instanceof \CartControllerCore
            || $controller instanceof \ClickToPayCheckoutModuleFrontController
            || $isNewRegistrationController
        )) {
            return;
        }

        $controller->registerStylesheet(
            'clicktopay-css-ui-kit',
            Config::CSS_COMPONENT_ASSET_SCRIPT,
            [
                'media' => 'all',
                'server' => 'remote',
            ]
        );

        $controller->registerStylesheet(
            'clicktopay-learn-more-modal',
            'modules/clicktopay/views/css/front/learn-more-modal.css'
        );
    }
}
