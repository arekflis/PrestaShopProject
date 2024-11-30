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
<div class="card-input-main">
    <div class="">
        <div id="mc_isv_payment_form" style="min-height: 220px"></div>
        {if $clicktopay.address && !$clicktopay.isOnePageCheckout && !$clicktopay.isSeparatePage}
            <div id="clicktopay-card-input-shipping-address" class="ps-hidden">
                {include file="./shipping_address.tpl" }
            </div>
        {/if}
    </div>

    <div id="card-input-access-your-cards-step">
        <div class="c2p-pt-4">
            <h2 class="card-input-line">
                <span class="card-input-line-text">{l s='OR' mod='clicktopay'}</span>
            </h2>
        </div>

        <div class="c2p-pt-4">
            <button type="button" id="card-input-access-your-cards-button" class="card-input-access-your-cards-button d-hidden">
                <img class="card-input-button-img" src="{$clicktopay.icons.c2pIcon|escape:'htmlall':'UTF-8'}"
                     alt="{l s='Click to pay' mod='clicktopay'}">

                <div class="card-input-button-pipe"></div>

                <span>{l s='Access your Click to Pay cards' mod='clicktopay'}</span>
            </button>

            <button type="button" id="card-input-access-your-saved-cards-button" class="card-input-access-your-cards-button d-hidden">
                <img class="card-input-button-img" src="{$clicktopay.icons.c2pIcon|escape:'htmlall':'UTF-8'}"
                     alt="{l s='Click to pay' mod='clicktopay'}">

                <div class="card-input-button-pipe"></div>

                <span>{l s='Show your saved cards' mod='clicktopay'}</span>
            </button>
        </div>
    </div>
    {if !$clicktopay.isOnePageCheckout}
        {include file="./card_footer.tpl" }
    {/if}
</div>
