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

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminLegacyTranslator implements AdminTranslatorInterface
{
    public const FILE_NAME = 'AdminTranslator';

    /** @var \ClickToPay|false|\Module|null */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translate(string $key): string
    {
        return isset($this->getTranslations()[$key]) ? $this->getTranslations()[$key] : $key;
    }

    private function getTranslations(): array
    {
        return [];
    }
}
