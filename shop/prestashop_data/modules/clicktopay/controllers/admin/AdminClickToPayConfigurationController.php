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

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Tools\Action\UpdatePaymentHookPositionAction;
use ClickToPay\Module\Infrastructure\Bootstrap\ModuleTabs;
use ClickToPay\Module\Infrastructure\Controller\AbstractAdminController as ModuleAdminController;
use ClickToPay\Module\Infrastructure\Cryptography\AES;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Request\Request;
use ClickToPay\Module\Infrastructure\Response\JsonResponse;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use ClickToPay\Module\Infrastructure\Verification\HasRequiredDependencies;
use ClickToPay\Module\Presentation\Loader\PrestaShopIntegrationAssetLoader;
use ClickToPay\Module\Presentation\Translator\ApiUpdatedPageTranslations;
use ClickToPay\Module\Presentation\Translator\ConfigurationActivatedPageTranslations;
use ClickToPay\Module\Presentation\Translator\ConfigurationFormTranslations;
use ClickToPay\Module\Presentation\Translator\PendingActivationPageTranslations;
use ClickToPay\Module\Presentation\Translator\WelcomePageTranslations;
use Prestashop\ModuleLibMboInstaller\DependencyBuilder;
use Rakit\Validation\Validator;

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

if (!defined('_PS_VERSION_')) {
    exit;
}

class AdminClickToPayConfigurationController extends ModuleAdminController
{
    public const FILE_NAME = 'AdminClickToPayConfigurationController';

    /** @var ClickToPay */
    public $module;

    public function __construct()
    {
        parent::__construct();

        $this->bootstrap = false;
    }

