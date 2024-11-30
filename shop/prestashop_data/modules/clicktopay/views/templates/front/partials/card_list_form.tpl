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
<div class="card-list-main">
    <div class="card-list-email-container d-hidden">
        <span class="card-list-consumer-channel">a*********g@mail.com</span>

        <button id="card-list-not-you-button-new" class="card-list-not-you-button"
                type="button">{l s='Not you?' mod='clicktopay'}</button>
    </div>

    <div class="card-list-title-wrapper" style="display: flex">
        <h1 class="card-list-title">{l s='Complete payment with' mod='clicktopay'}</h1>

        <span class="card-list-title-click-to-pay" data-toggle="modal"
              data-target="#c2p-info">{l s='Click to Pay' mod='clicktopay'}</span>
    </div>

    <span class="card-list-description">{l s='Please select a card to use.' mod='clicktopay'}</span>

    <div class="c2p-pt-6 card-list-not-you-button-container d-hidden">
        <button id="card-list-not-you-button" class="card-list-not-you-button"
                type="button"></button>
    </div>

    <div class="c2p-pt-4">
        <div id="card-list-dropdown" class="card-list-dropdown">
            <button id="card-list-dropdown-button" class="card-list-dropdown-button"
                    type="button">
                <div class="card-list-dropdown-button-empty-card d-hidden">
                    <span>{l s='Select a card' mod='clicktopay'}</span>
                </div>

                <div class="card-list-dropdown-button-full-card d-hidden">
                    <img class="card-list-dropdown-button-full-card-option-img"
                         src=""
                         alt="{l s='Card' mod='clicktopay'}">
                    <p class="card-list-dropdown-content-card-option-information">
                        <span class="card-list-dropdown-button-full-card-option-information-bank-card"></span>
                        <span class="card-list-dropdown-button-full-card-option-information-card"></span>
                        <span class="card-list-dropdown-button-full-card-option-information-number"></span>
                    </p>
                </div>

                <div>
                    <img class="arrow" id="arrow" style="width: 16px; height: 16px"
                         src="{$clicktopay.icons.dropdownArrowIcon|escape:'htmlall':'UTF-8'}"
                         alt="{l s='Arrow' mod='clicktopay'}">
                </div>
            </button>

            <ul id="card-list-dropdown-content"
                class="card-list-dropdown-content"
                role="listbox"
                tabindex="-1"
                data-listbox-id="0"
                data-state=""
            >
                <li id="card-list-initial-option"
                    role="option"
                    class="card-list-dropdown-content-card-option d-hidden"
                    tabindex="-1"
                    data-disabled="true"
                    data-state=""
                >
                    <div class="card-list-dropdown-content-card-option-card">
                        <img class="card-list-dropdown-content-card-option-img"
                             src=""
                             alt="{l s='Card' mod='clicktopay'}">

                        <p class="card-list-dropdown-content-card-option-information">
                            <span class="card-list-dropdown-content-card-option-information-bank-card"></span>
                            <span class="card-list-dropdown-content-card-option-information-card"></span>
                            <span class="card-list-dropdown-content-card-option-information-number"></span>
                        </p>
                    </div>

                    <div class="card-list-dropdown-content-card-option-expired d-hidden">
                        <span>{l s='Expired' mod='clicktopay'}</span>
                    </div>

                    <div class="card-list-dropdown-content-card-option-disabled d-hidden">
                        <span>{l s='Unavailable' mod='clicktopay'}</span>
                    </div>

                    <div class="card-list-dropdown-content-card-option-suspended d-hidden">
                        <span>{l s='Unavailable' mod='clicktopay'}</span>
                    </div>

                    <div class="card-list-dropdown-content-card-option-canceled d-hidden">
                        <span>{l s='Canceled' mod='clicktopay'}</span>
                    </div>

                    <div class="card-list-dropdown-content-card-option-selected d-hidden">
                        <img style="width: 13px; height: 13px"
                             src="{$clicktopay.icons.checkmarkIcon|escape:'htmlall':'UTF-8'}"
                             alt="{l s='Checkmark' mod='clicktopay'}">
                    </div>
                </li>
            </ul>
        </div>

    </div>

    {if $clicktopay.address && !$clicktopay.isOnePageCheckout && !$clicktopay.isSeparatePage}
        <div id="clicktopay-card-list-shipping-address" class="ps-hidden">
            {include file="./shipping_address.tpl" }
        </div>
    {/if}

    <div class="c2p-pt-4">
        <h2 class="card-list-line">
            <span class="card-list-line-text">{l s='OR' mod='clicktopay'}</span>
        </h2>
    </div>


    <div class="c2p-pt-4">
        <button id="card-list-manual-card-entry-button" class="card-list-manual-card-entry-button" type="button">
            {l s='Manual card entry' mod='clicktopay'}
        </button>
    </div>
    {if !$clicktopay.isOnePageCheckout}
        {include file="./card_footer.tpl" }
    {/if}
</div>
