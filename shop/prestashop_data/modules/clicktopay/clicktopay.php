<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

use ClickToPay\Module\Core\Config\Config;
use ClickToPay\Module\Core\Shared\Repository\AddressRepositoryInterface;
use ClickToPay\Module\Core\Shared\Repository\CountryRepositoryInterface;
use ClickToPay\Module\Core\Shared\Verification\CanDisplayPaymentOptionDefaultBanner;
use ClickToPay\Module\Core\Tools\Action\PruneOldRecordsAction;
use ClickToPay\Module\Core\Tools\Action\ValidateOpcModuleCompatibilityAction;
use ClickToPay\Module\Core\Tools\DTO\PruneOldRecordsData;
use ClickToPay\Module\Core\Tools\Exception\CouldNotPruneOldRecords;
use ClickToPay\Module\Infrastructure\Adapter\CartHelper;
use ClickToPay\Module\Infrastructure\Adapter\Configuration;
use ClickToPay\Module\Infrastructure\Adapter\PrestaShopCookie;
use ClickToPay\Module\Infrastructure\Adapter\Tools;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\Installer;
use ClickToPay\Module\Infrastructure\Bootstrap\Install\PrestaShopDependenciesInstall;
use ClickToPay\Module\Infrastructure\Bootstrap\ModuleTabs;
use ClickToPay\Module\Infrastructure\Bootstrap\Uninstall\Uninstaller;
use ClickToPay\Module\Infrastructure\Container\Container;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;
use ClickToPay\Module\Infrastructure\Provider\ApplicationContextProvider;
use ClickToPay\Module\Infrastructure\Translator\ExceptionTranslatorInterface;
use ClickToPay\Module\Infrastructure\Utility\ExceptionUtility;
use ClickToPay\Module\Infrastructure\Utility\VersionUtility;
use ClickToPay\Module\Infrastructure\Verification\HasCompiledAssets;
use ClickToPay\Module\Infrastructure\Verification\HasRequiredDatabaseTables;
use ClickToPay\Module\Presentation\Builder\OrderManagementTemplateParameterBuilder;
use ClickToPay\Module\Presentation\Loader\BannerAssetLoader;
use ClickToPay\Module\Presentation\Loader\ComponentAssetLoader;
use ClickToPay\Module\Presentation\Loader\CustomerFormTemplateLoader;
use ClickToPay\Module\Presentation\Loader\ExpressCheckoutButtonLoader;
use ClickToPay\Module\Presentation\Loader\OrderManagementAssetLoader;
use ClickToPay\Module\Presentation\Loader\PaymentFormAssetLoader;
use ClickToPay\Module\Presentation\Presenter\PaymentOptionPresenter;

if (!defined('_PS_VERSION_')) {
    exit;
}

/**
 * const visibility cannot be declared in this file as well as class typehinting in function arguments or return types,
 * because phpparser fails to validate it in lower prestashop versions for some reason (at least with php 7.1) resulting in module install failure
 */
class ClickToPay extends PaymentModule
{
    const NAME = 'clicktopay';

    public function __construct()
    {
        // Parameter for cloudsync consent component
        $this->useLightMode = true;

        $this->name = 'clicktopay';

        $this->version = '1.0.4.1';
        $this->author = 'PrestaShop Partners';
        $this->tab = 'payments_gateways';
        $this->module_key = '4b4cde136336253dd20beee4c8a7e4ee';

        parent::__construct();

        $this->displayName = $this->l('Click To Pay');
        $this->description = $this->l('Click to Pay is a streamlined, secure online payment solution, designed to simplify guest checkout by reducing friction points. Improve conversions and decrease fraud risk by allowing enrolled customers to pay with just a few clicks - without the need to manually enter card details or remember passwords. Delivered by Mastercard and supported by all major card networks (Mastercard, Visa, American Express and Discover)');

        $this->ps_versions_compliancy = [
            'min' => '1.7.2.0',
            'max' => _PS_VERSION_,
        ];
        $this->autoload();
    }

