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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Shared\Repository\CurrencyRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Context\ApplicationContext;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ApplicationContextProvider
{
    /** @var Configuration */
    private $configuration;

    /** @var GlobalShopContextInterface */
    private $globalShopContext;

    /** @var ApplicationContext */
    private $applicationContext;

    /** @var CurrencyRepositoryInterface */
    private $currencyRepository;

    public function __construct(
        Configuration $configuration,
        GlobalShopContextInterface $globalShopContext,
        CurrencyRepositoryInterface $currencyRepository
    ) {
        $this->configuration = $configuration;
        $this->globalShopContext = $globalShopContext;
        $this->currencyRepository = $currencyRepository;
    }

    public function refresh(): self
    {
        $this->applicationContext = null;

        return $this;
    }

    public function get(): ApplicationContext
    {
        if ($this->applicationContext) {
            return $this->applicationContext;
        }

        $this->applicationContext = new ApplicationContext(
            Config::CLICKTOPAY_ENV === Config::ENV_PROD,
            $this->configuration->get(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE, $this->globalShopContext->getShopId())
            && $this->configuration->get(Config::CLICKTOPAY_PRIVATE_KEY, $this->globalShopContext->getShopId())
            && $this->configuration->get(Config::CLICKTOPAY_KEY_PHRASE, $this->globalShopContext->getShopId()),
            $this->currencyRepository->findOneBy([
                'id_currency' => $this->configuration->get(Config::PS_CURRENCY_DEFAULT, $this->globalShopContext->getShopId()),
            ])
        );

        return $this->applicationContext;
    }
}
