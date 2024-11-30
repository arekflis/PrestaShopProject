<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   ISC
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Core\Payment\Action;

use ClickToPay\Module\Core\Payment\DTO\UpdateCheckoutProgressData;
use ClickToPay\Module\Core\Shared\Repository\CartRepositoryInterface;
use ClickToPay\Module\Infrastructure\Adapter\Tools;
use ClickToPay\Module\Infrastructure\Exception\ClickToPayException;
use PrestaShop\PrestaShop\Adapter\Entity\CartChecksum;

if (!defined('_PS_VERSION_')) {
    exit;
}

class UpdateCheckoutProgressAction
{
    private $cartRepository;
    private $tools;
    private $cartChecksum;

    public function __construct(
        CartRepositoryInterface $cartRepository,
        Tools $tools,
        CartChecksum $cartChecksum
    ) {
        $this->cartRepository = $cartRepository;
        $this->tools = $tools;
        $this->cartChecksum = $cartChecksum;
    }

    /**
     * @throws ClickToPayException
     */
    public function run(UpdateCheckoutProgressData $data): void
    {
        $cart = $this->cartRepository->findOneBy([
            'id_cart' => $data->getCartId(),
        ]);

        $currentSessionData = json_decode(\Db::getInstance()->getValue(
            'SELECT checkout_session_data FROM ' . _DB_PREFIX_ . 'cart WHERE id_cart = ' . (int) $cart->id
        ), true) ?? [];

        $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutPersonalInformationStep::class)]['step_is_reachable'] = true;
        $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutPersonalInformationStep::class)]['step_is_complete'] = $data->isCustomerInformationStepCompleted();

        $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutAddressesStep::class)]['step_is_reachable'] = true;
        $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutAddressesStep::class)]['step_is_complete'] = $data->isAddressStepCompleted();

        // NOTE: we don't want to override previous information.
        if (!array_key_exists('use_same_address', $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutAddressesStep::class)])) {
            $currentSessionData[$this->tools->camelCaseToKebabCase(\CheckoutAddressesStep::class)]['use_same_address'] = true;
        }

        $currentSessionData['checksum'] = $this->cartChecksum->generateChecksum($cart);

        \Db::getInstance()->update('cart', ['checkout_session_data' => json_encode($currentSessionData)],
            'id_cart = ' . (int) $cart->id
        );
    }
}
