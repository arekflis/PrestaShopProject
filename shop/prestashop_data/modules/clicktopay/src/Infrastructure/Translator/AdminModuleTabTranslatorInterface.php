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

namespace ClickToPay\Module\Infrastructure\Translator;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface AdminModuleTabTranslatorInterface
{
    /**
     * @param string $key
     *
     * @return string|array
     */
    public function translate(string $key);
}
