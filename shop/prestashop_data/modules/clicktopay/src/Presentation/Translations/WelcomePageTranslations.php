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

class WelcomePageTranslations extends AbstractTranslations
{
    public const FILE_NAME = 'WelcomePageTranslations';

    /** @var \ClickToPay */
    private $module;

    public function __construct(ModuleFactory $moduleFactory)
    {
        $this->module = $moduleFactory->getModule();
    }

    public function translations(): array
    {
        return $this->htmlDecode([
            'Welcome.checkoutSolutionDesignedToAccelerateYourBusiness' => $this->module->l('A checkout solution designed to accelerate your business', self::FILE_NAME),
            'Welcome.introducingClickToPay' => $this->module->l('Introducing Click to Pay, a network of millions of shoppers that can be instantly recognized for a seamless, secure, and password-free checkout.', self::FILE_NAME),
            'Welcome.benefitsForYourBusiness' => $this->module->l('Benefits for your business', self::FILE_NAME),
            'Welcome.reduceCartAbandonment' => $this->module->l('Reduce cart abandonment', self::FILE_NAME),
            'Welcome.allowCustomersToCheckout' => $this->module->l('Allow customers to checkout without needing to enter their card details each time', self::FILE_NAME),
            'Welcome.offerRicherGuestCheckout' => $this->module->l('Offer a richer guest checkout', self::FILE_NAME),
            'Welcome.treatNewShoppersLikeReturningCustomers' => $this->module->l('Treat new shoppers like returning customers through upfront recognition', self::FILE_NAME),
            'Welcome.optimizeConversion' => $this->module->l('Optimise Conversion', self::FILE_NAME),
            'Welcome.offerFastSeamlessOneClickCheckoutExperience' => $this->module->l('Offer a fast, seamless one-click checkout experience across devices and online stores', self::FILE_NAME),
            'Welcome.worksWithYourPreferredPaymentProvider' => $this->module->l('Works with your preferred payment provider', self::FILE_NAME),
            'Welcome.configurePaymentRouting' => $this->module->l('Configure payment routing by selecting from a list of supported payment providers', self::FILE_NAME),
            'Welcome.reduceFraudRisk' => $this->module->l('Reduce fraud risk', self::FILE_NAME),
            'Welcome.builtInIntelligenceToDetectHighRisk' => $this->module->l('Built-in intelligence to detect high-risk consumer behaviors in real-time. Meet SCA standards by configuring your payment provider’s 3DS2 Authentication.', self::FILE_NAME),
            'Welcome.noAdditionalProcessingCost' => $this->module->l('No additional processing cost', self::FILE_NAME),
            'Welcome.worksAcrossMajorPaymentNetworks' => $this->module->l('Works across major payment networks and with your configured payment provider at no additional cost for consumers or merchants', self::FILE_NAME),
            'Welcome.howDoesItWork?' => $this->module->l('How does it work?', self::FILE_NAME),
            'Welcome.readyToGetStarted?' => $this->module->l('Ready to get started?', self::FILE_NAME),
            'Welcome.transformCheckoutExperience' => $this->module->l('Transform the checkout experience for your shoppers by completing the Click to Pay setup now.', self::FILE_NAME),
            'Welcome.getStarted' => $this->module->l('Get started', self::FILE_NAME),
            'Welcome.activatingClickToPayEasy' => $this->module->l('Activating Click to Pay is easy', self::FILE_NAME),
            'Welcome.stepSignUp' => $this->module->l('1. Sign up', self::FILE_NAME),
            'Welcome.createClickToPayMerchant' => $this->module->l('Create a Click to Pay merchant account to get started', self::FILE_NAME),
            'Welcome.stepVerification' => $this->module->l('2. Verification', self::FILE_NAME),
            'Welcome.fillInYourBusinessProfile' => $this->module->l('Fill in your business profile details and submit for verification', self::FILE_NAME),
            'Welcome.stepConfigure' => $this->module->l('3. Configure', self::FILE_NAME),
            'Welcome.configureTheSettingsUsing' => $this->module->l('Configure the settings using your existing payment gateway to activate', self::FILE_NAME),
            'Welcome.stepActivate' => $this->module->l('4. Activate', self::FILE_NAME),
            'Welcome.goLiveWithClickToPay' => $this->module->l('Go live with Click to Pay and start accepting payments. Sandbox mode available', self::FILE_NAME),
            'Welcome.forAdditionalHelp' => $this->module->l('For additional help, queries regarding this module please contact us at', self::FILE_NAME),
            'Welcome.supportEmail' => $this->module->l('digital.support@mastercard.com', self::FILE_NAME),
            'Welcome.supportPhone' => $this->module->l('1-800-999-0363 or +1-636-722-6176.', self::FILE_NAME),
        ]);
    }
}
