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

namespace ClickToPay\Module\Infrastructure\Controller;

use ClickToPay\Module\Infrastructure\Lock\Lock;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Notification\Enum\NotificationType;
use ClickToPay\Module\Infrastructure\Notification\Handler\NotificationHandlerInterface;
use ClickToPay\Module\Infrastructure\Notification\Notifications\Notification;
use ClickToPay\Module\Infrastructure\Provider\ApplicationContextProvider;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Response\Response;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AbstractFrontController extends \ModuleFrontController
{
    public const FILE_NAME = 'AbstractFrontController';

    /** @var \ClickToPay */
    public $module;

    /** @var Lock */
    private $lock;

    public function __construct()
    {
        parent::__construct();

        $this->lock = $this->module->getService(Lock::class);
    }

    public function redirectWithNotifications()
    {
        if (method_exists(parent::class, 'redirectWithNotifications')) {
            return call_user_func_array(['parent', 'redirectWithNotifications'], func_get_args());
        }

        $notifications = json_encode([
            'error' => $this->errors,
            'warning' => $this->warning,
            'success' => $this->success,
            'info' => $this->info,
        ]);

        // This session function is used to show notification messages between all prestashop version at a front end.
        // module validator error is ignored, we copied this function from core to be reused in PS1.6
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['notifications'] = $notifications;
        } elseif (session_status() === PHP_SESSION_NONE) {
            session_start();
            $_SESSION['notifications'] = $notifications;
        } else {
            setcookie('notifications', $notifications);
        }

        return call_user_func_array(['Tools', 'redirect'], func_get_args());
    }

    protected function addNotification(Notification $notification)
    {
        /** @var NotificationHandlerInterface $notificationHandler */
        $notificationHandler = $this->module->getService(NotificationHandlerInterface::class);

        if ($notification->getType() === NotificationType::SUCCESS) {
            $this->success[] = $notification->getMessage();
        }

        if ($notification->getType() === NotificationType::ERROR) {
            $this->errors[] = $notification->getMessage();
        }

        if ($notification->getType() === NotificationType::WARNING) {
            $this->warning[] = $notification->getMessage();
        }

        $notificationHandler->removeNotification(static::FILE_NAME, $notification);
    }

    protected function getControllerLink(string $destination, bool $isModuleLink = false, array $params = []): string
    {
        return $isModuleLink ?
            $this->context->link->getModuleLink($this->module->name, $destination, $params) :
            $this->context->link->getPageLink($destination, true, null, $params);
    }

    /**
     * @param null $value
     * @param null $controller
     * @param null $method
     *
     * @return never
     *
     * @throws \PrestaShopException
     */
    protected function ajaxResponse($value = null, $controller = null, $method = null)
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        if ($value instanceof JsonResponse) {
            if ($value->getStatusCode() === JsonResponse::HTTP_INTERNAL_SERVER_ERROR) {
                $logger->error('Failed to return valid response', [
                    'context' => [
                        'response' => $value->getContent(),
                    ],
                ]);
            }

            http_response_code($value->getStatusCode());

            $value = $value->getContent();
        }

        try {
            $this->ajaxDie($value, $controller, $method);
        } catch (\Exception $exception) {
            $logger->error('Could not return ajax response', [
                'context' => [
                    'response' => json_encode($value ?: []),
                    'exceptions' => ExceptionUtility::getExceptions($exception),
                ],
            ]);
        }

        exit;
    }

    protected function checkApplicationCredentials()
    {
        /** @var ApplicationContextProvider $applicationContextProvider */
        $applicationContextProvider = $this->module->getService(ApplicationContextProvider::class);

        if (!$applicationContextProvider->get()->isValid()) {
            $this->ajaxResponse(JsonResponse::error(
                $this->module->l('Invalid application credentials. Connect to Click to Pay.', self::FILE_NAME),
                JsonResponse::HTTP_UNAUTHORIZED
            ));
        }
    }

    protected function applyLock(string $resource): Response
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        try {
            $this->lock->create($resource);

            if (!$this->lock->acquire()) {
                $logger->debug('Lock resource conflict', [
                    'context' => [
                        'resource' => $resource,
                    ],
                    'exceptions' => [],
                ]);

                return Response::respond(
                    $this->module->l('Resource conflict', self::FILE_NAME),
                    Response::HTTP_CONFLICT
                );
            }
        } catch (\Throwable $exception) {
            $logger->error('Failed to lock process', [
                'context' => [
                    'resource' => $resource,
                ],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            return Response::respond(
                $this->module->l('Internal error', self::FILE_NAME),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return Response::respond(
            '',
            Response::HTTP_OK
        );
    }

    protected function releaseLock(): void
    {
        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        try {
            $this->lock->release();
        } catch (\Throwable $exception) {
            $logger->error('Failed to release process', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);
        }
    }
}
