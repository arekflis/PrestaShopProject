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

namespace ClickToPay\Module\Core\Tools\Action;

use ClickToPay\Module\Core\Tools\DTO\PruneOldRecordsData;
use ClickToPay\Module\Core\Tools\Exception\CouldNotPruneOldRecords;
use ClickToPay\Module\Infrastructure\Logger\Repository\ClickToPayLogRepositoryInterface;
use ClickToPay\Module\Infrastructure\Logger\Repository\PrestashopLoggerRepositoryInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PruneOldRecordsAction
{
    private $prestashopLoggerRepository;
    private $clickToPayLogRepository;

    public function __construct(
        PrestashopLoggerRepositoryInterface $prestashopLoggerRepository,
        ClickToPayLogRepositoryInterface $clickToPayLogRepository
    ) {
        $this->prestashopLoggerRepository = $prestashopLoggerRepository;
        $this->clickToPayLogRepository = $clickToPayLogRepository;
    }

    /**
     * @throws CouldNotPruneOldRecords
     */
    public function run(PruneOldRecordsData $data)
    {
        try {
            $this->prestashopLoggerRepository->prune($data->getDaysToKeep());
            $this->clickToPayLogRepository->prune($data->getDaysToKeep());
        } catch (\Throwable $exception) {
            throw CouldNotPruneOldRecords::failedToPrune($exception);
        }
    }
}
