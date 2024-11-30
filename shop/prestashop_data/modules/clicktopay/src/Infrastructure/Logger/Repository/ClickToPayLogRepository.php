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

use ClickToPay\Module\Infrastructure\Repository\CollectionRepository;
use DusanKasan\Knapsack\Collection;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayLogRepository extends CollectionRepository implements ClickToPayLogRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(\ClickToPayLog::class);
    }

    public function prune(int $daysToKeep): void
    {
        Collection::from(
            $this->findAllInCollection()
                ->sqlWhere('DATEDIFF(NOW(),date_add) >= ' . $daysToKeep)
        )
            ->each(function (\ClickToPayLog $log) {
                $log->delete();
            })
            ->realize();
    }
}