    public function initContent()
    {
        $mboInstaller = new DependencyBuilder($this->module);

        if (!$mboInstaller->areDependenciesMet()) {
            $dependencies = $mboInstaller->handleDependencies();

            $this->context->smarty->assign('dependencies', $dependencies);
            $this->content .= $this->context->smarty->fetch($this->module->getLocalPath() . 'views/templates/admin/dependency_builder.tpl');

            parent::initContent();

            return;
        }

        if (Tools::getValue('ajax')) {
            return;
        }

        /** @var HasRequiredDependencies $hasRequiredDependencies */
        $hasRequiredModuleDependencies = $this->module->getService(HasRequiredDependencies::class);

        /** @var ConfigurationFormTranslations $configurationFormTranslations */
        $configurationFormTranslations = $this->module->getService(ConfigurationFormTranslations::class);

        /** @var ConfigurationActivatedPageTranslations $configurationActivatedTranslations */
        $configurationActivatedTranslations = $this->module->getService(ConfigurationActivatedPageTranslations::class);

        /** @var WelcomePageTranslations $welcomePageTranslations */
        $welcomePageTranslations = $this->module->getService(WelcomePageTranslations::class);

        /** @var PendingActivationPageTranslations $pendingActivationPageTranslations */
        $pendingActivationPageTranslations = $this->module->getService(PendingActivationPageTranslations::class);

        /** @var ApiUpdatedPageTranslations $apiUpdatedPageTranslations */
        $apiUpdatedPageTranslations = $this->module->getService(ApiUpdatedPageTranslations::class);

        $previousJsDef = isset(Media::getJsDef()['clicktopay']) ? Media::getJsDef()['clicktopay'] : [];

        Media::addJsDef([
            'clicktopay' => array_merge($previousJsDef, [
                'locale' => str_replace('-', '_', $this->context->language->locale) ?: 'en_US',
                'channelPartnerId' => Config::CLICKTOPAY_CHANNEL_ID,
                'sdkUrl' => Config::getAdminSdkUrl(),
                'eventOrigin' => Config::getSdkEventOrigin(),
                'merchantReferenceId' => Configuration::get(Config::CLICKTOPAY_MERCHANT_ID),
                'status' => Configuration::get(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS),
                'isPaymentConfigurationActive' => (bool) (int) Configuration::get(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE),
                'hasRequiredDependencies' => $hasRequiredModuleDependencies->verify(),
                'paymentConfiguration' => (bool) (int) Configuration::get(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE) ? [
                    'paymentGatewayDetails' => json_decode(Configuration::get(Config::CLICKTOPAY_PAYMENT_GATEWAY_DETAILS), true),
                    'cardBrands' => array_map('trim', explode(',', (string) Configuration::get(Config::CLICKTOPAY_CARDS_SUPPORTED))),
                    'isDefaultPaymentOption' => (bool) (int) Configuration::get(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION),
                    'isFasterCheckoutButtonActive' => (bool) (int) Configuration::get(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE),
                    'keyId' => (string) Configuration::get(Config::CLICKTOPAY_KEY_ID),
                    'keyAlias' => (string) Configuration::get(Config::CLICKTOPAY_KEY_ALIAS),
                    'theme' => (string) Configuration::get(Config::CLICKTOPAY_THEME),
                    'is3DSEnabled' => (bool) Configuration::get(Config::CLICKTOPAY_IS_3DS_ENABLED),
                    'expiryDate' => Configuration::get(Config::CLICKTOPAY_CONFIGURATION_TIMESTAMP),
                    'keyPhrase' => Configuration::get(Config::CLICKTOPAY_KEY_PHRASE) ? base64_decode(Configuration::get(Config::CLICKTOPAY_KEY_PHRASE)) : '',
                ] : [],
                'actions' => [
                    'submitPaymentConfiguration' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'submitPaymentConfiguration', 'ajax' => 1]
                    ),
                    'updateConfiguration' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'updateConfiguration', 'ajax' => 1]
                    ),
                    'savePsConfiguration' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'savePsConfiguration', 'ajax' => 1]
                    ),
                    'merchantOnboardingFinished' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'onboardingFinished', 'ajax' => 1]
                    ),
                    'merchantSignUpComplete' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'signUpComplete', 'ajax' => 1]
                    ),
                    'merchantConfigurationFinished' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'configurationFinished', 'ajax' => 1]
                    ),
                    'merchantConfigurationInProgress' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'configurationInProgress', 'ajax' => 1]
                    ),
                    'merchantConfigurationSignUpComplete' => $this->context->link->getAdminLink(
                        ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME,
                        true,
                        [],
                        ['action' => 'signUpComplete', 'ajax' => 1]
                    ),
                ],
                'translations' => array_merge(
                    $welcomePageTranslations->translations(),
                    $configurationFormTranslations->translations(),
                    $configurationActivatedTranslations->translations(),
                    $pendingActivationPageTranslations->translations(),
                    $apiUpdatedPageTranslations->translations(),
                    []
                ),
            ]),
        ]);

        $this->context->smarty->append('clicktopay', [
            'build' => [
                'cssPath' => $this->module->getPathUri() . 'views/js/admin/configuration/style.css',
                'jsPath' => $this->module->getPathUri() . 'views/js/admin/configuration/index.js',
            ],
            'merchantSdkUrl' => Config::getAdminSdkUrl(),
        ], true);

        $this->addCSS($this->module->getLocalPath() . 'views/css/admin/fonts.css');

        $this->content .= $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/configuration/configuration.tpl');

        try {
            /** @var PrestaShopIntegrationAssetLoader $prestashopIntegrationAssetLoader */
            $prestashopIntegrationAssetLoader = $this->module->getService(PrestaShopIntegrationAssetLoader::class);
            $prestashopIntegrationAssetLoader->load();

            $this->content .= $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/configuration/ps_accounts_script.tpl');
        } catch (\Throwable $exception) {
            /** @var LoggerInterface $logger */
            $logger = $this->module->getService(LoggerInterface::class);

            $this->errors[] = $this->module->l('Unable to load your prestashop accounts details. Please contact support.', self::FILE_NAME);
            $logger->error('Ps accounts script could not be loaded', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);
        }

        parent::initContent();
    }

    public function displayAjaxSubmitPaymentConfiguration()
    {
        $request = Request::createFromGlobals();

        $validation = (new Validator())->make($request->all(), [
            'encryptedData' => 'required|array',
            'encryptedData.key' => 'required',
            'encryptedData.iv' => 'required',
            'encryptedData.tag' => 'required',
            'encryptedData.data' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        $encryptedData = (array) $request->get('encryptedData');

        $decryptedData = AES::decrypt(
            base64_decode($encryptedData['key']),
            base64_decode($encryptedData['iv']),
            base64_decode($encryptedData['tag']),
            $encryptedData['data']
        );

        if ($decryptedData === false) {
            $this->ajaxResponse(JsonResponse::error(
                'Decryption was not successful',
                JsonResponse::HTTP_UNAUTHORIZED
            ));
        }

        $request->request->remove('encryptedData');
        $request->request->replace(json_decode($decryptedData, true) ?? []);

        $validation = (new Validator())->make($request->all(), [
            'cardBrands' => 'required|array',
            'defaultPaymentOption' => 'boolean|nullable',
            'checkoutFasterButton' => 'boolean|nullable',
            'paymentGatewayDetails' => 'required',
            'keyId' => 'required',
            'keyAlias' => 'required',
            'theme' => 'required',
            'keyPhrase' => 'required',
            'is3DSEnabled' => 'required',
            'expiryDate' => 'required',
        ]);

        $validation->validate();

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        /** @var LoggerInterface $logger */
        $logger = $this->module->getService(LoggerInterface::class);

        $privateKey = trim($request->get('privateKey') ?? Configuration::get(Config::CLICKTOPAY_PRIVATE_KEY));
        $keyPhrase = trim($request->get('keyPhrase'), PHP_EOL);

        if (!openssl_pkcs12_read(base64_decode($privateKey), $certInfo, $keyPhrase)) {
            $this->ajaxResponse(JsonResponse::error(['keyPhrase' => ['Invalid key phrase.']], JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        try {
            $cardsSupported = implode(',', array_map('trim', $request->get('cardBrands')));

            Configuration::updateValue(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE, true);

            Configuration::updateValue(Config::CLICKTOPAY_CARDS_SUPPORTED, $cardsSupported);
            Configuration::updateValue(Config::CLICKTOPAY_CONFIGURATION_TIMESTAMP, $request->get('expiryDate'));
            Configuration::updateValue(Config::CLICKTOPAY_IS_3DS_ENABLED, (bool) $request->get('is3DSEnabled'));
            Configuration::updateValue(Config::CLICKTOPAY_KEY_ID, $request->get('keyId'));
            Configuration::updateValue(Config::CLICKTOPAY_KEY_ALIAS, $request->get('keyAlias'));
            Configuration::updateValue(Config::CLICKTOPAY_THEME, $request->get('theme'));
            Configuration::updateValue(Config::CLICKTOPAY_PAYMENT_GATEWAY_DETAILS, json_encode($this->maskGatewayDetails($request->get('paymentGatewayDetails'))));

            if (trim($request->get('privateKey'))) {
                Configuration::updateValue(Config::CLICKTOPAY_PRIVATE_KEY, $request->get('privateKey'));
            }

            Configuration::updateValue(Config::CLICKTOPAY_KEY_PHRASE, base64_encode($request->get('keyPhrase')));

            $this->savePsConfiguration($request);

            $status = 'complete';
            Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, $status);

            $this->ajaxResponse(JsonResponse::success([
                'clicktopayStatus' => $status,
                'defaultPaymentOption' => Configuration::get(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION),
                'checkoutFasterButton' => Configuration::get(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE),
            ], JsonResponse::HTTP_OK));
        } catch (Throwable $exception) {
            $logger->error('Failed to submit payment configuration', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            $this->ajaxResponse(JsonResponse::error($this->module->l('Unknown error occurred', self::FILE_NAME), JsonResponse::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    public function displayAjaxOnboardingFinished()
    {
        $request = Request::createFromGlobals();

        $validation = (new Validator())->validate($request->all(), [
            'merchantReferenceId' => 'required',
        ]);

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_ID, $request->get('merchantReferenceId'));
        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, 'payment');

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_OK));
    }

    public function displayAjaxSignUpComplete()
    {
        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, 'onboarding');

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_OK));
    }

    public function displayAjaxConfigurationInProgress()
    {
        $request = Request::createFromGlobals();

        $validation = (new Validator())->validate($request->all(), [
            'merchantReferenceId' => 'required',
        ]);

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_ID, $request->get('merchantReferenceId'));
        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, 'in-progress');

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_OK));
    }

    public function displayAjaxConfigurationFinished()
    {
        $request = Request::createFromGlobals();

        $validation = (new Validator())->validate($request->all(), [
            'merchantReferenceId' => 'required',
        ]);

        if ($validation->fails()) {
            $this->ajaxResponse(JsonResponse::error($validation->errors()->toArray(), JsonResponse::HTTP_UNPROCESSABLE_ENTITY));
        }

        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_ID, $request->get('merchantReferenceId'));
        Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, 'file-upload');

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_OK));
    }

    public function displayAjaxUpdateConfiguration()
    {
        $request = Request::createFromGlobals();

        try {
            $cardsSupported = implode(',', array_map('trim', $request->get('cardBrands')));

            Configuration::updateValue(Config::CLICKTOPAY_CARDS_SUPPORTED, $cardsSupported);
            Configuration::updateValue(Config::CLICKTOPAY_IS_3DS_ENABLED, (bool) $request->get('is3DSEnabled'));
            Configuration::updateValue(Config::CLICKTOPAY_THEME, $request->get('theme'));
            Configuration::updateValue(Config::CLICKTOPAY_PAYMENT_GATEWAY_DETAILS, json_encode($this->maskGatewayDetails($request->get('paymentGatewayDetails'))));

            $this->savePsConfiguration($request);

            $status = 'complete';
            Configuration::updateValue(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS, $status);
            $this->ajaxResponse(JsonResponse::success([
                'status' => $status,
                'defaultPaymentOption' => Configuration::get(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION),
                'checkoutFasterButton' => Configuration::get(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE),
            ], JsonResponse::HTTP_OK));
        } catch (Throwable $exception) {
            /** @var LoggerInterface $logger */
            $logger = $this->module->getService(LoggerInterface::class);
            $logger->error('Failed to update configuration', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            $this->ajaxResponse(JsonResponse::error($this->module->l('Unknown error occurred', self::FILE_NAME), JsonResponse::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    public function displayAjaxSavePsConfiguration()
    {
        $this->savePsConfiguration(Request::createFromGlobals());

        $this->ajaxResponse(JsonResponse::success([], JsonResponse::HTTP_OK));
    }

    /**
     * Saves configs which are shown on same clicktopay form for better UX, but is actually only saved and controlled on our side
     * (so for these values our ps_configuration is the source of true while for most others is the clicktopay sdk)
     * e.g. defaultPaymentOption, checkoutFasterButton
     */
    private function savePsConfiguration(Request $request)
    {
        $isDefaultPaymentOption = $request->get('defaultPaymentOption');
        $isCheckoutButtonActive = $request->get('checkoutFasterButton');

        if (null !== $isDefaultPaymentOption) {
            $isDefaultPaymentOption = (bool) $isDefaultPaymentOption;
            Configuration::updateValue(Config::CLICKTOPAY_IS_DEFAULT_PAYMENT_OPTION, $isDefaultPaymentOption);
            /** @var UpdatePaymentHookPositionAction $updatePaymentHookPositionAction */
            $updatePaymentHookPositionAction = $this->module->getService(UpdatePaymentHookPositionAction::class);
            $updatePaymentHookPositionAction->run($isDefaultPaymentOption);
        }

        if (null !== $isCheckoutButtonActive) {
            Configuration::updateValue(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE, (bool) $isCheckoutButtonActive);
        }
    }

    /**
     * Masks up/removes sensitive information like password, so we don't save it on our side
     *
     * @return void
     */
    private function maskGatewayDetails(array $gatewayDetails): array
    {
        $credentials = $gatewayDetails['credentials'] ?? null;

        if (!$credentials) {
            return $gatewayDetails;
        }

        foreach ($credentials as $i => $credential) {
            $name = $credential['name'] ?? null;
            if ($name === 'password') {
                unset($credentials[$i]);
                break;
            }
        }

        $gatewayDetails['credentials'] = array_values($credentials);

        return $gatewayDetails;
    }
}
