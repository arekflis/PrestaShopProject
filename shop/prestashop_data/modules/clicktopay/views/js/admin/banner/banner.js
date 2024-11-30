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
    $('.clicktopay-button-primary').on('click', function (event) {
        event.preventDefault();

        $('.clicktopay-button-primary').attr('disabled', 'disabled');

        $.ajax({
            type: 'POST',
            url: clicktopay.set_default_url,
            data: {
                ajax: true,
                action: 'SetDefault',
            }
        })
            .then(response => jQuery.parseJSON(response))
            .then(response => {
                $('.clicktopay-banner-success').removeClass('ctp-d-none')
                $('.clicktopay-banner-alert').addClass('ctp-d-none')
            })
            .then(() => window.location.reload())
    });

    $('.clicktopay-button-secondary').on('click', function (event) {
        event.preventDefault();

        $('.clicktopay-button-secondary').attr('disabled', 'disabled');

        $.ajax({
            type: 'POST',
            url: clicktopay.dismiss_url,
            data: {
                ajax: true,
                action: 'Dismiss',
            }
        })
            .then(response => jQuery.parseJSON(response))
            .then(response => {
                $('.clicktopay-banner-alert').addClass('ctp-d-none');
            })
    });
})