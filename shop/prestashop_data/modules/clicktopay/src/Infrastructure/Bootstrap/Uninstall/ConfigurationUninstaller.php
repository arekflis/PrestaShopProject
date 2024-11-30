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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Uninstall;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ConfigurationUninstaller implements UninstallerInterface
{
    /** @var Configuration */
    private $configuration;

    public function __construct(Configuration $configuration)
    {
        $this->configuration = $configuration;
    }

    public function init(): void
    {
        $this->configuration->delete(Config::DAYS_TO_KEEP_LOGS);
        $this->configuration->delete(Config::CLICKTOPAY_DEBUG_MODE);
        $this->configuration->delete(Config::CLICKTOPAY_MERCHANT_ID);
        $this->configuration->delete(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE);
        $this->configuration->delete(Config::CLICKTOPAY_CARDS_SUPPORTED);
        $this->configuration->delete(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION);
        $this->configuration->delete(Config::CLICKTOPAY_IS_3DS_ENABLED);
        $this->configuration->delete(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE);
        $this->configuration->delete(Config::CLICKTOPAY_THEME);
        $this->configuration->delete(Config::CLICKTOPAY_KEY_ID);
        $this->configuration->delete(Config::CLICKTOPAY_KEY_ALIAS);

        $this->configuration->delete(Config::CLICKTOPAY_PRIVATE_KEY);
        $this->configuration->delete(Config::CLICKTOPAY_KEY_PHRASE);
        $this->configuration->delete(Config::CLICKTOPAY_HAS_VISITED_WELCOME_PAGE);
        $this->configuration->delete(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS);
        $this->configuration->delete(Config::CLICKTOPAY_PAYMENT_GATEWAY_DETAILS);
        $this->configuration->delete(Config::CLICKTOPAY_CONFIGURATION_TIMESTAMP);
    }
}
