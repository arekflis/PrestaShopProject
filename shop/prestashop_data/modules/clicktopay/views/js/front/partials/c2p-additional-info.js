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

const updatePhoneElement = (selector) => {
    if (!document.querySelector(selector)) {
        return;
    }

    const phoneElement = document.querySelector(selector);

    if (document.querySelector('#thecheckout-address-delivery')) {
        if (!$(phoneElement).parents('label').find('.c2p-comment').length) {
            $(phoneElement).parents('label').append(clicktopay.click2payAdditionalPhoneInfoTemplate);
        }
    } else {
        phoneElement.insertAdjacentHTML('afterend', clicktopay.click2payAdditionalPhoneInfoTemplate);
    }

    // NOTE: one page checkout already has mobile phone label.
    if (phoneElement.id !== 'delivery_phone_mobile') {
        if (document.querySelector(`label[for="${phoneElement.id}"]`)) {
            document.querySelector(`label[for="${phoneElement.id}"]`).textContent = clicktopay.newPhoneLabelValue;
        }
    }
}

const getPhoneElement = () => {
    // Check if both phone and mobile phone fields are present
    if (document.querySelector('.js-address-form input[name=phone]') && document.querySelector('.js-address-form input[name=phone_mobile]')) {
        return document.querySelector('.js-address-form input[name=phone_mobile]');
    }
    // Check if only phone field is present
    else if (document.querySelector('.js-address-form input[name=phone]')) {
        return  document.querySelector('.js-address-form input[name=phone]');
    }
    // Check if only mobile phone field is present
    else if (document.querySelector('.js-address-form input[name=phone_mobile]')) {
        return  document.querySelector('.js-address-form input[name=phone_mobile]');
    }

    return null;
};

const getPhoneQuerySelectors = () => {
    let phoneElementName = getPhoneElement() ? getPhoneElement().getAttribute('name') : 'phone';

    return [
        `#checkout #checkout-addresses-step [name="${phoneElementName}"]`,
        '#checkout [name="delivery_phone_mobile"]',
        '#checkout #thecheckout-address-delivery [name="phone"]'
    ];
};

document.addEventListener('DOMContentLoaded', function () {
    const emailQuerySelectors = [
        '#checkout form[id="form_customer"] input[id="customer_email"]',
        '#checkout form[id="customer-form"] input[name="email"]',
        '#checkout #thecheckout-account input[name="email"]'
    ];

    emailQuerySelectors.forEach((selector) => {
        if (document.querySelector(selector)) {
            document.querySelector(selector).insertAdjacentHTML('afterend', clicktopay.click2payAdditionalMailInfoTemplate);
        }
    });

    getPhoneQuerySelectors().forEach((selector) => {
        updatePhoneElement(selector);
    })

    $(document).on('thecheckout_Address_Modified', function () {
        getPhoneQuerySelectors().forEach((selector) => {
            updatePhoneElement(selector);
        })
    });

    if (typeof prestashop !== 'undefined') {
        prestashop.on(
            'updatedAddressForm', () => {
                getPhoneQuerySelectors().forEach((selector) => {
                    updatePhoneElement(selector);
                })
            }
        );
    }
});