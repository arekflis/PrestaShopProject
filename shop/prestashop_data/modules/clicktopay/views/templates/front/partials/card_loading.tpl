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
<div class="card-loading-main">
    <img class="card-loading-img" src="{$clicktopay.icons.loading|escape:'htmlall':'UTF-8'}"
         alt="{l s='Loading' mod='clicktopay'}">

    <span class="card-loading-text">
        {l s='We are checking with Click to Pay to see if you have any saved cards...' mod='clicktopay'}
    </span>
</div>
{include file="./card_footer.tpl" }
