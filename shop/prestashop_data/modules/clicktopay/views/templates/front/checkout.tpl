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
{extends file=$layout}

{block name='header_desktop'}
    <div class="header-top" style="box-shadow: 0 4px 8px rgb(0 0 0 / 15%);">
        <div class="row" style="align-items: center; justify-content:center; display: flex;">
            {if isset($shop.logo_details) && $shop.logo_details}
                <a href="{$urls.pages.index}">
                    <img
                            class="logo img-fluid"
                            src="{$shop.logo_details.src}"
                            alt="{$shop.name}"
                            width="{$shop.logo_details.width}"
                            height="{$shop.logo_details.height}">
                </a>
            {/if}
        </div>
    </div>
{/block}

{block name='header_mobile'}{/block}

{block name='header_top'}
    <div class="header-top">
        <div class="row" style="align-items: center; justify-content:center; display: flex">
            <div class="" id="_desktop_logo">
                {if isset($shop.logo_details) && $shop.logo_details}
                    <a href="{$urls.pages.index}">
                        <img
                                class="logo img-fluid"
                                src="{$shop.logo_details.src}"
                                alt="{$shop.name}"
                                width="{$shop.logo_details.width}"
                                height="{$shop.logo_details.height}">
                    </a>
                {/if}
            </div>
        </div>
    </div>
{/block}

{block name='header_nav'}{/block}

{block name='content'}
    <div style="height:65vh;">
        <div style="width:100%; height:100%; margin: 40px auto; max-width:500px; max-height: 500px;">
            <form id="js-clicktopay-payment-form">

                <div class="clicktopay-form-section">
                    <div id="clicktopay-card-loading" class="form-step">
                        <div class="card-loading-container clicktopay-container">
                            {include file="./partials/card_loading.tpl" }
                        </div>
                    </div>

                    <div id="otp-form" class="form-step">
                        <div class="otp-form-container">
                            <div id="mc_isv_otp_placeholder"></div>
                            {include file="./partials/card_footer.tpl" }
                        </div>
                    </div>

                    <div id="clicktopay-card-input-form" class="form-step">
                        <div class="card-input-container clicktopay-container">
                            {include file="./partials/card_input_form.tpl" }

                            <div style="display: flex; flex-direction: column; margin-right: 1.5rem; margin-left: 1.5rem; margin-bottom:1.5rem">
                                <button class="pay-clicktopay">{l s='Pay' mod='clicktopay'}
                                </button>
                            </div>
                        </div>
                    </div>


                    <div id="clicktopay-id-lookup-form" class="form-step">
                        <div class="id-lookup-container clicktopay-container">
                            {include file="./partials/id_lookup_form.tpl" }
                        </div>
                    </div>

                    <div id="clicktopay-card-list" class="form-step">
                        <div class="card-list-container clicktopay-container">
                            {include file="./partials/card_list_form.tpl" }

                            <div style="display: flex; flex-direction: column; margin-right: 1.5rem; margin-left: 1.5rem; margin-bottom:1.5rem">
                                <button class="pay-clicktopay">{l s='Pay' mod='clicktopay'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>

        </div>


    </div>
{/block}

