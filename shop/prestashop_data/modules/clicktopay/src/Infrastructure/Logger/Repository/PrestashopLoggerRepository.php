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

use ClickToPay\Module\Infrastructure\Logger\Logger;
use ClickToPay\Module\Infrastructure\Repository\CollectionRepository;
use ClickToPay\Module\Infrastructure\Utility\VersionUtility;
use DusanKasan\Knapsack\Collection;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PrestashopLoggerRepository extends CollectionRepository implements PrestashopLoggerRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(\PrestaShopLogger::class);
    }

    /** {@inheritDoc} */
    public function getLogIdByObjectId(string $objectId, ?int $shopId): ?int
    {
        $query = new \DbQuery();

        $query
            ->select('l.id_log')
            ->from('log', 'l')
            ->where('l.object_id = "' . pSQL($objectId) . '"')
            ->orderBy('l.id_log DESC');

        if (VersionUtility::isPsVersionGreaterOrEqualTo('1.7.8.0')) {
            $query->where('l.id_shop = ' . (int) $shopId);
        }

        $logId = \Db::getInstance()->getValue($query);

        return (int) $logId ?: null;
    }

    public function prune(int $daysToKeep): void
    {
        Collection::from(
            $this->findAllInCollection()
                ->sqlWhere('DATEDIFF(NOW(),date_add) >= ' . $daysToKeep)
                ->where('object_type', '=', Logger::LOG_OBJECT_TYPE)
        )
            ->each(function (\PrestaShopLogger $log) {
                $log->delete();
            })
            ->realize();
    }
}
