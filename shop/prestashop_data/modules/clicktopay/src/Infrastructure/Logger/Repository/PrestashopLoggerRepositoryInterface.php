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

namespace ClickToPay\Module\Infrastructure\Logger\Repository;

use ClickToPay\Module\Infrastructure\Repository\ReadOnlyCollectionRepositoryInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface PrestashopLoggerRepositoryInterface extends ReadOnlyCollectionRepositoryInterface
{
    /**
     * @param string $objectId
     * @param int $shopId
     *
     * @return int|null
     */
    public function getLogIdByObjectId(string $objectId, ?int $shopId): ?int;

    public function prune(int $daysToKeep): void;
}
