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

namespace ClickToPay\Module\Infrastructure\Provider;

use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContext;
use ClickToPay\Module\Infrastructure\Exception\InvalidConfigurationException;

if (!defined('_PS_VERSION_')) {
    exit;
}

class MandatoryConfigProvider
{
    /**
     * @var Configuration
     */
    private $configuration;

    /**
     * @var GlobalShopContext
     */
    private $globalShopContext;

    public function __construct(
        Configuration $configuration,
        GlobalShopContext $globalShopContext
    ) {
        $this->configuration = $configuration;
        $this->globalShopContext = $globalShopContext;
    }

    public function getConfiguredOrderState(string $configId): int
    {
        $stateId = (int) $this->configuration->get($configId, $this->globalShopContext->getShopId());

        if (!$stateId) {
            throw new InvalidConfigurationException(sprintf('Clicktopay Order configuration invalid. Missing config "%s"', $configId));
        }

        return $stateId;
    }
}
