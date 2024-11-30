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

namespace ClickToPay\Module\Infrastructure\Context;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ApplicationContext
{
    /** @var bool */
    private $isProduction;

    /** @var bool */
    private $isActive;

    /** @var \Currency|null */
    private $defaultCurrency;

    public function __construct(
        $isProduction,
        $isActive,
        $defaultCurrency
    ) {
        $this->isProduction = $isProduction;
        $this->isActive = $isActive;
        $this->defaultCurrency = $defaultCurrency;
    }

    /**
     * @return bool
     */
    public function getIsProduction(): bool
    {
        return $this->isProduction;
    }

    /**
     * @return bool
     */
    public function getIsActive(): bool
    {
        return $this->isActive;
    }

    /**
     * @return \Currency|null
     */
    public function getDefaultCurrency(): ?\Currency
    {
        return $this->defaultCurrency;
    }

    public function isValid(): bool
    {
        return !empty($this->isActive);
    }
}
