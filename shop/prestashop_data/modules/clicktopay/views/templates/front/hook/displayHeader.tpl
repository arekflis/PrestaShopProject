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
{literal}
    <script type="module"
            src="https://src.mastercard.com/srci/integration/components/src-ui-kit/src-ui-kit.esm.js"></script>
{/literal}

<!-- Modal -->
<div class="modal fade clicktopay-c2p-modal-container" id="c2p-info" tabindex="-1" role="dialog"
     aria-labelledby="c2p-modal-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered c2p-modal-dialog c2p-modal-center" role="document">
        <div class="modal-content c2p-modal-content">
            <div class="modal-body c2p-modal-body">
                <src-learn-more class="clicktopay-c2p-modal" card-brands="{$clicktopay.brands|escape:'htmlall':'UTF-8'}"
                    {if $clicktopay.locale}locale="{$clicktopay.locale|escape:'htmlall':'UTF-8'}"{/if}
                    display-close-button="false"
                    display-ok-button="false">
                </src-learn-more>
            </div>
            <div class="c2p-button-wrapper">
                <button type="button" class="c2p-modal-btn" data-dismiss="modal">{l s='OK' mod='clicktopay'}</button>
            </div>
        </div>
    </div>
</div>


<div id="dcf-overlay" class="dcf-overlay"></div>

<div id="dcf-screen" class="dcf-screen {if $clicktopay.isDarkTheme}dark{/if}">
    <div class="dcf-content" style="display:none;">

        {if $clicktopay.isOnePageCheckout && !$clicktopay.isFallbackPage}
            <div class="clicktopay-form {if $clicktopay.isDarkTheme}dark{/if}" style="min-height: inherit">
                {if $clicktopay.isOnePageCheckout && !$clicktopay.isSeparatePage }
                    <div class="src-mark-container {if $clicktopay.isDarkTheme}dark{/if}">
                        {include '../partials/src_mark.tpl'}
                    </div>
                {/if}
                <button class="clicktopay-form-close-button">
                    <img style="width: 16px; height: 16px;" src="{$clicktopay.icons.close|escape:'htmlall':'UTF-8'}"/>
                </button>

                <div class="clicktopay-form-section {if $clicktopay.isDarkTheme}dark{/if}">
                    <div id="clicktopay-card-loading" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
                        <div class="card-loading-container clicktopay-container clicktopay-opc">
                            {include file="../partials/card_loading.tpl" }
                        </div>
                    </div>

                    <div id="otp-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
                        <div class="otp-form-container {if $clicktopay.isDarkTheme}dark{/if} clicktopay-opc-otp">
                            <div id="mc_isv_otp_placeholder"></div>
                            {include file="../partials/card_footer.tpl" }
                        </div>
                    </div>

                    <div id="clicktopay-card-input-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
                        <div class="card-input-container clicktopay-container clicktopay-opc">
                            {include file="../partials/card_input_form.tpl" }

                            <div style="display: flex; flex-direction: column; margin-right: 1.5rem; margin-left: 1.5rem; margin-bottom:1.5rem">
                                <button class="pay-clicktopay">{l s='Pay' mod='clicktopay'}
                                </button>
                            </div>
                            {include file="../partials/card_footer.tpl" }
                        </div>
                    </div>


                    <div id="clicktopay-id-lookup-form" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
                        <div class="id-lookup-container clicktopay-container clicktopay-opc">
                            {include file="../partials/id_lookup_form.tpl" }
                        </div>
                    </div>

                    <div id="clicktopay-card-list" class="form-step {if $clicktopay.isDarkTheme}dark{/if}">
                        <div class="card-list-container clicktopay-container clicktopay-opc">
                            {include file="../partials/card_list_form.tpl" }

                            <div style="display: flex; flex-direction: column; margin-right: 1.5rem; margin-left: 1.5rem; margin-bottom:1.5rem">
                                <button class="pay-clicktopay">{l s='Pay' mod='clicktopay'}
                                </button>
                            </div>
                            {include file="../partials/card_footer.tpl" }
                        </div>
                    </div>
                </div>
            </div>
        {/if}


        <iframe class="dcf-iframe" title="description" src="" style="display: none"></iframe>

        <div id="device-fingerprint"></div>
        <div id="challenge" class="dcf-challenge" style="display:none;"></div>

        <div id="dcf-loading" class="card-loading-main" style="display:none">
            <img class="card-loading-img" src="{$clicktopay.icons.loading|escape:'htmlall':'UTF-8'}"
                 alt="{l s='Loading' mod='clicktopay'}">

            <span class="card-loading-text">
                {l s='Processing payment...' mod='clicktopay'}
            </span>
        </div>
    </div>
</div>

<div class="modal fade clicktopay-error-modal" id="clicktopay-error-modal" role="dialog">
    <div class="modal-dialog clicktopay-error-dialog">

        <!-- Modal content -->
        <div class="modal-content clicktopay-error-content">
            <div class="modal-header clicktopay-error-header">
                <h4 id="clicktopay-error-title" class="modal-title mc-text-primary"></h4>
            </div>
            <div class="modal-body clicktopay-error-body mc-text-accent">
                <p id="clicktopay-error-body"></p>
            </div>
            <div class="modal-footer clicktopay-error-footer">
                <button id="clicktopay-error-btn" type="button"
                        class="btn btn-primary clicktopay-error-btn mc-text-secondary" data-dismiss="modal"></button>
            </div>
        </div>

    </div>
</div>



