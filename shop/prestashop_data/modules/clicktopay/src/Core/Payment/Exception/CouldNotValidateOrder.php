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

namespace ClickToPay\Module\Core\Payment\Exception;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CouldNotValidateOrder extends ClickToPayException
{
    public static function failedToFindCustomer(int $customerId): self
    {
        return new static(
            sprintf('No result for customer %s', $customerId),
            ExceptionCode::PAYMENT_FAILED_TO_FIND_CUSTOMER,
            null,
            [
                'customer_id' => $customerId,
            ]
        );
    }
}
