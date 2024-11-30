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

namespace ClickToPay\Module\Presentation\Translator;

use ClickToPay\Module\Infrastructure\Adapter\ModuleFactory;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ApiUpdatedPageTranslations extends AbstractTranslations
{
    public const FILE_NAME = 'ApiUpdatedPageTranslations';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translations(): array
    {
        return $this->htmlDecode([
            'Configuration.Updated.apiKeyHaveBeenUpdated' => $this->module->l('API keys have been updated successfully', self::FILE_NAME),
            'Configuration.Updated.important' => $this->module->l('Important:', self::FILE_NAME),
            'Configuration.Updated.deleteTheJsonFileNow' => $this->module->l('Delete the "Json" file now for security reasons; it holds sensitive data.', self::FILE_NAME),
            'Configuration.Updated.done' => $this->module->l('Done', self::FILE_NAME),
        ]);
    }
}
