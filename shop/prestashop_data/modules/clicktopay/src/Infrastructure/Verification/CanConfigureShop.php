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

namespace ClickToPay\Module\Infrastructure\Verification;

use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CanConfigureShop
{
    private $globalShopContext;

    public function __construct(GlobalShopContextInterface $globalShopContext)
    {
        $this->globalShopContext = $globalShopContext;
    }

    public function verify(): bool
    {
        if (!$this->isShopSingleContextShop()) {
            return false;
        }

        return true;
    }

    /**
     * @return mixed
     */
    private function isShopSingleContextShop()
    {
        return $this->globalShopContext->isShopSingleShopContext();
    }
}
