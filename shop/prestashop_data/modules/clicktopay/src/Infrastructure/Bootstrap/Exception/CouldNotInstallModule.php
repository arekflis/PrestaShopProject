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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

final class CouldNotInstallModule extends ClickToPayException
{
    public static function failedToInstallDatabaseTable($databaseTable): CouldNotInstallModule
    {
        return new self(
            sprintf('Failed to install database table (%s)', $databaseTable),
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_DATABASE_TABLE,
            null,
            [
                'database_table' => $databaseTable,
            ]
        );
    }

    public static function failedToInstallOrderState(string $orderStateName, \Exception $exception): self
    {
        return new self(
            sprintf('Failed to install order state (%s).', $orderStateName),
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_ORDER_STATE,
            $exception,
            [
                'order_state_name' => $orderStateName,
            ]
        );
    }
}
