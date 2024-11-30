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

namespace ClickToPay\Module\Infrastructure\Bootstrap;

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;
use ClickToPay\Module\Infrastructure\Translator\AdminModuleTabTranslatorInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ModuleTabs
{
    public const PARENT_MODULE_TAB_CONTROLLER_NAME = 'AdminClickToPayParent';
    public const LOGS_MODULE_TAB_CONTROLLER_NAME = 'AdminClickToPayLogs';
    public const CONFIGURATION_TAB_CONTROLLER_NAME = 'AdminClickToPayConfiguration';

    private $module;
    private $adminModuleTabTranslator;

    public function __construct(ModuleFactory $moduleFactory, AdminModuleTabTranslatorInterface $adminModuleTabTranslator)
    {
        $this->module = $moduleFactory->getModule();
        $this->adminModuleTabTranslator = $adminModuleTabTranslator;
    }

    public function getTabs(): array
    {
        return [
            [
                'name' => [
                    'en' => $this->module->displayName,
                    'en-US' => $this->module->displayName,
                ],
                'ParentClassName' => 'AdminParentModulesSf',
                'parent_class_name' => 'AdminParentModulesSf',
                'class_name' => self::PARENT_MODULE_TAB_CONTROLLER_NAME,
                'visible' => false,
            ],
            [
                'name' => $this->getTabName(self::CONFIGURATION_TAB_CONTROLLER_NAME),
                'ParentClassName' => self::PARENT_MODULE_TAB_CONTROLLER_NAME,
                'parent_class_name' => self::PARENT_MODULE_TAB_CONTROLLER_NAME,
                'class_name' => self::CONFIGURATION_TAB_CONTROLLER_NAME,
                'module_tab' => true,
                'visible' => true,
            ],
            [
                'name' => $this->getTabName(self::LOGS_MODULE_TAB_CONTROLLER_NAME),
                'ParentClassName' => self::PARENT_MODULE_TAB_CONTROLLER_NAME,
                'parent_class_name' => self::PARENT_MODULE_TAB_CONTROLLER_NAME,
                'class_name' => self::LOGS_MODULE_TAB_CONTROLLER_NAME,
                'module_tab' => true,
                'visible' => true,
            ],
        ];
    }

    private function getTabName($controllerName): array
    {
        $translation = $this->adminModuleTabTranslator->translate($controllerName);

        $tabName['en'] = isset($translation['en']) ? $translation['en'] : 'Missing';
        $tabName['en-US'] = isset($translation['en-US']) ? $translation['en-US'] : 'Missing';

        return $tabName;
    }

    /**
     * Filter visible tabs to handle in javascript for ps versions below 174
     */
    public function getTabsClassNames(): array
    {
        $filtered = [];
        $tabs = $this->getTabs();

        foreach ($tabs as $tab) {
            if (isset($tab['visible']) && $tab['visible']) {
                $filtered[] = $tab['class_name'];
            }
        }

        return $filtered;
    }
}
