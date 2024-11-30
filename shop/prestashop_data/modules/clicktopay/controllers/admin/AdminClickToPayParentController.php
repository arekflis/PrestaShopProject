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

use ClickToPay\Module\Infrastructure\Bootstrap\ModuleTabs;
use ClickToPay\Module\Infrastructure\Controller\AbstractAdminController as ModuleAdminController;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminClickToPayParentController extends ModuleAdminController
{
    public function postProcess()
    {
        Tools::redirectAdmin($this->context->link->getAdminLink(ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME));
    }
}
