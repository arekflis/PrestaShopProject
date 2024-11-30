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

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotUninstallModule;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface UninstallerInterface
{
    /**
     * @throws CouldNotUninstallModule
     */
    public function init(): void;
}
