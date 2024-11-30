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

namespace ClickToPay\Module\Infrastructure\Bootstrap\Install;

use ClickToPay\Module\Infrastructure\Bootstrap\Exception\CouldNotInstallModule;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Command\ClickToPayCartsTableInstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Command\ClickToPayLogsTableInstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Command\ClickToPayOrdersTableInstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Command\ClickToPayRefundsTableInstallCommand;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Command\InstallCommandInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class DatabaseTableInstaller implements InstallerInterface
{
    /** @var ClickToPayLogsTableInstallCommand */
    private $clickToPayLogsTableInstallCommand;
    /** @var ClickToPayOrdersTableInstallCommand */
    private $clickToPayOrdersTableInstallCommand;
    /** @var ClickToPayCartsTableInstallCommand */
    private $clickToPayCartsTableInstallCommand;
    /** @var ClickToPayRefundsTableInstallCommand */
    private $clickToPayRefundsTableInstallCommand;

    public function __construct(
        ClickToPayLogsTableInstallCommand $clickToPayLogsTableInstallCommand,
        ClickToPayOrdersTableInstallCommand $clickToPayOrdersTableInstallCommand,
        ClickToPayCartsTableInstallCommand $clickToPayCartsTableInstallCommand,
        ClickToPayRefundsTableInstallCommand $clickToPayRefundsTableInstallCommand
    ) {
        $this->clickToPayLogsTableInstallCommand = $clickToPayLogsTableInstallCommand;
        $this->clickToPayOrdersTableInstallCommand = $clickToPayOrdersTableInstallCommand;
        $this->clickToPayCartsTableInstallCommand = $clickToPayCartsTableInstallCommand;
        $this->clickToPayRefundsTableInstallCommand = $clickToPayRefundsTableInstallCommand;
    }

    /**
     * @return void
     *
     * @throws CouldNotInstallModule
     */
    public function init(): void
    {
        $commands = $this->getCommands();

        foreach ($commands as $command) {
            if (false == \Db::getInstance()->execute($command->getCommand())) {
                throw CouldNotInstallModule::failedToInstallDatabaseTable($command->getName());
            }
        }
    }

    /**
     * @return InstallCommandInterface[]
     */
    private function getCommands(): array
    {
        return [
            $this->clickToPayLogsTableInstallCommand,
            $this->clickToPayOrdersTableInstallCommand,
            $this->clickToPayCartsTableInstallCommand,
            $this->clickToPayRefundsTableInstallCommand,
        ];
    }
}
