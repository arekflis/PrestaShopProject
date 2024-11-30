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

namespace ClickToPay\Module\Core\Shared\Repository;

use ClickToPay\Module\Infrastructure\Repository\CollectionRepository;

if (!defined('_PS_VERSION_')) {
    exit;
}

class StateRepository extends CollectionRepository implements StateRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(\State::class);
    }
}
