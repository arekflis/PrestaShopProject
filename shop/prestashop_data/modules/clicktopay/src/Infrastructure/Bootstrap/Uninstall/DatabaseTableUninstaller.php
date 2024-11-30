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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Uninstall;

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotUninstallModule;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\ClickToPayCartsTableUninstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\ClickToPayLogsTableUninstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\ClickToPayOrdersTableUninstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\ClickToPayRefundsTableUninstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\LogEntriesUninstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Command\UninstallCommandInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class DatabaseTableUninstaller implements UninstallerInterface
{
    private $logEntriesUninstallCommand;
    /** @var ClickToPayLogsTableUninstallCommand */
    private $clickToPayLogsTableUninstallCommand;
    /** @var ClickToPayOrdersTableUninstallCommand */
    private $clickToPayOrdersTableUninstallCommand;
    /** @var ClickToPayCartsTableUninstallCommand */
    private $clickToPayCartsTableUninstallCommand;
    /**
     * @var ClickToPayRefundsTableUninstallCommand
     */
    private $clickToPayRefundsTableUninstallCommand;

    public function __construct(
        LogEntriesUninstallCommand $logEntriesUninstallCommand,
        ClickToPayLogsTableUninstallCommand $clickToPayLogsTableUninstallCommand,
        ClickToPayOrdersTableUninstallCommand $clickToPayOrdersTableUninstallCommand,
        ClickToPayCartsTableUninstallCommand $clickToPayCartsTableUninstallCommand,
        ClickToPayRefundsTableUninstallCommand $clickToPayRefundsTableUninstallCommand
    ) {
        $this->logEntriesUninstallCommand = $logEntriesUninstallCommand;
        $this->clickToPayLogsTableUninstallCommand = $clickToPayLogsTableUninstallCommand;
        $this->clickToPayOrdersTableUninstallCommand = $clickToPayOrdersTableUninstallCommand;
        $this->clickToPayCartsTableUninstallCommand = $clickToPayCartsTableUninstallCommand;
        $this->clickToPayRefundsTableUninstallCommand = $clickToPayRefundsTableUninstallCommand;
    }

    /**
     * @throws CouldNotUninstallModule
     */
    public function init(): void
    {
        $commands = $this->getCommands();

        foreach ($commands as $command) {
            if (false == \Db::getInstance()->execute($command->getCommand())) {
                throw CouldNotUninstallModule::failedToUninstallDatabaseTable($command->getName());
            }
        }
    }

    /**
     * @return UninstallCommandInterface[]
     */
    private function getCommands(): array
    {
        return [
            $this->logEntriesUninstallCommand,
            $this->clickToPayLogsTableUninstallCommand,
            $this->clickToPayOrdersTableUninstallCommand,
            $this->clickToPayCartsTableUninstallCommand,
            $this->clickToPayRefundsTableUninstallCommand,
        ];
    }
}
