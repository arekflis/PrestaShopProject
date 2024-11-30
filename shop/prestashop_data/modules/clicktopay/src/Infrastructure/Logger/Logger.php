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

namespace ClickToPay\Module\Infrastructure\Logger;

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\EntityManager\EntityManagerInterface;
use ClickToPay\Module\Infrastructure\EntityManager\ObjectModelUnitOfWork;
use ClickToPay\Module\Infrastructure\Logger\Formatter\LogFormatterInterface;
use ClickToPay\Module\Infrastructure\Logger\Repository\PrestashopLoggerRepositoryInterface;
use ClickToPay\Module\Infrastructure\Provider\NumberIdempotencyProvider;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Logger implements LoggerInterface
{
    public const FILE_NAME = 'Logger';

    public const LOG_OBJECT_TYPE = 'clicktopayLog';

    public const SEVERITY_INFO = 1;
    public const SEVERITY_WARNING = 2;
    public const SEVERITY_ERROR = 3;

    private $logFormatter;
    private $globalShopContext;
    private $configuration;
    private $context;
    private $entityManager;
    private $idempotencyProvider;
    private $prestashopLoggerRepository;

    public function __construct(
        LogFormatterInterface $logFormatter,
        GlobalShopContextInterface $globalShopContext,
        Configuration $configuration,
        Context $context,
        EntityManagerInterface $entityManager,
        NumberIdempotencyProvider $idempotencyProvider,
        PrestashopLoggerRepositoryInterface $prestashopLoggerRepository
    ) {
        $this->logFormatter = $logFormatter;
        $this->globalShopContext = $globalShopContext;
        $this->configuration = $configuration;
        $this->context = $context;
        $this->entityManager = $entityManager;
        $this->idempotencyProvider = $idempotencyProvider;
        $this->prestashopLoggerRepository = $prestashopLoggerRepository;
    }

    public function emergency($message, array $context = [])
    {
        $this->log(
            $this->configuration->getAsInteger(
                'PS_LOGS_BY_EMAIL',
                $this->globalShopContext->getShopId()
            ),
            $message,
            $context
        );
    }

    public function alert($message, array $context = [])
    {
        $this->log(self::SEVERITY_WARNING, $message, $context);
    }

    public function critical($message, array $context = [])
    {
        $this->log(
            $this->configuration->getAsInteger(
                'PS_LOGS_BY_EMAIL',
                $this->globalShopContext->getShopId()
            ),
            $message,
            $context
        );
    }

    public function error($message, array $context = [])
    {
        $this->log(self::SEVERITY_ERROR, $message, $context);
    }

    public function warning($message, array $context = [])
    {
        $this->log(self::SEVERITY_WARNING, $message, $context);
    }

    public function notice($message, array $context = [])
    {
        $this->log(self::SEVERITY_INFO, $message, $context);
    }

    public function info($message, array $context = [])
    {
        $this->log(self::SEVERITY_INFO, $message, $context);
    }

    public function debug($message, array $context = [])
    {
        if (!$this->configuration->get(Config::CLICKTOPAY_DEBUG_MODE)) {
            return;
        }

        $this->log(self::SEVERITY_INFO, $message, $context);
    }

    public function log($level, $message, array $context = [])
    {
        $idempotencyKey = $this->idempotencyProvider->getIdempotencyKey();

        \PrestaShopLogger::addLog(
            $this->logFormatter->getMessage($message),
            $level,
            null,
            self::LOG_OBJECT_TYPE,
            $idempotencyKey
        );

        $logId = $this->prestashopLoggerRepository->getLogIdByObjectId(
            $idempotencyKey,
            $this->globalShopContext->getShopId()
        );

        if (!$logId) {
            return;
        }

        $this->logContext($logId, $context);
    }

    private function logContext($logId, array $context)
    {
        $request = '';
        $response = '';

        if (isset($context['request'])) {
            $request = $context['request'];
            unset($context['request']);
        }

        if (isset($context['response'])) {
            $response = $context['response'];
            unset($context['response']);
        }

        $log = new \ClickToPayLog();
        $log->id_log = $logId;
        $log->id_shop = $this->globalShopContext->getShopId();
        $log->context = json_encode($this->getFilledContextWithShopData($context));
        $log->request = json_encode($request);
        $log->response = json_encode($response);

        $this->entityManager->persist($log, ObjectModelUnitOfWork::UNIT_OF_WORK_SAVE);
        $this->entityManager->flush();
    }

    private function getFilledContextWithShopData(array $context = [])
    {
        $context['context_id_customer'] = $this->context->getCustomerId();
        $context['id_shop'] = $this->globalShopContext->getShopId();
        $context['currency'] = $this->globalShopContext->getCurrencyIso();
        $context['id_language'] = $this->globalShopContext->getLanguageId();

        return $context;
    }
}
