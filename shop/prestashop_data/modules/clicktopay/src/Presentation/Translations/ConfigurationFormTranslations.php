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

class ConfigurationFormTranslations extends AbstractTranslations
{
    public const FILE_NAME = 'ConfigurationFormTranslations';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translations(): array
    {
        return $this->htmlDecode([
            'Configuration.Form.clickToPayConfiguration' => $this->module->l('Click to Pay configuration', self::FILE_NAME),
            'Configuration.Form.update' => $this->module->l('Update', self::FILE_NAME),
            'Configuration.Form.paymentGatewaySettings' => $this->module->l('Payment gateway settings', self::FILE_NAME),
            'Configuration.Form.paymentGateway' => $this->module->l('Payment Gateway', self::FILE_NAME),
            'Configuration.Form.updateClickToPayConfiguration' => $this->module->l('Update Click to Pay configuration', self::FILE_NAME),
            'Configuration.Form.configureAndActivateClickToPay' => $this->module->l('Configure and activate Click to Pay', self::FILE_NAME),
            'Configuration.Form.toGetStartedUploadTheJsonFile' => $this->module->l('To get started, upload the ‘Json’ file received in the module package', self::FILE_NAME),
            'Configuration.Form.uploadConfigurationFile' => $this->module->l('Upload configuration file', self::FILE_NAME),
            'Configuration.Form.uploading' => $this->module->l('Uploading', self::FILE_NAME),
            'Configuration.Form.somethingWentWrongTryAgain' => $this->module->l('Something went wrong. Try again', self::FILE_NAME),
            'Configuration.Form.uploadedSuccessfully' => $this->module->l('uploaded successfully', self::FILE_NAME),
            'Configuration.Form.merchantId' => $this->module->l('Merchant ID', self::FILE_NAME),
            'Configuration.Form.keyId' => $this->module->l('Key ID', self::FILE_NAME),
            'Configuration.Form.keyAlias' => $this->module->l('Key Alias', self::FILE_NAME),
            'Configuration.Form.cardBrandsSupported' => $this->module->l('Card Brands Supported', self::FILE_NAME),
            'Configuration.Form.theme' => $this->module->l('Theme', self::FILE_NAME),
            'Configuration.Form.classicTheme' => $this->module->l('Light', self::FILE_NAME),
            'Configuration.Form.darkTheme' => $this->module->l('Dark', self::FILE_NAME),
            'Configuration.Form.keyPhrase' => $this->module->l('Key phrase', self::FILE_NAME),
            'Configuration.Form.enterTheKeyPhrase' => $this->module->l('Enter the key phrase', self::FILE_NAME),
            'Configuration.Form.enterTheKeyPhraseReceivedAlongWithModule' => $this->module->l('Enter the key phrase received along with the module package', self::FILE_NAME),
            'Configuration.Form.defaultPaymentOption' => $this->module->l('Default payment option', self::FILE_NAME),
            'Configuration.Form.enable3DS' => $this->module->l('Enable 3Ds', self::FILE_NAME),
            'Configuration.Form.displaySettings' => $this->module->l('Display settings', self::FILE_NAME),
            'Configuration.Form.yes' => $this->module->l('Yes', self::FILE_NAME),
            'Configuration.Form.no' => $this->module->l('No', self::FILE_NAME),
            'Configuration.Form.keepingClickToPayADefaultPaymentOption' => $this->module->l('Keeping Click to Pay a default payment option ensures shoppers enjoy fast seamless checkout experience. Other payment options will also be available to choose from.', self::FILE_NAME),
            'Configuration.Form.checkoutFasterButton' => $this->module->l(' \'Checkout Faster\' Button', self::FILE_NAME),
            'Configuration.Form.weRecommendDisplayingClickToPay' => $this->module->l('We recommend displaying Click to Pay ‘Checkout Faster’ button on product summary page to offer one-click checkouts.', self::FILE_NAME),
            'Configuration.Form.saveSettings' => $this->module->l('Save settings', self::FILE_NAME),
            'Configuration.Form.cancel' => $this->module->l('Cancel', self::FILE_NAME),
            'Configuration.Form.activateClickToPay' => $this->module->l('Activate Click to Pay', self::FILE_NAME),
            'Configuration.Form.youAreJustOneStepAway' => $this->module->l('You’re just one step away', self::FILE_NAME),
            'Configuration.Form.toActiveClickToPayUploadJson' => $this->module->l('To activate Click to Pay, upload the ‘Json’ file and enter the ‘Key Phrase’ once the upload is completed', self::FILE_NAME),
            'Configuration.Form.signIn' => $this->module->l('Sign in', self::FILE_NAME),
            'Configuration.Form.regenerateKeys' => $this->module->l('Regenerate keys', self::FILE_NAME),
            'Configuration.Form.toGenerateFreshKeys' => $this->module->l('to generate fresh keys and get an updated ‘Json’ configuration file. Upload the file and enter the ‘Key Phrase’ when prompted.', self::FILE_NAME),
            'Configuration.Form.updateClickToPay' => $this->module->l('Update Click to Pay', self::FILE_NAME),
            'Configuration.Form.success' => $this->module->l('Configuration settings have been updated successfully', self::FILE_NAME),
            'Configuration.Form.seamlessGenerateFreshKeys' => $this->module->l('To generate fresh keys and update the configuration file for a seamless Click to Pay operation', self::FILE_NAME),
            'Configuration.Form.unableToLocateJsonTip' => $this->module->l('Unable to locate \'Json\' file or \'Key Phrase\'? Generate a fresh set ', self::FILE_NAME),
            'Configuration.Form.clickHere' => $this->module->l('click here', self::FILE_NAME),
            'Configuration.Form.apiKeysExpireOn' => $this->module->l('API keys expire on', self::FILE_NAME),
        ]);
    }
}
