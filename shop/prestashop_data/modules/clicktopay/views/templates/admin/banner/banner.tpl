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

<div class="alert alert-success clicktopay-banner-success ctp-d-none" role="alert">
    <div id="clicktopay-banner" class="clicktopay-banner-container">
        <span class="clicktopay-banner-text">
            <strong>{l s='Click to Pay' mod='clicktopay'}</strong>&nbsp;{l s='has been successfully set as your default payment option' mod='clicktopay'}
        </span>
        <button type="button" class="close" data-dismiss="alert">×</button>
    </div>
</div>
<div class="alert alert-warning clicktopay-banner-alert" role="alert">
    <div id="clicktopay-banner" class="clicktopay-banner-container">
        <span class="clicktopay-banner-text">
        {l s='Make' mod='clicktopay'}&nbsp;<strong>{l s='Click to Pay' mod='clicktopay'}</strong>&nbsp;{l s='the default payment option for your shoppers and transform their checkout experience right away' mod='clicktopay'}
        </span>

        <div style="display: flex">
            <button type="button"
                    class="clicktopay-banner-button clicktopay-button-primary">{l s='Set as default' mod='clicktopay'}</button>

            <button type="button"
                    class=" clicktopay-banner-button clicktopay-button-secondary">{l s='Not now' mod='clicktopay'}</button>
        </div>
    </div>
</div>


