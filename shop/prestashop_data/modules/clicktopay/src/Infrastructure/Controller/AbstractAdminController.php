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

use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Notification\Enum\NotificationType;
use ClickToPay\Module\Infrastructure\Notification\Handler\NotificationHandlerInterface;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use ClickToPay\Module\Infrastructure\Verification\CanConfigureShop;

if (!defined('_PS_VERSION_')) {
    exit;
}

class AbstractAdminController extends \ModuleAdminController
{
    public const FILE_NAME = 'AbstractAdminController';

    /** @var \ClickToPay */
    public $module;

    public function initContent()
    {
        /** @var NotificationHandlerInterface $notificationHandler */
        $notificationHandler = $this->module->getService(NotificationHandlerInterface::class);

        /** @var CanConfigureShop $canConfigureShop */
        $canConfigureShop = $this->module->getService(CanConfigureShop::class);

        if (!$canConfigureShop->verify()) {
            /* Override bootstrap for notification to get styles * */
            $this->context->smarty->assign([
                'bootstrap' => true,
            ]);

            $this->warnings[] = $this->module->l('Please select a single shop context to use this module', self::FILE_NAME);

            return;
        }

        $notifications = $notificationHandler->getNotifications(static::FILE_NAME);

        foreach ($notifications as $notification) {
            if ($notification->getType() === NotificationType::SUCCESS) {
                $this->confirmations[] = $notification->getMessage();
            }

            if ($notification->getType() === NotificationType::ERROR) {
                $this->errors[] = $notification->getMessage();
            }

            if ($notification->getType() === NotificationType::WARNING) {
                $this->warnings[] = $notification->getMessage();
            }

            $notificationHandler->removeNotification(static::FILE_NAME, $notification);
        }

        parent::initContent();
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

    public function ensureHasPermissions(array $permissions, bool $ajax = false): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->access($permission)) {
                if ($ajax) {
                    $this->ajaxResponse(json_encode([
                        'error' => true,
                        'message' => $this->module->l('Unauthorized.', self::FILE_NAME),
                    ]), JsonResponse::HTTP_UNAUTHORIZED);
                } else {
                    $this->errors[] = $this->module->l(
                        'You do not have permission to view this.',
                        self::FILE_NAME
                    );
                }

                return false;
            }
        }

        return true;
    }
}
