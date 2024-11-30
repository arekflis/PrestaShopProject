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
<div class="alert alert-warning " role="alert" style="font-family: 'Mark Offc For MC', 'sans-serif';font-size: 16px;">
    <a href="{$clicktopay.configurationControllerLink|escape:'htmlall':'UTF-8'}">
        {l s='Click to Pay' mod='clicktopay'}
    </a>
    {l s='setup is not complete. You are one step away from activation. Complete the setup to transform the checkout experience for your shoppers right away.' mod='clicktopay'}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
