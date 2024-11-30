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

namespace ClickToPay\Module\Presentation\Translator;

if (!defined('_PS_VERSION_')) {
    exit;
}

abstract class AbstractTranslations
{
    public function htmlDecode(array $rawTranslations): array
    {
        $translations = [];
        foreach ($rawTranslations as $key => $raw) {
            // to avoid symbols like &quot; in frontend
            $translations[$key] = html_entity_decode($raw);
        }

        return $translations;
    }
}
