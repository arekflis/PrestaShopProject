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

namespace ClickToPay\Module\Infrastructure\Utility;

use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class MoneyCalculator
{
    public const MULTIPLIER_TO_CREATE_INTEGER = 100;
    public const DIVISOR_TO_CREATE_FLOAT = 100;

    private $configuration;
    private $globalShopContext;
    private $context;

    public function __construct(
        Configuration $configuration,
        GlobalShopContextInterface $globalShopContext,
        Context $context
    ) {
        $this->configuration = $configuration;
        $this->globalShopContext = $globalShopContext;
        $this->context = $context;
    }

    public function calculateIntoInteger(float $money): int
    {
        return (int) NumberUtility::multiplyBy((float) $money, self::MULTIPLIER_TO_CREATE_INTEGER);
    }

    public function calculateIntoFloat(int $money, $precision = null, $roundMode = null): float
    {
        if (is_null($precision)) {
            $precision = $this->context->getComputingPrecision();
        }

        if (is_null($roundMode)) {
            $roundMode = $this->configuration->get('PS_PRICE_ROUND_MODE', $this->globalShopContext->getShopId());
        }

        return (float) NumberUtility::divideBy((int) $money, self::DIVISOR_TO_CREATE_FLOAT, $precision, $roundMode);
    }

    public function calculateTaxRate(float $costTaxInc, float $costTaxExcl): float
    {
        return NumberUtility::multiplyBy(
            NumberUtility::divideBy($costTaxInc, $costTaxExcl, $this->context->getComputingPrecision()) - 1,
            100,
            $this->context->getComputingPrecision()
        );
    }
}
