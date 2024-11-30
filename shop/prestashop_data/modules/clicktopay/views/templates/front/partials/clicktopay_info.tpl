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
<form id="js-clicktopay-payment-form" class="section"
      action="{$clicktopay.payment_option_action|escape:'htmlall':'UTF-8'}">
    <div class="clicktopay-form-section">
        <div id="clicktopay-card-loading" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
            <div class="card-loading-container clicktopay-container">
                {include file="./card_loading.tpl" }
            </div>
        </div>

        <div id="otp-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
            <div class="otp-form-container {if $clicktopay.isDarkTheme}dark{/if}">
                <div id="mc_isv_otp_placeholder"></div>
                {include file="./card_footer.tpl" }
            </div>
        </div>

        <div id="clicktopay-card-input-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
            <div class="card-input-container clicktopay-container">
                {include file="./card_input_form.tpl" }
            </div>
        </div>


        <div id="clicktopay-id-lookup-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
            <div class="id-lookup-container clicktopay-container">
                {include file="./id_lookup_form.tpl" }
            </div>
        </div>

        <div id="clicktopay-card-list" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
            <div class="card-list-container clicktopay-container">
                {include file="./card_list_form.tpl" }
            </div>
        </div>
    </div>
</form>
