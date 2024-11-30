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

namespace ClickToPay\Module\Infrastructure\Provider;

use ClickToPay\Module\Core\Config\Config;

class CardMarksProvider
{
    public function getOrderedCardMarks(): array
    {
        $cardsOrder = [
            'mastercard',
            'amex',
            'visa',
            'discovery',
        ];

        $marks = explode(',', \Configuration::get(Config::CLICKTOPAY_CARDS_SUPPORTED));

        if (empty($marks)) {
            return [];
        }

        $orderedMarks = [];
        foreach ($cardsOrder as $card) {
            if (in_array($card, $marks, true)) {
                $orderedMarks[] = $card;
            }
        }

        return $orderedMarks;
    }
}
