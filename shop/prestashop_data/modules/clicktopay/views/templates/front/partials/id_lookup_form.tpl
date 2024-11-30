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
<div class="id-lookup-main">
    <h1 class="id-lookup-title">{l s='Access your' mod='clicktopay'}
        <span class="id-lookup-title-click-to-pay" data-toggle="modal"
              data-target="#c2p-info">{l s='Click to Pay' mod='clicktopay'}
        </span>
        {l s='cards' mod='clicktopay'}
    </h1>

    <span class="id-lookup-description">{l s='Enter your email or mobile number to access cards or register' mod='clicktopay'}</span>

    <div class="c2p-pt-4 id-lookup-form-group">
        <label class="id-lookup-input-label"
               for="id-lookup-input">{l s='Email or mobile number' mod='clicktopay'}</label>
        <input class="id-lookup-input" name="id-lookup-input"
               placeholder="{l s='Enter your email or mobile number' mod='clicktopay'}">
        <span class="id-lookup-input-error">{l s='No Click to Pay cards found. Confirm your information and try again, or get started with manual card entry.' mod='clicktopay'}</span>
    </div>

    <div class="c2p-pt-4">
        <button id="id-lookup-continue-with-click-to-pay-button" class="id-lookup-continue-with-click-to-pay-button" disabled type="button">
            <span>{l s='Continue with Click to Pay' mod='clicktopay'}</span>
        </button>
    </div>

    <div class="c2p-pt-4">
        <h2 class="id-lookup-line">
            <span class="id-lookup-line-text">{l s='OR' mod='clicktopay'}</span>
        </h2>
    </div>

    <div class="c2p-pt-4">
        <button id="id-lookup-manual-card-entry-button" class="id-lookup-manual-card-entry-button" type="button">
            <span>{l s='Manual card entry' mod='clicktopay'}</span>
        </button>
    </div>
    {include file="./card_footer.tpl" }
</div>
