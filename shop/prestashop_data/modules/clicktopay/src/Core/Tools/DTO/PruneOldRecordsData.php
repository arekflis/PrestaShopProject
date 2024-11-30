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

namespace ClickToPay\Module\Core\Tools\DTO;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PruneOldRecordsData
{
    /**
     * @var int
     */
    private $daysToKeep;

    private function __construct(
        int $daysToKeep
    ) {
        $this->daysToKeep = $daysToKeep;
    }

    public function getDaysToKeep(): int
    {
        return $this->daysToKeep;
    }

    public static function create(int $daysToKeep): self
    {
        return new self(
            $daysToKeep
        );
    }
}
