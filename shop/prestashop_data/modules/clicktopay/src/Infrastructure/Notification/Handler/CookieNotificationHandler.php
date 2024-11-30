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

use ClickToPay\Module\Infrastructure\Adapter\PrestaShopCookie;
use ClickToPay\Module\Infrastructure\Notification\Notifications\Notification;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CookieNotificationHandler implements NotificationHandlerInterface
{
    /**
     * NOTE:
     *
     * This notification will work based on associative array.
     *
     * Example:
     * [
     *    'key' => [
     *       Notification,
     *       Notification,
     *       Notification,
     *       ...
     *    ]
     * ]
     */
    public const FILE_NAME = 'CookieNotification';

    private $cookie;

    public function __construct(PrestaShopCookie $cookie)
    {
        $this->cookie = $cookie;
    }

    public function addNotification(string $key, Notification $notification): void
    {
        $currentNotifications = $this->getNotifications($key);

        $currentNotifications[] = $notification;

        $this->cookie->set($key, json_encode($currentNotifications));
    }

    public function removeNotification(string $key, Notification $notification): void
    {
        $currentNotifications = $this->getNotifications($key);

        foreach ($currentNotifications as $index => $currentNotification) {
            if ($currentNotification->getId() == $notification->getId()) {
                unset($currentNotifications[$index]);
                break;
            }
        }

        if (!empty($currentNotifications)) {
            $this->cookie->set($key, json_encode($currentNotifications));
        } else {
            $this->cookie->clear($key);
        }
    }

    public function removeNotifications(string $key): void
    {
        $this->cookie->clear($key);
    }

    public function getNotifications(string $key): array
    {
        $serializedNotificationsInformation = $this->cookie->get($key);

        $notificationsInformation = json_decode($serializedNotificationsInformation, true);

        $notificationsInformation = is_array($notificationsInformation) ? $notificationsInformation : [];

        $currentNotifications = [];

        foreach ($notificationsInformation as $notificationInformation) {
            if (empty($notificationInformation)) { // NOTE: if there was some old information previously.
                continue;
            }

            $currentNotifications[] = Notification::createFromArray($notificationInformation);
        }

        return $currentNotifications;
    }
}
