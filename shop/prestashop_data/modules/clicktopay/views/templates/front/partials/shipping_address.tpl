{**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 *}
<div class="clicktopay-shipping-address-container">
    <div class="clicktopay-shipping-address-header">
        <span class="clicktopay-shipping-address-title">{l s='Shipping address:' mod='clicktopay'}</span>
        <a class="clicktopay-shipping-address-button" href="{$clicktopay.address.editAddressUrl|escape:'htmlall':'UTF-8'}">{l s='Edit' mod='clicktopay'}</a>
    </div>
    <div class="clicktopay-shipping-address">
        <span>{$clicktopay.address.firstname|escape:'htmlall':'UTF-8'} {$clicktopay.address.lastname|escape:'htmlall':'UTF-8'}</span>
        <span>{$clicktopay.address.address1|escape:'htmlall':'UTF-8'}</span>
        <span>{$clicktopay.address.city|escape:'htmlall':'UTF-8'}, {$clicktopay.address.country_iso|escape:'htmlall':'UTF-8'} {$clicktopay.address.postcode|escape:'htmlall':'UTF-8'} / {$clicktopay.address.country|escape:'htmlall':'UTF-8'}</span>
    </div>
</div>
