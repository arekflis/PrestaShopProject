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
<div class="pl-0 {if $isLegacyHook}col-md-4 left-column{/if}">
    <div class="panel card">
        <div class="panel-heading card-header clicktopay-card-header">
            <span class="clicktopay-card-header-text">{l s='Refund Click to Pay order' mod='clicktopay'}</span>
        </div>

        <div class="card-body clicktopay-card-body-content">
            <p class="clicktopay-card-body-description">{l s='Applicable to orders paid exclusively through Click to Pay' mod='clicktopay'}</p>
                <div class="row">
                    {if $clicktopayOrder.canRefund}
                        <div class="col-lg-12">
                            <div class="clicktopay-card-body-radio-group-container">

                                <div class="clicktopay-card-body-radio-container">
                                    <input class="clicktopay-card-body-radio-button" type="radio"
                                           name="clicktopay-refund"
                                           value="partial"
                                           {if $clicktopayOrder.refundedAmountInCents}checked{/if}
                                    />

                                    <div class="clicktopay-card-body-radio-content">
                                        <span class="clicktopay-card-body-radio-content-title">{l s='Partial refund' mod='clicktopay'}</span>
                                        <span class="clicktopay-card-body-radio-content-description">{l s='Refund a custom amount for partial order returns' mod='clicktopay'}</span>
                                    </div>
                                </div>

                                {if !$clicktopayOrder.refundedAmountInCents}
                                    <div class="clicktopay-card-body-radio-container">
                                        <input class="clicktopay-card-body-radio-button" type="radio"
                                               name="clicktopay-refund" value="full"/>

                                        <div class="clicktopay-card-body-radio-content">
                                            <span class="clicktopay-card-body-radio-content-title">{l s='Full refund' mod='clicktopay'}</span>
                                            <span class="clicktopay-card-body-radio-content-description">{l s='Cancel entire order and process a full refund' mod='clicktopay'}</span>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                            <div id="clicktopay-refund-input"
                                 data-refunded-amount-in-cents="{$clicktopayOrder.refundedAmountInCents}"
                                 class="col-lg-12 {if !$clicktopayOrder.refundedAmountInCents}d-none{/if}">
                                <label for="clicktopay-refund-amount"
                                       class="form-control-label clicktopay-card-body-refund-input-label">{l s='Refund amount (Max: %s)' sprintf=[$clicktopayOrder.maxAllowedRefund] mod='clicktopay'} </label>

                                <div class="input-group clicktopay-card-body-refund-input-group">
                                    <input
                                            type="number"
                                            name="clicktopay-refund-amount"
                                            class="form-control clicktopay-card-body-refund-input"
                                            step=".01"
                                            min="0"
                                            max="{$clicktopayOrder.maxAllowedRefund|escape:'htmlall':'UTF-8'}"
                                            placeholder="{l s='Enter amount' mod='clicktopay'}"
                                    >
                                    <div class="input-group-append input-group-addon">
                                        <div class="input-group-text">{$clicktopayOrder.currencySymbol|escape:'htmlall':'UTF-8'}</div>
                                    </div>
                                </div>

                                <div class="clicktopay-card-body-refund-input-error">
                                    <p class="clicktopay-card-body-refund-input-error-text"></p>
                                </div>
                            </div>

                            <div class="col-lg-12 p-0 clicktopay-card-body-refund-button-container">
                                <button
                                        class="btn btn-secondary clicktopay-card-body-refund-button"
                                        disabled
                                        type="submit"
                                        name="refund-order"
                                >{l s='Initiate refund' mod='clicktopay'}</button>
                            </div>
                        </div>
                    {/if}
                </div>
                {if $clicktopayOrder.refundedAmountInCents}
                    <div class="row">
                        <div class="col-md-12 action-container">
                            <div class="d-inline-flex justify-content-center align-items-center h-100 w-100">
                                <span class="font-weight-bold">{l s='Already refunded: ' mod='clicktopay'} {$clicktopayOrder.refundedAmountFormatted|escape:'htmlall':'UTF-8'}</span>
                            </div>
                        </div>
                    </div>
                {/if}
        </div>
    </div>
</div>

