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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install;

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotInstallModule;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface InstallerInterface
{
    /**
     * @throws CouldNotInstallModule
     */
    public function init(): void;
}