    public function install(): bool
    {
        PrestaShopLogger::addLog('Click to Pay module install started', 1, null, 'ClickToPay', 1);
        $install = parent::install();

        if (!$install) {
            return false;
        }
        PrestaShopLogger::addLog('Click to Pay module installed from prestashop', 1, null, 'ClickToPay', 1);

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        /** @var Installer $installer */
        $installer = $this->getService(Installer::class);

        /** @var ExceptionTranslatorInterface $exceptionTranslator */
        $exceptionTranslator = $this->getService(ExceptionTranslatorInterface::class);

        try {
            $installer->init();
            PrestaShopLogger::addLog('Click to Pay module logic installed', 1, null, 'ClickToPay', 1);
        } catch (ClickToPayException $exception) {
            $logger->error('Failed to install module.', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            $this->_errors[] = $exceptionTranslator->translate($exception);
            PrestaShopLogger::addLog('Failed to install Click to Pay module logic', 3, null, 'ClickToPay', 1);

            return false;
        }

        /** @var PrestaShopDependenciesInstall $prestaShopDependenciesInstaller */
        $prestaShopDependenciesInstaller = $this->getService(PrestaShopDependenciesInstall::class);

        try {
            $prestaShopDependenciesInstaller->init();
            PrestaShopLogger::addLog('Click to Pay dependencies installed', 1, null, 'ClickToPay', 1);
        } catch (Throwable $exception) {
            //NOTE: we are continuing installation of module even if PS dependencies are not installed.
            PrestaShopLogger::addLog('Failed to install PrestaShop dependencies', 3, null, 'ClickToPay', 1);
            PrestaShopLogger::addLog('Error:' . $exception->getMessage(), 3, null, 'ClickToPay', 1);
        }

        PrestaShopLogger::addLog('Click to Pay module installation finished successfully', 1, null, 'ClickToPay', 1);

        return true;
    }

    public function uninstall(): bool
    {
        $uninstall = parent::uninstall();

        if (!$uninstall) {
            return false;
        }

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        /** @var Uninstaller $uninstaller */
        $uninstaller = $this->getService(Uninstaller::class);

        /** @var ExceptionTranslatorInterface $exceptionTranslator */
        $exceptionTranslator = $this->getService(ExceptionTranslatorInterface::class);

        try {
            $uninstaller->init();

            return true;
        } catch (ClickToPayException $exception) {
            $logger->error('Failed to uninstall module.', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            $this->_errors[] = $exceptionTranslator->translate($exception);

            return false;
        }
    }

    public function getTabs(): array
    {
        /** @var ModuleTabs $moduleTabs */
        $moduleTabs = $this->getService(ModuleTabs::class);

        return $moduleTabs->getTabs();
    }

    /**
     * Gets service that is defined by module container.
     *
     * @param string $serviceName
     * @returns mixed
     */
    public function getService(string $serviceName)
    {
        return Container::getInstance()->get($serviceName);
    }

    public function getContent(): void
    {
        \Tools::redirectAdmin($this->context->link->getAdminLink(ModuleTabs::CONFIGURATION_TAB_CONTROLLER_NAME));
    }

    public function hookDisplayAdminAfterHeader()
    {
        if (!$this->canPerformAdminHook()) {
            return '';
        }

        if (!$this->context->controller instanceof AdminDashboardControllerCore) {
            return '';
        }

        // NOTE: if there's no merchant reference id - we are not showing merchant to continue.
        if (!\Configuration::get(Config::CLICKTOPAY_MERCHANT_ID)) {
            return '';
        }

        if (\Configuration::get(Config::CLICKTOPAY_IS_PAYMENT_CONFIGURATION_ACTIVE)) {
            return '';
        }

        $this->context->smarty->assign([
            'clicktopay' => [
                'configurationControllerLink' => $this->context->link->getAdminLink('AdminClickToPayConfiguration'),
            ],
        ]);

        return $this->context->smarty->fetch($this->getLocalPath() . 'views/templates/admin/hook/onboarding_notification.tpl');
    }

    /**
     * Hook is required to display payment option as first
     *
     * @param $params
     *
     * @return array
     */
    public function hookDisplayPaymentEU($params)
    {
        return [];
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function hookPaymentOptions(array $params): array
    {
        if (!$this->canPerformFrontHook()) {
            return [];
        }

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        /** @var PaymentOptionPresenter $paymentOptionPresenter */
        $paymentOptionPresenter = $this->getService(PaymentOptionPresenter::class);

        try {
            return $paymentOptionPresenter->present();
        } catch (Throwable $exception) {
            $logger->error('Failed to present payment option.', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            return [];
        }
    }

    /**
     * @return void
     */
    public function hookActionFrontControllerSetMedia(): void
    {
        if (!$this->canPerformFrontHook()) {
            return;
        }

        $isOrderController = $this->context->controller instanceof OrderControllerCore
            || (isset($this->context->controller->php_self) && $this->context->controller->php_self === 'order');

        if (!(
                $isOrderController
                || Context::getContext()->controller instanceof CartControllerCore
                || Context::getContext()->controller instanceof ClickToPayCheckoutModuleFrontController)
            || !CartHelper::hasProducts(Context::getContext()->cart->id)
        ) {
            return;
        }

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        /** @var PaymentFormAssetLoader $paymentFormAssetsLoader */
        $paymentFormAssetsLoader = $this->getService(PaymentFormAssetLoader::class);

        /** @var CustomerFormTemplateLoader $customerFormTemplateLoader */
        $customerFormTemplateLoader = $this->getService(CustomerFormTemplateLoader::class);

        /** @var ComponentAssetLoader $componentAssetLoader */
        $componentAssetLoader = $this->getService(ComponentAssetLoader::class);

        /** @var ExpressCheckoutButtonLoader $expressCheckoutButtonLoader */
        $expressCheckoutButtonLoader = $this->getService(ExpressCheckoutButtonLoader::class);

        try {
            $paymentFormAssetsLoader->register($this->context->controller);
            $customerFormTemplateLoader->load($this->context->controller);
            $componentAssetLoader->register($this->context->controller);
            $expressCheckoutButtonLoader->load($this->context->controller);
        } catch (Throwable $exception) {
            $logger->error('Failed to present payment option assets.', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            return;
        }

        $this->context->controller->registerJavascript(
            'clicktopaySdk',
            Config::getSdkUrl(),
            [
                'priority' => 100,
                'server' => 'remote',
            ]
        );

        $this->context->controller->registerJavascript(
            'paymentSdk',
            'modules/' . $this->name . '/views/js/front/payment/index.js',
            [
                'priority' => 100,
            ]
        );

        $this->context->controller->registerStylesheet(
            'paymentSdk-css',
            'modules/' . $this->name . '/views/js/front/payment/style.css'
        );
    }

    public function hookDisplayDashboardTop(): string
    {
        if (!$this->canPerformAdminHook()) {
            return '';
        }

        /** @var CanDisplayPaymentOptionDefaultBanner $canDisplayPaymentOptionDefaultBanner */
        $canDisplayPaymentOptionDefaultBanner = $this->getService(CanDisplayPaymentOptionDefaultBanner::class);

        if (!$canDisplayPaymentOptionDefaultBanner->verify()) {
            return '';
        }

        return $this->context->smarty->fetch(
            $this->getLocalPath() . 'views/templates/admin/banner/banner.tpl'
        );
    }

    /**
     * @throws PrestaShopDatabaseException
     * @throws PrestaShopException
     * @throws Exception
     */
    public function hookActionAdminControllerSetMedia(): void
    {
        /** @var HasRequiredDatabaseTables $hasRequiredDatabaseTables */
        $hasRequiredDatabaseTables = $this->getService(HasRequiredDatabaseTables::class);

        if (!$hasRequiredDatabaseTables->verifyAll() && $this->context->controller->controller_name === 'AdminClickToPayConfiguration') {
            $this->context->controller->errors[] = $this->l('Failed to load Click to Pay module database tables.');

            return;
        }

        if (!$this->canPerformAdminHook()) {
            return;
        }

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        /** @var Tools $tools */
        $tools = $this->getService(Tools::class);

        /** @var PrestaShopCookie $cookie */
        $cookie = $this->getService(PrestaShopCookie::class);

        /** @var PruneOldRecordsAction $pruneOldRecordsAction */
        $pruneOldRecordsAction = $this->getService(PruneOldRecordsAction::class);

        /** @var Configuration $configuration */
        $configuration = $this->getService(Configuration::class);

        $currentController = $tools->getValue('controller');

        try {
            $pruneOldRecordsAction->run(PruneOldRecordsData::create($configuration->getAsInteger(Config::DAYS_TO_KEEP_LOGS)));
        } catch (CouldNotPruneOldRecords $exception) {
            $logger->error('Failed to prune old records.', [
                'context' => [],
                'exceptions' => ExceptionUtility::getExceptions($exception),
            ]);

            // NOTE: continuing on as it does not affect the functionality.
        }

        /** @var BannerAssetLoader $bannerAssetLoader */
        $bannerAssetLoader = $this->getService(BannerAssetLoader::class);
        $bannerAssetLoader->register($this->context->controller);

        if ('AdminOrders' === $currentController) {
            $orderId = $tools->getValue('id_order');
            $order = new Order($orderId);

            if ($order->module !== $this->name) {
                return;
            }

            /** @var OrderManagementAssetLoader $orderManagementAssetLoader */
            $orderManagementAssetLoader = $this->getService(OrderManagementAssetLoader::class);
            $orderManagementAssetLoader->register($this->context->controller, (int) $orderId);

            if (!empty($cookie->get(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS))) {
                $errors = json_decode($cookie->get(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS), true);

                if (isset($errors[$orderId])) {
                    $this->addFlash((string) $errors[$orderId], 'error');
                    unset($errors[$orderId]);
                    $cookie->set(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_ERRORS, json_encode($errors));
                }
            }

            if ($cookie->get(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_CANCELED)) {
                $this->addFlash($this->l('Order canceled'), 'success');
                $cookie->set(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_CANCELED, false);
            }

            if ($cookie->get(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_REFUNDED)) {
                $this->addFlash($this->l('Order refunded'), 'success');
                $cookie->set(Config::CLICKTOPAY_PAYMENT_ORDER_MANAGEMENT_COOKIE_REFUNDED, false);
            }
        }
    }

    /**
     * @param array $params
     *
     * @return string
     */
    public function hookDisplayAdminOrder(array $params): string
    {
        if (!$this->canPerformAdminHook()) {
            return '';
        }

        if (VersionUtility::isPsVersionGreaterOrEqualTo('1.7.7.0')) {
            return '';
        }

        $orderId = $params['id_order'];
        $order = new Order((int) $orderId);

        /** @var OrderManagementTemplateParameterBuilder $orderManagementTemplateParameterBuilder */
        $orderManagementTemplateParameterBuilder = $this->getService(OrderManagementTemplateParameterBuilder::class);

        $this->context->smarty->assign([
            'isLegacyHook' => true,
            'merchantSdkUrl' => Config::getAdminSdkUrl(),
            'clicktopayOrder' => $orderManagementTemplateParameterBuilder->buildParams($order),
        ]);

        $script = $this->context->smarty->fetch(
            $this->getLocalPath() . 'views/templates/admin/configuration/order_management_script.tpl'
        );

        return $script . $this->context->smarty->fetch(
            $this->getLocalPath() . 'views/templates/admin/hook/order_management.tpl'
        );
    }

    /**
     * @param array $params
     *
     * @return string
     */
    public function hookDisplayAdminOrderSide(array $params): string
    {
        if (!$this->canPerformAdminHook()) {
            return '';
        }

        if (VersionUtility::isPsVersionLessThan('1.7.7.0')) {
            return '';
        }

        $orderId = $params['id_order'];
        $order = new Order((int) $orderId);

        /** @var OrderManagementTemplateParameterBuilder $orderManagementTemplateParameterBuilder */
        $orderManagementTemplateParameterBuilder = $this->getService(OrderManagementTemplateParameterBuilder::class);

        $this->context->smarty->assign([
            'isLegacyHook' => false,
            'merchantSdkUrl' => Config::getAdminSdkUrl(),
            'clicktopayOrder' => $orderManagementTemplateParameterBuilder->buildParams($order),
        ]);

        $script = $this->context->smarty->fetch(
            $this->getLocalPath() . 'views/templates/admin/configuration/order_management_script.tpl'
        );

        return $script . $this->context->smarty->fetch(
            $this->getLocalPath() . 'views/templates/admin/hook/order_management.tpl'
        );
    }

    /**
     * @return string
     */
    public function hookDisplayHeader(): string
    {
        if (!$this->canPerformFrontHook()) {
            return '';
        }

        $isNewRegistrationController = ((bool) VersionUtility::isPsVersionGreaterOrEqualTo('8.0.0') && $this->context->controller instanceof RegistrationControllerCore);

        $isOrderController = $this->context->controller instanceof OrderControllerCore
            || (isset($this->context->controller->php_self) && $this->context->controller->php_self === 'order');

        if (!(
            $this->context->controller instanceof AuthControllerCore
            || $this->context->controller instanceof IdentityControllerCore
            || $isNewRegistrationController
            || $isOrderController
            || $this->context->controller instanceof ClickToPayCheckoutModuleFrontController
        )) {
            return '';
        }

        /** @var Configuration $configuration */
        $configuration = $this->getService(Configuration::class);

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Context $context */
        $context = $this->getService(\ClickToPay\Module\Infrastructure\Adapter\Context::class);

        $theme = $configuration->get(Config::CLICKTOPAY_THEME);

        $this->context->controller->registerStylesheet('clicktopay-common', 'modules/' . $this->name . '/views/css/front/common.css');

        /** @var ValidateOpcModuleCompatibilityAction $validateOpcModuleCompatibilityAction */
        $validateOpcModuleCompatibilityAction = $this->getService(ValidateOpcModuleCompatibilityAction::class);

        // NOTE: needs to be \Tools due to it being parsed to null with adapter as it's empty string.
        $isSeparatePage =
            \Tools::getValue(Config::THE_CHECKOUT_OPC_SEPARATE_PAGE_PARAM) === '';

        $isFallbackPage = $this->context->controller instanceof ClickToPayCheckoutModuleFrontController;

        $isOnePageCheckout = $validateOpcModuleCompatibilityAction->run() && !$isSeparatePage;
        /** @var \ClickToPay\Module\Infrastructure\Provider\CardMarksProvider $cardsProvider */
        $cardsProvider = $this->getService(\ClickToPay\Module\Infrastructure\Provider\CardMarksProvider::class);
        $supportedBrands = json_encode($cardsProvider->getOrderedCardMarks());

        $this->smarty->assign([
            'clicktopay' => [
                'locale' => $this->context->language->locale,
                'brands' => $supportedBrands,
                'cards' => $supportedBrands,
                'cart_id' => $context->getCart()->id,
                'secure_key' => $context->getCart()->secure_key,
                'icons' => [
                    'dropdownArrowIcon' => $this->getPathUri() . 'views/img/dropdown-arrow-' . $theme . '.svg',
                    'checkmarkIcon' => $this->getPathUri() . 'views/img/checkmark.svg',
                    'c2pIcon' => $this->getPathUri() . 'views/img/c2p-' . $theme . '.svg',
                    'loading' => $theme === 'dark' ? $this->getPathUri() . 'views/img/loading-dark.gif' : $this->getPathUri() . 'views/img/loading.gif',
                    'close' => $theme === 'dark' ? $this->getPathUri() . 'views/img/close-dark.svg' : $this->getPathUri() . 'views/img/close.svg',
                ],
                'isOnePageCheckout' => $isOnePageCheckout,
                'isFallbackPage' => $isFallbackPage,
                'address' => $this->shippingAddressBlockDataToArray($this->getShippingAddress()),
                'isDarkTheme' => $theme === 'dark',
                'theme' => $theme,
                'isSeparatePage' => $isSeparatePage,
            ],
        ]);

        return $this->fetch($this->getLocalPath() . '/views/templates/front/hook/displayHeader.tpl');
    }

    /**
     * @return Address|null
     *
     * @throws PrestaShopException
     */
    private function getShippingAddress()
    {
        /** @var \ClickToPay\Module\Infrastructure\Adapter\Context $context */
        $context = $this->getService(\ClickToPay\Module\Infrastructure\Adapter\Context::class);

        /** @var AddressRepositoryInterface $addressRepository */
        $addressRepository = $this->getService(AddressRepositoryInterface::class);

        $idAddress = $context->getCart()->id_address_delivery;

        /** @var Address $address */
        $address = $addressRepository->findOneBy(['id_address' => (int) $idAddress]);

        if (!$address) {
            return null;
        }

        return $address;
    }

    /**
     * @param Address|null $address
     *
     * @return array
     *
     * @throws PrestaShopException
     */
    private function shippingAddressBlockDataToArray($address): array
    {
        if (!$address) {
            return [];
        }

        /** @var \ClickToPay\Module\Infrastructure\Adapter\Context $context */
        $context = $this->getService(\ClickToPay\Module\Infrastructure\Adapter\Context::class);

        /** @var Tools $tools */
        $tools = $this->getService(Tools::class);

        /** @var CountryRepositoryInterface $countryRepository */
        $countryRepository = $this->getService(CountryRepositoryInterface::class);

        /** @var Country $country */
        $country = $countryRepository->findOneBy(['id_country' => (int) $address->id_country]);

        return [
            'firstname' => $address->firstname,
            'lastname' => $address->lastname,
            'address1' => $address->address1,
            'city' => $address->city,
            'postcode' => $address->postcode,
            'country_iso' => $country->iso_code,
            'country' => $country->name[$context->getLanguageId()],
            'editAddressUrl' => $context->getPageLink('order', true, null, 'id_address=' . $address->id . '&editAddress=delivery&token' . $tools->getToken(false)),
        ];
    }

    /**
     * @return string
     */
    public function hookDisplayExpressCheckout(): string
    {
        if (!$this->canPerformFrontHook() || !\Configuration::get(Config::CLICKTOPAY_IS_FASTER_CHECKOUT_BUTTON_ACTIVE)) {
            return '';
        }

        /** @var ExpressCheckoutButtonLoader $expressCheckoutButtonLoader */
        $expressCheckoutButtonLoader = $this->getService(ExpressCheckoutButtonLoader::class);

        return $expressCheckoutButtonLoader->getTemplate($this->context->controller, $this->context->customer);
    }

    /**
     * @param string $msg
     * @param string $type
     *
     * @return string|true
     *
     * @throws Exception
     */
    public function addFlash(string $msg, string $type)
    {
        /** @var ApplicationContextProvider $applicationContextProvider */
        $applicationContextProvider = $this->getService(ApplicationContextProvider::class);

        if (!$applicationContextProvider->get()->isValid()) {
            return '';
        }

        if (VersionUtility::isPsVersionGreaterThan('1.7.7.0')) {
            return $this->get('session')->getFlashBag()->add($type, $msg);
        }

        switch ($type) {
            case 'success':
                return $this->context->controller->confirmations[] = $msg;
            case 'error':
                return $this->context->controller->errors[] = $msg;
        }

        return true;
    }

    private function canPerformFrontHook(): bool
    {
        if (!$this->isMerchantOnboardingComplete()) {
            return false;
        }

        /** @var ApplicationContextProvider $applicationContextProvider */
        $applicationContextProvider = $this->getService(ApplicationContextProvider::class);

        /** @var HasCompiledAssets $hasCompiledAssets */
        $hasCompiledAssets = $this->getService(HasCompiledAssets::class);

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        if (!$hasCompiledAssets->verify()) {
            $logger->debug('Click to Pay assets are not compiled.');

            return false;
        }

        if (!$applicationContextProvider->get()->isValid()) {
            $logger->debug('Merchant is not logged in.');

            return false;
        }

        return true;
    }

    private function canPerformAdminHook(): bool
    {
        /** @var ApplicationContextProvider $applicationContextProvider */
        $applicationContextProvider = $this->getService(ApplicationContextProvider::class);

        /** @var LoggerInterface $logger */
        $logger = $this->getService(LoggerInterface::class);

        if (!$applicationContextProvider->get()->isValid()) {
            $logger->debug('Merchant is not logged in.');

            return false;
        }

        return true;
    }

    private function autoload()
    {
        include_once "{$this->getLocalPath()}vendor/autoload.php";
    }

    private function isMerchantOnboardingComplete()
    {
        /** @var Configuration $configuration */
        $configuration = $this->getService(Configuration::class);

        return $configuration->get(Config::CLICKTOPAY_MERCHANT_CONFIGURATION_STATUS) === 'complete';
    }
}
