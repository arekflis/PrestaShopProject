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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install\Command;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface InstallCommandInterface
{
    public function getName(): string;

    public function getCommand(): string;
}
