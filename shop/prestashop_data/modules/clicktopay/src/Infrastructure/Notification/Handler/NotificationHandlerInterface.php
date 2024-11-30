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

namespace ClickToPay\Module\Infrastructure\Notification\Handler;

use ClickToPay\Module\Infrastructure\Notification\Notifications\Notification;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface NotificationHandlerInterface
{
    /**
     * @param string $key
     * @param Notification $notification
     *
     * @return void
     */
    public function addNotification(string $key, Notification $notification);

    /**
     * @param string $key
     * @param Notification $notification
     *
     * @return void
     */
    public function removeNotification(string $key, Notification $notification);

    /**
     * @param string $key
     *
     * @return void
     */
    public function removeNotifications(string $key);

    /**
     * @param string $key
     *
     * @return Notification[]
     */
    public function getNotifications(string $key);
}
