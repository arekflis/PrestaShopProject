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

<div id="clicktopay-express-checkout-button" class="clicktopay-express-checkout-container {if !$clicktopay.showC2PButton}ps-hidden{/if} {if $clicktopay.isDarkTheme}dark{/if}" >
    <a
        id="express-checkout-button" class="express-checkout-button"
        style="display: flex; gap: 5px"
        href="{$urls.pages.order|escape:'htmlall':'UTF-8'}"
        type="button"
    >
        <span class="express-checkout-button-text">{l s='Checkout faster' mod='clicktopay'}</span>

        <div class="clicktopay-mastercard-logos-wrapper">
            <img class="c2p-icon" src="{$clicktopay.iconDirPath|escape:'htmlall':'UTF-8'}/mastercard-c2p-logo-{if $clicktopay.isDarkTheme}black{else}classic{/if}.svg" alt="">
            <div class="mastercard-logo-separator"></div>
            <img id="c2p-card-icon" class="ps-hidden" src="" alt="{l s='card logo' mod='clicktopay'}">
            <div id="express-checkout-button-c2p" class="express-checkout-button-c2p">
                <div class="express-checkout-button-c2p-icons">
                {foreach $clicktopay.cards as $card}
                    {if $card|trim == 'visa'}
                        {if $clicktopay.isDarkTheme}
                            {assign var="color" value='-classic'}
                        {else}
                            {assign var="color" value='-dark'}
                        {/if}
                    {else}
                        {assign var="color" value=''}
                    {/if}
                    <img class="c2p-icon c2p-{$card|escape:'htmlall':'UTF-8'}-logo" src="{$clicktopay.iconDirPath|escape:'htmlall':'UTF-8'}{$card|escape:'htmlall':'UTF-8'}{$color|escape:'htmlall':'UTF-8'}_logo.svg" alt="{$card|escape:'htmlall':'UTF-8'}{l s='logo' mod='clicktopay'}">
                {/foreach}
                </div>
            </div>
        </div>
    </a>

    <div id="express-checkout-additional-description" class="express-checkout-additional-text ps-hidden">
        <span class="express-checkout-card-count-text mc-text-accent mc-text-body" id="express-checkout-card-count"></span>&nbsp;<span class="express-checkout-card-count-text mc-text-accent mc-text-body">{l s='more cards available for payment' mod='clicktopay'}</span>
    </div>
</div>
