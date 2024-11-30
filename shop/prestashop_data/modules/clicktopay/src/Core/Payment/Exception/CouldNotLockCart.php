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

namespace ClickToPay\Module\Core\Payment\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotLockCart extends ClickToPayException
{
}
