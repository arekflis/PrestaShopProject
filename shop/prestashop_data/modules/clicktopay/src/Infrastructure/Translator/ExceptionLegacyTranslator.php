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

namespace ClickToPay\Module\Infrastructure\Translator;

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotInstallModule;
use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotUninstallModule;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Exception\ExceptionCode;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ExceptionLegacyTranslator implements ExceptionTranslatorInterface
{
    public const FILE_NAME = 'ExceptionLegacyTranslator';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translate(ClickToPayException $exception): string
    {
        $customMessages = $this->getCustomMessages();
        $genericMessages = $this->getGenericMessages();

        $exceptionType = get_class($exception);
        $exceptionCode = $exception->getCode();

        if (isset($customMessages[$exceptionType], $customMessages[$exceptionType][$exceptionCode])) {
            return $this->getFormattedMessage($customMessages[$exceptionType][$exceptionCode], $exception->getContext());
        }

        if (isset($genericMessages[$exceptionCode])) {
            return $this->getFormattedMessage($genericMessages[$exceptionCode], $exception->getContext());
        }

        return $this->getFormattedMessage($exception->getMessage(), $exception->getContext());
    }

    private function getCustomMessages(): array
    {
        return [
            /* BOOTSTRAP start */
            CouldNotInstallModule::class => [
                ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_DATABASE_TABLE => $this->module->l('Failed to install database table (%s).', self::FILE_NAME),
                ExceptionCode::INFRASTRUCTURE_FAILED_TO_INSTALL_MODULE_TAB => $this->module->l('Failed to install module tab (%s)', self::FILE_NAME),
            ],
            CouldNotUninstallModule::class => [
                ExceptionCode::INFRASTRUCTURE_FAILED_TO_UNINSTALL_DATABASE_TABLE => $this->module->l('Failed to uninstall database table (%s)', self::FILE_NAME),
                ExceptionCode::INFRASTRUCTURE_FAILED_TO_UNINSTALL_MODULE_TAB => $this->module->l('Failed to uninstall module tab (%s)', self::FILE_NAME),
            ],
            /* BOOTSTRAP end */
        ];
    }

    private function getGenericMessages(): array
    {
        return [
            ExceptionCode::UNKNOWN_ERROR => $this->module->l('An unknown error error occurred. Please check system logs or contact ClickToPay support.', self::FILE_NAME),
            ExceptionCode::API_FAILED_TO_GET_SUCCESSFUL_RESPONSE => $this->module->l('Failed to get successful api response.', self::FILE_NAME),
            ExceptionCode::API_FAILED_TO_CREATE_REQUEST => $this->module->l('Failed to create api request.', self::FILE_NAME),
            ExceptionCode::CONFIGURATION_MERCHANT_IS_NOT_LOGGED_IN => $this->module->l('Merchant is not logged in.', self::FILE_NAME),
            ExceptionCode::CONFIGURATION_UNSUPPORTED_CURRENCY => $this->module->l('Unsupported currency (%s). Supported currencies: [%2$s]', self::FILE_NAME),
        ];
    }

    private function getFormattedMessage(string $message, array $context): string
    {
        if (strpos($message, '%') !== false) {
            return vsprintf($message, $context);
        }

        return $message;
    }
}
