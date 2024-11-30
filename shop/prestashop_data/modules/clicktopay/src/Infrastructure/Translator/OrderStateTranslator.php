<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Square, squareup.com <https://squareup.com/help/us/en>
 * @copyright Copyright (c) permanent, Square, Inc.
 * @license   Apache License
 *
 * @see       /LICENSE
 *
 *  International Registered Trademark & Property of Square, Inc.
 */

declare(strict_types=1);

namespace ClickToPay\Module\Infrastructure\Translator;

use ClickToPay\Module\Core\Config\Config;

if (!defined('_PS_VERSION_')) {
    exit;
}

class OrderStateTranslator
{
    public static function translate(string $configName): array
    {
        if ($configName === Config::CLICKTOPAY_ORDER_STATE_PARTIALLY_REFUNDED) {
            return [
                'en' => 'ClickToPay partially refunded',
                'de' => 'ClickToPay teilweise erstattet',
                'es' => 'ClickToPay reembolsado parcialmente',
                'fr' => 'ClickToPay partiellement remboursé',
                'it' => 'ClickToPay parzialmente rimborsato',
                'nl' => 'ClickToPay gedeeltelijk terugbetaald',
                'pl' => 'ClickToPay częściowo zwrócone',
                'pt' => 'ClickToPay parcialmente reembolsado',
                'sv' => 'ClickToPay delvis återbetald',
            ];
        }

        return [
            'en' => 'ClickToPay fully refunded',
            'de' => 'ClickToPay vollständig erstattet',
            'es' => 'ClickToPay reembolsado completamente',
            'fr' => 'ClickToPay entièrement remboursé',
            'it' => 'ClickToPay completamente rimborsato',
            'nl' => 'ClickToPay volledig terugbetaald',
            'pl' => 'ClickToPay w pełni zwrócone',
            'pt' => 'ClickToPay totalmente reembolsado',
            'sv' => 'ClickToPay helt återbetald',
        ];
    }
}
