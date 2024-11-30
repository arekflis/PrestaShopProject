<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   ISC
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Infrastructure\Verification;

use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use Db;
use PrestaShopLogger;

if (!defined('_PS_VERSION_')) {
    exit;
}

class HasRequiredDatabaseTables
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    private const TABLE_NAMES = [
        'clicktopay_carts',
        'clicktopay_logs',
        'clicktopay_orders',
        'clicktopay_refunds',
    ];

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * Verify if all required tables exist in the database.
     *
     * @return bool true if all required tables exist, false otherwise
     */
    public function verifyAll(): bool
    {
        foreach (self::TABLE_NAMES as $tableName) {
            if (!$this->verify($tableName)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Verify if a specific table exists in the database.
     *
     * @param string $tableName the name of the table to check
     *
     * @return bool true if the table exists, false otherwise
     */
    public function verify(string $tableName): bool
    {
        $sql = 'SHOW TABLES LIKE "' . _DB_PREFIX_ . pSQL($tableName) . '"';
        $result = Db::getInstance()->executeS($sql);

        if (empty($result)) {
            PrestaShopLogger::addLog(
                'Table ' . $tableName . ' does not exist in the database.',
                3,
                null,
                'ClickToPay',
                1
            );

            return false;
        }

        return true;
    }
}
