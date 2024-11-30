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

namespace ClickToPay\Module\Infrastructure\Notification\Notifications;

use ClickToPay\Module\Infrastructure\Notification\Enum\NotificationType;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ErrorNotification
{
    public static function create(
        $message
    ): Notification {
        return Notification::create(
            NotificationType::ERROR,
            $message
        );
    }
}
