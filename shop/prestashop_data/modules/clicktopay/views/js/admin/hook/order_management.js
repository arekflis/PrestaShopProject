/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */
$(document).ready(function () {
    var initiateRefundButton = $('.clicktopay-card-body-refund-button');
    var refundRadioButton = $('input[type=radio][name="clicktopay-refund"]');
    var refundInput = $('input[name="clicktopay-refund-amount"]');

    refundRadioButton.change(function () {
        hideError();
        const inputContainer = document.getElementById('clicktopay-refund-input');

        this.value ? inputContainer.classList.remove('d-none') : inputContainer.classList.remove('d-none');

        if (this.value === "full") {
            refundInput.attr("disabled", true);
            refundInput.val(refundInput.attr('max'))
            initiateRefundButton.attr("disabled", false)
        } else {
            refundInput.attr("disabled", false);
            refundInput.val('');
            initiateRefundButton.attr("disabled", true)
        }
    })

    refundInput.on('input', function () {
        hideError();

        var minimumAllowedRefundAmount = parseFloat($(this).attr('min'));
        var maximumAllowedRefundAmount = parseFloat($(this).attr('max'));

        var refundAmount = parseFloat(this.value);

        if (refundAmount <= minimumAllowedRefundAmount) {
            showError(clicktopay.errors.belowMinimumAllowedRefundAmount);

            return;
        }

        if (refundAmount > maximumAllowedRefundAmount) {
            showError(clicktopay.errors.aboveMaximumAllowedRefundAmount);
        }
    });

    initiateRefundButton.on('click', async () => {
        var isPartial = isPartialRefund();

        await window.merchantSDK.openRefundPage(clicktopay.locale, clicktopay.merchantReferenceId, clicktopay.gatewayTransactionId, isPartial, isPartial ? createRefundTransactionRequest(getRefundAmountInCents()) : null);
    });

    showError = (message) => {
        $('.clicktopay-card-body-refund-input-error').show();
        $('.clicktopay-card-body-refund-input-error .clicktopay-card-body-refund-input-error-text').text(message);
        $('input[name="clicktopay-refund-amount"]').parents('.input-group').addClass('clicktopay-card-body-refund-input-group-error');
        initiateRefundButton.attr("disabled", true);
    };

    hideError = () => {
        $('.clicktopay-card-body-refund-input-error').hide();
        $('.clicktopay-card-body-refund-input-error .clicktopay-card-body-refund-input-error-text').text('');
        $('input[name="clicktopay-refund-amount"]').parents('.input-group').removeClass('clicktopay-card-body-refund-input-group-error');
        initiateRefundButton.attr("disabled", false);
    };

    getRefundAmountInCents = () => parseFloat($('input[name="clicktopay-refund-amount"]').val()).toFixed(2) * 100;
    isPartialRefund = () => $('input[type=radio][name="clicktopay-refund"]:checked').val() !== 'full';

    window.addEventListener('message', function(messageEvent) {
        // Check if origin is proper
        if (messageEvent.origin !== clicktopay.eventOrigin) {
            return;
        }

        if (messageEvent.data.page !== 'refund' || messageEvent.data.action !== "data") {
            return
        }

        if (messageEvent.data.payload.success) {
            refundOrder(messageEvent.data.payload);
            return;
        }

        $.growl.error({ message: clicktopay.errors.somethingWentWrong, position: 'top-right', size: 'medium', duration: 10000 });
    })
});

const refundOrder = (data) => {
    $.ajax({
        type: 'POST',
        url: clicktopay.orderUrl,
        data: {
            ajax: true,
            action: 'refund',
            orderId: clicktopay.orderId,
            amount: data.transactionAmount,
            merchantReferenceId: data.merchantReferenceId,
            gatewayTransactionId: data.gatewayTransactionId,
            refundTransactionToken: data.refundTransactionToken
        }
    }).then(response => {
        var data = JSON.parse(response);

        if (data.success) {
            location.reload();
        }
    });
};
/*NOTE : Create only if refund is partial */
const createRefundTransactionRequest = (refundAmountInCents) => {
    return {
        transactionAmount: refundAmountInCents.toString(),
        transactionCurrency: clicktopay.transactionCurrency,
    };
};
