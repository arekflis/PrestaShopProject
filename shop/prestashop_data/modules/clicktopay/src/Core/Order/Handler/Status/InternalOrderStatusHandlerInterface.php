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

namespace ClickToPay\Module\Core\Order\Handler\Status;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface InternalOrderStatusHandlerInterface
{
    /**
     * @param int $internalOrderId
     * @param string $orderStatus
     *
     * @throws \PrestaShopDatabaseException
     * @throws \PrestaShopException
     */
    public function handle(int $internalOrderId, string $orderStatus): void;
}
