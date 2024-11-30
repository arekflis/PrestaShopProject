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

namespace ClickToPay\Module\Presentation\Presenter;

use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use ClickToPay\Module\Infrastructure\Provider\ApplicationContextProvider;
use ClickToPay\Module\Infrastructure\Verification\HasCompiledAssets;
use ClickToPay\Module\Presentation\Presenter\Exception\CouldNotPresentPaymentOption;
use ClickToPay\Module\Presentation\Presenter\Option\ClickToPayOption;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PaymentOptionPresenter
{
    private $applicationContextProvider;
    private $clickToPayOption;
    private $hasPaymentOptionAssets;

    public function __construct(
        ApplicationContextProvider $applicationContextProvider,
        ClickToPayOption $clickToPayOption,
        HasCompiledAssets $hasPaymentOptionAssets
    ) {
        $this->applicationContextProvider = $applicationContextProvider;
        $this->clickToPayOption = $clickToPayOption;
        $this->hasPaymentOptionAssets = $hasPaymentOptionAssets;
    }

    /**
     * @throws ClickToPayException
     */
    public function present(): array
    {
        if (!$this->hasPaymentOptionAssets->verify()) {
            throw CouldNotPresentPaymentOption::paymentFormAssetsAreMissing();
        }

        if (!$this->applicationContextProvider->get()->isValid()) {
            throw CouldNotPresentPaymentOption::merchantIsNotLoggedIn();
        }

        $paymentOptions = [];

        try {
            $paymentOptions[] = $this->clickToPayOption
                ->setPaymentMethodIdentifier('clicktopay')
                ->setLogo('')
                ->getOption();
        } catch (\Throwable $exception) {
            throw CouldNotPresentPaymentOption::unknownError($exception);
        }

        return $paymentOptions;
    }
}
