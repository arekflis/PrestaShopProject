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

namespace ClickToPay\Module\Presentation\Loader;

use ClickToPay;
use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

final class BannerAssetLoader
{
    /** @var ClickToPay */
    private $module;

    /**
     * @var Context
     */
    private $context;

    public function __construct(ModuleFactory $moduleFactory, Context $context)
    {
        $this->module = $moduleFactory->getModule();
        $this->context = $context;
    }

    public function register(\AdminController $controller): void
    {
        \Media::addJsDef([
            'clicktopay' => [
                'dismiss_url' => $this->context->getModuleLink(
                    $this->module->name,
                    'banner',
                    [
                        'action' => 'Dismiss',
                        'ajax' => 1,
                    ],
                    true
                ),
                'set_default_url' => $this->context->getModuleLink(
                    $this->module->name,
                    'banner',
                    [
                        'action' => 'SetDefault',
                        'ajax' => 1,
                    ],
                    true
                ),
            ],
        ]);

        $controller->addCSS($this->module->getLocalPath() . '/views/css/admin/banner/banner.css');
        $controller->addJs($this->module->getLocalPath() . '/views/js/admin/banner/banner.js');
    }
}
