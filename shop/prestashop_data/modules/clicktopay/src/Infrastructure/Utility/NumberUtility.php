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

namespace ClickToPay\Module\Infrastructure\Utility;

use PrestaShop\Decimal\Exception\DivisionByZeroException;
use PrestaShop\Decimal\Number;
use PrestaShop\Decimal\Operation\Rounding;

if (!defined('_PS_VERSION_')) {
    exit;
}

class NumberUtility
{
    public static function multiplyBy(float $argument, int $times, int $precision = 0, ?string $roundingMode = null): string
    {
        $number = new Number((string) $argument);
        $number = $number->times(new Number((string) $times));

        return $number->toPrecision($precision, self::getRoundingMode($roundingMode));
    }

    public static function minus(float $argument1, float $argument2, int $precision = 0, ?string $roundingMode = null): string
    {
        $number1 = new Number((string) $argument1);
        $number2 = new Number((string) $argument2);

        return $number1->minus($number2)->toPrecision($precision, self::getRoundingMode($roundingMode));
    }

    public static function add(float $argument1, float $argument2, int $precision = 0, ?string $roundingMode = null): string
    {
        $number1 = new Number((string) $argument1);
        $number2 = new Number((string) $argument2);

        return $number1->plus($number2)->toPrecision($precision, self::getRoundingMode($roundingMode));
    }

    public static function round(float $argument1, int $precision = 1, ?string $roundingMode = null): string
    {
        $number1 = new Number((string) $argument1);

        return $number1->toPrecision($precision, self::getRoundingMode($roundingMode));
    }

    /**
     * @throws DivisionByZeroException
     */
    public static function divideBy(float $argument, float $times, int $precision = 0, ?string $roundingMode = null): string
    {
        $number = new Number((string) $argument);
        $number = $number->dividedBy(new Number((string) $times));

        return $number->toPrecision($precision, self::getRoundingMode($roundingMode));
    }

    public static function getRoundingMode(?string $roundingMode): string
    {
        if (is_null($roundingMode)) {
            return Rounding::ROUND_HALF_UP;
        }

        switch ($roundingMode) {
            case PS_ROUND_HALF_DOWN:
                return Rounding::ROUND_HALF_DOWN;
            case PS_ROUND_HALF_EVEN:
                return Rounding::ROUND_HALF_EVEN;
            case PS_ROUND_UP:
                return Rounding::ROUND_CEIL;
            case PS_ROUND_DOWN:
                return Rounding::ROUND_FLOOR;
            default:
                return Rounding::ROUND_HALF_UP;
        }
    }

    public static function parseNumber(string $string): ?string
    {
        // Use preg_match to capture the numeric part of the postal code
        if (preg_match('/\d+/', $string, $matches)) {
            return $matches[0];
        }

        return null;
    }
}
