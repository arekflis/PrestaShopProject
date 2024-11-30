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

final class CouldNotUninstallModule extends ClickToPayException
{
    public static function failedToUninstallDatabaseTable($databaseTable): CouldNotUninstallModule
    {
        return new self(
            sprintf('Failed to uninstall database table (%s)', $databaseTable),
            ExceptionCode::INFRASTRUCTURE_FAILED_TO_UNINSTALL_DATABASE_TABLE,
            null,
            [
                'database_table' => $databaseTable,
            ]
        );
    }
}
