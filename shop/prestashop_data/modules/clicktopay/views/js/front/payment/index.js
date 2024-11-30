var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const intlTelInput$3 = "";
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
const delay = (delay2) => new Promise((resolve) => setTimeout(resolve, delay2));
const isVisible = (element) => {
  return !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};
const isEmail = (value) => {
  const regexExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexExp.test(value);
};
const isPaymentStep = () => {
  return !!document.getElementById("checkout") || !!document.getElementById("module-thecheckout-order");
};
const toggleLoader = async (on) => {
  return new Promise(async (resolve) => {
    const intervalId = setInterval(async () => {
      if (document.getElementById("clicktopay-card-loading")) {
        clearInterval(intervalId);
        resolve();
      }
    }, 10);
  }).then((response) => {
    document.getElementById("clicktopay-card-loading").classList.toggle("active", on);
  });
};
const disablePaymentOption = () => {
  if (!clicktopay.isOnePageCheckout) {
    document.getElementById("js-clicktopay-payment-form").classList.add("ps-hidden");
  }
  new Promise(async (resolve) => {
    const intervalId = setInterval(async () => {
      if (document.querySelector('input[data-module-name="clicktopay"]')) {
        clearInterval(intervalId);
        resolve();
      }
    }, 10);
  }).then((response) => {
    $('input[name="payment-option"]').on("change", async function(event) {
      if (clicktopay.name === this.dataset.moduleName) {
        if (document.querySelector('input[data-module-name="clicktopay"]').disabled) {
          event.stopImmediatePropagation();
          const paymentOptions2 = [...document.querySelectorAll(".payment-option")].filter((option) => !option.classList.contains("mc-disabled-payment-option"));
          if (paymentOptions2.length > 0) {
            paymentOptions2[0].querySelector('input[type="radio"]').click();
          }
        }
      }
    });
    document.querySelector('input[data-module-name="clicktopay"]').checked = false;
    document.querySelector('input[data-module-name="clicktopay"]').disabled = true;
    document.querySelector('input[data-module-name="clicktopay"]').closest(".payment-option").classList.add("mc-disabled-payment-option");
    const paymentOptions = [...document.querySelectorAll(".payment-option")].filter((option) => !option.classList.contains("mc-disabled-payment-option"));
    if (paymentOptions.length > 0) {
      paymentOptions[0].querySelector('input[type="radio"]').click();
    }
  });
};
const displayError = (title, message, btn, callback) => {
  document.getElementById("clicktopay-error-title").innerHTML = title;
  document.getElementById("clicktopay-error-body").innerHTML = message;
  document.getElementById("clicktopay-error-btn").innerHTML = btn;
  document.getElementById("clicktopay-error-btn").addEventListener("click", callback);
  $("#clicktopay-error-modal").modal({
    backdrop: "static",
    //Not clickable outside to dismiss modal
    keyboard: false,
    //Not clickable outside to dismiss modal
    show: true
  });
};
const utils = { delay, isVisible, isEmail, isPaymentStep, toggleLoader, disablePaymentOption, displayError };
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
const set = (key, value, seconds = 3600) => {
  const currentDate = /* @__PURE__ */ new Date();
  const expires = new Date(currentDate.getTime() + seconds * 1e3);
  const data = {
    expiresAt: expires,
    [key]: value
  };
  sessionStorage.setItem(key, JSON.stringify(data));
};
const get = (key) => {
  const currentDate = /* @__PURE__ */ new Date();
  if (!has(key)) {
    return null;
  }
  const data = JSON.parse(sessionStorage.getItem(key));
  const expirationDate = data.expiresAt;
  if (Date.parse(currentDate) < Date.parse(expirationDate)) {
    return data[key];
  } else {
    sessionStorage.removeItem(key);
    console.log(key, "session expired");
    return null;
  }
};
const remove = (key) => {
  sessionStorage.removeItem(key);
};
const has = (key) => {
  if (!sessionStorage.getItem(key)) {
    return false;
  }
  const data = JSON.parse(sessionStorage.getItem(key));
  return data[key];
};
const session = { set, get, has, remove };
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
const Focus = {
  First: "First",
  Last: "Last",
  Previous: "Previous",
  Next: "Next"
};
const create$2 = (dropdown, button, value) => {
  const options = Array.from(dropdown.children);
  const onButtonClick = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    dropdown.getAttribute("data-state") === "open" ? close() : open();
  };
  const onButtonKeyDown = (event) => {
    switch (event.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        open();
        goToOption(Focus.First);
        break;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        open();
        goToOption(Focus.Last);
        break;
    }
  };
  const onDropdownKeydown = (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        event.stopPropagation();
        return goToOption(Focus.Next);
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        event.stopPropagation();
        return goToOption(Focus.Previous);
      case "Home":
      case "PageUp":
        event.preventDefault();
        event.stopPropagation();
        return goToOption(Focus.First);
      case "End":
      case "PageDown":
        event.preventDefault();
        event.stopPropagation();
        return goToOption(Focus.Last);
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close();
        break;
      case "Tab":
        break;
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        close();
        change(selected);
        break;
    }
  };
  const onClickOutsideDropdown = (event) => {
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      close();
    }
  };
  button.removeEventListener("click", onButtonClick);
  button.addEventListener("click", onButtonClick);
  button.removeEventListener("keydown", onButtonKeyDown);
  button.addEventListener("keydown", onButtonKeyDown);
  dropdown.removeEventListener("keydown", onDropdownKeydown);
  dropdown.addEventListener("keydown", onDropdownKeydown);
  document.removeEventListener("click", onClickOutsideDropdown);
  document.addEventListener("click", onClickOutsideDropdown);
  const calculateActiveIndex = (focus) => {
    let currentActiveIndex = dropdown.getAttribute("activedescendant");
    let activeIndex = currentActiveIndex ?? -1;
    let nextActiveIndex = ((focus2) => {
      switch (focus2) {
        case Focus.First: {
          return options.findIndex((item) => !item.getAttribute("data-disabled"));
        }
        case Focus.Previous: {
          let idx = options.slice().reverse().findIndex((item, idx2, all) => {
            if (activeIndex !== -1 && all.length - idx2 - 1 >= activeIndex)
              return false;
            return !item.getAttribute("data-disabled");
          });
          if (idx === -1)
            return idx;
          return options.length - 1 - idx;
        }
        case Focus.Next: {
          return options.findIndex((item, idx) => {
            if (idx <= activeIndex)
              return false;
            return !item.getAttribute("data-disabled");
          });
        }
        case Focus.Last: {
          let idx = options.slice().reverse().findIndex((item) => !item.getAttribute("data-disabled"));
          if (idx === -1)
            return idx;
          return options.length - 1 - idx;
        }
      }
    })(focus);
    return nextActiveIndex === -1 ? currentActiveIndex : nextActiveIndex;
  };
  const goToOption = (focus) => {
    hover(calculateActiveIndex(focus));
  };
  const hover = (index) => {
    dropdown.setAttribute("activedescendant", index);
    options.forEach((item, i) => {
      var _a;
      const currentState2 = item.getAttribute("data-state") || "";
      if (i === parseInt(index)) {
        const nextState = currentState2 + (!currentState2.includes("active") ? " active" : "");
        item.setAttribute("data-state", nextState.trim());
        item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      } else {
        item.setAttribute("data-state", ((_a = item.getAttribute("data-state")) == null ? void 0 : _a.replace("active", "")) ?? "");
      }
    });
  };
  const close = () => {
    dropdown.setAttribute("data-state", "");
  };
  const open = () => {
    dropdown.setAttribute("data-state", "open");
  };
  const change = (index) => {
    options.forEach((item, i) => {
      var _a;
      if (i === parseInt(index)) {
        const currentState2 = item.getAttribute("data-state") || "";
        const nextState = currentState2 + (!currentState2.includes("selected") ? " selected" : "");
        item.setAttribute("data-state", nextState.trim());
      } else {
        item.setAttribute("data-state", ((_a = item.getAttribute("data-state")) == null ? void 0 : _a.replace("selected", "")) ?? "");
      }
    });
    close();
  };
  options.forEach((option, index) => {
    if (!option.getAttribute("data-disabled")) {
      option.addEventListener("mouseover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        hover(index);
      });
      option.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        change(index);
      });
    }
  });
  change(value);
};
const listBox = { create: create$2 };
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
const dropdownContent = document.getElementById("card-list-dropdown-content");
const dropdownButton = document.getElementById("card-list-dropdown-button");
const create$1 = (cards, selectedCard = null) => {
  Array.from(dropdownContent.children).forEach((item) => {
    if (item.getAttribute("data-id")) {
      item.remove();
    }
  });
  cards = getSortedCards(cards);
  populateDropdown(dropdownContent, cards);
  if (cards.length === 1) {
    dropdownButton.style.pointerEvents = "none";
    document.getElementById("arrow").style.display = "none";
  } else if (cards.length > 1) {
    dropdownButton.style.pointerEvents = "all";
    document.getElementById("arrow").style.display = "inline-block";
  }
  const index = cards.findIndex((card, index2) => card.srcDigitalCardId === getSelectedCardId(cards, selectedCard));
  const dropdownContentObserver = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== "attributes" || mutation.attributeName !== "data-state") {
        return;
      }
      if (mutation.target.getAttribute("data-state").trim() === "open") {
        dropdownButton.querySelector(".card-list-dropdown-button-empty-card").classList.remove("d-hidden");
        dropdownButton.querySelector(".card-list-dropdown-button-full-card").classList.add("d-hidden");
        dropdownContent.style.width = dropdownButton.offsetWidth + "px";
        dropdownContent.classList.add("show");
        setTimeout(function() {
          dropdownContent.focus();
        }, 20);
      } else {
        dropdownButton.querySelector(".card-list-dropdown-button-empty-card").classList.add("d-hidden");
        dropdownButton.querySelector(".card-list-dropdown-button-full-card").classList.remove("d-hidden");
        dropdownContent.classList.remove("show");
      }
    }
  });
  const dropdownItemObserver = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== "attributes" || mutation.attributeName !== "data-state") {
        return;
      }
      if (mutation.target.getAttribute("data-state").includes("selected")) {
        mutation.target.querySelector(".card-list-dropdown-content-card-option-selected").classList.remove("d-hidden");
        mutation.target.classList.add("selected");
        dropdownButton.querySelector(".card-list-dropdown-button-full-card-option-img").src = mutation.target.querySelector(".card-list-dropdown-content-card-option-img").src;
        dropdownButton.querySelector(".card-list-dropdown-button-full-card-option-information-bank-card").innerHTML = mutation.target.querySelector(".card-list-dropdown-content-card-option-information-bank-card").innerHTML;
        dropdownButton.querySelector(".card-list-dropdown-button-full-card-option-information-card").innerHTML = mutation.target.querySelector(".card-list-dropdown-content-card-option-information-card").innerHTML;
        dropdownButton.querySelector(".card-list-dropdown-button-full-card-option-information-number").innerHTML = mutation.target.querySelector(".card-list-dropdown-content-card-option-information-number").innerHTML;
      } else {
        mutation.target.querySelector(".card-list-dropdown-content-card-option-selected").classList.add("d-hidden");
        mutation.target.classList.remove("selected");
      }
      if (mutation.target.getAttribute("data-state").includes("active")) {
        mutation.target.classList.add("hovered");
      } else {
        mutation.target.classList.remove("hovered");
      }
    }
  });
  dropdownContentObserver.observe(dropdownContent, { attributes: true, attributeFilter: ["data-state"], subtree: false });
  Array.from(dropdownContent.children).forEach((target) => {
    dropdownItemObserver.observe(target, { attributes: true, attributeFilter: ["data-state"], subtree: false });
  });
  listBox.create(dropdownContent, dropdownButton, index + 1);
};
const getSortedCards = (cards) => {
  cards.map((card) => {
    if (card.panExpirationMonth && card.panExpirationYear) {
      const expirationMonth = parseInt(card.panExpirationMonth, 10);
      const expirationYear = parseInt(card.panExpirationYear, 10);
      const expirationDate = new Date(expirationYear, expirationMonth, 1);
      const currentDate = /* @__PURE__ */ new Date();
      if (expirationDate < currentDate) {
        card.digitalCardData.status = "EXPIRED";
      }
    }
    return card;
  });
  const activeCards = cards.filter((card) => ["ACTIVE"].includes(card.digitalCardData.status));
  const disabledCards = cards.filter((card) => ["DISABLED"].includes(card.digitalCardData.status));
  const suspendedCards = cards.filter((card) => ["SUSPENDED"].includes(card.digitalCardData.status));
  const canceledCards = cards.filter((card) => ["CANCELED"].includes(card.digitalCardData.status));
  const expiredCards = cards.filter((card) => ["EXPIRED"].includes(card.digitalCardData.status));
  cards = activeCards.concat(disabledCards, suspendedCards, canceledCards, expiredCards);
  return cards;
};
const getSelectedCardId = (cards, selectedCardId) => {
  let selectedCard = cards.find((card) => card.srcDigitalCardId === selectedCardId);
  if (!selectedCard) {
    const activeCards = cards.filter((card) => ["ACTIVE", "SUSPENDED"].includes(card.digitalCardData.status));
    selectedCard = activeCards.length > 0 ? activeCards[0] : null;
  }
  return selectedCard == null ? void 0 : selectedCard.srcDigitalCardId;
};
const populateDropdown = (dropdownContent2, cards) => {
  cards.forEach((card, index) => {
    const fullBankCardName = card.digitalCardData.descriptorName;
    const cardName = card.paymentCardDescriptor;
    let listItem = createListItem(
      index,
      card.srcDigitalCardId,
      card.digitalCardData.artUri,
      fullBankCardName,
      cardName.charAt(0).toUpperCase() + cardName.slice(1),
      " •••• " + card.panLastFour,
      card.digitalCardData.status
    );
    dropdownContent2.appendChild(listItem);
  });
};
const createListItem = (index, id, imageSrc, fullBankCardName, cardName, cardNumber, status) => {
  const templateListItem = document.getElementById("card-list-initial-option");
  const listItem = templateListItem.cloneNode(true);
  listItem.id = "list-option-" + index;
  listItem.removeAttribute("data-disabled");
  listItem.setAttribute("data-id", id);
  listItem.classList.remove("d-hidden");
  switch (status) {
    case "SUSPENDED":
      listItem.querySelector(".card-list-dropdown-content-card-option-suspended").classList.remove("d-hidden");
      listItem.querySelector(".card-list-dropdown-content-card-option-information").classList.add("line-through");
      listItem.classList.add("disabled");
      listItem.setAttribute("data-disabled", "true");
      break;
    case "CANCELED":
      listItem.querySelector(".card-list-dropdown-content-card-option-canceled").classList.remove("d-hidden");
      listItem.querySelector(".card-list-dropdown-content-card-option-information").classList.add("line-through");
      listItem.classList.add("disabled");
      listItem.setAttribute("data-disabled", "true");
      break;
    case "DISABLED":
      listItem.querySelector(".card-list-dropdown-content-card-option-information").classList.add("line-through");
      listItem.querySelector(".card-list-dropdown-content-card-option-disabled").classList.remove("d-hidden");
      listItem.classList.add("disabled");
      listItem.setAttribute("data-disabled", "true");
      break;
    case "EXPIRED":
      listItem.querySelector(".card-list-dropdown-content-card-option-information").classList.add("line-through");
      listItem.querySelector(".card-list-dropdown-content-card-option-expired").classList.remove("d-hidden");
      listItem.classList.add("disabled");
      listItem.setAttribute("data-disabled", "true");
      break;
  }
  listItem.querySelector(".card-list-dropdown-content-card-option-img").src = imageSrc;
  listItem.querySelector(".card-list-dropdown-content-card-option-information-bank-card").textContent = fullBankCardName;
  listItem.querySelector(".card-list-dropdown-content-card-option-information-card").textContent = cardName;
  listItem.querySelector(".card-list-dropdown-content-card-option-information-number").textContent = cardNumber;
  listItem.querySelector(".card-list-dropdown-content-card-option-information-bank-card").classList.remove("d-hidden");
  listItem.querySelector(".card-list-dropdown-content-card-option-information-card").classList.remove("d-hidden");
  listItem.querySelector(".card-list-dropdown-content-card-option-information-number").classList.remove("d-hidden");
  return listItem;
};
const cardList = { create: create$1 };
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
class ClickToPaySDK {
  canInitialize() {
    return typeof window.initializeCTPSDK === "function";
  }
  async initialize(merchantReferenceId, jwtToken, env, locale, consumerCountryCode) {
    return await this.request(async () => window.initializeCTPSDK(merchantReferenceId, jwtToken, env, locale, consumerCountryCode));
  }
  async getNonce(jwtToken) {
    return await this.request(async () => await window.getNonce(jwtToken));
  }
  async getCards() {
    return await this.request(async () => await window.getCardsFromTrustedDevice());
  }
  async clearCardForm() {
    return await this.request(async () => await window.clearCardForm());
  }
  async createCardEntryForm() {
    return await this.request(async () => await window.createCardEntryForm());
  }
  async signOut() {
    return await this.request(async () => await window.signOut());
  }
  async idLookupWithEmail(email) {
    return await this.request(async () => await window.idLookupWithEmail(email));
  }
  async idLookupWithPhoneNumber(phoneCode, phone) {
    return await this.request(async () => await window.idLookupWithPhoneNumber(phoneCode, phone));
  }
  async initiateValidationForOTP(channel, isSrcUi, config) {
    return await this.request(async () => await window.initiateValidationForOTP(channel, isSrcUi, config));
  }
  async payWithCard(signedData, transactionAmount, srcDigitalCardId, windowRef, is_cvv, consumerInfo, dpaTransactionOptions, customFields) {
    return await this.request(async () => await window.payWithCard(signedData, transactionAmount, srcDigitalCardId, windowRef, is_cvv, consumerInfo, dpaTransactionOptions, customFields));
  }
  async payWithNewCard(signedData, transactionAmount, windowRef, is_cvv, consumerInfo, dpaTransactionOptions, customFields) {
    return await this.request(async () => await window.payWithNewCard(signedData, transactionAmount, windowRef, is_cvv, consumerInfo, dpaTransactionOptions, customFields));
  }
  async request(method, retried = false) {
    if (navigator.onLine) {
      return method();
    } else if (!retried) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const response = await this.request(method, true);
            resolve(response);
          } catch (error) {
            resolve(error);
          }
        }, 1e3);
      });
    } else {
      console.error("Internet connection lost.");
      utils.displayError(
        clicktopay.errors.internetConnectionLost.title,
        clicktopay.errors.internetConnectionLost.message,
        clicktopay.errors.internetConnectionLost.btn,
        () => {
          location.reload();
        }
      );
    }
  }
}
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
const FormStates = {
  None: "None",
  CardList: "CardList",
  CardForm: "CardForm",
  IdLookupForm: "IdLookupForm",
  OtpForm: "OtpForm"
};
let currentState = null;
const sdk$1 = new ClickToPaySDK();
const states = {
  [FormStates.IdLookupForm]: {
    onEnter: async function(data) {
      document.getElementById("clicktopay-id-lookup-form").classList.add("active");
    },
    onExit: async function(data) {
      document.getElementById("clicktopay-id-lookup-form").classList.remove("active");
      document.querySelector(".id-lookup-form-group").classList.remove("error");
      document.getElementsByName("id-lookup-input")[0].value = "";
    }
  },
  [FormStates.CardForm]: {
    onEnter: async function(data) {
      document.getElementById("clicktopay-card-input-form").classList.add("active");
      if (document.querySelector('[data-module-name*="clicktopay"]:checked') && document.getElementById("mc_isv_payment_form").childNodes.length === 0) {
        await sdk$1.createCardEntryForm();
      }
      const hasCards = data.cards && data.cards.length > 0;
      if (hasCards) {
        document.getElementById("card-input-access-your-saved-cards-button").classList.remove("d-hidden");
        document.getElementById("card-input-access-your-cards-button").classList.add("d-hidden");
      } else {
        document.getElementById("card-input-access-your-cards-button").classList.remove("d-hidden");
        document.getElementById("card-input-access-your-saved-cards-button").classList.add("d-hidden");
      }
      document.getElementById("card-input-access-your-cards-step").classList.remove("ps-hidden");
    },
    onExit: async function(data) {
      document.getElementById("clicktopay-card-input-form").classList.remove("active");
      document.getElementById("mc_isv_payment_form").innerHTML = "";
      await sdk$1.clearCardForm();
    }
  },
  [FormStates.OtpForm]: {
    onEnter: async function(data) {
      await utils.toggleLoader(true);
      window.allow_otp = true;
      if (!document.querySelector('[data-module-name*="clicktopay"]:checked')) {
        return;
      }
      const response = await sdk$1.initiateValidationForOTP("", true, data.otpConfig);
      setTimeout(async () => {
        await utils.toggleLoader(false);
        document.getElementById("otp-form").classList.add("active");
      }, 1e3);
      if (response && response.Errors) {
        utils.displayError(
          clicktopay.errors.somethingWentWrong.title,
          clicktopay.errors.somethingWentWrong.message,
          clicktopay.errors.somethingWentWrong.btn
        );
        if (clicktopay.isFallbackPage) {
          window.location.href = clicktopay.orderRedirectUrl;
        } else {
          utils.disablePaymentOption();
        }
        return;
      }
      document.querySelector("src-otp-input").setAttribute("display-cancel-option", "false");
      document.querySelector("src-otp-input").setAttribute("auto-submit", "false");
    },
    onExit: async function(data) {
      document.getElementById("otp-form").classList.remove("active");
    }
  },
  [FormStates.CardList]: {
    onEnter: async function(data) {
      var _a;
      document.getElementById("clicktopay-card-list").classList.add("active");
      if (data.cards.length > 1) {
        document.getElementById("card-list-not-you-button").innerHTML = clicktopay.translations.notYourCards;
      }
      if (data.cards.length === 1) {
        document.getElementById("card-list-not-you-button").innerHTML = clicktopay.translations.notYourCard;
      }
      document.querySelector(".card-list-not-you-button-container").classList.remove("d-hidden");
      if (!parseInt(document.getElementById("card-list-dropdown").getAttribute("data-initialized"))) {
        await cardList.create(data.cards);
      }
      if (!session.get("customer-entered-address-manually")) {
        (_a = document.getElementById("clicktopay-card-list-shipping-address")) == null ? void 0 : _a.classList.remove("ps-hidden");
      }
    },
    onExit: async function(data) {
      document.getElementById("clicktopay-card-list").classList.remove("active");
      document.querySelector(".card-list-not-you-button-container").classList.add("d-hidden");
      document.getElementById("card-list-not-you-button").innerHTML = "";
    }
  }
};
const setState = async (stateName, data) => {
  if (currentState && states[currentState]) {
    await utils.toggleLoader(true);
    await states[currentState].onExit(data[currentState]);
  }
  currentState = stateName;
  if (states[currentState]) {
    await utils.toggleLoader(false);
    await states[currentState].onEnter(data[currentState]);
  }
};
const getState = () => currentState;
const stateMachine = { setState, getState };
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var intlTelInput$2 = { exports: {} };
(function(module) {
  (function(factory) {
    if (module.exports)
      module.exports = factory();
    else
      window.intlTelInput = factory();
  })(function(undefined$1) {
    return function() {
      var allCountries = [["Afghanistan (‫افغانستان‬‎)", "af", "93"], ["Albania (Shqipëri)", "al", "355"], ["Algeria (‫الجزائر‬‎)", "dz", "213"], ["American Samoa", "as", "1", 5, ["684"]], ["Andorra", "ad", "376"], ["Angola", "ao", "244"], ["Anguilla", "ai", "1", 6, ["264"]], ["Antigua and Barbuda", "ag", "1", 7, ["268"]], ["Argentina", "ar", "54"], ["Armenia (Հայաստան)", "am", "374"], ["Aruba", "aw", "297"], ["Ascension Island", "ac", "247"], ["Australia", "au", "61", 0], ["Austria (Österreich)", "at", "43"], ["Azerbaijan (Azərbaycan)", "az", "994"], ["Bahamas", "bs", "1", 8, ["242"]], ["Bahrain (‫البحرين‬‎)", "bh", "973"], ["Bangladesh (বাংলাদেশ)", "bd", "880"], ["Barbados", "bb", "1", 9, ["246"]], ["Belarus (Беларусь)", "by", "375"], ["Belgium (België)", "be", "32"], ["Belize", "bz", "501"], ["Benin (Bénin)", "bj", "229"], ["Bermuda", "bm", "1", 10, ["441"]], ["Bhutan (འབྲུག)", "bt", "975"], ["Bolivia", "bo", "591"], ["Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387"], ["Botswana", "bw", "267"], ["Brazil (Brasil)", "br", "55"], ["British Indian Ocean Territory", "io", "246"], ["British Virgin Islands", "vg", "1", 11, ["284"]], ["Brunei", "bn", "673"], ["Bulgaria (България)", "bg", "359"], ["Burkina Faso", "bf", "226"], ["Burundi (Uburundi)", "bi", "257"], ["Cambodia (កម្ពុជា)", "kh", "855"], ["Cameroon (Cameroun)", "cm", "237"], ["Canada", "ca", "1", 1, ["204", "226", "236", "249", "250", "263", "289", "306", "343", "354", "365", "367", "368", "382", "387", "403", "416", "418", "428", "431", "437", "438", "450", "584", "468", "474", "506", "514", "519", "548", "579", "581", "584", "587", "604", "613", "639", "647", "672", "683", "705", "709", "742", "753", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]], ["Cape Verde (Kabu Verdi)", "cv", "238"], ["Caribbean Netherlands", "bq", "599", 1, ["3", "4", "7"]], ["Cayman Islands", "ky", "1", 12, ["345"]], ["Central African Republic (République centrafricaine)", "cf", "236"], ["Chad (Tchad)", "td", "235"], ["Chile", "cl", "56"], ["China (中国)", "cn", "86"], ["Christmas Island", "cx", "61", 2, ["89164"]], ["Cocos (Keeling) Islands", "cc", "61", 1, ["89162"]], ["Colombia", "co", "57"], ["Comoros (‫جزر القمر‬‎)", "km", "269"], ["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243"], ["Congo (Republic) (Congo-Brazzaville)", "cg", "242"], ["Cook Islands", "ck", "682"], ["Costa Rica", "cr", "506"], ["Côte d’Ivoire", "ci", "225"], ["Croatia (Hrvatska)", "hr", "385"], ["Cuba", "cu", "53"], ["Curaçao", "cw", "599", 0], ["Cyprus (Κύπρος)", "cy", "357"], ["Czech Republic (Česká republika)", "cz", "420"], ["Denmark (Danmark)", "dk", "45"], ["Djibouti", "dj", "253"], ["Dominica", "dm", "1", 13, ["767"]], ["Dominican Republic (República Dominicana)", "do", "1", 2, ["809", "829", "849"]], ["Ecuador", "ec", "593"], ["Egypt (‫مصر‬‎)", "eg", "20"], ["El Salvador", "sv", "503"], ["Equatorial Guinea (Guinea Ecuatorial)", "gq", "240"], ["Eritrea", "er", "291"], ["Estonia (Eesti)", "ee", "372"], ["Eswatini", "sz", "268"], ["Ethiopia", "et", "251"], ["Falkland Islands (Islas Malvinas)", "fk", "500"], ["Faroe Islands (Føroyar)", "fo", "298"], ["Fiji", "fj", "679"], ["Finland (Suomi)", "fi", "358", 0], ["France", "fr", "33"], ["French Guiana (Guyane française)", "gf", "594"], ["French Polynesia (Polynésie française)", "pf", "689"], ["Gabon", "ga", "241"], ["Gambia", "gm", "220"], ["Georgia (საქართველო)", "ge", "995"], ["Germany (Deutschland)", "de", "49"], ["Ghana (Gaana)", "gh", "233"], ["Gibraltar", "gi", "350"], ["Greece (Ελλάδα)", "gr", "30"], ["Greenland (Kalaallit Nunaat)", "gl", "299"], ["Grenada", "gd", "1", 14, ["473"]], ["Guadeloupe", "gp", "590", 0], ["Guam", "gu", "1", 15, ["671"]], ["Guatemala", "gt", "502"], ["Guernsey", "gg", "44", 1, ["1481", "7781", "7839", "7911"]], ["Guinea (Guinée)", "gn", "224"], ["Guinea-Bissau (Guiné Bissau)", "gw", "245"], ["Guyana", "gy", "592"], ["Haiti", "ht", "509"], ["Honduras", "hn", "504"], ["Hong Kong (香港)", "hk", "852"], ["Hungary (Magyarország)", "hu", "36"], ["Iceland (Ísland)", "is", "354"], ["India (भारत)", "in", "91"], ["Indonesia", "id", "62"], ["Iran (‫ایران‬‎)", "ir", "98"], ["Iraq (‫العراق‬‎)", "iq", "964"], ["Ireland", "ie", "353"], ["Isle of Man", "im", "44", 2, ["1624", "74576", "7524", "7924", "7624"]], ["Israel (‫ישראל‬‎)", "il", "972"], ["Italy (Italia)", "it", "39", 0], ["Jamaica", "jm", "1", 4, ["876", "658"]], ["Japan (日本)", "jp", "81"], ["Jersey", "je", "44", 3, ["1534", "7509", "7700", "7797", "7829", "7937"]], ["Jordan (‫الأردن‬‎)", "jo", "962"], ["Kazakhstan (Казахстан)", "kz", "7", 1, ["33", "7"]], ["Kenya", "ke", "254"], ["Kiribati", "ki", "686"], ["Kosovo", "xk", "383"], ["Kuwait (‫الكويت‬‎)", "kw", "965"], ["Kyrgyzstan (Кыргызстан)", "kg", "996"], ["Laos (ລາວ)", "la", "856"], ["Latvia (Latvija)", "lv", "371"], ["Lebanon (‫لبنان‬‎)", "lb", "961"], ["Lesotho", "ls", "266"], ["Liberia", "lr", "231"], ["Libya (‫ليبيا‬‎)", "ly", "218"], ["Liechtenstein", "li", "423"], ["Lithuania (Lietuva)", "lt", "370"], ["Luxembourg", "lu", "352"], ["Macau (澳門)", "mo", "853"], ["Madagascar (Madagasikara)", "mg", "261"], ["Malawi", "mw", "265"], ["Malaysia", "my", "60"], ["Maldives", "mv", "960"], ["Mali", "ml", "223"], ["Malta", "mt", "356"], ["Marshall Islands", "mh", "692"], ["Martinique", "mq", "596"], ["Mauritania (‫موريتانيا‬‎)", "mr", "222"], ["Mauritius (Moris)", "mu", "230"], ["Mayotte", "yt", "262", 1, ["269", "639"]], ["Mexico (México)", "mx", "52"], ["Micronesia", "fm", "691"], ["Moldova (Republica Moldova)", "md", "373"], ["Monaco", "mc", "377"], ["Mongolia (Монгол)", "mn", "976"], ["Montenegro (Crna Gora)", "me", "382"], ["Montserrat", "ms", "1", 16, ["664"]], ["Morocco (‫المغرب‬‎)", "ma", "212", 0], ["Mozambique (Moçambique)", "mz", "258"], ["Myanmar (Burma) (မြန်မာ)", "mm", "95"], ["Namibia (Namibië)", "na", "264"], ["Nauru", "nr", "674"], ["Nepal (नेपाल)", "np", "977"], ["Netherlands (Nederland)", "nl", "31"], ["New Caledonia (Nouvelle-Calédonie)", "nc", "687"], ["New Zealand", "nz", "64"], ["Nicaragua", "ni", "505"], ["Niger (Nijar)", "ne", "227"], ["Nigeria", "ng", "234"], ["Niue", "nu", "683"], ["Norfolk Island", "nf", "672"], ["North Korea (조선 민주주의 인민 공화국)", "kp", "850"], ["North Macedonia (Северна Македонија)", "mk", "389"], ["Northern Mariana Islands", "mp", "1", 17, ["670"]], ["Norway (Norge)", "no", "47", 0], ["Oman (‫عُمان‬‎)", "om", "968"], ["Pakistan (‫پاکستان‬‎)", "pk", "92"], ["Palau", "pw", "680"], ["Palestine (‫فلسطين‬‎)", "ps", "970"], ["Panama (Panamá)", "pa", "507"], ["Papua New Guinea", "pg", "675"], ["Paraguay", "py", "595"], ["Peru (Perú)", "pe", "51"], ["Philippines", "ph", "63"], ["Poland (Polska)", "pl", "48"], ["Portugal", "pt", "351"], ["Puerto Rico", "pr", "1", 3, ["787", "939"]], ["Qatar (‫قطر‬‎)", "qa", "974"], ["Réunion (La Réunion)", "re", "262", 0], ["Romania (România)", "ro", "40"], ["Russia (Россия)", "ru", "7", 0], ["Rwanda", "rw", "250"], ["Saint Barthélemy", "bl", "590", 1], ["Saint Helena", "sh", "290"], ["Saint Kitts and Nevis", "kn", "1", 18, ["869"]], ["Saint Lucia", "lc", "1", 19, ["758"]], ["Saint Martin (Saint-Martin (partie française))", "mf", "590", 2], ["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508"], ["Saint Vincent and the Grenadines", "vc", "1", 20, ["784"]], ["Samoa", "ws", "685"], ["San Marino", "sm", "378"], ["São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239"], ["Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966"], ["Senegal (Sénégal)", "sn", "221"], ["Serbia (Србија)", "rs", "381"], ["Seychelles", "sc", "248"], ["Sierra Leone", "sl", "232"], ["Singapore", "sg", "65"], ["Sint Maarten", "sx", "1", 21, ["721"]], ["Slovakia (Slovensko)", "sk", "421"], ["Slovenia (Slovenija)", "si", "386"], ["Solomon Islands", "sb", "677"], ["Somalia (Soomaaliya)", "so", "252"], ["South Africa", "za", "27"], ["South Korea (대한민국)", "kr", "82"], ["South Sudan (‫جنوب السودان‬‎)", "ss", "211"], ["Spain (España)", "es", "34"], ["Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94"], ["Sudan (‫السودان‬‎)", "sd", "249"], ["Suriname", "sr", "597"], ["Svalbard and Jan Mayen", "sj", "47", 1, ["79"]], ["Sweden (Sverige)", "se", "46"], ["Switzerland (Schweiz)", "ch", "41"], ["Syria (‫سوريا‬‎)", "sy", "963"], ["Taiwan (台灣)", "tw", "886"], ["Tajikistan", "tj", "992"], ["Tanzania", "tz", "255"], ["Thailand (ไทย)", "th", "66"], ["Timor-Leste", "tl", "670"], ["Togo", "tg", "228"], ["Tokelau", "tk", "690"], ["Tonga", "to", "676"], ["Trinidad and Tobago", "tt", "1", 22, ["868"]], ["Tunisia (‫تونس‬‎)", "tn", "216"], ["Turkey (Türkiye)", "tr", "90"], ["Turkmenistan", "tm", "993"], ["Turks and Caicos Islands", "tc", "1", 23, ["649"]], ["Tuvalu", "tv", "688"], ["U.S. Virgin Islands", "vi", "1", 24, ["340"]], ["Uganda", "ug", "256"], ["Ukraine (Україна)", "ua", "380"], ["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971"], ["United Kingdom", "gb", "44", 0], ["United States", "us", "1", 0], ["Uruguay", "uy", "598"], ["Uzbekistan (Oʻzbekiston)", "uz", "998"], ["Vanuatu", "vu", "678"], ["Vatican City (Città del Vaticano)", "va", "39", 1, ["06698"]], ["Venezuela", "ve", "58"], ["Vietnam (Việt Nam)", "vn", "84"], ["Wallis and Futuna (Wallis-et-Futuna)", "wf", "681"], ["Western Sahara (‫الصحراء الغربية‬‎)", "eh", "212", 1, ["5288", "5289"]], ["Yemen (‫اليمن‬‎)", "ye", "967"], ["Zambia", "zm", "260"], ["Zimbabwe", "zw", "263"], ["Åland Islands", "ax", "358", 1, ["18"]]];
      for (var i = 0; i < allCountries.length; i++) {
        var c = allCountries[i];
        allCountries[i] = {
          name: c[0],
          iso2: c[1],
          dialCode: c[2],
          priority: c[3] || 0,
          areaCodes: c[4] || null
        };
      }
      function _objectSpread2(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2.push.apply(ownKeys2, Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key) {
            _defineProperty2(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty2(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _classCallCheck2(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties2(target, props) {
        for (var i2 = 0; i2 < props.length; i2++) {
          var descriptor = props[i2];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass2(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties2(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties2(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
          writable: false
        });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null)
          return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined$1) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object")
            return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      var intlTelInputGlobals = {
        getInstance: function getInstance(input) {
          var id2 = input.getAttribute("data-intl-tel-input-id");
          return window.intlTelInputGlobals.instances[id2];
        },
        instances: {},
        // using a global like this allows us to mock it in the tests
        documentReady: function documentReady() {
          return document.readyState === "complete";
        }
      };
      if (typeof window === "object") {
        window.intlTelInputGlobals = intlTelInputGlobals;
      }
      var id = 0;
      var defaults = {
        // whether or not to allow the dropdown
        allowDropdown: true,
        // auto insert dial code (A) on init, (B) on user selecting a country, (C) on calling setCountry
        // also listen for blur/submit and auto remove dial code if that's all there is
        autoInsertDialCode: false,
        // add a placeholder in the input with an example number for the selected country
        autoPlaceholder: "polite",
        // modify the parentClass
        customContainer: "",
        // modify the auto placeholder
        customPlaceholder: null,
        // append menu to specified element
        dropdownContainer: null,
        // don't display these countries
        excludeCountries: [],
        // format the input value during initialisation and on setNumber
        formatOnDisplay: true,
        // geoIp lookup function
        geoIpLookup: null,
        // inject a hidden input with this name, and on submit, populate it with the result of getNumber
        hiddenInput: "",
        // initial country
        initialCountry: "",
        // localized country names e.g. { 'de': 'Deutschland' }
        localizedCountries: null,
        // national vs international formatting for numbers e.g. placeholders and displaying existing numbers
        nationalMode: true,
        // display only these countries
        onlyCountries: [],
        // number type to use for placeholders
        placeholderNumberType: "MOBILE",
        // the countries at the top of the list. defaults to united states and united kingdom
        preferredCountries: ["us", "gb"],
        // display the country dial code next to the selected flag
        separateDialCode: false,
        // option to hide the flags - must be used with separateDialCode, or allowDropdown=false
        showFlags: true,
        // use full screen popup instead of dropdown for country list
        useFullscreenPopup: (
          // we cannot just test screen size as some smartphones/website meta tags will report desktop
          // resolutions
          // Note: to target Android Mobiles (and not Tablets), we must find 'Android' and 'Mobile'
          /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 500
        ),
        // specify the path to the libphonenumber script to enable validation/formatting
        utilsScript: ""
      };
      var regionlessNanpNumbers = ["800", "822", "833", "844", "855", "866", "877", "880", "881", "882", "883", "884", "885", "886", "887", "888", "889"];
      var forEachProp = function forEachProp2(obj, callback) {
        var keys = Object.keys(obj);
        for (var i2 = 0; i2 < keys.length; i2++) {
          callback(keys[i2], obj[keys[i2]]);
        }
      };
      var forEachInstance = function forEachInstance2(method) {
        forEachProp(window.intlTelInputGlobals.instances, function(key) {
          window.intlTelInputGlobals.instances[key][method]();
        });
      };
      var Iti = /* @__PURE__ */ function() {
        function Iti2(input, options) {
          var _this = this;
          _classCallCheck2(this, Iti2);
          this.id = id++;
          this.telInput = input;
          this.activeItem = null;
          this.highlightedItem = null;
          var customOptions = options || {};
          this.options = {};
          forEachProp(defaults, function(key, value) {
            _this.options[key] = customOptions.hasOwnProperty(key) ? customOptions[key] : value;
          });
          this.hadInitialPlaceholder = Boolean(input.getAttribute("placeholder"));
        }
        _createClass2(Iti2, [{
          key: "_init",
          value: function _init() {
            var _this2 = this;
            if (this.options.nationalMode) {
              this.options.autoInsertDialCode = false;
            }
            if (this.options.separateDialCode) {
              this.options.autoInsertDialCode = false;
            }
            var forceShowFlags = this.options.allowDropdown && !this.options.separateDialCode;
            if (!this.options.showFlags && forceShowFlags) {
              this.options.showFlags = true;
            }
            if (this.options.useFullscreenPopup) {
              document.body.classList.add("iti-fullscreen-popup");
              if (!this.options.dropdownContainer) {
                this.options.dropdownContainer = document.body;
              }
            }
            this.isRTL = !!this.telInput.closest("[dir=rtl]");
            if (typeof Promise !== "undefined") {
              var autoCountryPromise = new Promise(function(resolve, reject) {
                _this2.resolveAutoCountryPromise = resolve;
                _this2.rejectAutoCountryPromise = reject;
              });
              var utilsScriptPromise = new Promise(function(resolve, reject) {
                _this2.resolveUtilsScriptPromise = resolve;
                _this2.rejectUtilsScriptPromise = reject;
              });
              this.promise = Promise.all([autoCountryPromise, utilsScriptPromise]);
            } else {
              this.resolveAutoCountryPromise = this.rejectAutoCountryPromise = function() {
              };
              this.resolveUtilsScriptPromise = this.rejectUtilsScriptPromise = function() {
              };
            }
            this.selectedCountryData = {};
            this._processCountryData();
            this._generateMarkup();
            this._setInitialState();
            this._initListeners();
            this._initRequests();
          }
        }, {
          key: "_processCountryData",
          value: function _processCountryData() {
            this._processAllCountries();
            this._processCountryCodes();
            this._processPreferredCountries();
            if (this.options.localizedCountries) {
              this._translateCountriesByLocale();
            }
            if (this.options.onlyCountries.length || this.options.localizedCountries) {
              this.countries.sort(this._countryNameSort);
            }
          }
        }, {
          key: "_addCountryCode",
          value: function _addCountryCode(iso2, countryCode, priority) {
            if (countryCode.length > this.countryCodeMaxLen) {
              this.countryCodeMaxLen = countryCode.length;
            }
            if (!this.countryCodes.hasOwnProperty(countryCode)) {
              this.countryCodes[countryCode] = [];
            }
            for (var i2 = 0; i2 < this.countryCodes[countryCode].length; i2++) {
              if (this.countryCodes[countryCode][i2] === iso2) {
                return;
              }
            }
            var index = priority !== undefined$1 ? priority : this.countryCodes[countryCode].length;
            this.countryCodes[countryCode][index] = iso2;
          }
        }, {
          key: "_processAllCountries",
          value: function _processAllCountries() {
            if (this.options.onlyCountries.length) {
              var lowerCaseOnlyCountries = this.options.onlyCountries.map(function(country) {
                return country.toLowerCase();
              });
              this.countries = allCountries.filter(function(country) {
                return lowerCaseOnlyCountries.indexOf(country.iso2) > -1;
              });
            } else if (this.options.excludeCountries.length) {
              var lowerCaseExcludeCountries = this.options.excludeCountries.map(function(country) {
                return country.toLowerCase();
              });
              this.countries = allCountries.filter(function(country) {
                return lowerCaseExcludeCountries.indexOf(country.iso2) === -1;
              });
            } else {
              this.countries = allCountries;
            }
          }
        }, {
          key: "_translateCountriesByLocale",
          value: function _translateCountriesByLocale() {
            for (var i2 = 0; i2 < this.countries.length; i2++) {
              var iso = this.countries[i2].iso2.toLowerCase();
              if (this.options.localizedCountries.hasOwnProperty(iso)) {
                this.countries[i2].name = this.options.localizedCountries[iso];
              }
            }
          }
        }, {
          key: "_countryNameSort",
          value: function _countryNameSort(a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          }
        }, {
          key: "_processCountryCodes",
          value: function _processCountryCodes() {
            this.countryCodeMaxLen = 0;
            this.dialCodes = {};
            this.countryCodes = {};
            for (var i2 = 0; i2 < this.countries.length; i2++) {
              var c2 = this.countries[i2];
              if (!this.dialCodes[c2.dialCode]) {
                this.dialCodes[c2.dialCode] = true;
              }
              this._addCountryCode(c2.iso2, c2.dialCode, c2.priority);
            }
            for (var _i = 0; _i < this.countries.length; _i++) {
              var _c = this.countries[_i];
              if (_c.areaCodes) {
                var rootCountryCode = this.countryCodes[_c.dialCode][0];
                for (var j = 0; j < _c.areaCodes.length; j++) {
                  var areaCode = _c.areaCodes[j];
                  for (var k = 1; k < areaCode.length; k++) {
                    var partialDialCode = _c.dialCode + areaCode.substr(0, k);
                    this._addCountryCode(rootCountryCode, partialDialCode);
                    this._addCountryCode(_c.iso2, partialDialCode);
                  }
                  this._addCountryCode(_c.iso2, _c.dialCode + areaCode);
                }
              }
            }
          }
        }, {
          key: "_processPreferredCountries",
          value: function _processPreferredCountries() {
            this.preferredCountries = [];
            for (var i2 = 0; i2 < this.options.preferredCountries.length; i2++) {
              var countryCode = this.options.preferredCountries[i2].toLowerCase();
              var countryData = this._getCountryData(countryCode, false, true);
              if (countryData) {
                this.preferredCountries.push(countryData);
              }
            }
          }
        }, {
          key: "_createEl",
          value: function _createEl(name, attrs, container) {
            var el = document.createElement(name);
            if (attrs) {
              forEachProp(attrs, function(key, value) {
                return el.setAttribute(key, value);
              });
            }
            if (container) {
              container.appendChild(el);
            }
            return el;
          }
        }, {
          key: "_generateMarkup",
          value: function _generateMarkup() {
            if (!this.telInput.hasAttribute("autocomplete") && !(this.telInput.form && this.telInput.form.hasAttribute("autocomplete"))) {
              this.telInput.setAttribute("autocomplete", "off");
            }
            var _this$options = this.options, allowDropdown = _this$options.allowDropdown, separateDialCode = _this$options.separateDialCode, showFlags = _this$options.showFlags, customContainer = _this$options.customContainer, hiddenInput = _this$options.hiddenInput, dropdownContainer = _this$options.dropdownContainer;
            var parentClass = "iti";
            if (allowDropdown) {
              parentClass += " iti--allow-dropdown";
            }
            if (separateDialCode) {
              parentClass += " iti--separate-dial-code";
            }
            if (showFlags) {
              parentClass += " iti--show-flags";
            }
            if (customContainer) {
              parentClass += " ".concat(customContainer);
            }
            var wrapper = this._createEl("div", {
              "class": parentClass
            });
            this.telInput.parentNode.insertBefore(wrapper, this.telInput);
            var showFlagsContainer = allowDropdown || showFlags || separateDialCode;
            if (showFlagsContainer) {
              this.flagsContainer = this._createEl("div", {
                "class": "iti__flag-container"
              }, wrapper);
            }
            wrapper.appendChild(this.telInput);
            if (showFlagsContainer) {
              this.selectedFlag = this._createEl("div", _objectSpread2({
                "class": "iti__selected-flag"
              }, allowDropdown && {
                role: "combobox",
                "aria-haspopup": "listbox",
                "aria-controls": "iti-".concat(this.id, "__country-listbox"),
                "aria-expanded": "false",
                "aria-label": "Telephone country code"
              }), this.flagsContainer);
            }
            if (showFlags) {
              this.selectedFlagInner = this._createEl("div", {
                "class": "iti__flag"
              }, this.selectedFlag);
            }
            if (this.selectedFlag && this.telInput.disabled) {
              this.selectedFlag.setAttribute("aria-disabled", "true");
            }
            if (separateDialCode) {
              this.selectedDialCode = this._createEl("div", {
                "class": "iti__selected-dial-code"
              }, this.selectedFlag);
            }
            if (allowDropdown) {
              if (!this.telInput.disabled) {
                this.selectedFlag.setAttribute("tabindex", "0");
              }
              this.dropdownArrow = this._createEl("div", {
                "class": "iti__arrow"
              }, this.selectedFlag);
              this.countryList = this._createEl("ul", {
                "class": "iti__country-list iti__hide",
                id: "iti-".concat(this.id, "__country-listbox"),
                role: "listbox",
                "aria-label": "List of countries"
              });
              if (this.preferredCountries.length) {
                this._appendListItems(this.preferredCountries, "iti__preferred", true);
                this._createEl("li", {
                  "class": "iti__divider",
                  "aria-hidden": "true"
                }, this.countryList);
              }
              this._appendListItems(this.countries, "iti__standard");
              if (dropdownContainer) {
                this.dropdown = this._createEl("div", {
                  "class": "iti iti--container"
                });
                this.dropdown.appendChild(this.countryList);
              } else {
                this.flagsContainer.appendChild(this.countryList);
              }
            }
            if (hiddenInput) {
              var hiddenInputName = hiddenInput;
              var name = this.telInput.getAttribute("name");
              if (name) {
                var i2 = name.lastIndexOf("[");
                if (i2 !== -1) {
                  hiddenInputName = "".concat(name.substr(0, i2), "[").concat(hiddenInputName, "]");
                }
              }
              this.hiddenInput = this._createEl("input", {
                type: "hidden",
                name: hiddenInputName
              });
              wrapper.appendChild(this.hiddenInput);
            }
          }
        }, {
          key: "_appendListItems",
          value: function _appendListItems(countries, className, preferred) {
            var tmp = "";
            for (var i2 = 0; i2 < countries.length; i2++) {
              var c2 = countries[i2];
              var idSuffix = preferred ? "-preferred" : "";
              tmp += "<li class='iti__country ".concat(className, "' tabIndex='-1' id='iti-").concat(this.id, "__item-").concat(c2.iso2).concat(idSuffix, "' role='option' data-dial-code='").concat(c2.dialCode, "' data-country-code='").concat(c2.iso2, "' aria-selected='false'>");
              if (this.options.showFlags) {
                tmp += "<div class='iti__flag-box'><div class='iti__flag iti__".concat(c2.iso2, "'></div></div>");
              }
              tmp += "<span class='iti__country-name'>".concat(c2.name, "</span>");
              tmp += "<span class='iti__dial-code'>+".concat(c2.dialCode, "</span>");
              tmp += "</li>";
            }
            this.countryList.insertAdjacentHTML("beforeend", tmp);
          }
        }, {
          key: "_setInitialState",
          value: function _setInitialState() {
            var attributeValue = this.telInput.getAttribute("value");
            var inputValue = this.telInput.value;
            var useAttribute = attributeValue && attributeValue.charAt(0) === "+" && (!inputValue || inputValue.charAt(0) !== "+");
            var val = useAttribute ? attributeValue : inputValue;
            var dialCode = this._getDialCode(val);
            var isRegionlessNanp = this._isRegionlessNanp(val);
            var _this$options2 = this.options, initialCountry = _this$options2.initialCountry, autoInsertDialCode = _this$options2.autoInsertDialCode;
            if (dialCode && !isRegionlessNanp) {
              this._updateFlagFromNumber(val);
            } else if (initialCountry !== "auto") {
              if (initialCountry) {
                this._setFlag(initialCountry.toLowerCase());
              } else {
                if (dialCode && isRegionlessNanp) {
                  this._setFlag("us");
                } else {
                  this.defaultCountry = this.preferredCountries.length ? this.preferredCountries[0].iso2 : this.countries[0].iso2;
                  if (!val) {
                    this._setFlag(this.defaultCountry);
                  }
                }
              }
              if (!val && autoInsertDialCode) {
                this.telInput.value = "+".concat(this.selectedCountryData.dialCode);
              }
            }
            if (val) {
              this._updateValFromNumber(val);
            }
          }
        }, {
          key: "_initListeners",
          value: function _initListeners() {
            this._initKeyListeners();
            if (this.options.autoInsertDialCode) {
              this._initBlurListeners();
            }
            if (this.options.allowDropdown) {
              this._initDropdownListeners();
            }
            if (this.hiddenInput) {
              this._initHiddenInputListener();
            }
          }
        }, {
          key: "_initHiddenInputListener",
          value: function _initHiddenInputListener() {
            var _this3 = this;
            this._handleHiddenInputSubmit = function() {
              _this3.hiddenInput.value = _this3.getNumber();
            };
            if (this.telInput.form) {
              this.telInput.form.addEventListener("submit", this._handleHiddenInputSubmit);
            }
          }
        }, {
          key: "_getClosestLabel",
          value: function _getClosestLabel() {
            var el = this.telInput;
            while (el && el.tagName !== "LABEL") {
              el = el.parentNode;
            }
            return el;
          }
        }, {
          key: "_initDropdownListeners",
          value: function _initDropdownListeners() {
            var _this4 = this;
            this._handleLabelClick = function(e) {
              if (_this4.countryList.classList.contains("iti__hide")) {
                _this4.telInput.focus();
              } else {
                e.preventDefault();
              }
            };
            var label = this._getClosestLabel();
            if (label) {
              label.addEventListener("click", this._handleLabelClick);
            }
            this._handleClickSelectedFlag = function() {
              if (_this4.countryList.classList.contains("iti__hide") && !_this4.telInput.disabled && !_this4.telInput.readOnly) {
                _this4._showDropdown();
              }
            };
            this.selectedFlag.addEventListener("click", this._handleClickSelectedFlag);
            this._handleFlagsContainerKeydown = function(e) {
              var isDropdownHidden = _this4.countryList.classList.contains("iti__hide");
              if (isDropdownHidden && ["ArrowUp", "Up", "ArrowDown", "Down", " ", "Enter"].indexOf(e.key) !== -1) {
                e.preventDefault();
                e.stopPropagation();
                _this4._showDropdown();
              }
              if (e.key === "Tab") {
                _this4._closeDropdown();
              }
            };
            this.flagsContainer.addEventListener("keydown", this._handleFlagsContainerKeydown);
          }
        }, {
          key: "_initRequests",
          value: function _initRequests() {
            var _this5 = this;
            if (this.options.utilsScript && !window.intlTelInputUtils) {
              if (window.intlTelInputGlobals.documentReady()) {
                window.intlTelInputGlobals.loadUtils(this.options.utilsScript);
              } else {
                window.addEventListener("load", function() {
                  window.intlTelInputGlobals.loadUtils(_this5.options.utilsScript);
                });
              }
            } else {
              this.resolveUtilsScriptPromise();
            }
            if (this.options.initialCountry === "auto") {
              this._loadAutoCountry();
            } else {
              this.resolveAutoCountryPromise();
            }
          }
        }, {
          key: "_loadAutoCountry",
          value: function _loadAutoCountry() {
            if (window.intlTelInputGlobals.autoCountry) {
              this.handleAutoCountry();
            } else if (!window.intlTelInputGlobals.startedLoadingAutoCountry) {
              window.intlTelInputGlobals.startedLoadingAutoCountry = true;
              if (typeof this.options.geoIpLookup === "function") {
                this.options.geoIpLookup(function(countryCode) {
                  window.intlTelInputGlobals.autoCountry = countryCode.toLowerCase();
                  setTimeout(function() {
                    return forEachInstance("handleAutoCountry");
                  });
                }, function() {
                  return forEachInstance("rejectAutoCountryPromise");
                });
              }
            }
          }
        }, {
          key: "_initKeyListeners",
          value: function _initKeyListeners() {
            var _this6 = this;
            this._handleKeyupEvent = function() {
              if (_this6._updateFlagFromNumber(_this6.telInput.value)) {
                _this6._triggerCountryChange();
              }
            };
            this.telInput.addEventListener("keyup", this._handleKeyupEvent);
            this._handleClipboardEvent = function() {
              setTimeout(_this6._handleKeyupEvent);
            };
            this.telInput.addEventListener("cut", this._handleClipboardEvent);
            this.telInput.addEventListener("paste", this._handleClipboardEvent);
          }
        }, {
          key: "_cap",
          value: function _cap(number) {
            var max = this.telInput.getAttribute("maxlength");
            return max && number.length > max ? number.substr(0, max) : number;
          }
        }, {
          key: "_initBlurListeners",
          value: function _initBlurListeners() {
            var _this7 = this;
            this._handleSubmitOrBlurEvent = function() {
              _this7._removeEmptyDialCode();
            };
            if (this.telInput.form) {
              this.telInput.form.addEventListener("submit", this._handleSubmitOrBlurEvent);
            }
            this.telInput.addEventListener("blur", this._handleSubmitOrBlurEvent);
          }
        }, {
          key: "_removeEmptyDialCode",
          value: function _removeEmptyDialCode() {
            if (this.telInput.value.charAt(0) === "+") {
              var numeric = this._getNumeric(this.telInput.value);
              if (!numeric || this.selectedCountryData.dialCode === numeric) {
                this.telInput.value = "";
              }
            }
          }
        }, {
          key: "_getNumeric",
          value: function _getNumeric(s) {
            return s.replace(/\D/g, "");
          }
        }, {
          key: "_trigger",
          value: function _trigger(name) {
            var e = document.createEvent("Event");
            e.initEvent(name, true, true);
            this.telInput.dispatchEvent(e);
          }
        }, {
          key: "_showDropdown",
          value: function _showDropdown() {
            this.countryList.classList.remove("iti__hide");
            this.selectedFlag.setAttribute("aria-expanded", "true");
            this._setDropdownPosition();
            if (this.activeItem) {
              this._highlightListItem(this.activeItem, false);
              this._scrollTo(this.activeItem, true);
            }
            this._bindDropdownListeners();
            this.dropdownArrow.classList.add("iti__arrow--up");
            this._trigger("open:countrydropdown");
          }
        }, {
          key: "_toggleClass",
          value: function _toggleClass(el, className, shouldHaveClass) {
            if (shouldHaveClass && !el.classList.contains(className)) {
              el.classList.add(className);
            } else if (!shouldHaveClass && el.classList.contains(className)) {
              el.classList.remove(className);
            }
          }
        }, {
          key: "_setDropdownPosition",
          value: function _setDropdownPosition() {
            var _this8 = this;
            if (this.options.dropdownContainer) {
              this.options.dropdownContainer.appendChild(this.dropdown);
            }
            if (!this.options.useFullscreenPopup) {
              var pos = this.telInput.getBoundingClientRect();
              var windowTop = window.pageYOffset || document.documentElement.scrollTop;
              var inputTop = pos.top + windowTop;
              var dropdownHeight = this.countryList.offsetHeight;
              var dropdownFitsBelow = inputTop + this.telInput.offsetHeight + dropdownHeight < windowTop + window.innerHeight;
              var dropdownFitsAbove = inputTop - dropdownHeight > windowTop;
              this._toggleClass(this.countryList, "iti__country-list--dropup", !dropdownFitsBelow && dropdownFitsAbove);
              if (this.options.dropdownContainer) {
                var extraTop = !dropdownFitsBelow && dropdownFitsAbove ? 0 : this.telInput.offsetHeight;
                this.dropdown.style.top = "".concat(inputTop + extraTop, "px");
                this.dropdown.style.left = "".concat(pos.left + document.body.scrollLeft, "px");
                this._handleWindowScroll = function() {
                  return _this8._closeDropdown();
                };
                window.addEventListener("scroll", this._handleWindowScroll);
              }
            }
          }
        }, {
          key: "_getClosestListItem",
          value: function _getClosestListItem(target) {
            var el = target;
            while (el && el !== this.countryList && !el.classList.contains("iti__country")) {
              el = el.parentNode;
            }
            return el === this.countryList ? null : el;
          }
        }, {
          key: "_bindDropdownListeners",
          value: function _bindDropdownListeners() {
            var _this9 = this;
            this._handleMouseoverCountryList = function(e) {
              var listItem = _this9._getClosestListItem(e.target);
              if (listItem) {
                _this9._highlightListItem(listItem, false);
              }
            };
            this.countryList.addEventListener("mouseover", this._handleMouseoverCountryList);
            this._handleClickCountryList = function(e) {
              var listItem = _this9._getClosestListItem(e.target);
              if (listItem) {
                _this9._selectListItem(listItem);
              }
            };
            this.countryList.addEventListener("click", this._handleClickCountryList);
            var isOpening = true;
            this._handleClickOffToClose = function() {
              if (!isOpening) {
                _this9._closeDropdown();
              }
              isOpening = false;
            };
            document.documentElement.addEventListener("click", this._handleClickOffToClose);
            var query = "";
            var queryTimer = null;
            this._handleKeydownOnDropdown = function(e) {
              e.preventDefault();
              if (e.key === "ArrowUp" || e.key === "Up" || e.key === "ArrowDown" || e.key === "Down") {
                _this9._handleUpDownKey(e.key);
              } else if (e.key === "Enter") {
                _this9._handleEnterKey();
              } else if (e.key === "Escape") {
                _this9._closeDropdown();
              } else if (/^[a-zA-ZÀ-ÿа-яА-Я ]$/.test(e.key)) {
                if (queryTimer) {
                  clearTimeout(queryTimer);
                }
                query += e.key.toLowerCase();
                _this9._searchForCountry(query);
                queryTimer = setTimeout(function() {
                  query = "";
                }, 1e3);
              }
            };
            document.addEventListener("keydown", this._handleKeydownOnDropdown);
          }
        }, {
          key: "_handleUpDownKey",
          value: function _handleUpDownKey(key) {
            var next = key === "ArrowUp" || key === "Up" ? this.highlightedItem.previousElementSibling : this.highlightedItem.nextElementSibling;
            if (next) {
              if (next.classList.contains("iti__divider")) {
                next = key === "ArrowUp" || key === "Up" ? next.previousElementSibling : next.nextElementSibling;
              }
              this._highlightListItem(next, true);
            }
          }
        }, {
          key: "_handleEnterKey",
          value: function _handleEnterKey() {
            if (this.highlightedItem) {
              this._selectListItem(this.highlightedItem);
            }
          }
        }, {
          key: "_searchForCountry",
          value: function _searchForCountry(query) {
            for (var i2 = 0; i2 < this.countries.length; i2++) {
              if (this._startsWith(this.countries[i2].name, query)) {
                var listItem = this.countryList.querySelector("#iti-".concat(this.id, "__item-").concat(this.countries[i2].iso2));
                this._highlightListItem(listItem, false);
                this._scrollTo(listItem, true);
                break;
              }
            }
          }
        }, {
          key: "_startsWith",
          value: function _startsWith(a, b) {
            return a.substr(0, b.length).toLowerCase() === b;
          }
        }, {
          key: "_updateValFromNumber",
          value: function _updateValFromNumber(originalNumber) {
            var number = originalNumber;
            if (this.options.formatOnDisplay && window.intlTelInputUtils && this.selectedCountryData) {
              var useNational = this.options.nationalMode || number.charAt(0) !== "+" && !this.options.separateDialCode;
              var _intlTelInputUtils$nu = intlTelInputUtils.numberFormat, NATIONAL = _intlTelInputUtils$nu.NATIONAL, INTERNATIONAL = _intlTelInputUtils$nu.INTERNATIONAL;
              var format = useNational ? NATIONAL : INTERNATIONAL;
              number = intlTelInputUtils.formatNumber(number, this.selectedCountryData.iso2, format);
            }
            number = this._beforeSetNumber(number);
            this.telInput.value = number;
          }
        }, {
          key: "_updateFlagFromNumber",
          value: function _updateFlagFromNumber(originalNumber) {
            var number = originalNumber;
            var selectedDialCode = this.selectedCountryData.dialCode;
            var isNanp = selectedDialCode === "1";
            if (number && isNanp && number.charAt(0) !== "+") {
              if (number.charAt(0) !== "1") {
                number = "1".concat(number);
              }
              number = "+".concat(number);
            }
            if (this.options.separateDialCode && selectedDialCode && number.charAt(0) !== "+") {
              number = "+".concat(selectedDialCode).concat(number);
            }
            var dialCode = this._getDialCode(number, true);
            var numeric = this._getNumeric(number);
            var countryCode = null;
            if (dialCode) {
              var countryCodes = this.countryCodes[this._getNumeric(dialCode)];
              var alreadySelected = countryCodes.indexOf(this.selectedCountryData.iso2) !== -1 && numeric.length <= dialCode.length - 1;
              var isRegionlessNanpNumber = selectedDialCode === "1" && this._isRegionlessNanp(numeric);
              if (!isRegionlessNanpNumber && !alreadySelected) {
                for (var j = 0; j < countryCodes.length; j++) {
                  if (countryCodes[j]) {
                    countryCode = countryCodes[j];
                    break;
                  }
                }
              }
            } else if (number.charAt(0) === "+" && numeric.length) {
              countryCode = "";
            } else if (!number || number === "+") {
              countryCode = this.defaultCountry;
            }
            if (countryCode !== null) {
              return this._setFlag(countryCode);
            }
            return false;
          }
        }, {
          key: "_isRegionlessNanp",
          value: function _isRegionlessNanp(number) {
            var numeric = this._getNumeric(number);
            if (numeric.charAt(0) === "1") {
              var areaCode = numeric.substr(1, 3);
              return regionlessNanpNumbers.indexOf(areaCode) !== -1;
            }
            return false;
          }
        }, {
          key: "_highlightListItem",
          value: function _highlightListItem(listItem, shouldFocus) {
            var prevItem = this.highlightedItem;
            if (prevItem) {
              prevItem.classList.remove("iti__highlight");
            }
            this.highlightedItem = listItem;
            this.highlightedItem.classList.add("iti__highlight");
            this.selectedFlag.setAttribute("aria-activedescendant", listItem.getAttribute("id"));
            if (shouldFocus) {
              this.highlightedItem.focus();
            }
          }
        }, {
          key: "_getCountryData",
          value: function _getCountryData(countryCode, ignoreOnlyCountriesOption, allowFail) {
            var countryList = ignoreOnlyCountriesOption ? allCountries : this.countries;
            for (var i2 = 0; i2 < countryList.length; i2++) {
              if (countryList[i2].iso2 === countryCode) {
                return countryList[i2];
              }
            }
            if (allowFail) {
              return null;
            }
            throw new Error("No country data for '".concat(countryCode, "'"));
          }
        }, {
          key: "_setFlag",
          value: function _setFlag(countryCode) {
            var _this$options3 = this.options, allowDropdown = _this$options3.allowDropdown, separateDialCode = _this$options3.separateDialCode, showFlags = _this$options3.showFlags;
            var prevCountry = this.selectedCountryData.iso2 ? this.selectedCountryData : {};
            this.selectedCountryData = countryCode ? this._getCountryData(countryCode, false, false) : {};
            if (this.selectedCountryData.iso2) {
              this.defaultCountry = this.selectedCountryData.iso2;
            }
            if (showFlags) {
              this.selectedFlagInner.setAttribute("class", "iti__flag iti__".concat(countryCode));
            }
            this._setSelectedCountryFlagTitleAttribute(countryCode, separateDialCode);
            if (separateDialCode) {
              var dialCode = this.selectedCountryData.dialCode ? "+".concat(this.selectedCountryData.dialCode) : "";
              this.selectedDialCode.innerHTML = dialCode;
              var selectedFlagWidth = this.selectedFlag.offsetWidth || this._getHiddenSelectedFlagWidth();
              if (this.isRTL) {
                this.telInput.style.paddingRight = "".concat(selectedFlagWidth + 6, "px");
              } else {
                this.telInput.style.paddingLeft = "".concat(selectedFlagWidth + 6, "px");
              }
            }
            this._updatePlaceholder();
            if (allowDropdown) {
              var prevItem = this.activeItem;
              if (prevItem) {
                prevItem.classList.remove("iti__active");
                prevItem.setAttribute("aria-selected", "false");
              }
              if (countryCode) {
                var nextItem = this.countryList.querySelector("#iti-".concat(this.id, "__item-").concat(countryCode, "-preferred")) || this.countryList.querySelector("#iti-".concat(this.id, "__item-").concat(countryCode));
                nextItem.setAttribute("aria-selected", "true");
                nextItem.classList.add("iti__active");
                this.activeItem = nextItem;
              }
            }
            return prevCountry.iso2 !== countryCode;
          }
        }, {
          key: "_setSelectedCountryFlagTitleAttribute",
          value: function _setSelectedCountryFlagTitleAttribute(countryCode, separateDialCode) {
            if (!this.selectedFlag) {
              return;
            }
            var title;
            if (countryCode && !separateDialCode) {
              title = "".concat(this.selectedCountryData.name, ": +").concat(this.selectedCountryData.dialCode);
            } else if (countryCode) {
              title = this.selectedCountryData.name;
            } else {
              title = "Unknown";
            }
            this.selectedFlag.setAttribute("title", title);
          }
        }, {
          key: "_getHiddenSelectedFlagWidth",
          value: function _getHiddenSelectedFlagWidth() {
            var containerClone = this.telInput.parentNode.cloneNode();
            containerClone.style.visibility = "hidden";
            document.body.appendChild(containerClone);
            var flagsContainerClone = this.flagsContainer.cloneNode();
            containerClone.appendChild(flagsContainerClone);
            var selectedFlagClone = this.selectedFlag.cloneNode(true);
            flagsContainerClone.appendChild(selectedFlagClone);
            var width = selectedFlagClone.offsetWidth;
            containerClone.parentNode.removeChild(containerClone);
            return width;
          }
        }, {
          key: "_updatePlaceholder",
          value: function _updatePlaceholder() {
            var shouldSetPlaceholder = this.options.autoPlaceholder === "aggressive" || !this.hadInitialPlaceholder && this.options.autoPlaceholder === "polite";
            if (window.intlTelInputUtils && shouldSetPlaceholder) {
              var numberType = intlTelInputUtils.numberType[this.options.placeholderNumberType];
              var placeholder = this.selectedCountryData.iso2 ? intlTelInputUtils.getExampleNumber(this.selectedCountryData.iso2, this.options.nationalMode, numberType) : "";
              placeholder = this._beforeSetNumber(placeholder);
              if (typeof this.options.customPlaceholder === "function") {
                placeholder = this.options.customPlaceholder(placeholder, this.selectedCountryData);
              }
              this.telInput.setAttribute("placeholder", placeholder);
            }
          }
        }, {
          key: "_selectListItem",
          value: function _selectListItem(listItem) {
            var flagChanged = this._setFlag(listItem.getAttribute("data-country-code"));
            this._closeDropdown();
            this._updateDialCode(listItem.getAttribute("data-dial-code"));
            this.telInput.focus();
            var len = this.telInput.value.length;
            this.telInput.setSelectionRange(len, len);
            if (flagChanged) {
              this._triggerCountryChange();
            }
          }
        }, {
          key: "_closeDropdown",
          value: function _closeDropdown() {
            this.countryList.classList.add("iti__hide");
            this.selectedFlag.setAttribute("aria-expanded", "false");
            this.selectedFlag.removeAttribute("aria-activedescendant");
            this.dropdownArrow.classList.remove("iti__arrow--up");
            document.removeEventListener("keydown", this._handleKeydownOnDropdown);
            document.documentElement.removeEventListener("click", this._handleClickOffToClose);
            this.countryList.removeEventListener("mouseover", this._handleMouseoverCountryList);
            this.countryList.removeEventListener("click", this._handleClickCountryList);
            if (this.options.dropdownContainer) {
              if (!this.options.useFullscreenPopup) {
                window.removeEventListener("scroll", this._handleWindowScroll);
              }
              if (this.dropdown.parentNode) {
                this.dropdown.parentNode.removeChild(this.dropdown);
              }
            }
            this._trigger("close:countrydropdown");
          }
        }, {
          key: "_scrollTo",
          value: function _scrollTo(element, middle) {
            var container = this.countryList;
            var windowTop = window.pageYOffset || document.documentElement.scrollTop;
            var containerHeight = container.offsetHeight;
            var containerTop = container.getBoundingClientRect().top + windowTop;
            var containerBottom = containerTop + containerHeight;
            var elementHeight = element.offsetHeight;
            var elementTop = element.getBoundingClientRect().top + windowTop;
            var elementBottom = elementTop + elementHeight;
            var newScrollTop = elementTop - containerTop + container.scrollTop;
            var middleOffset = containerHeight / 2 - elementHeight / 2;
            if (elementTop < containerTop) {
              if (middle) {
                newScrollTop -= middleOffset;
              }
              container.scrollTop = newScrollTop;
            } else if (elementBottom > containerBottom) {
              if (middle) {
                newScrollTop += middleOffset;
              }
              var heightDifference = containerHeight - elementHeight;
              container.scrollTop = newScrollTop - heightDifference;
            }
          }
        }, {
          key: "_updateDialCode",
          value: function _updateDialCode(newDialCodeBare) {
            var inputVal = this.telInput.value;
            var newDialCode = "+".concat(newDialCodeBare);
            var newNumber;
            if (inputVal.charAt(0) === "+") {
              var prevDialCode = this._getDialCode(inputVal);
              if (prevDialCode) {
                newNumber = inputVal.replace(prevDialCode, newDialCode);
              } else {
                newNumber = newDialCode;
              }
              this.telInput.value = newNumber;
            } else if (this.options.autoInsertDialCode) {
              if (inputVal) {
                newNumber = newDialCode + inputVal;
              } else {
                newNumber = newDialCode;
              }
              this.telInput.value = newNumber;
            }
          }
        }, {
          key: "_getDialCode",
          value: function _getDialCode(number, includeAreaCode) {
            var dialCode = "";
            if (number.charAt(0) === "+") {
              var numericChars = "";
              for (var i2 = 0; i2 < number.length; i2++) {
                var c2 = number.charAt(i2);
                if (!isNaN(parseInt(c2, 10))) {
                  numericChars += c2;
                  if (includeAreaCode) {
                    if (this.countryCodes[numericChars]) {
                      dialCode = number.substr(0, i2 + 1);
                    }
                  } else {
                    if (this.dialCodes[numericChars]) {
                      dialCode = number.substr(0, i2 + 1);
                      break;
                    }
                  }
                  if (numericChars.length === this.countryCodeMaxLen) {
                    break;
                  }
                }
              }
            }
            return dialCode;
          }
        }, {
          key: "_getFullNumber",
          value: function _getFullNumber() {
            var val = this.telInput.value.trim();
            var dialCode = this.selectedCountryData.dialCode;
            var prefix;
            var numericVal = this._getNumeric(val);
            if (this.options.separateDialCode && val.charAt(0) !== "+" && dialCode && numericVal) {
              prefix = "+".concat(dialCode);
            } else {
              prefix = "";
            }
            return prefix + val;
          }
        }, {
          key: "_beforeSetNumber",
          value: function _beforeSetNumber(originalNumber) {
            var number = originalNumber;
            if (this.options.separateDialCode) {
              var dialCode = this._getDialCode(number);
              if (dialCode) {
                dialCode = "+".concat(this.selectedCountryData.dialCode);
                var start = number[dialCode.length] === " " || number[dialCode.length] === "-" ? dialCode.length + 1 : dialCode.length;
                number = number.substr(start);
              }
            }
            return this._cap(number);
          }
        }, {
          key: "_triggerCountryChange",
          value: function _triggerCountryChange() {
            this._trigger("countrychange");
          }
        }, {
          key: "handleAutoCountry",
          value: function handleAutoCountry() {
            if (this.options.initialCountry === "auto") {
              this.defaultCountry = window.intlTelInputGlobals.autoCountry;
              if (!this.telInput.value) {
                this.setCountry(this.defaultCountry);
              }
              this.resolveAutoCountryPromise();
            }
          }
        }, {
          key: "handleUtils",
          value: function handleUtils() {
            if (window.intlTelInputUtils) {
              if (this.telInput.value) {
                this._updateValFromNumber(this.telInput.value);
              }
              this._updatePlaceholder();
            }
            this.resolveUtilsScriptPromise();
          }
        }, {
          key: "destroy",
          value: function destroy() {
            var form = this.telInput.form;
            if (this.options.allowDropdown) {
              this._closeDropdown();
              this.selectedFlag.removeEventListener("click", this._handleClickSelectedFlag);
              this.flagsContainer.removeEventListener("keydown", this._handleFlagsContainerKeydown);
              var label = this._getClosestLabel();
              if (label) {
                label.removeEventListener("click", this._handleLabelClick);
              }
            }
            if (this.hiddenInput && form) {
              form.removeEventListener("submit", this._handleHiddenInputSubmit);
            }
            if (this.options.autoInsertDialCode) {
              if (form) {
                form.removeEventListener("submit", this._handleSubmitOrBlurEvent);
              }
              this.telInput.removeEventListener("blur", this._handleSubmitOrBlurEvent);
            }
            this.telInput.removeEventListener("keyup", this._handleKeyupEvent);
            this.telInput.removeEventListener("cut", this._handleClipboardEvent);
            this.telInput.removeEventListener("paste", this._handleClipboardEvent);
            this.telInput.removeAttribute("data-intl-tel-input-id");
            var wrapper = this.telInput.parentNode;
            wrapper.parentNode.insertBefore(this.telInput, wrapper);
            wrapper.parentNode.removeChild(wrapper);
            delete window.intlTelInputGlobals.instances[this.id];
          }
        }, {
          key: "getExtension",
          value: function getExtension() {
            if (window.intlTelInputUtils) {
              return intlTelInputUtils.getExtension(this._getFullNumber(), this.selectedCountryData.iso2);
            }
            return "";
          }
        }, {
          key: "getNumber",
          value: function getNumber(format) {
            if (window.intlTelInputUtils) {
              var iso2 = this.selectedCountryData.iso2;
              return intlTelInputUtils.formatNumber(this._getFullNumber(), iso2, format);
            }
            return "";
          }
        }, {
          key: "getNumberType",
          value: function getNumberType2() {
            if (window.intlTelInputUtils) {
              return intlTelInputUtils.getNumberType(this._getFullNumber(), this.selectedCountryData.iso2);
            }
            return -99;
          }
        }, {
          key: "getSelectedCountryData",
          value: function getSelectedCountryData() {
            return this.selectedCountryData;
          }
        }, {
          key: "getValidationError",
          value: function getValidationError() {
            if (window.intlTelInputUtils) {
              var iso2 = this.selectedCountryData.iso2;
              return intlTelInputUtils.getValidationError(this._getFullNumber(), iso2);
            }
            return -99;
          }
        }, {
          key: "isValidNumber",
          value: function isValidNumber2() {
            var val = this._getFullNumber().trim();
            return window.intlTelInputUtils ? intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2) : null;
          }
        }, {
          key: "isPossibleNumber",
          value: function isPossibleNumber2() {
            var val = this._getFullNumber().trim();
            return window.intlTelInputUtils ? intlTelInputUtils.isPossibleNumber(val, this.selectedCountryData.iso2) : null;
          }
        }, {
          key: "setCountry",
          value: function setCountry(originalCountryCode) {
            var countryCode = originalCountryCode.toLowerCase();
            if (this.selectedCountryData.iso2 !== countryCode) {
              this._setFlag(countryCode);
              this._updateDialCode(this.selectedCountryData.dialCode);
              this._triggerCountryChange();
            }
          }
        }, {
          key: "setNumber",
          value: function setNumber(number) {
            var flagChanged = this._updateFlagFromNumber(number);
            this._updateValFromNumber(number);
            if (flagChanged) {
              this._triggerCountryChange();
            }
          }
        }, {
          key: "setPlaceholderNumberType",
          value: function setPlaceholderNumberType(type) {
            this.options.placeholderNumberType = type;
            this._updatePlaceholder();
          }
        }]);
        return Iti2;
      }();
      intlTelInputGlobals.getCountryData = function() {
        return allCountries;
      };
      var injectScript = function injectScript2(path, handleSuccess, handleFailure) {
        var script = document.createElement("script");
        script.onload = function() {
          forEachInstance("handleUtils");
          if (handleSuccess) {
            handleSuccess();
          }
        };
        script.onerror = function() {
          forEachInstance("rejectUtilsScriptPromise");
          if (handleFailure) {
            handleFailure();
          }
        };
        script.className = "iti-load-utils";
        script.async = true;
        script.src = path;
        document.body.appendChild(script);
      };
      intlTelInputGlobals.loadUtils = function(path) {
        if (!window.intlTelInputUtils && !window.intlTelInputGlobals.startedLoadingUtilsScript) {
          window.intlTelInputGlobals.startedLoadingUtilsScript = true;
          if (typeof Promise !== "undefined") {
            return new Promise(function(resolve, reject) {
              return injectScript(path, resolve, reject);
            });
          }
          injectScript(path);
        }
        return null;
      };
      intlTelInputGlobals.defaults = defaults;
      intlTelInputGlobals.version = "18.3.3";
      return function(input, options) {
        var iti = new Iti(input, options);
        iti._init();
        input.setAttribute("data-intl-tel-input-id", iti.id);
        window.intlTelInputGlobals.instances[iti.id] = iti;
        return iti;
      };
    }();
  });
})(intlTelInput$2);
var intlTelInputExports = intlTelInput$2.exports;
var intlTelInput = intlTelInputExports;
const intlTelInput$1 = /* @__PURE__ */ getDefaultExportFromCjs(intlTelInput);
const metadata = { "version": 4, "country_calling_codes": { "1": ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], "7": ["RU", "KZ"], "20": ["EG"], "27": ["ZA"], "30": ["GR"], "31": ["NL"], "32": ["BE"], "33": ["FR"], "34": ["ES"], "36": ["HU"], "39": ["IT", "VA"], "40": ["RO"], "41": ["CH"], "43": ["AT"], "44": ["GB", "GG", "IM", "JE"], "45": ["DK"], "46": ["SE"], "47": ["NO", "SJ"], "48": ["PL"], "49": ["DE"], "51": ["PE"], "52": ["MX"], "53": ["CU"], "54": ["AR"], "55": ["BR"], "56": ["CL"], "57": ["CO"], "58": ["VE"], "60": ["MY"], "61": ["AU", "CC", "CX"], "62": ["ID"], "63": ["PH"], "64": ["NZ"], "65": ["SG"], "66": ["TH"], "81": ["JP"], "82": ["KR"], "84": ["VN"], "86": ["CN"], "90": ["TR"], "91": ["IN"], "92": ["PK"], "93": ["AF"], "94": ["LK"], "95": ["MM"], "98": ["IR"], "211": ["SS"], "212": ["MA", "EH"], "213": ["DZ"], "216": ["TN"], "218": ["LY"], "220": ["GM"], "221": ["SN"], "222": ["MR"], "223": ["ML"], "224": ["GN"], "225": ["CI"], "226": ["BF"], "227": ["NE"], "228": ["TG"], "229": ["BJ"], "230": ["MU"], "231": ["LR"], "232": ["SL"], "233": ["GH"], "234": ["NG"], "235": ["TD"], "236": ["CF"], "237": ["CM"], "238": ["CV"], "239": ["ST"], "240": ["GQ"], "241": ["GA"], "242": ["CG"], "243": ["CD"], "244": ["AO"], "245": ["GW"], "246": ["IO"], "247": ["AC"], "248": ["SC"], "249": ["SD"], "250": ["RW"], "251": ["ET"], "252": ["SO"], "253": ["DJ"], "254": ["KE"], "255": ["TZ"], "256": ["UG"], "257": ["BI"], "258": ["MZ"], "260": ["ZM"], "261": ["MG"], "262": ["RE", "YT"], "263": ["ZW"], "264": ["NA"], "265": ["MW"], "266": ["LS"], "267": ["BW"], "268": ["SZ"], "269": ["KM"], "290": ["SH", "TA"], "291": ["ER"], "297": ["AW"], "298": ["FO"], "299": ["GL"], "350": ["GI"], "351": ["PT"], "352": ["LU"], "353": ["IE"], "354": ["IS"], "355": ["AL"], "356": ["MT"], "357": ["CY"], "358": ["FI", "AX"], "359": ["BG"], "370": ["LT"], "371": ["LV"], "372": ["EE"], "373": ["MD"], "374": ["AM"], "375": ["BY"], "376": ["AD"], "377": ["MC"], "378": ["SM"], "380": ["UA"], "381": ["RS"], "382": ["ME"], "383": ["XK"], "385": ["HR"], "386": ["SI"], "387": ["BA"], "389": ["MK"], "420": ["CZ"], "421": ["SK"], "423": ["LI"], "500": ["FK"], "501": ["BZ"], "502": ["GT"], "503": ["SV"], "504": ["HN"], "505": ["NI"], "506": ["CR"], "507": ["PA"], "508": ["PM"], "509": ["HT"], "590": ["GP", "BL", "MF"], "591": ["BO"], "592": ["GY"], "593": ["EC"], "594": ["GF"], "595": ["PY"], "596": ["MQ"], "597": ["SR"], "598": ["UY"], "599": ["CW", "BQ"], "670": ["TL"], "672": ["NF"], "673": ["BN"], "674": ["NR"], "675": ["PG"], "676": ["TO"], "677": ["SB"], "678": ["VU"], "679": ["FJ"], "680": ["PW"], "681": ["WF"], "682": ["CK"], "683": ["NU"], "685": ["WS"], "686": ["KI"], "687": ["NC"], "688": ["TV"], "689": ["PF"], "690": ["TK"], "691": ["FM"], "692": ["MH"], "850": ["KP"], "852": ["HK"], "853": ["MO"], "855": ["KH"], "856": ["LA"], "880": ["BD"], "886": ["TW"], "960": ["MV"], "961": ["LB"], "962": ["JO"], "963": ["SY"], "964": ["IQ"], "965": ["KW"], "966": ["SA"], "967": ["YE"], "968": ["OM"], "970": ["PS"], "971": ["AE"], "972": ["IL"], "973": ["BH"], "974": ["QA"], "975": ["BT"], "976": ["MN"], "977": ["NP"], "992": ["TJ"], "993": ["TM"], "994": ["AZ"], "995": ["GE"], "996": ["KG"], "998": ["UZ"] }, "countries": { "AC": ["247", "00", "(?:[01589]\\d|[46])\\d{4}", [5, 6]], "AD": ["376", "00", "(?:1|6\\d)\\d{7}|[135-9]\\d{5}", [6, 8, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["[135-9]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["1"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]]], "AE": ["971", "00", "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{2,9})", "$1 $2", ["60|8"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[236]|[479][2-8]"], "0$1"], ["(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", ["[479]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"]], "0"], "AF": ["93", "00", "[2-7]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"]], "0"], "AG": ["1", "011", "(?:268|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([457]\\d{6})$|1", "268$1", 0, "268"], "AI": ["1", "011", "(?:264|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2457]\\d{6})$|1", "264$1", 0, "264"], "AL": ["355", "00", "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}", [6, 7, 8, 9], [["(\\d{3})(\\d{3,4})", "$1 $2", ["80|9"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["[23578]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1"]], "0"], "AM": ["374", "00", "(?:[1-489]\\d|55|60|77)\\d{6}", [8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0"], "0 $1"], ["(\\d{3})(\\d{5})", "$1 $2", ["2|3[12]"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[3-9]"], "0$1"]], "0"], "AO": ["244", "00", "[29]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[29]"]]]], "AR": ["54", "00", "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}", [10, 11], [["(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", 1], ["(\\d)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 15-$3-$4", ["91"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9"], "0$1", 0, "$1 $2 $3-$4"]], "0", 0, "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?", "9$1"], "AS": ["1", "011", "(?:[58]\\d\\d|684|900)\\d{7}", [10], 0, "1", 0, "([267]\\d{6})$|1", "684$1", 0, "684"], "AT": ["43", "00", "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{3,12})", "$1 $2", ["1(?:11|[2-9])"], "0$1"], ["(\\d{3})(\\d{2})", "$1 $2", ["517"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["5[079]"], "0$1"], ["(\\d{3})(\\d{3,10})", "$1 $2", ["(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]"], "0$1"], ["(\\d{4})(\\d{3,9})", "$1 $2", ["[2-467]|5[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5"], "0$1"]], "0"], "AU": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}", [5, 6, 7, 8, 9, 10, 12], [["(\\d{2})(\\d{3,4})", "$1 $2", ["16"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["14|4"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:30|[89])"]]], "0", 0, "(183[12])|0", 0, 0, 0, [["(?:(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8]))\\d{3}|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4]))|(?:6[0-8]|[78]\\d)\\d{3}|9(?:[02-9]\\d{3}|1(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79])))))\\d{3}", [9]], ["4(?:(?:79|94)[01]|83[0-389])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[0-26-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, ["163\\d{2,6}", [5, 6, 7, 8, 9]], ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "AW": ["297", "00", "(?:[25-79]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[25-9]"]]]], "AX": ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}", [5, 6, 7, 8, 9, 10, 11, 12], 0, "0", 0, 0, 0, 0, "18", 0, "00"], "AZ": ["994", "00", "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[13-9]"], "0$1"]], "0"], "BA": ["387", "00", "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-3]|[7-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]|6[56]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6"], "0$1"]], "0"], "BB": ["1", "011", "(?:246|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "246$1", 0, "246"], "BD": ["880", "00", "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{2})(\\d{4,6})", "$1-$2", ["31[5-8]|[459]1"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1-$2", ["3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:[15]|28|4[14])|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]"], "0$1"], ["(\\d{4})(\\d{3,6})", "$1-$2", ["[13-9]|22"], "0$1"], ["(\\d)(\\d{7,8})", "$1-$2", ["2"], "0$1"]], "0"], "BE": ["32", "00", "4\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[239]|4[23]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[15-8]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4"], "0$1"]], "0"], "BF": ["226", "00", "[025-7]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[025-7]"]]]], "BG": ["359", "00", "00800\\d{7}|[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}", [6, 7, 8, 9, 12], [["(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["43[1-6]|70[1-9]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:70|8)0"], "0$1"], ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[1-7]|7"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[48]|9[08]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"]], "0"], "BH": ["973", "00", "[136-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[13679]|8[02-4679]"]]]], "BI": ["257", "00", "(?:[267]\\d|31)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2367]"]]]], "BJ": ["229", "00", "[24-689]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-689]"]]]], "BL": ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["590(?:2[7-9]|3[3-7]|5[12]|87)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:395|76[018])\\d|475[0-5])\\d{4}"]]], "BM": ["1", "011", "(?:441|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "441$1", 0, "441"], "BN": ["673", "00", "[2-578]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-578]"]]]], "BO": ["591", "00(?:1\\d)?", "(?:[2-467]\\d\\d|8001)\\d{5}", [8, 9], [["(\\d)(\\d{7})", "$1 $2", ["[23]|4[46]"]], ["(\\d{8})", "$1", ["[67]"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["8"]]], "0", 0, "0(1\\d)?"], "BQ": ["599", "00", "(?:[34]1|7\\d)\\d{5}", [7], 0, 0, 0, 0, 0, 0, "[347]"], "BR": ["55", "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)", "(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-46-9]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}", [8, 9, 10, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["300|4(?:0[02]|37)", "4(?:02|37)0|[34]00"]], ["(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", ["(?:[358]|90)0"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"], "($1)"], ["(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["[16][1-9]|[2-57-9]"], "($1)"]], "0", 0, "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2"], "BS": ["1", "011", "(?:242|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([3-8]\\d{6})$|1", "242$1", 0, "242"], "BT": ["975", "00", "[17]\\d{7}|[2-8]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-68]|7[246]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[67]|7"]]]], "BW": ["267", "00", "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["90"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[24-6]|3[15-9]"]], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37]"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["8"]]]], "BY": ["375", "810", "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3})", "$1 $2", ["800"], "8 $1"], ["(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"], ["(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:[56]|7[467])|2[1-3]"], "8 0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-4]"], "8 0$1"], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[89]"], "8 $1"]], "8", 0, "0|80?", 0, 0, 0, 0, "8~10"], "BZ": ["501", "00", "(?:0800\\d|[2-8])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]], ["(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]]]], "CA": ["1", "011", "(?:[2-8]\\d|90)\\d{8}|3\\d{6}", [7, 10], 0, "1", 0, 0, 0, 0, 0, [["(?:2(?:04|[23]6|[48]9|50|63)|3(?:06|43|54|6[578]|82)|4(?:03|1[68]|[26]8|3[178]|50|74)|5(?:06|1[49]|48|79|8[147])|6(?:04|[18]3|39|47|72)|7(?:0[59]|42|53|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}", [10]], ["", [10]], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", [10]], ["900[2-9]\\d{6}", [10]], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:00|2[125-9]|33|44|66|77|88)|622)[2-9]\\d{6}", [10]], 0, ["310\\d{4}", [7]], 0, ["600[2-9]\\d{6}", [10]]]], "CC": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}", [9]], ["4(?:(?:79|94)[01]|83[0-389])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[0-26-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "CD": ["243", "00", "[189]\\d{8}|[1-68]\\d{6}", [7, 9], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]"], "0$1"]], "0"], "CF": ["236", "00", "(?:[27]\\d{3}|8776)\\d{4}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[278]"]]]], "CG": ["242", "00", "222\\d{6}|(?:0\\d|80)\\d{7}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]]]], "CH": ["41", "00", "8\\d{11}|[2-9]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]|81"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["8"], "0$1"]], "0"], "CI": ["225", "00", "[02]\\d{9}", [10], [["(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", ["2"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", ["0"]]]], "CK": ["682", "00", "[2-578]\\d{4}", [5], [["(\\d{2})(\\d{3})", "$1 $2", ["[2-578]"]]]], "CL": ["56", "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0", "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}", [9, 10, 11], [["(\\d{5})(\\d{4})", "$1 $2", ["219", "2196"], "($1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[1-36]"], "($1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9[2-9]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])"], "($1)"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"]]]], "CM": ["237", "00", "[26]\\d{8}|88\\d{6,7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["88"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]|88"]]]], "CN": ["86", "00|1(?:[12]\\d|79)\\d\\d00", "1[127]\\d{8,9}|2\\d{9}(?:\\d{2})?|[12]\\d{6,7}|86\\d{6}|(?:1[03-689]\\d|6)\\d{7,9}|(?:[3-579]\\d|8[0-57-9])\\d{6,9}", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2[0-57-9])[19]", "(?:10|2[0-57-9])(?:10|9[56])", "10(?:10|9[56])|2[0-57-9](?:100|9[56])"], "0$1"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["(?:4|80)0"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]"], "0$1", 1], ["(\\d{3})(\\d{7,8})", "$1 $2", ["9"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[3-578]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-9]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["[12]"], "0$1", 1]], "0", 0, "(1(?:[12]\\d|79)\\d\\d)|0", 0, 0, 0, 0, "00"], "CO": ["57", "00(?:4(?:[14]4|56)|[579])", "(?:60\\d\\d|9101)\\d{6}|(?:1\\d|3)\\d{9}", [10, 11], [["(\\d{3})(\\d{7})", "$1 $2", ["6"], "($1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3[0-357]|91"]], ["(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", ["1"], "0$1", 0, "$1 $2 $3"]], "0", 0, "0([3579]|4(?:[14]4|56))?"], "CR": ["506", "00", "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}", [8, 10], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[3-9]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]"]]], 0, 0, "(19(?:0[0-2468]|1[09]|20|66|77|99))"], "CU": ["53", "119", "[27]\\d{6,7}|[34]\\d{5,7}|63\\d{6}|(?:5|8\\d\\d)\\d{7}", [6, 7, 8, 10], [["(\\d{2})(\\d{4,6})", "$1 $2", ["2[1-4]|[34]"], "(0$1)"], ["(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["[56]"], "0$1"], ["(\\d{3})(\\d{7})", "$1 $2", ["8"], "0$1"]], "0"], "CV": ["238", "0", "(?:[2-59]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-589]"]]]], "CW": ["599", "00", "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[3467]"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["9[4-8]"]]], 0, 0, 0, 0, 0, "[69]"], "CX": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}", [9]], ["4(?:(?:79|94)[01]|83[0-389])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[0-26-9]|7[02-8]|8[0-24-9]|9[0-37-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "CY": ["357", "00", "(?:[279]\\d|[58]0)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[257-9]"]]]], "CZ": ["420", "00", "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["96"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]]], "DE": ["49", "00", "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:2[024-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[015]\\d|2[13]|31|[46][1-8])\\d{1,9}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [["(\\d{2})(\\d{3,13})", "$1 $2", ["3[02]|40|[68]9"], "0$1"], ["(\\d{3})(\\d{3,12})", "$1 $2", ["2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1", "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1"], "0$1"], ["(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]", "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["138"], "0$1"], ["(\\d{5})(\\d{2,10})", "$1 $2", ["3"], "0$1"], ["(\\d{3})(\\d{5,11})", "$1 $2", ["181"], "0$1"], ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["1(?:3|80)|9"], "0$1"], ["(\\d{3})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1"], ["(\\d{3})(\\d{7,12})", "$1 $2", ["8"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["18[68]"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["15[1279]"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["15[03568]", "15(?:[0568]|31)"], "0$1"], ["(\\d{3})(\\d{8})", "$1 $2", ["18"], "0$1"], ["(\\d{3})(\\d{2})(\\d{7,8})", "$1 $2 $3", ["1(?:6[023]|7)"], "0$1"], ["(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", ["15"], "0$1"]], "0"], "DJ": ["253", "00", "(?:2\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[27]"]]]], "DK": ["45", "00", "[2-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-9]"]]]], "DM": ["1", "011", "(?:[58]\\d\\d|767|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "767$1", 0, "767"], "DO": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "8001|8[024]9"], "DZ": ["213", "00", "(?:[1-4]|[5-79]\\d|80)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"], "0$1"]], "0"], "EC": ["593", "00", "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}", [8, 9, 10, 11], [["(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[2-7]"], "(0$1)", 0, "$1-$2-$3"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"]]], "0"], "EE": ["372", "00", "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88"]], ["(\\d{4})(\\d{3,4})", "$1 $2", ["[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], "EG": ["20", "00", "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}", [8, 9, 10], [["(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1"], ["(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|8[2468]|9[235-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{8})", "$1 $2", ["1"], "0$1"]], "0"], "EH": ["212", "00", "[5-8]\\d{8}", [9], 0, "0", 0, 0, 0, 0, "528[89]"], "ER": ["291", "00", "[178]\\d{6}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[178]"], "0$1"]], "0"], "ES": ["34", "00", "[5-9]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-9]"]]]], "ET": ["251", "00", "(?:11|[2-579]\\d)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-579]"], "0$1"]], "0"], "FI": ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{5})", "$1", ["20[2-59]"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]0|[68])0|70[07-9]"], "0$1"], ["(\\d{2})(\\d{4,8})", "$1 $2", ["[14]|2[09]|50|7[135]"], "0$1"], ["(\\d{2})(\\d{6,10})", "$1 $2", ["7"], "0$1"], ["(\\d)(\\d{4,9})", "$1 $2", ["(?:1[3-79]|[2568])[1-8]|3(?:0[1-9]|[1-9])|9"], "0$1"]], "0", 0, 0, 0, 0, "1[03-79]|[2-9]", 0, "00"], "FJ": ["679", "0(?:0|52)", "45\\d{5}|(?:0800\\d|[235-9])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[235-9]|45"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "FK": ["500", "00", "[2-7]\\d{4}", [5]], "FM": ["691", "00", "(?:[39]\\d\\d|820)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[389]"]]]], "FO": ["298", "00", "[2-9]\\d{5}", [6], [["(\\d{6})", "$1", ["[2-9]"]]], 0, 0, "(10(?:01|[12]0|88))"], "FR": ["33", "00", "[1-9]\\d{8}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1"]], "0"], "GA": ["241", "00", "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}", [7, 8], [["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["11|[67]"], "0$1"]], 0, 0, "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[467]\\d{6})", "$1"], "GB": ["44", "00", "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}", [7, 9, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["845", "8454", "84546", "845464"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["800"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:(?:38|69)7|5(?:24|39)|768|946)", "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["1(?:[2-69][02-9]|[78])"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1389]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0235])|4(?:[0-5]\\d\\d|69[7-9]|70[0-79])|(?:(?:5[0-26-9]|[78][0-49])\\d|6(?:[0-4]\\d|50))\\d)|(?:2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d|1(?:[0-7]\\d|8[0-2]))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d)\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}", [9, 10]], ["7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]], 0, " x"], "GD": ["1", "011", "(?:473|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "473$1", 0, "473"], "GE": ["995", "00", "(?:[3-57]\\d\\d|800)\\d{6}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["32"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[57]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1"]], "0"], "GF": ["594", "00", "[56]94\\d{6}|(?:80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[56]|9[47]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[89]"], "0$1"]], "0"], "GG": ["44", "00", "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?", [7, 9, 10], 0, "0", 0, "([25-9]\\d{5})$|0", "1481$1", 0, 0, [["1481[25-9]\\d{5}", [10]], ["7(?:(?:781|839)\\d|911[17])\\d{5}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]]], "GH": ["233", "00", "(?:[235]\\d{3}|800)\\d{5}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"], "0$1"]], "0"], "GI": ["350", "00", "(?:[25]\\d|60)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["2"]]]], "GL": ["299", "00", "(?:19|[2-689]\\d|70)\\d{4}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["19|[2-9]"]]]], "GM": ["220", "00", "[2-9]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "GN": ["224", "00", "722\\d{6}|(?:3|6\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]]]], "GP": ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0", 0, 0, 0, 0, 0, [["590(?:0[1-68]|[14][0-24-9]|2[0-68]|3[1-9]|5[3-579]|[68][0-689]|7[08]|9\\d)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:395|76[018])\\d|475[0-5])\\d{4}"]]], "GQ": ["240", "00", "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]], ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]]]], "GR": ["30", "00", "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}", [10, 11, 12], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]], ["(\\d{4})(\\d{6})", "$1 $2", ["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2689]"]], ["(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", ["8"]]]], "GT": ["502", "00", "80\\d{6}|(?:1\\d{3}|[2-7])\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-8]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], "GU": ["1", "011", "(?:[58]\\d\\d|671|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "671$1", 0, "671"], "GW": ["245", "00", "[49]\\d{8}|4\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["40"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"]]]], "GY": ["592", "001", "(?:[2-8]\\d{3}|9008)\\d{3}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "HK": ["852", "00(?:30|5[09]|[126-9]?)", "8[0-46-9]\\d{6,7}|9\\d{4,7}|(?:[2-7]|9\\d{3})\\d{7}", [5, 6, 7, 8, 9, 11], [["(\\d{3})(\\d{2,5})", "$1 $2", ["900", "9003"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "HN": ["504", "00", "8\\d{10}|[237-9]\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["[237-9]"]]]], "HR": ["385", "00", "(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}", [6, 7, 8, 9], [["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["6[01]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[67]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-5]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"]], "0"], "HT": ["509", "00", "(?:[2-489]\\d|55)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[2-589]"]]]], "HU": ["36", "00", "[235-7]\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "06 $1"]], "06"], "ID": ["62", "00[89]", "(?:(?:00[1-9]|8\\d)\\d{4}|[1-36])\\d{6}|00\\d{10}|[1-9]\\d{8,10}|[2-9]\\d{7}", [7, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["15"]], ["(\\d{2})(\\d{5,9})", "$1 $2", ["2[124]|[36]1"], "(0$1)"], ["(\\d{3})(\\d{5,7})", "$1 $2", ["800"], "0$1"], ["(\\d{3})(\\d{5,8})", "$1 $2", ["[2-79]"], "(0$1)"], ["(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", ["8[1-35-9]"], "0$1"], ["(\\d{3})(\\d{6,8})", "$1 $2", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["804"], "0$1"], ["(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["8"], "0$1"]], "0"], "IE": ["353", "00", "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}", [7, 8, 9, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"], "(0$1)"], ["(\\d{3})(\\d{5})", "$1 $2", ["[45]0"], "(0$1)"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2569]|4[1-69]|7[14]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["4"], "(0$1)"], ["(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "IL": ["972", "0(?:0|1[2-9])", "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}", [7, 8, 9, 10, 11, 12], [["(\\d{4})(\\d{3})", "$1-$2", ["125"]], ["(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]], ["(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", ["12"]], ["(\\d{4})(\\d{6})", "$1-$2", ["159"]], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]], ["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", ["15"]]], "0"], "IM": ["44", "00", "1624\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([25-8]\\d{5})$|0", "1624$1", 0, "74576|(?:16|7[56])24"], "IN": ["91", "00", "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}", [8, 9, 10, 11, 12, 13], [["(\\d{8})", "$1", ["5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)"], 0, 1], ["(\\d{4})(\\d{4,5})", "$1 $2", ["180", "1800"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], 0, 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]"], "0$1", 1], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]"], "0$1", 1], ["(\\d{5})(\\d{5})", "$1 $2", ["[6-9]"], "0$1", 1], ["(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", ["1(?:6|8[06])", "1(?:6|8[06]0)"], 0, 1], ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18"], 0, 1]], "0"], "IO": ["246", "00", "3\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["3"]]]], "IQ": ["964", "00", "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]], "0"], "IR": ["98", "00", "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}", [4, 5, 6, 7, 10], [["(\\d{4,5})", "$1", ["96"], "0$1"], ["(\\d{2})(\\d{4,5})", "$1 $2", ["(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1"]], "0"], "IS": ["354", "00|1(?:0(?:01|[12]0)|100)", "(?:38\\d|[4-9])\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "IT": ["39", "00", "0\\d{5,10}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|(?:55|70)\\d{8}|8\\d{5}(?:\\d{2,4})?", [6, 7, 8, 9, 10, 11], [["(\\d{2})(\\d{4,6})", "$1 $2", ["0[26]"]], ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))"]], ["(\\d{4})(\\d{2,6})", "$1 $2", ["0(?:[13-579][2-46-8]|8[236-8])"]], ["(\\d{4})(\\d{4})", "$1 $2", ["894"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|5"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1(?:44|[679])|[378]"]], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]|14"]], ["(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["3"]]], 0, 0, 0, 0, 0, 0, [["0669[0-79]\\d{1,6}|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}"], ["3[1-9]\\d{8}|3[2-9]\\d{7}", [9, 10]], ["80(?:0\\d{3}|3)\\d{3}", [6, 9]], ["(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", [6, 8, 9, 10]], ["1(?:78\\d|99)\\d{6}", [9, 10]], 0, 0, 0, ["55\\d{8}", [10]], ["84(?:[08]\\d{3}|[17])\\d{3}", [6, 9]]]], "JE": ["44", "00", "1534\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([0-24-8]\\d{5})$|0", "1534$1", 0, 0, [["1534[0-24-8]\\d{5}"], ["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97[7-9]))\\d{5}"], ["80(?:07(?:35|81)|8901)\\d{4}"], ["(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"], ["701511\\d{4}"], 0, ["(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}"], ["56\\d{8}"]]], "JM": ["1", "011", "(?:[58]\\d\\d|658|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "658|876"], "JO": ["962", "00", "(?:(?:[2689]|7\\d)\\d|32|53)\\d{6}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["70"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]], "0"], "JP": ["81", "010", "00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1"], ["(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51)|9(?:80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["[36]|4(?:2[09]|7[01])", "[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[0459]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[26-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9]|9[29])|5(?:2|3(?:[045]|9[0-8])|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|3(?:[29]|60)|49|51|6(?:[0-24]|36|5[0-3589]|7[23]|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3(?:[045]|9(?:[0-58]|6[4-9]|7[0-35689]))|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|60|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[2-57-9]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|7(?:2[2-468]|3[78])|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["[14]|[289][2-9]|5[3-9]|7[2-4679]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[257-9]"], "0$1"]], "0", 0, "(000[259]\\d{6})$|(?:(?:003768)0?)|0", "$1"], "KE": ["254", "000", "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}", [7, 8, 9, 10], [["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[17]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0"], "KG": ["996", "00", "8\\d{9}|[235-9]\\d{8}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[346]|[24-79])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-79]|88"], "0$1"], ["(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "KH": ["855", "00[14-9]", "1\\d{9}|[1-9]\\d{7,8}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "KI": ["686", "00", "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}", [5, 8], 0, "0"], "KM": ["269", "00", "[3478]\\d{6}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[3478]"]]]], "KN": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "869$1", 0, "869"], "KP": ["850", "00|99", "85\\d{6}|(?:19\\d|[2-7])\\d{7}", [8, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"]], "0"], "KR": ["82", "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))", "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}", [5, 6, 8, 9, 10, 11, 12, 13, 14], [["(\\d{2})(\\d{3,4})", "$1-$2", ["(?:3[1-3]|[46][1-4]|5[1-5])1"], "0$1"], ["(\\d{4})(\\d{4})", "$1-$2", ["1"]], ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60|8"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["[1346]|5[1-5]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", ["5"], "0$1"]], "0", 0, "0(8(?:[1-46-8]|5\\d\\d))?"], "KW": ["965", "00", "18\\d{5}|(?:[2569]\\d|41)\\d{6}", [7, 8], [["(\\d{4})(\\d{3,4})", "$1 $2", ["[169]|2(?:[235]|4[1-35-9])|52"]], ["(\\d{3})(\\d{5})", "$1 $2", ["[245]"]]]], "KY": ["1", "011", "(?:345|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "345$1", 0, "345"], "KZ": ["7", "810", "(?:33622|8\\d{8})\\d{5}|[78]\\d{9}", [10, 14], 0, "8", 0, 0, 0, 0, "33|7", 0, "8~10"], "LA": ["856", "00", "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["30[013-9]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0"], "LB": ["961", "00", "[27-9]\\d{7}|[13-9]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27-9]"]]], "0"], "LC": ["1", "011", "(?:[58]\\d\\d|758|900)\\d{7}", [10], 0, "1", 0, "([2-8]\\d{6})$|1", "758$1", 0, "758"], "LI": ["423", "00", "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}", [7, 9], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["69"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]], "0", 0, "(1001)|0"], "LK": ["94", "00", "[1-9]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[1-689]"], "0$1"]], "0"], "LR": ["231", "00", "(?:[25]\\d|33|77|88)\\d{7}|(?:2\\d|[4-6])\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[4-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23578]"], "0$1"]], "0"], "LS": ["266", "00", "(?:[256]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2568]"]]]], "LT": ["370", "00", "(?:[3469]\\d|52|[78]0)\\d{6}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["52[0-7]"], "(8-$1)", 1], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "8 $1", 1], ["(\\d{2})(\\d{6})", "$1 $2", ["37|4(?:[15]|6[1-8])"], "(8-$1)", 1], ["(\\d{3})(\\d{5})", "$1 $2", ["[3-6]"], "(8-$1)", 1]], "8", 0, "[08]"], "LU": ["352", "00", "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}", [4, 5, 6, 7, 8, 9, 10, 11], [["(\\d{2})(\\d{3})", "$1 $2", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20[2-689]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["2(?:[0367]|4[3-8])"]], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["80[01]|90[015]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["2(?:[0367]|4[3-8])"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})", "$1 $2 $3 $4", ["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"]]], 0, 0, "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"], "LV": ["371", "00", "(?:[268]\\d|90)\\d{6}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[269]|8[01]"]]]], "LY": ["218", "00", "[2-9]\\d{8}", [9], [["(\\d{2})(\\d{7})", "$1-$2", ["[2-9]"], "0$1"]], "0"], "MA": ["212", "00", "[5-8]\\d{8}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5[45]"], "0$1"], ["(\\d{4})(\\d{5})", "$1-$2", ["5(?:2[2-489]|3[5-9]|9)|8(?:0[89]|92)", "5(?:2(?:[2-49]|8[235-9])|3[5-9]|9)|8(?:0[89]|92)"], "0$1"], ["(\\d{2})(\\d{7})", "$1-$2", ["8"], "0$1"], ["(\\d{3})(\\d{6})", "$1-$2", ["[5-7]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["5(?:2(?:[0-25-79]\\d|3[1-578]|4[02-46-8]|8[0235-7])|3(?:[0-47]\\d|5[02-9]|6[02-8]|8[014-9]|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}"], ["(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[0167]\\d|2[0-2]|5[01]|8[0-3]))\\d{6}"], ["80[0-7]\\d{6}"], ["89\\d{7}"], 0, 0, 0, 0, ["(?:592(?:4[0-2]|93)|80[89]\\d\\d)\\d{4}"]]], "MC": ["377", "00", "(?:[3489]|6\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[389]"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["6"], "0$1"]], "0"], "MD": ["373", "00", "(?:[235-7]\\d|[89]0)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[25-7]"], "0$1"]], "0"], "ME": ["382", "00", "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "0$1"]], "0"], "MF": ["590", "00", "590\\d{6}|(?:69|80|9\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["590(?:0[079]|[14]3|[27][79]|3[03-7]|5[0-268]|87)\\d{4}"], ["69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}"], ["80[0-5]\\d{6}"], 0, 0, 0, 0, 0, ["9(?:(?:395|76[018])\\d|475[0-5])\\d{4}"]]], "MG": ["261", "00", "[23]\\d{8}", [9], [["(\\d{2})(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0", 0, "([24-9]\\d{6})$|0", "20$1"], "MH": ["692", "011", "329\\d{4}|(?:[256]\\d|45)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-6]"]]], "1"], "MK": ["389", "00", "[2-578]\\d{7}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2|34[47]|4(?:[37]7|5[47]|64)"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1"]], "0"], "ML": ["223", "00", "[24-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-9]"]]]], "MM": ["95", "00", "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}", [6, 7, 8, 9, 10], [["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[4-7]|8[1-35]"], "0$1"], ["(\\d)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[137-9])"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92"], "0$1"], ["(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", ["9"], "0$1"]], "0"], "MN": ["976", "001", "[12]\\d{7,9}|[5-9]\\d{7}", [8, 9, 10], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[5-9]"]], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["[12](?:27|3[2-8]|4[2-68]|5[1-4689])", "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["[12]"], "0$1"]], "0"], "MO": ["853", "00", "0800\\d{3}|(?:28|[68]\\d)\\d{6}", [7, 8], [["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[268]"]]]], "MP": ["1", "011", "[58]\\d{9}|(?:67|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "670$1", 0, "670"], "MQ": ["596", "00", "596\\d{6}|(?:69|80|9\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[569]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "MR": ["222", "00", "(?:[2-4]\\d\\d|800)\\d{5}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-48]"]]]], "MS": ["1", "011", "(?:[58]\\d\\d|664|900)\\d{7}", [10], 0, "1", 0, "([34]\\d{6})$|1", "664$1", 0, "664"], "MT": ["356", "00", "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2357-9]"]]]], "MU": ["230", "0(?:0|[24-7]0|3[03])", "(?:[57]|8\\d\\d)\\d{7}|[2-468]\\d{6}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-46]|8[013]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[57]"]], ["(\\d{5})(\\d{5})", "$1 $2", ["8"]]], 0, 0, 0, 0, 0, 0, 0, "020"], "MV": ["960", "0(?:0|19)", "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}", [7, 10], [["(\\d{3})(\\d{4})", "$1-$2", ["[34679]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "MW": ["265", "00", "(?:[1289]\\d|31|77)\\d{7}|1\\d{6}", [7, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[137-9]"], "0$1"]], "0"], "MX": ["52", "0[09]", "1(?:(?:[27]2|44|87|99)[1-9]|65[0-689])\\d{7}|(?:1(?:[01]\\d|2[13-9]|[35][1-9]|4[0-35-9]|6[0-46-9]|7[013-9]|8[1-69]|9[1-8])|[2-9]\\d)\\d{8}", [10, 11], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["33|5[56]|81"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-9]"], 0, 1], ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 $3 $4", ["1(?:33|5[56]|81)"], 0, 1], ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 $3 $4", ["1"], 0, 1]], "01", 0, "0(?:[12]|4[45])|1", 0, 0, 0, 0, "00"], "MY": ["60", "00", "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1(?:[02469]|[378][1-9]|53)|8", "1(?:[02469]|[37][1-9]|53|8(?:[1-46-9]|5[7-9]))|8"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1(?:[367]|80)"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", ["1"], "0$1"]], "0"], "MZ": ["258", "00", "(?:2|8\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-79]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], "NA": ["264", "00", "[68]\\d{7,8}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["87"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], "NC": ["687", "00", "(?:050|[2-57-9]\\d\\d)\\d{3}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[02-57-9]"]]]], "NE": ["227", "00", "[027-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[089]|2[013]|7[047]"]]]], "NF": ["672", "00", "[13]\\d{5}", [6], [["(\\d{2})(\\d{4})", "$1 $2", ["1[0-3]"]], ["(\\d)(\\d{5})", "$1 $2", ["[13]"]]], 0, 0, "([0-258]\\d{4})$", "3$1"], "NG": ["234", "009", "(?:[124-7]|9\\d{3})\\d{6}|[1-9]\\d{7}|[78]\\d{9,13}", [7, 8, 10, 11, 12, 13, 14], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["78"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]|9(?:0[3-9]|[1-9])"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[3-7]|8[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[7-9]"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]"], "0$1"]], "0"], "NI": ["505", "00", "(?:1800|[25-8]\\d{3})\\d{4}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[125-8]"]]]], "NL": ["31", "00", "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|8\\d{6,9}|9\\d{6,10}|1\\d{4,5}", [5, 6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{4,7})", "$1 $2", ["[89]0"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["66"], "0$1"], ["(\\d)(\\d{8})", "$1 $2", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-578]|91"], "0$1"], ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", ["9"], "0$1"]], "0"], "NO": ["47", "00", "(?:0|[2-9]\\d{3})\\d{4}", [5, 8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]"]]], 0, 0, 0, 0, 0, "[02-689]|7[0-8]"], "NP": ["977", "00", "(?:1\\d|9)\\d{9}|[1-9]\\d{7}", [8, 10, 11], [["(\\d)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1"], ["(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-59]|[67][2-6])"], "0$1"], ["(\\d{3})(\\d{7})", "$1-$2", ["9"]]], "0"], "NR": ["674", "00", "(?:444|(?:55|8\\d)\\d|666)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[4-68]"]]]], "NU": ["683", "00", "(?:[4-7]|888\\d)\\d{3}", [4, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["8"]]]], "NZ": ["64", "0(?:0|161)", "[1289]\\d{9}|50\\d{5}(?:\\d{2,3})?|[27-9]\\d{7,8}|(?:[34]\\d|6[0-35-9])\\d{6}|8\\d{4,6}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,8})", "$1 $2", ["8[1-79]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["50[036-8]|8|90", "50(?:[0367]|88)|8|90"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["24|[346]|7[2-57-9]|9[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|[589]"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1|2[028]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:[169]|7[0-35-9])|7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "00"], "OM": ["968", "00", "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}", [7, 8, 9], [["(\\d{3})(\\d{4,6})", "$1 $2", ["[58]"]], ["(\\d{2})(\\d{6})", "$1 $2", ["2"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[179]"]]]], "PA": ["507", "00", "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}", [7, 8, 10, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]], ["(\\d{4})(\\d{4})", "$1-$2", ["[68]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]]], "PE": ["51", "00|19(?:1[124]|77|90)00", "(?:[14-8]|9\\d)\\d{7}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["1"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[4-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]]], "0", 0, 0, 0, 0, 0, 0, "00", " Anexo "], "PF": ["689", "00", "4\\d{5}(?:\\d{2})?|8\\d{7,8}", [6, 8, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4|8[7-9]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], "PG": ["675", "00|140[1-3]", "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["18|[2-69]|85"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[78]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "PH": ["63", "00", "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}", [6, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{5})", "$1 $2", ["2"], "(0$1)"], ["(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)"], ["(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|8[2-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]]], "0"], "PK": ["92", "00", "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", ["[89]0"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["1"]], ["(\\d{3})(\\d{6,7})", "$1 $2", ["2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])", "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]"], "(0$1)"], ["(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"], "(0$1)"], ["(\\d{5})(\\d{5})", "$1 $2", ["58"], "(0$1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[24-9]"], "(0$1)"]], "0"], "PL": ["48", "00", "(?:6|8\\d\\d)\\d{7}|[1-9]\\d{6}(?:\\d{2})?|[26]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{5})", "$1", ["19"]], ["(\\d{3})(\\d{3})", "$1 $2", ["11|20|64"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1", "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"]], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[2-8]|[2-7]|8[1-79]|9[145]"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["8"]]]], "PM": ["508", "00", "[45]\\d{5}|(?:708|80\\d)\\d{6}", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[45]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "PR": ["1", "011", "(?:[589]\\d\\d|787)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "787|939"], "PS": ["970", "00", "[2489]2\\d{6}|(?:1\\d|5)\\d{8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2489]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "PT": ["351", "00", "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["16|[236-9]"]]]], "PW": ["680", "01[12]", "(?:[24-8]\\d\\d|345|900)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "PY": ["595", "00", "59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"], "(0$1)"], ["(\\d{3})(\\d{4,5})", "$1 $2", ["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["87"]], ["(\\d{3})(\\d{6})", "$1 $2", ["9(?:[5-79]|8[1-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]], "0"], "QA": ["974", "00", "800\\d{4}|(?:2|800)\\d{6}|(?:0080|[3-7])\\d{7}", [7, 8, 9, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["2[16]|8"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[3-7]"]]]], "RE": ["262", "00", "(?:26|[689]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2689]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["26(?:2\\d\\d|3(?:0\\d|1[0-6]))\\d{4}"], ["69(?:2\\d\\d|3(?:[06][0-6]|1[013]|2[0-2]|3[0-39]|4\\d|5[0-5]|7[0-37]|8[0-8]|9[0-479]))\\d{4}"], ["80\\d{7}"], ["89[1-37-9]\\d{6}"], 0, 0, 0, 0, ["9(?:399[0-3]|479[0-5]|76(?:2[27]|3[0-37]))\\d{4}"], ["8(?:1[019]|2[0156]|84|90)\\d{6}"]]], "RO": ["40", "00", "(?:[236-8]\\d|90)\\d{7}|[23]\\d{5}", [6, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["2[3-6]", "2[3-6]\\d9"], "0$1"], ["(\\d{2})(\\d{4})", "$1 $2", ["219|31"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[236-9]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, " int "], "RS": ["381", "00", "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}", [6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{3,9})", "$1 $2", ["(?:2[389]|39)0|[7-9]"], "0$1"], ["(\\d{2})(\\d{5,10})", "$1 $2", ["[1-36]"], "0$1"]], "0"], "RU": ["7", "810", "8\\d{13}|[347-9]\\d{9}", [10, 14], [["(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2"], "8 ($1)", 1], ["(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[349]|8(?:[02-7]|1[1-8])"], "8 ($1)", 1], ["(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["8"], "8 ($1)"]], "8", 0, 0, 0, 0, "3[04-689]|[489]", 0, "8~10"], "RW": ["250", "00", "(?:06|[27]\\d\\d|[89]00)\\d{6}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"]], "0"], "SA": ["966", "00", "92\\d{7}|(?:[15]|8\\d)\\d{8}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["9"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["81"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]], "0"], "SB": ["677", "0[01]", "(?:[1-6]|[7-9]\\d\\d)\\d{4}", [5, 7], [["(\\d{2})(\\d{5})", "$1 $2", ["7|8[4-9]|9(?:[1-8]|9[0-8])"]]]], "SC": ["248", "010|0[0-2]", "800\\d{4}|(?:[249]\\d|64)\\d{5}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]|9[57]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "SD": ["249", "00", "[19]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], "SE": ["46", "00", "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}", [6, 7, 8, 9, 10], [["(\\d{2})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{4})", "$1-$2", ["9(?:00|39|44|9)"], "0$1", 0, "$1 $2"], ["(\\d{2})(\\d{3})(\\d{2})", "$1-$2 $3", ["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3"], ["(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{2,3})(\\d{3})", "$1-$2 $3", ["9(?:00|39|44)"], "0$1", 0, "$1 $2 $3"], ["(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["10|7"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", ["[26]"], "0$1", 0, "$1 $2 $3 $4 $5"]], "0"], "SG": ["65", "0[0-3]\\d", "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}", [8, 10, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[369]|8(?:0[1-8]|[1-9])"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], "SH": ["290", "00", "(?:[256]\\d|8)\\d{3}", [4, 5], 0, 0, 0, 0, 0, 0, "[256]"], "SI": ["386", "00|10(?:22|66|88|99)", "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}", [5, 6, 7, 8], [["(\\d{2})(\\d{3,6})", "$1 $2", ["8[09]|9"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["59|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[0139]|51|6"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-57]"], "(0$1)"]], "0", 0, 0, 0, 0, 0, 0, "00"], "SJ": ["47", "00", "0\\d{4}|(?:[489]\\d|79)\\d{6}", [5, 8], 0, 0, 0, 0, 0, 0, "79"], "SK": ["421", "00", "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}", [6, 7, 9], [["(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", ["21"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["[3-5][1-8]1", "[3-5][1-8]1[67]"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", ["[3-5]"], "0$1"]], "0"], "SL": ["232", "00", "(?:[237-9]\\d|66)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[236-9]"], "(0$1)"]], "0"], "SM": ["378", "00", "(?:0549|[5-7]\\d)\\d{6}", [8, 10], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]], ["(\\d{4})(\\d{6})", "$1 $2", ["0"]]], 0, 0, "([89]\\d{5})$", "0549$1"], "SN": ["221", "00", "(?:[378]\\d|93)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]]]], "SO": ["252", "00", "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}", [6, 7, 8, 9], [["(\\d{2})(\\d{4})", "$1 $2", ["8[125]"]], ["(\\d{6})", "$1", ["[134]"]], ["(\\d)(\\d{6})", "$1 $2", ["[15]|2[0-79]|3[0-46-8]|4[0-7]"]], ["(\\d)(\\d{7})", "$1 $2", ["(?:2|90)4|[67]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[348]|64|79|90"]], ["(\\d{2})(\\d{5,7})", "$1 $2", ["1|28|6[0-35-9]|77|9[2-9]"]]], "0"], "SR": ["597", "00", "(?:[2-5]|68|[78]\\d)\\d{5}", [6, 7], [["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]], ["(\\d{3})(\\d{3})", "$1-$2", ["[2-5]"]], ["(\\d{3})(\\d{4})", "$1-$2", ["[6-8]"]]]], "SS": ["211", "00", "[19]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], "ST": ["239", "00", "(?:22|9\\d)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[29]"]]]], "SV": ["503", "00", "[267]\\d{7}|[89]00\\d{4}(?:\\d{4})?", [7, 8, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[267]"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]]]], "SX": ["1", "011", "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "(5\\d{6})$|1", "721$1", 0, "721"], "SY": ["963", "00", "[1-39]\\d{8}|[1-5]\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-5]"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1", 1]], "0"], "SZ": ["268", "00", "0800\\d{4}|(?:[237]\\d|900)\\d{6}", [8, 9], [["(\\d{4})(\\d{4})", "$1 $2", ["[0237]"]], ["(\\d{5})(\\d{4})", "$1 $2", ["9"]]]], "TA": ["290", "00", "8\\d{3}", [4], 0, 0, 0, 0, 0, 0, "8"], "TC": ["1", "011", "(?:[58]\\d\\d|649|900)\\d{7}", [10], 0, "1", 0, "([2-479]\\d{6})$|1", "649$1", 0, "649"], "TD": ["235", "00|16", "(?:22|[69]\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2679]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "TG": ["228", "00", "[279]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[279]"]]]], "TH": ["66", "00[1-9]", "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}", [8, 9, 10, 13], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "TJ": ["992", "810", "[0-57-9]\\d{8}", [9], [["(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["44[02-479]|[34]7"]], ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3[1-5]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[0-57-9]"]]], 0, 0, 0, 0, 0, 0, 0, "8~10"], "TK": ["690", "00", "[2-47]\\d{3,6}", [4, 5, 6, 7]], "TL": ["670", "00", "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]|70"]], ["(\\d{4})(\\d{4})", "$1 $2", ["7"]]]], "TM": ["993", "810", "[1-6]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"], "(8 $1)"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-5]"], "(8 $1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["6"], "8 $1"]], "8", 0, 0, 0, 0, 0, 0, "8~10"], "TN": ["216", "00", "[2-57-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]"]]]], "TO": ["676", "00", "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}", [5, 7], [["(\\d{2})(\\d{3})", "$1-$2", ["[2-4]|50|6[09]|7[0-24-69]|8[05]"]], ["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[5-9]"]]]], "TR": ["90", "00", "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}", [7, 10, 12, 13], [["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["512|8[01589]|90"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5(?:[0-59]|61)", "5(?:[0-59]|61[06])", "5(?:[0-59]|61[06]1)"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24][1-8]|3[1-9]"], "(0$1)", 1], ["(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", ["80"], "0$1", 1]], "0"], "TT": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-46-8]\\d{6})$|1", "868$1", 0, "868"], "TV": ["688", "00", "(?:2|7\\d\\d|90)\\d{4}", [5, 6, 7], [["(\\d{2})(\\d{3})", "$1 $2", ["2"]], ["(\\d{2})(\\d{4})", "$1 $2", ["90"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], "TW": ["886", "0(?:0[25-79]|19)", "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}", [7, 8, 9, 10, 11], [["(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", ["202"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[258]0"], "0$1"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]", "[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, "#"], "TZ": ["255", "00[056]", "(?:[25-8]\\d|41|90)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["5"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1"]], "0"], "UA": ["380", "00", "[89]\\d{9}|[3-9]\\d{8}", [9, 10], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]", "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6(?:[12][3-7]|[459])", "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6(?:[12][3-7]|[459])"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|89|9[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "0~0"], "UG": ["256", "00[057]", "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}", [9], [["(\\d{4})(\\d{5})", "$1 $2", ["202", "2024"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[27-9]|4(?:6[45]|[7-9])"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[34]"], "0$1"]], "0"], "US": ["1", "011", "[2-9]\\d{9}|3\\d{6}", [10], [["(\\d{3})(\\d{4})", "$1-$2", ["310"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", ["[2-9]"], 0, 1, "$1-$2-$3"]], "1", 0, 0, 0, 0, 0, [["(?:5056(?:[0-35-9]\\d|4[468])|73020\\d)\\d{4}|(?:472[24]|505[2-57-9]|983[289])\\d{6}|(?:2(?:0[1-35-9]|1[02-9]|2[03-57-9]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[013569]|3[0-24679]|4[167]|5[0-2]|6[0149]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[349]|7[0589]|8[04])|5(?:0[1-47-9]|1[0235-8]|20|3[0149]|4[01]|5[179]|6[1-47]|7[0-5]|8[0256])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[01679]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[068]|3[0-2589]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01357-9]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}"], [""], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"], ["900[2-9]\\d{6}"], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[125-9]|33|44|66|77|88)[2-9]\\d{6}"]]], "UY": ["598", "0(?:0|1[3-9]\\d)", "0004\\d{2,9}|[1249]\\d{7}|(?:[49]\\d|80)\\d{5}", [6, 7, 8, 9, 10, 11, 12, 13], [["(\\d{3})(\\d{3,4})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[49]0|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[124]"]], ["(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3 $4", ["0"]]], "0", 0, 0, 0, 0, 0, 0, "00", " int. "], "UZ": ["998", "810", "(?:20|33|[5-79]\\d|88)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-9]"], "8 $1"]], "8", 0, 0, 0, 0, 0, 0, "8~10"], "VA": ["39", "00", "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}", [6, 7, 8, 9, 10, 11], 0, 0, 0, 0, 0, 0, "06698"], "VC": ["1", "011", "(?:[58]\\d\\d|784|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "784$1", 0, "784"], "VE": ["58", "00", "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}", [10], [["(\\d{3})(\\d{7})", "$1-$2", ["[24-689]"], "0$1"]], "0"], "VG": ["1", "011", "(?:284|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-578]\\d{6})$|1", "284$1", 0, "284"], "VI": ["1", "011", "[58]\\d{9}|(?:34|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "340$1", 0, "340"], "VN": ["84", "00", "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}", [7, 8, 9, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["80"], "0$1", 1], ["(\\d{4})(\\d{4,6})", "$1 $2", ["1"], 0, 1], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["6"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[357-9]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2[48]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["2"], "0$1", 1]], "0"], "VU": ["678", "00", "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}", [5, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["[57-9]"]]]], "WF": ["681", "00", "(?:40|72)\\d{4}|8\\d{5}(?:\\d{3})?", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[478]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], "WS": ["685", "0", "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}", [5, 6, 7, 10], [["(\\d{5})", "$1", ["[2-5]|6[1-9]"]], ["(\\d{3})(\\d{3,7})", "$1 $2", ["[68]"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], "XK": ["383", "00", "[23]\\d{7,8}|(?:4\\d\\d|[89]00)\\d{5}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[23]"], "0$1"]], "0"], "YE": ["967", "00", "(?:1|7\\d)\\d{7}|[1-7]\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7(?:[24-6]|8[0-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"]], "0"], "YT": ["262", "00", "(?:80|9\\d)\\d{7}|(?:26|63)9\\d{6}", [9], 0, "0", 0, 0, 0, 0, 0, [["269(?:0[0-467]|5[0-4]|6\\d|[78]0)\\d{4}"], ["639(?:0[0-79]|1[019]|[267]\\d|3[09]|40|5[05-9]|9[04-79])\\d{4}"], ["80\\d{7}"], 0, 0, 0, 0, 0, ["9(?:(?:39|47)8[01]|769\\d)\\d{4}"]]], "ZA": ["27", "00", "[1-79]\\d{8}|8\\d{4,9}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], "ZM": ["260", "00", "800\\d{6}|(?:21|63|[79]\\d)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[28]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[79]"], "0$1"]], "0"], "ZW": ["263", "00", "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}", [5, 6, 7, 8, 9, 10], [["(\\d{3})(\\d{3,5})", "$1 $2", ["2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]"], "0$1"], ["(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["80"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2", "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)", "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["29[013-9]|39|54"], "0$1"], ["(\\d{4})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258|5483"], "0$1"]], "0"] }, "nonGeographic": { "800": ["800", 0, "(?:00|[1-9]\\d)\\d{6}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["\\d"]]], 0, 0, 0, 0, 0, 0, [0, 0, ["(?:00|[1-9]\\d)\\d{6}"]]], "808": ["808", 0, "[1-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[1-9]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, ["[1-9]\\d{7}"]]], "870": ["870", 0, "7\\d{11}|[35-7]\\d{8}", [9, 12], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[35-7]"]]], 0, 0, 0, 0, 0, 0, [0, ["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"]]], "878": ["878", 0, "10\\d{10}", [12], [["(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", ["1"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["10\\d{10}"]]], "881": ["881", 0, "6\\d{9}|[0-36-9]\\d{8}", [9, 10], [["(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[0-37-9]"]], ["(\\d)(\\d{3})(\\d{5,6})", "$1 $2 $3", ["6"]]], 0, 0, 0, 0, 0, 0, [0, ["6\\d{9}|[0-36-9]\\d{8}"]]], "882": ["882", 0, "[13]\\d{6}(?:\\d{2,5})?|[19]\\d{7}|(?:[25]\\d\\d|4)\\d{7}(?:\\d{2})?", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5})", "$1 $2", ["16|342"]], ["(\\d{2})(\\d{6})", "$1 $2", ["49"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["1[36]|9"]], ["(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["3[23]"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["16"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|23|3(?:[15]|4[57])|4|51"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["34"]], ["(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["[1-35]"]]], 0, 0, 0, 0, 0, 0, [0, ["342\\d{4}|(?:337|49)\\d{6}|(?:3(?:2|47|7\\d{3})|50\\d{3})\\d{7}", [7, 8, 9, 10, 12]], 0, 0, 0, 0, 0, 0, ["1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:345\\d|9[89])\\d{6}|(?:10|2(?:3|85\\d)|3(?:[15]|[69]\\d\\d)|4[15-8]|51)\\d{8}"]]], "883": ["883", 0, "(?:[1-4]\\d|51)\\d{6,10}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,8})", "$1 $2 $3", ["[14]|2[24-689]|3[02-689]|51[24-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["21"]], ["(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[235]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["(?:2(?:00\\d\\d|10)|(?:370[1-9]|51\\d0)\\d)\\d{7}|51(?:00\\d{5}|[24-9]0\\d{4,7})|(?:1[0-79]|2[24-689]|3[02-689]|4[0-4])0\\d{5,9}"]]], "888": ["888", 0, "\\d{11}", [11], [["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3"]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, ["\\d{11}"]]], "979": ["979", 0, "[1359]\\d{8}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[1359]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, ["[1359]\\d{8}"]]] } };
function withMetadataArgument(func, _arguments) {
  var args = Array.prototype.slice.call(_arguments);
  args.push(metadata);
  return func.apply(this, args);
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$1(obj);
}
function _defineProperties$2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$2(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$2(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$2(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result2;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result2 = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result2 = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result2);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
var ParseError = /* @__PURE__ */ function(_Error) {
  _inherits(ParseError2, _Error);
  var _super = _createSuper(ParseError2);
  function ParseError2(code) {
    var _this;
    _classCallCheck$2(this, ParseError2);
    _this = _super.call(this, code);
    Object.setPrototypeOf(_assertThisInitialized(_this), ParseError2.prototype);
    _this.name = _this.constructor.name;
    return _this;
  }
  return _createClass$2(ParseError2);
}(/* @__PURE__ */ _wrapNativeSuper(Error));
var MIN_LENGTH_FOR_NSN = 2;
var MAX_LENGTH_FOR_NSN = 17;
var MAX_LENGTH_COUNTRY_CODE = 3;
var VALID_DIGITS = "0-9０-９٠-٩۰-۹";
var DASHES = "-‐-―−ー－";
var SLASHES = "／/";
var DOTS = "．.";
var WHITESPACE = "  ­​⁠　";
var BRACKETS = "()（）［］\\[\\]";
var TILDES = "~⁓∼～";
var VALID_PUNCTUATION = "".concat(DASHES).concat(SLASHES).concat(DOTS).concat(WHITESPACE).concat(BRACKETS).concat(TILDES);
var PLUS_CHARS = "+＋";
function compare(a, b) {
  a = a.split("-");
  b = b.split("-");
  var pa = a[0].split(".");
  var pb = b[0].split(".");
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb)
      return 1;
    if (nb > na)
      return -1;
    if (!isNaN(na) && isNaN(nb))
      return 1;
    if (isNaN(na) && !isNaN(nb))
      return -1;
  }
  if (a[1] && b[1]) {
    return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
  }
  return !a[1] && b[1] ? 1 : a[1] && !b[1] ? -1 : 0;
}
var objectConstructor = {}.constructor;
function isObject(object) {
  return object !== void 0 && object !== null && object.constructor === objectConstructor;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
var V3 = "1.2.0";
var V4 = "1.7.35";
var DEFAULT_EXT_PREFIX = " ext. ";
var CALLING_CODE_REG_EXP = /^\d+$/;
var Metadata = /* @__PURE__ */ function() {
  function Metadata2(metadata2) {
    _classCallCheck$1(this, Metadata2);
    validateMetadata(metadata2);
    this.metadata = metadata2;
    setVersion.call(this, metadata2);
  }
  _createClass$1(Metadata2, [{
    key: "getCountries",
    value: function getCountries() {
      return Object.keys(this.metadata.countries).filter(function(_) {
        return _ !== "001";
      });
    }
  }, {
    key: "getCountryMetadata",
    value: function getCountryMetadata(countryCode) {
      return this.metadata.countries[countryCode];
    }
  }, {
    key: "nonGeographic",
    value: function nonGeographic() {
      if (this.v1 || this.v2 || this.v3)
        return;
      return this.metadata.nonGeographic || this.metadata.nonGeographical;
    }
  }, {
    key: "hasCountry",
    value: function hasCountry(country) {
      return this.getCountryMetadata(country) !== void 0;
    }
  }, {
    key: "hasCallingCode",
    value: function hasCallingCode(callingCode) {
      if (this.getCountryCodesForCallingCode(callingCode)) {
        return true;
      }
      if (this.nonGeographic()) {
        if (this.nonGeographic()[callingCode]) {
          return true;
        }
      } else {
        var countryCodes = this.countryCallingCodes()[callingCode];
        if (countryCodes && countryCodes.length === 1 && countryCodes[0] === "001") {
          return true;
        }
      }
    }
  }, {
    key: "isNonGeographicCallingCode",
    value: function isNonGeographicCallingCode(callingCode) {
      if (this.nonGeographic()) {
        return this.nonGeographic()[callingCode] ? true : false;
      } else {
        return this.getCountryCodesForCallingCode(callingCode) ? false : true;
      }
    }
    // Deprecated.
  }, {
    key: "country",
    value: function country(countryCode) {
      return this.selectNumberingPlan(countryCode);
    }
  }, {
    key: "selectNumberingPlan",
    value: function selectNumberingPlan(countryCode, callingCode) {
      if (countryCode && CALLING_CODE_REG_EXP.test(countryCode)) {
        callingCode = countryCode;
        countryCode = null;
      }
      if (countryCode && countryCode !== "001") {
        if (!this.hasCountry(countryCode)) {
          throw new Error("Unknown country: ".concat(countryCode));
        }
        this.numberingPlan = new NumberingPlan(this.getCountryMetadata(countryCode), this);
      } else if (callingCode) {
        if (!this.hasCallingCode(callingCode)) {
          throw new Error("Unknown calling code: ".concat(callingCode));
        }
        this.numberingPlan = new NumberingPlan(this.getNumberingPlanMetadata(callingCode), this);
      } else {
        this.numberingPlan = void 0;
      }
      return this;
    }
  }, {
    key: "getCountryCodesForCallingCode",
    value: function getCountryCodesForCallingCode(callingCode) {
      var countryCodes = this.countryCallingCodes()[callingCode];
      if (countryCodes) {
        if (countryCodes.length === 1 && countryCodes[0].length === 3) {
          return;
        }
        return countryCodes;
      }
    }
  }, {
    key: "getCountryCodeForCallingCode",
    value: function getCountryCodeForCallingCode(callingCode) {
      var countryCodes = this.getCountryCodesForCallingCode(callingCode);
      if (countryCodes) {
        return countryCodes[0];
      }
    }
  }, {
    key: "getNumberingPlanMetadata",
    value: function getNumberingPlanMetadata(callingCode) {
      var countryCode = this.getCountryCodeForCallingCode(callingCode);
      if (countryCode) {
        return this.getCountryMetadata(countryCode);
      }
      if (this.nonGeographic()) {
        var metadata2 = this.nonGeographic()[callingCode];
        if (metadata2) {
          return metadata2;
        }
      } else {
        var countryCodes = this.countryCallingCodes()[callingCode];
        if (countryCodes && countryCodes.length === 1 && countryCodes[0] === "001") {
          return this.metadata.countries["001"];
        }
      }
    }
    // Deprecated.
  }, {
    key: "countryCallingCode",
    value: function countryCallingCode() {
      return this.numberingPlan.callingCode();
    }
    // Deprecated.
  }, {
    key: "IDDPrefix",
    value: function IDDPrefix() {
      return this.numberingPlan.IDDPrefix();
    }
    // Deprecated.
  }, {
    key: "defaultIDDPrefix",
    value: function defaultIDDPrefix() {
      return this.numberingPlan.defaultIDDPrefix();
    }
    // Deprecated.
  }, {
    key: "nationalNumberPattern",
    value: function nationalNumberPattern() {
      return this.numberingPlan.nationalNumberPattern();
    }
    // Deprecated.
  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      return this.numberingPlan.possibleLengths();
    }
    // Deprecated.
  }, {
    key: "formats",
    value: function formats() {
      return this.numberingPlan.formats();
    }
    // Deprecated.
  }, {
    key: "nationalPrefixForParsing",
    value: function nationalPrefixForParsing() {
      return this.numberingPlan.nationalPrefixForParsing();
    }
    // Deprecated.
  }, {
    key: "nationalPrefixTransformRule",
    value: function nationalPrefixTransformRule() {
      return this.numberingPlan.nationalPrefixTransformRule();
    }
    // Deprecated.
  }, {
    key: "leadingDigits",
    value: function leadingDigits() {
      return this.numberingPlan.leadingDigits();
    }
    // Deprecated.
  }, {
    key: "hasTypes",
    value: function hasTypes() {
      return this.numberingPlan.hasTypes();
    }
    // Deprecated.
  }, {
    key: "type",
    value: function type(_type) {
      return this.numberingPlan.type(_type);
    }
    // Deprecated.
  }, {
    key: "ext",
    value: function ext() {
      return this.numberingPlan.ext();
    }
  }, {
    key: "countryCallingCodes",
    value: function countryCallingCodes() {
      if (this.v1)
        return this.metadata.country_phone_code_to_countries;
      return this.metadata.country_calling_codes;
    }
    // Deprecated.
  }, {
    key: "chooseCountryByCountryCallingCode",
    value: function chooseCountryByCountryCallingCode(callingCode) {
      return this.selectNumberingPlan(callingCode);
    }
  }, {
    key: "hasSelectedNumberingPlan",
    value: function hasSelectedNumberingPlan() {
      return this.numberingPlan !== void 0;
    }
  }]);
  return Metadata2;
}();
var NumberingPlan = /* @__PURE__ */ function() {
  function NumberingPlan2(metadata2, globalMetadataObject) {
    _classCallCheck$1(this, NumberingPlan2);
    this.globalMetadataObject = globalMetadataObject;
    this.metadata = metadata2;
    setVersion.call(this, globalMetadataObject.metadata);
  }
  _createClass$1(NumberingPlan2, [{
    key: "callingCode",
    value: function callingCode() {
      return this.metadata[0];
    }
    // Formatting information for regions which share
    // a country calling code is contained by only one region
    // for performance reasons. For example, for NANPA region
    // ("North American Numbering Plan Administration",
    //  which includes USA, Canada, Cayman Islands, Bahamas, etc)
    // it will be contained in the metadata for `US`.
  }, {
    key: "getDefaultCountryMetadataForRegion",
    value: function getDefaultCountryMetadataForRegion() {
      return this.globalMetadataObject.getNumberingPlanMetadata(this.callingCode());
    }
    // Is always present.
  }, {
    key: "IDDPrefix",
    value: function IDDPrefix() {
      if (this.v1 || this.v2)
        return;
      return this.metadata[1];
    }
    // Is only present when a country supports multiple IDD prefixes.
  }, {
    key: "defaultIDDPrefix",
    value: function defaultIDDPrefix() {
      if (this.v1 || this.v2)
        return;
      return this.metadata[12];
    }
  }, {
    key: "nationalNumberPattern",
    value: function nationalNumberPattern() {
      if (this.v1 || this.v2)
        return this.metadata[1];
      return this.metadata[2];
    }
    // "possible length" data is always present in Google's metadata.
  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      if (this.v1)
        return;
      return this.metadata[this.v2 ? 2 : 3];
    }
  }, {
    key: "_getFormats",
    value: function _getFormats(metadata2) {
      return metadata2[this.v1 ? 2 : this.v2 ? 3 : 4];
    }
    // For countries of the same region (e.g. NANPA)
    // formats are all stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "formats",
    value: function formats() {
      var _this = this;
      var formats2 = this._getFormats(this.metadata) || this._getFormats(this.getDefaultCountryMetadataForRegion()) || [];
      return formats2.map(function(_) {
        return new Format(_, _this);
      });
    }
  }, {
    key: "nationalPrefix",
    value: function nationalPrefix() {
      return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
    }
  }, {
    key: "_getNationalPrefixFormattingRule",
    value: function _getNationalPrefixFormattingRule(metadata2) {
      return metadata2[this.v1 ? 4 : this.v2 ? 5 : 6];
    }
    // For countries of the same region (e.g. NANPA)
    // national prefix formatting rule is stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "nationalPrefixFormattingRule",
    value: function nationalPrefixFormattingRule() {
      return this._getNationalPrefixFormattingRule(this.metadata) || this._getNationalPrefixFormattingRule(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "_nationalPrefixForParsing",
    value: function _nationalPrefixForParsing() {
      return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7];
    }
  }, {
    key: "nationalPrefixForParsing",
    value: function nationalPrefixForParsing() {
      return this._nationalPrefixForParsing() || this.nationalPrefix();
    }
  }, {
    key: "nationalPrefixTransformRule",
    value: function nationalPrefixTransformRule() {
      return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
    }
  }, {
    key: "_getNationalPrefixIsOptionalWhenFormatting",
    value: function _getNationalPrefixIsOptionalWhenFormatting() {
      return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
    }
    // For countries of the same region (e.g. NANPA)
    // "national prefix is optional when formatting" flag is
    // stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".
  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
      return this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "leadingDigits",
    value: function leadingDigits() {
      return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
    }
  }, {
    key: "types",
    value: function types() {
      return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
    }
  }, {
    key: "hasTypes",
    value: function hasTypes() {
      if (this.types() && this.types().length === 0) {
        return false;
      }
      return !!this.types();
    }
  }, {
    key: "type",
    value: function type(_type2) {
      if (this.hasTypes() && getType(this.types(), _type2)) {
        return new Type(getType(this.types(), _type2), this);
      }
    }
  }, {
    key: "ext",
    value: function ext() {
      if (this.v1 || this.v2)
        return DEFAULT_EXT_PREFIX;
      return this.metadata[13] || DEFAULT_EXT_PREFIX;
    }
  }]);
  return NumberingPlan2;
}();
var Format = /* @__PURE__ */ function() {
  function Format2(format, metadata2) {
    _classCallCheck$1(this, Format2);
    this._format = format;
    this.metadata = metadata2;
  }
  _createClass$1(Format2, [{
    key: "pattern",
    value: function pattern() {
      return this._format[0];
    }
  }, {
    key: "format",
    value: function format() {
      return this._format[1];
    }
  }, {
    key: "leadingDigitsPatterns",
    value: function leadingDigitsPatterns() {
      return this._format[2] || [];
    }
  }, {
    key: "nationalPrefixFormattingRule",
    value: function nationalPrefixFormattingRule() {
      return this._format[3] || this.metadata.nationalPrefixFormattingRule();
    }
  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
      return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    }
  }, {
    key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
    value: function nationalPrefixIsMandatoryWhenFormattingInNationalFormat() {
      return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    }
    // Checks whether national prefix formatting rule contains national prefix.
  }, {
    key: "usesNationalPrefix",
    value: function usesNationalPrefix() {
      return this.nationalPrefixFormattingRule() && // Check that national prefix formatting rule is not a "dummy" one.
      !FIRST_GROUP_ONLY_PREFIX_PATTERN.test(this.nationalPrefixFormattingRule()) ? true : false;
    }
  }, {
    key: "internationalFormat",
    value: function internationalFormat() {
      return this._format[5] || this.format();
    }
  }]);
  return Format2;
}();
var FIRST_GROUP_ONLY_PREFIX_PATTERN = /^\(?\$1\)?$/;
var Type = /* @__PURE__ */ function() {
  function Type2(type, metadata2) {
    _classCallCheck$1(this, Type2);
    this.type = type;
    this.metadata = metadata2;
  }
  _createClass$1(Type2, [{
    key: "pattern",
    value: function pattern() {
      if (this.metadata.v1)
        return this.type;
      return this.type[0];
    }
  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      if (this.metadata.v1)
        return;
      return this.type[1] || this.metadata.possibleLengths();
    }
  }]);
  return Type2;
}();
function getType(types, type) {
  switch (type) {
    case "FIXED_LINE":
      return types[0];
    case "MOBILE":
      return types[1];
    case "TOLL_FREE":
      return types[2];
    case "PREMIUM_RATE":
      return types[3];
    case "PERSONAL_NUMBER":
      return types[4];
    case "VOICEMAIL":
      return types[5];
    case "UAN":
      return types[6];
    case "PAGER":
      return types[7];
    case "VOIP":
      return types[8];
    case "SHARED_COST":
      return types[9];
  }
}
function validateMetadata(metadata2) {
  if (!metadata2) {
    throw new Error("[libphonenumber-js] `metadata` argument not passed. Check your arguments.");
  }
  if (!isObject(metadata2) || !isObject(metadata2.countries)) {
    throw new Error("[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(isObject(metadata2) ? "an object of shape: { " + Object.keys(metadata2).join(", ") + " }" : "a " + typeOf(metadata2) + ": " + metadata2, "."));
  }
}
var typeOf = function typeOf2(_) {
  return _typeof(_);
};
function getCountryCallingCode(country, metadata2) {
  metadata2 = new Metadata(metadata2);
  if (metadata2.hasCountry(country)) {
    return metadata2.country(country).countryCallingCode();
  }
  throw new Error("Unknown country: ".concat(country));
}
function isSupportedCountry(country, metadata2) {
  return metadata2.countries.hasOwnProperty(country);
}
function setVersion(metadata2) {
  var version = metadata2.version;
  if (typeof version === "number") {
    this.v1 = version === 1;
    this.v2 = version === 2;
    this.v3 = version === 3;
    this.v4 = version === 4;
  } else {
    if (!version) {
      this.v1 = true;
    } else if (compare(version, V3) === -1) {
      this.v2 = true;
    } else if (compare(version, V4) === -1) {
      this.v3 = true;
    } else {
      this.v4 = true;
    }
  }
}
var RFC3966_EXTN_PREFIX = ";ext=";
var getExtensionDigitsPattern = function getExtensionDigitsPattern2(maxLength) {
  return "([".concat(VALID_DIGITS, "]{1,").concat(maxLength, "})");
};
function createExtensionPattern(purpose) {
  var extLimitAfterExplicitLabel = "20";
  var extLimitAfterLikelyLabel = "15";
  var extLimitAfterAmbiguousChar = "9";
  var extLimitWhenNotSure = "6";
  var possibleSeparatorsBetweenNumberAndExtLabel = "[  \\t,]*";
  var possibleCharsAfterExtLabel = "[:\\.．]?[  \\t,-]*";
  var optionalExtnSuffix = "#?";
  var explicitExtLabels = "(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|доб|anexo)";
  var ambiguousExtLabels = "(?:[xｘ#＃~～]|int|ｉｎｔ)";
  var ambiguousSeparator = "[- ]+";
  var possibleSeparatorsNumberExtLabelNoComma = "[  \\t]*";
  var autoDiallingAndExtLabelsFound = "(?:,{2}|;)";
  var rfcExtn = RFC3966_EXTN_PREFIX + getExtensionDigitsPattern(extLimitAfterExplicitLabel);
  var explicitExtn = possibleSeparatorsBetweenNumberAndExtLabel + explicitExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterExplicitLabel) + optionalExtnSuffix;
  var ambiguousExtn = possibleSeparatorsBetweenNumberAndExtLabel + ambiguousExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix;
  var americanStyleExtnWithSuffix = ambiguousSeparator + getExtensionDigitsPattern(extLimitWhenNotSure) + "#";
  var autoDiallingExtn = possibleSeparatorsNumberExtLabelNoComma + autoDiallingAndExtLabelsFound + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterLikelyLabel) + optionalExtnSuffix;
  var onlyCommasExtn = possibleSeparatorsNumberExtLabelNoComma + "(?:,)+" + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix;
  return rfcExtn + "|" + explicitExtn + "|" + ambiguousExtn + "|" + americanStyleExtnWithSuffix + "|" + autoDiallingExtn + "|" + onlyCommasExtn;
}
var MIN_LENGTH_PHONE_NUMBER_PATTERN = "[" + VALID_DIGITS + "]{" + MIN_LENGTH_FOR_NSN + "}";
var VALID_PHONE_NUMBER = "[" + PLUS_CHARS + "]{0,1}(?:[" + VALID_PUNCTUATION + "]*[" + VALID_DIGITS + "]){3,}[" + VALID_PUNCTUATION + VALID_DIGITS + "]*";
var VALID_PHONE_NUMBER_START_REG_EXP = new RegExp("^[" + PLUS_CHARS + "]{0,1}(?:[" + VALID_PUNCTUATION + "]*[" + VALID_DIGITS + "]){1,2}$", "i");
var VALID_PHONE_NUMBER_WITH_EXTENSION = VALID_PHONE_NUMBER + // Phone number extensions
"(?:" + createExtensionPattern() + ")?";
var VALID_PHONE_NUMBER_PATTERN = new RegExp(
  // Either a short two-digit-only phone number
  "^" + MIN_LENGTH_PHONE_NUMBER_PATTERN + "$|^" + VALID_PHONE_NUMBER_WITH_EXTENSION + "$",
  "i"
);
function isViablePhoneNumber(number) {
  return number.length >= MIN_LENGTH_FOR_NSN && VALID_PHONE_NUMBER_PATTERN.test(number);
}
function isViablePhoneNumberStart(number) {
  return VALID_PHONE_NUMBER_START_REG_EXP.test(number);
}
var EXTN_PATTERN = new RegExp("(?:" + createExtensionPattern() + ")$", "i");
function extractExtension(number) {
  var start = number.search(EXTN_PATTERN);
  if (start < 0) {
    return {};
  }
  var numberWithoutExtension = number.slice(0, start);
  var matches = number.match(EXTN_PATTERN);
  var i = 1;
  while (i < matches.length) {
    if (matches[i]) {
      return {
        number: numberWithoutExtension,
        ext: matches[i]
      };
    }
    i++;
  }
}
var DIGITS = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "０": "0",
  // Fullwidth digit 0
  "１": "1",
  // Fullwidth digit 1
  "２": "2",
  // Fullwidth digit 2
  "３": "3",
  // Fullwidth digit 3
  "４": "4",
  // Fullwidth digit 4
  "５": "5",
  // Fullwidth digit 5
  "６": "6",
  // Fullwidth digit 6
  "７": "7",
  // Fullwidth digit 7
  "８": "8",
  // Fullwidth digit 8
  "９": "9",
  // Fullwidth digit 9
  "٠": "0",
  // Arabic-indic digit 0
  "١": "1",
  // Arabic-indic digit 1
  "٢": "2",
  // Arabic-indic digit 2
  "٣": "3",
  // Arabic-indic digit 3
  "٤": "4",
  // Arabic-indic digit 4
  "٥": "5",
  // Arabic-indic digit 5
  "٦": "6",
  // Arabic-indic digit 6
  "٧": "7",
  // Arabic-indic digit 7
  "٨": "8",
  // Arabic-indic digit 8
  "٩": "9",
  // Arabic-indic digit 9
  "۰": "0",
  // Eastern-Arabic digit 0
  "۱": "1",
  // Eastern-Arabic digit 1
  "۲": "2",
  // Eastern-Arabic digit 2
  "۳": "3",
  // Eastern-Arabic digit 3
  "۴": "4",
  // Eastern-Arabic digit 4
  "۵": "5",
  // Eastern-Arabic digit 5
  "۶": "6",
  // Eastern-Arabic digit 6
  "۷": "7",
  // Eastern-Arabic digit 7
  "۸": "8",
  // Eastern-Arabic digit 8
  "۹": "9"
  // Eastern-Arabic digit 9
};
function parseDigit(character) {
  return DIGITS[character];
}
function _createForOfIteratorHelperLoose$4(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$5(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$5(o, minLen);
}
function _arrayLikeToArray$5(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function parseIncompletePhoneNumber(string) {
  var result2 = "";
  for (var _iterator = _createForOfIteratorHelperLoose$4(string.split("")), _step; !(_step = _iterator()).done; ) {
    var character = _step.value;
    result2 += parsePhoneNumberCharacter(character, result2) || "";
  }
  return result2;
}
function parsePhoneNumberCharacter(character, prevParsedCharacters) {
  if (character === "+") {
    if (prevParsedCharacters) {
      return;
    }
    return "+";
  }
  return parseDigit(character);
}
function _createForOfIteratorHelperLoose$3(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$4(o, minLen);
}
function _arrayLikeToArray$4(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function mergeArrays(a, b) {
  var merged = a.slice();
  for (var _iterator = _createForOfIteratorHelperLoose$3(b), _step; !(_step = _iterator()).done; ) {
    var element = _step.value;
    if (a.indexOf(element) < 0) {
      merged.push(element);
    }
  }
  return merged.sort(function(a2, b2) {
    return a2 - b2;
  });
}
function checkNumberLength(nationalNumber, metadata2) {
  return checkNumberLengthForType(nationalNumber, void 0, metadata2);
}
function checkNumberLengthForType(nationalNumber, type, metadata2) {
  var type_info = metadata2.type(type);
  var possible_lengths = type_info && type_info.possibleLengths() || metadata2.possibleLengths();
  if (!possible_lengths) {
    return "IS_POSSIBLE";
  }
  if (type === "FIXED_LINE_OR_MOBILE") {
    if (!metadata2.type("FIXED_LINE")) {
      return checkNumberLengthForType(nationalNumber, "MOBILE", metadata2);
    }
    var mobile_type = metadata2.type("MOBILE");
    if (mobile_type) {
      possible_lengths = mergeArrays(possible_lengths, mobile_type.possibleLengths());
    }
  } else if (type && !type_info) {
    return "INVALID_LENGTH";
  }
  var actual_length = nationalNumber.length;
  var minimum_length = possible_lengths[0];
  if (minimum_length === actual_length) {
    return "IS_POSSIBLE";
  }
  if (minimum_length > actual_length) {
    return "TOO_SHORT";
  }
  if (possible_lengths[possible_lengths.length - 1] < actual_length) {
    return "TOO_LONG";
  }
  return possible_lengths.indexOf(actual_length, 1) >= 0 ? "IS_POSSIBLE" : "INVALID_LENGTH";
}
function isPossiblePhoneNumber(input, options, metadata2) {
  if (options === void 0) {
    options = {};
  }
  metadata2 = new Metadata(metadata2);
  if (options.v2) {
    if (!input.countryCallingCode) {
      throw new Error("Invalid phone number object passed");
    }
    metadata2.selectNumberingPlan(input.countryCallingCode);
  } else {
    if (!input.phone) {
      return false;
    }
    if (input.country) {
      if (!metadata2.hasCountry(input.country)) {
        throw new Error("Unknown country: ".concat(input.country));
      }
      metadata2.country(input.country);
    } else {
      if (!input.countryCallingCode) {
        throw new Error("Invalid phone number object passed");
      }
      metadata2.selectNumberingPlan(input.countryCallingCode);
    }
  }
  if (metadata2.possibleLengths()) {
    return isPossibleNumber(input.phone || input.nationalNumber, metadata2);
  } else {
    if (input.countryCallingCode && metadata2.isNonGeographicCallingCode(input.countryCallingCode)) {
      return true;
    } else {
      throw new Error('Missing "possibleLengths" in metadata. Perhaps the metadata has been generated before v1.0.18.');
    }
  }
}
function isPossibleNumber(nationalNumber, metadata2) {
  switch (checkNumberLength(nationalNumber, metadata2)) {
    case "IS_POSSIBLE":
      return true;
    default:
      return false;
  }
}
function matchesEntirely(text, regular_expression) {
  text = text || "";
  return new RegExp("^(?:" + regular_expression + ")$").test(text);
}
function _createForOfIteratorHelperLoose$2(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$3(o, minLen);
}
function _arrayLikeToArray$3(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var NON_FIXED_LINE_PHONE_TYPES = ["MOBILE", "PREMIUM_RATE", "TOLL_FREE", "SHARED_COST", "VOIP", "PERSONAL_NUMBER", "PAGER", "UAN", "VOICEMAIL"];
function getNumberType(input, options, metadata2) {
  options = options || {};
  if (!input.country && !input.countryCallingCode) {
    return;
  }
  metadata2 = new Metadata(metadata2);
  metadata2.selectNumberingPlan(input.country, input.countryCallingCode);
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  if (!matchesEntirely(nationalNumber, metadata2.nationalNumberPattern())) {
    return;
  }
  if (isNumberTypeEqualTo(nationalNumber, "FIXED_LINE", metadata2)) {
    if (metadata2.type("MOBILE") && metadata2.type("MOBILE").pattern() === "") {
      return "FIXED_LINE_OR_MOBILE";
    }
    if (!metadata2.type("MOBILE")) {
      return "FIXED_LINE_OR_MOBILE";
    }
    if (isNumberTypeEqualTo(nationalNumber, "MOBILE", metadata2)) {
      return "FIXED_LINE_OR_MOBILE";
    }
    return "FIXED_LINE";
  }
  for (var _iterator = _createForOfIteratorHelperLoose$2(NON_FIXED_LINE_PHONE_TYPES), _step; !(_step = _iterator()).done; ) {
    var type = _step.value;
    if (isNumberTypeEqualTo(nationalNumber, type, metadata2)) {
      return type;
    }
  }
}
function isNumberTypeEqualTo(nationalNumber, type, metadata2) {
  type = metadata2.type(type);
  if (!type || !type.pattern()) {
    return false;
  }
  if (type.possibleLengths() && type.possibleLengths().indexOf(nationalNumber.length) < 0) {
    return false;
  }
  return matchesEntirely(nationalNumber, type.pattern());
}
function isValidNumber(input, options, metadata2) {
  options = options || {};
  metadata2 = new Metadata(metadata2);
  metadata2.selectNumberingPlan(input.country, input.countryCallingCode);
  if (metadata2.hasTypes()) {
    return getNumberType(input, options, metadata2.metadata) !== void 0;
  }
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  return matchesEntirely(nationalNumber, metadata2.nationalNumberPattern());
}
function getPossibleCountriesForNumber(callingCode, nationalNumber, metadata2) {
  var _metadata = new Metadata(metadata2);
  var possibleCountries = _metadata.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return [];
  }
  return possibleCountries.filter(function(country) {
    return couldNationalNumberBelongToCountry(nationalNumber, country, metadata2);
  });
}
function couldNationalNumberBelongToCountry(nationalNumber, country, metadata2) {
  var _metadata = new Metadata(metadata2);
  _metadata.selectNumberingPlan(country);
  if (_metadata.numberingPlan.possibleLengths().indexOf(nationalNumber.length) >= 0) {
    return true;
  }
  return false;
}
function applyInternationalSeparatorStyle(formattedNumber) {
  return formattedNumber.replace(new RegExp("[".concat(VALID_PUNCTUATION, "]+"), "g"), " ").trim();
}
var FIRST_GROUP_PATTERN = /(\$\d)/;
function formatNationalNumberUsingFormat(number, format, _ref) {
  var useInternationalFormat = _ref.useInternationalFormat, withNationalPrefix = _ref.withNationalPrefix;
  _ref.carrierCode;
  _ref.metadata;
  var formattedNumber = number.replace(new RegExp(format.pattern()), useInternationalFormat ? format.internationalFormat() : (
    // This library doesn't use `domestic_carrier_code_formatting_rule`,
    // because that one is only used when formatting phone numbers
    // for dialing from a mobile phone, and this is not a dialing library.
    // carrierCode && format.domesticCarrierCodeFormattingRule()
    // 	// First, replace the $CC in the formatting rule with the desired carrier code.
    // 	// Then, replace the $FG in the formatting rule with the first group
    // 	// and the carrier code combined in the appropriate way.
    // 	? format.format().replace(FIRST_GROUP_PATTERN, format.domesticCarrierCodeFormattingRule().replace('$CC', carrierCode))
    // 	: (
    // 		withNationalPrefix && format.nationalPrefixFormattingRule()
    // 			? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule())
    // 			: format.format()
    // 	)
    withNationalPrefix && format.nationalPrefixFormattingRule() ? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule()) : format.format()
  ));
  if (useInternationalFormat) {
    return applyInternationalSeparatorStyle(formattedNumber);
  }
  return formattedNumber;
}
var SINGLE_IDD_PREFIX_REG_EXP = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/;
function getIddPrefix(country, callingCode, metadata2) {
  var countryMetadata = new Metadata(metadata2);
  countryMetadata.selectNumberingPlan(country, callingCode);
  if (countryMetadata.defaultIDDPrefix()) {
    return countryMetadata.defaultIDDPrefix();
  }
  if (SINGLE_IDD_PREFIX_REG_EXP.test(countryMetadata.IDDPrefix())) {
    return countryMetadata.IDDPrefix();
  }
}
function formatRFC3966(_ref) {
  var number = _ref.number, ext = _ref.ext;
  if (!number) {
    return "";
  }
  if (number[0] !== "+") {
    throw new Error('"formatRFC3966()" expects "number" to be in E.164 format.');
  }
  return "tel:".concat(number).concat(ext ? ";ext=" + ext : "");
}
function _createForOfIteratorHelperLoose$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2(o, minLen);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function ownKeys$4(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$4(Object(source), true).forEach(function(key) {
      _defineProperty$4(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var DEFAULT_OPTIONS = {
  formatExtension: function formatExtension(formattedNumber, extension, metadata2) {
    return "".concat(formattedNumber).concat(metadata2.ext()).concat(extension);
  }
};
function formatNumber(input, format, options, metadata2) {
  if (options) {
    options = _objectSpread$4(_objectSpread$4({}, DEFAULT_OPTIONS), options);
  } else {
    options = DEFAULT_OPTIONS;
  }
  metadata2 = new Metadata(metadata2);
  if (input.country && input.country !== "001") {
    if (!metadata2.hasCountry(input.country)) {
      throw new Error("Unknown country: ".concat(input.country));
    }
    metadata2.country(input.country);
  } else if (input.countryCallingCode) {
    metadata2.selectNumberingPlan(input.countryCallingCode);
  } else
    return input.phone || "";
  var countryCallingCode = metadata2.countryCallingCode();
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  var number;
  switch (format) {
    case "NATIONAL":
      if (!nationalNumber) {
        return "";
      }
      number = formatNationalNumber(nationalNumber, input.carrierCode, "NATIONAL", metadata2, options);
      return addExtension(number, input.ext, metadata2, options.formatExtension);
    case "INTERNATIONAL":
      if (!nationalNumber) {
        return "+".concat(countryCallingCode);
      }
      number = formatNationalNumber(nationalNumber, null, "INTERNATIONAL", metadata2, options);
      number = "+".concat(countryCallingCode, " ").concat(number);
      return addExtension(number, input.ext, metadata2, options.formatExtension);
    case "E.164":
      return "+".concat(countryCallingCode).concat(nationalNumber);
    case "RFC3966":
      return formatRFC3966({
        number: "+".concat(countryCallingCode).concat(nationalNumber),
        ext: input.ext
      });
    case "IDD":
      if (!options.fromCountry) {
        return;
      }
      var formattedNumber = formatIDD(nationalNumber, input.carrierCode, countryCallingCode, options.fromCountry, metadata2);
      return addExtension(formattedNumber, input.ext, metadata2, options.formatExtension);
    default:
      throw new Error('Unknown "format" argument passed to "formatNumber()": "'.concat(format, '"'));
  }
}
function formatNationalNumber(number, carrierCode, formatAs, metadata2, options) {
  var format = chooseFormatForNumber(metadata2.formats(), number);
  if (!format) {
    return number;
  }
  return formatNationalNumberUsingFormat(number, format, {
    useInternationalFormat: formatAs === "INTERNATIONAL",
    withNationalPrefix: format.nationalPrefixIsOptionalWhenFormattingInNationalFormat() && options && options.nationalPrefix === false ? false : true,
    carrierCode,
    metadata: metadata2
  });
}
function chooseFormatForNumber(availableFormats, nationalNnumber) {
  for (var _iterator = _createForOfIteratorHelperLoose$1(availableFormats), _step; !(_step = _iterator()).done; ) {
    var format = _step.value;
    if (format.leadingDigitsPatterns().length > 0) {
      var lastLeadingDigitsPattern = format.leadingDigitsPatterns()[format.leadingDigitsPatterns().length - 1];
      if (nationalNnumber.search(lastLeadingDigitsPattern) !== 0) {
        continue;
      }
    }
    if (matchesEntirely(nationalNnumber, format.pattern())) {
      return format;
    }
  }
}
function addExtension(formattedNumber, ext, metadata2, formatExtension2) {
  return ext ? formatExtension2(formattedNumber, ext, metadata2) : formattedNumber;
}
function formatIDD(nationalNumber, carrierCode, countryCallingCode, fromCountry, metadata2) {
  var fromCountryCallingCode = getCountryCallingCode(fromCountry, metadata2.metadata);
  if (fromCountryCallingCode === countryCallingCode) {
    var formattedNumber = formatNationalNumber(nationalNumber, carrierCode, "NATIONAL", metadata2);
    if (countryCallingCode === "1") {
      return countryCallingCode + " " + formattedNumber;
    }
    return formattedNumber;
  }
  var iddPrefix = getIddPrefix(fromCountry, void 0, metadata2.metadata);
  if (iddPrefix) {
    return "".concat(iddPrefix, " ").concat(countryCallingCode, " ").concat(formatNationalNumber(nationalNumber, null, "INTERNATIONAL", metadata2));
  }
}
function ownKeys$3(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$3(Object(source), true).forEach(function(key) {
      _defineProperty$3(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
var PhoneNumber = /* @__PURE__ */ function() {
  function PhoneNumber2(countryOrCountryCallingCode, nationalNumber, metadata2) {
    _classCallCheck(this, PhoneNumber2);
    if (!countryOrCountryCallingCode) {
      throw new TypeError("`country` or `countryCallingCode` not passed");
    }
    if (!nationalNumber) {
      throw new TypeError("`nationalNumber` not passed");
    }
    if (!metadata2) {
      throw new TypeError("`metadata` not passed");
    }
    var _getCountryAndCountry = getCountryAndCountryCallingCode(countryOrCountryCallingCode, metadata2), country = _getCountryAndCountry.country, countryCallingCode = _getCountryAndCountry.countryCallingCode;
    this.country = country;
    this.countryCallingCode = countryCallingCode;
    this.nationalNumber = nationalNumber;
    this.number = "+" + this.countryCallingCode + this.nationalNumber;
    this.getMetadata = function() {
      return metadata2;
    };
  }
  _createClass(PhoneNumber2, [{
    key: "setExt",
    value: function setExt(ext) {
      this.ext = ext;
    }
  }, {
    key: "getPossibleCountries",
    value: function getPossibleCountries() {
      if (this.country) {
        return [this.country];
      }
      return getPossibleCountriesForNumber(this.countryCallingCode, this.nationalNumber, this.getMetadata());
    }
  }, {
    key: "isPossible",
    value: function isPossible() {
      return isPossiblePhoneNumber(this, {
        v2: true
      }, this.getMetadata());
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return isValidNumber(this, {
        v2: true
      }, this.getMetadata());
    }
  }, {
    key: "isNonGeographic",
    value: function isNonGeographic() {
      var metadata2 = new Metadata(this.getMetadata());
      return metadata2.isNonGeographicCallingCode(this.countryCallingCode);
    }
  }, {
    key: "isEqual",
    value: function isEqual(phoneNumber) {
      return this.number === phoneNumber.number && this.ext === phoneNumber.ext;
    }
    // This function was originally meant to be an equivalent for `validatePhoneNumberLength()`,
    // but later it was found out that it doesn't include the possible `TOO_SHORT` result
    // returned from `parsePhoneNumberWithError()` in the original `validatePhoneNumberLength()`,
    // so eventually I simply commented out this method from the `PhoneNumber` class
    // and just left the `validatePhoneNumberLength()` function, even though that one would require
    // and additional step to also validate the actual country / calling code of the phone number.
    // validateLength() {
    // 	const metadata = new Metadata(this.getMetadata())
    // 	metadata.selectNumberingPlan(this.countryCallingCode)
    // 	const result = checkNumberLength(this.nationalNumber, metadata)
    // 	if (result !== 'IS_POSSIBLE') {
    // 		return result
    // 	}
    // }
  }, {
    key: "getType",
    value: function getType2() {
      return getNumberType(this, {
        v2: true
      }, this.getMetadata());
    }
  }, {
    key: "format",
    value: function format(_format, options) {
      return formatNumber(this, _format, options ? _objectSpread$3(_objectSpread$3({}, options), {}, {
        v2: true
      }) : {
        v2: true
      }, this.getMetadata());
    }
  }, {
    key: "formatNational",
    value: function formatNational(options) {
      return this.format("NATIONAL", options);
    }
  }, {
    key: "formatInternational",
    value: function formatInternational(options) {
      return this.format("INTERNATIONAL", options);
    }
  }, {
    key: "getURI",
    value: function getURI(options) {
      return this.format("RFC3966", options);
    }
  }]);
  return PhoneNumber2;
}();
var isCountryCode = function isCountryCode2(value) {
  return /^[A-Z]{2}$/.test(value);
};
function getCountryAndCountryCallingCode(countryOrCountryCallingCode, metadataJson) {
  var country;
  var countryCallingCode;
  var metadata2 = new Metadata(metadataJson);
  if (isCountryCode(countryOrCountryCallingCode)) {
    country = countryOrCountryCallingCode;
    metadata2.selectNumberingPlan(country);
    countryCallingCode = metadata2.countryCallingCode();
  } else {
    countryCallingCode = countryOrCountryCallingCode;
  }
  return {
    country,
    countryCallingCode
  };
}
var CAPTURING_DIGIT_PATTERN = new RegExp("([" + VALID_DIGITS + "])");
function stripIddPrefix(number, country, callingCode, metadata2) {
  if (!country) {
    return;
  }
  var countryMetadata = new Metadata(metadata2);
  countryMetadata.selectNumberingPlan(country, callingCode);
  var IDDPrefixPattern = new RegExp(countryMetadata.IDDPrefix());
  if (number.search(IDDPrefixPattern) !== 0) {
    return;
  }
  number = number.slice(number.match(IDDPrefixPattern)[0].length);
  var matchedGroups = number.match(CAPTURING_DIGIT_PATTERN);
  if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
    if (matchedGroups[1] === "0") {
      return;
    }
  }
  return number;
}
function extractNationalNumberFromPossiblyIncompleteNumber(number, metadata2) {
  if (number && metadata2.numberingPlan.nationalPrefixForParsing()) {
    var prefixPattern = new RegExp("^(?:" + metadata2.numberingPlan.nationalPrefixForParsing() + ")");
    var prefixMatch = prefixPattern.exec(number);
    if (prefixMatch) {
      var nationalNumber;
      var carrierCode;
      var capturedGroupsCount = prefixMatch.length - 1;
      var hasCapturedGroups = capturedGroupsCount > 0 && prefixMatch[capturedGroupsCount];
      if (metadata2.nationalPrefixTransformRule() && hasCapturedGroups) {
        nationalNumber = number.replace(prefixPattern, metadata2.nationalPrefixTransformRule());
        if (capturedGroupsCount > 1) {
          carrierCode = prefixMatch[1];
        }
      } else {
        var prefixBeforeNationalNumber = prefixMatch[0];
        nationalNumber = number.slice(prefixBeforeNationalNumber.length);
        if (hasCapturedGroups) {
          carrierCode = prefixMatch[1];
        }
      }
      var nationalPrefix;
      if (hasCapturedGroups) {
        var possiblePositionOfTheFirstCapturedGroup = number.indexOf(prefixMatch[1]);
        var possibleNationalPrefix = number.slice(0, possiblePositionOfTheFirstCapturedGroup);
        if (possibleNationalPrefix === metadata2.numberingPlan.nationalPrefix()) {
          nationalPrefix = metadata2.numberingPlan.nationalPrefix();
        }
      } else {
        nationalPrefix = prefixMatch[0];
      }
      return {
        nationalNumber,
        nationalPrefix,
        carrierCode
      };
    }
  }
  return {
    nationalNumber: number
  };
}
function extractNationalNumber(number, metadata2) {
  var _extractNationalNumbe = extractNationalNumberFromPossiblyIncompleteNumber(number, metadata2), carrierCode = _extractNationalNumbe.carrierCode, nationalNumber = _extractNationalNumbe.nationalNumber;
  if (nationalNumber !== number) {
    if (!shouldHaveExtractedNationalPrefix(number, nationalNumber, metadata2)) {
      return {
        nationalNumber: number
      };
    }
    if (metadata2.possibleLengths()) {
      if (!isPossibleIncompleteNationalNumber(nationalNumber, metadata2)) {
        return {
          nationalNumber: number
        };
      }
    }
  }
  return {
    nationalNumber,
    carrierCode
  };
}
function shouldHaveExtractedNationalPrefix(nationalNumberBefore, nationalNumberAfter, metadata2) {
  if (matchesEntirely(nationalNumberBefore, metadata2.nationalNumberPattern()) && !matchesEntirely(nationalNumberAfter, metadata2.nationalNumberPattern())) {
    return false;
  }
  return true;
}
function isPossibleIncompleteNationalNumber(nationalNumber, metadata2) {
  switch (checkNumberLength(nationalNumber, metadata2)) {
    case "TOO_SHORT":
    case "INVALID_LENGTH":
      return false;
    default:
      return true;
  }
}
function extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, callingCode, metadata2) {
  var countryCallingCode = country ? getCountryCallingCode(country, metadata2) : callingCode;
  if (number.indexOf(countryCallingCode) === 0) {
    metadata2 = new Metadata(metadata2);
    metadata2.selectNumberingPlan(country, callingCode);
    var possibleShorterNumber = number.slice(countryCallingCode.length);
    var _extractNationalNumbe = extractNationalNumber(possibleShorterNumber, metadata2), possibleShorterNationalNumber = _extractNationalNumbe.nationalNumber;
    var _extractNationalNumbe2 = extractNationalNumber(number, metadata2), nationalNumber = _extractNationalNumbe2.nationalNumber;
    if (!matchesEntirely(nationalNumber, metadata2.nationalNumberPattern()) && matchesEntirely(possibleShorterNationalNumber, metadata2.nationalNumberPattern()) || checkNumberLength(nationalNumber, metadata2) === "TOO_LONG") {
      return {
        countryCallingCode,
        number: possibleShorterNumber
      };
    }
  }
  return {
    number
  };
}
function extractCountryCallingCode(number, country, callingCode, metadata2) {
  if (!number) {
    return {};
  }
  var isNumberWithIddPrefix;
  if (number[0] !== "+") {
    var numberWithoutIDD = stripIddPrefix(number, country, callingCode, metadata2);
    if (numberWithoutIDD && numberWithoutIDD !== number) {
      isNumberWithIddPrefix = true;
      number = "+" + numberWithoutIDD;
    } else {
      if (country || callingCode) {
        var _extractCountryCallin = extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, callingCode, metadata2), countryCallingCode = _extractCountryCallin.countryCallingCode, shorterNumber = _extractCountryCallin.number;
        if (countryCallingCode) {
          return {
            countryCallingCodeSource: "FROM_NUMBER_WITHOUT_PLUS_SIGN",
            countryCallingCode,
            number: shorterNumber
          };
        }
      }
      return {
        // No need to set it to `UNSPECIFIED`. It can be just `undefined`.
        // countryCallingCodeSource: 'UNSPECIFIED',
        number
      };
    }
  }
  if (number[1] === "0") {
    return {};
  }
  metadata2 = new Metadata(metadata2);
  var i = 2;
  while (i - 1 <= MAX_LENGTH_COUNTRY_CODE && i <= number.length) {
    var _countryCallingCode = number.slice(1, i);
    if (metadata2.hasCallingCode(_countryCallingCode)) {
      metadata2.selectNumberingPlan(_countryCallingCode);
      return {
        countryCallingCodeSource: isNumberWithIddPrefix ? "FROM_NUMBER_WITH_IDD" : "FROM_NUMBER_WITH_PLUS_SIGN",
        countryCallingCode: _countryCallingCode,
        number: number.slice(i)
      };
    }
    i++;
  }
  return {};
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function getCountryByNationalNumber(nationalPhoneNumber, _ref) {
  var countries = _ref.countries, defaultCountry = _ref.defaultCountry, metadata2 = _ref.metadata;
  metadata2 = new Metadata(metadata2);
  var matchingCountries = [];
  for (var _iterator = _createForOfIteratorHelperLoose(countries), _step; !(_step = _iterator()).done; ) {
    var country = _step.value;
    metadata2.country(country);
    if (metadata2.leadingDigits()) {
      if (nationalPhoneNumber && nationalPhoneNumber.search(metadata2.leadingDigits()) === 0) {
        return country;
      }
    } else if (getNumberType({
      phone: nationalPhoneNumber,
      country
    }, void 0, metadata2.metadata)) {
      if (defaultCountry) {
        if (country === defaultCountry) {
          return country;
        }
        matchingCountries.push(country);
      } else {
        return country;
      }
    }
  }
  if (matchingCountries.length > 0) {
    return matchingCountries[0];
  }
}
var USE_NON_GEOGRAPHIC_COUNTRY_CODE = false;
function getCountryByCallingCode(callingCode, _ref) {
  var nationalPhoneNumber = _ref.nationalNumber, defaultCountry = _ref.defaultCountry, metadata2 = _ref.metadata;
  if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
    if (metadata2.isNonGeographicCallingCode(callingCode)) {
      return "001";
    }
  }
  var possibleCountries = metadata2.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return;
  }
  if (possibleCountries.length === 1) {
    return possibleCountries[0];
  }
  return getCountryByNationalNumber(nationalPhoneNumber, {
    countries: possibleCountries,
    defaultCountry,
    metadata: metadata2.metadata
  });
}
var PLUS_SIGN = "+";
var RFC3966_VISUAL_SEPARATOR_ = "[\\-\\.\\(\\)]?";
var RFC3966_PHONE_DIGIT_ = "([" + VALID_DIGITS + "]|" + RFC3966_VISUAL_SEPARATOR_ + ")";
var RFC3966_GLOBAL_NUMBER_DIGITS_ = "^\\" + PLUS_SIGN + RFC3966_PHONE_DIGIT_ + "*[" + VALID_DIGITS + "]" + RFC3966_PHONE_DIGIT_ + "*$";
var RFC3966_GLOBAL_NUMBER_DIGITS_PATTERN_ = new RegExp(RFC3966_GLOBAL_NUMBER_DIGITS_, "g");
var ALPHANUM_ = VALID_DIGITS;
var RFC3966_DOMAINLABEL_ = "[" + ALPHANUM_ + "]+((\\-)*[" + ALPHANUM_ + "])*";
var VALID_ALPHA_ = "a-zA-Z";
var RFC3966_TOPLABEL_ = "[" + VALID_ALPHA_ + "]+((\\-)*[" + ALPHANUM_ + "])*";
var RFC3966_DOMAINNAME_ = "^(" + RFC3966_DOMAINLABEL_ + "\\.)*" + RFC3966_TOPLABEL_ + "\\.?$";
var RFC3966_DOMAINNAME_PATTERN_ = new RegExp(RFC3966_DOMAINNAME_, "g");
var RFC3966_PREFIX_ = "tel:";
var RFC3966_PHONE_CONTEXT_ = ";phone-context=";
var RFC3966_ISDN_SUBADDRESS_ = ";isub=";
function extractPhoneContext(numberToExtractFrom) {
  var indexOfPhoneContext = numberToExtractFrom.indexOf(RFC3966_PHONE_CONTEXT_);
  if (indexOfPhoneContext < 0) {
    return null;
  }
  var phoneContextStart = indexOfPhoneContext + RFC3966_PHONE_CONTEXT_.length;
  if (phoneContextStart >= numberToExtractFrom.length) {
    return "";
  }
  var phoneContextEnd = numberToExtractFrom.indexOf(";", phoneContextStart);
  if (phoneContextEnd >= 0) {
    return numberToExtractFrom.substring(phoneContextStart, phoneContextEnd);
  } else {
    return numberToExtractFrom.substring(phoneContextStart);
  }
}
function isPhoneContextValid(phoneContext) {
  if (phoneContext === null) {
    return true;
  }
  if (phoneContext.length === 0) {
    return false;
  }
  return RFC3966_GLOBAL_NUMBER_DIGITS_PATTERN_.test(phoneContext) || RFC3966_DOMAINNAME_PATTERN_.test(phoneContext);
}
function extractFormattedPhoneNumberFromPossibleRfc3966NumberUri(numberToParse, _ref) {
  var extractFormattedPhoneNumber = _ref.extractFormattedPhoneNumber;
  var phoneContext = extractPhoneContext(numberToParse);
  if (!isPhoneContextValid(phoneContext)) {
    throw new ParseError("NOT_A_NUMBER");
  }
  var phoneNumberString;
  if (phoneContext === null) {
    phoneNumberString = extractFormattedPhoneNumber(numberToParse) || "";
  } else {
    phoneNumberString = "";
    if (phoneContext.charAt(0) === PLUS_SIGN) {
      phoneNumberString += phoneContext;
    }
    var indexOfRfc3966Prefix = numberToParse.indexOf(RFC3966_PREFIX_);
    var indexOfNationalNumber;
    if (indexOfRfc3966Prefix >= 0) {
      indexOfNationalNumber = indexOfRfc3966Prefix + RFC3966_PREFIX_.length;
    } else {
      indexOfNationalNumber = 0;
    }
    var indexOfPhoneContext = numberToParse.indexOf(RFC3966_PHONE_CONTEXT_);
    phoneNumberString += numberToParse.substring(indexOfNationalNumber, indexOfPhoneContext);
  }
  var indexOfIsdn = phoneNumberString.indexOf(RFC3966_ISDN_SUBADDRESS_);
  if (indexOfIsdn > 0) {
    phoneNumberString = phoneNumberString.substring(0, indexOfIsdn);
  }
  if (phoneNumberString !== "") {
    return phoneNumberString;
  }
}
var MAX_INPUT_STRING_LENGTH = 250;
var PHONE_NUMBER_START_PATTERN = new RegExp("[" + PLUS_CHARS + VALID_DIGITS + "]");
var AFTER_PHONE_NUMBER_END_PATTERN = new RegExp("[^" + VALID_DIGITS + "#]+$");
function parse(text, options, metadata2) {
  options = options || {};
  metadata2 = new Metadata(metadata2);
  if (options.defaultCountry && !metadata2.hasCountry(options.defaultCountry)) {
    if (options.v2) {
      throw new ParseError("INVALID_COUNTRY");
    }
    throw new Error("Unknown country: ".concat(options.defaultCountry));
  }
  var _parseInput = parseInput(text, options.v2, options.extract), formattedPhoneNumber = _parseInput.number, ext = _parseInput.ext, error = _parseInput.error;
  if (!formattedPhoneNumber) {
    if (options.v2) {
      if (error === "TOO_SHORT") {
        throw new ParseError("TOO_SHORT");
      }
      throw new ParseError("NOT_A_NUMBER");
    }
    return {};
  }
  var _parsePhoneNumber = parsePhoneNumber$3(formattedPhoneNumber, options.defaultCountry, options.defaultCallingCode, metadata2), country = _parsePhoneNumber.country, nationalNumber = _parsePhoneNumber.nationalNumber, countryCallingCode = _parsePhoneNumber.countryCallingCode, countryCallingCodeSource = _parsePhoneNumber.countryCallingCodeSource, carrierCode = _parsePhoneNumber.carrierCode;
  if (!metadata2.hasSelectedNumberingPlan()) {
    if (options.v2) {
      throw new ParseError("INVALID_COUNTRY");
    }
    return {};
  }
  if (!nationalNumber || nationalNumber.length < MIN_LENGTH_FOR_NSN) {
    if (options.v2) {
      throw new ParseError("TOO_SHORT");
    }
    return {};
  }
  if (nationalNumber.length > MAX_LENGTH_FOR_NSN) {
    if (options.v2) {
      throw new ParseError("TOO_LONG");
    }
    return {};
  }
  if (options.v2) {
    var phoneNumber = new PhoneNumber(countryCallingCode, nationalNumber, metadata2.metadata);
    if (country) {
      phoneNumber.country = country;
    }
    if (carrierCode) {
      phoneNumber.carrierCode = carrierCode;
    }
    if (ext) {
      phoneNumber.ext = ext;
    }
    phoneNumber.__countryCallingCodeSource = countryCallingCodeSource;
    return phoneNumber;
  }
  var valid = (options.extended ? metadata2.hasSelectedNumberingPlan() : country) ? matchesEntirely(nationalNumber, metadata2.nationalNumberPattern()) : false;
  if (!options.extended) {
    return valid ? result(country, nationalNumber, ext) : {};
  }
  return {
    country,
    countryCallingCode,
    carrierCode,
    valid,
    possible: valid ? true : options.extended === true && metadata2.possibleLengths() && isPossibleNumber(nationalNumber, metadata2) ? true : false,
    phone: nationalNumber,
    ext
  };
}
function _extractFormattedPhoneNumber(text, extract, throwOnError) {
  if (!text) {
    return;
  }
  if (text.length > MAX_INPUT_STRING_LENGTH) {
    if (throwOnError) {
      throw new ParseError("TOO_LONG");
    }
    return;
  }
  if (extract === false) {
    return text;
  }
  var startsAt = text.search(PHONE_NUMBER_START_PATTERN);
  if (startsAt < 0) {
    return;
  }
  return text.slice(startsAt).replace(AFTER_PHONE_NUMBER_END_PATTERN, "");
}
function parseInput(text, v2, extract) {
  var number = extractFormattedPhoneNumberFromPossibleRfc3966NumberUri(text, {
    extractFormattedPhoneNumber: function extractFormattedPhoneNumber(text2) {
      return _extractFormattedPhoneNumber(text2, extract, v2);
    }
  });
  if (!number) {
    return {};
  }
  if (!isViablePhoneNumber(number)) {
    if (isViablePhoneNumberStart(number)) {
      return {
        error: "TOO_SHORT"
      };
    }
    return {};
  }
  var withExtensionStripped = extractExtension(number);
  if (withExtensionStripped.ext) {
    return withExtensionStripped;
  }
  return {
    number
  };
}
function result(country, nationalNumber, ext) {
  var result2 = {
    country,
    phone: nationalNumber
  };
  if (ext) {
    result2.ext = ext;
  }
  return result2;
}
function parsePhoneNumber$3(formattedPhoneNumber, defaultCountry, defaultCallingCode, metadata2) {
  var _extractCountryCallin = extractCountryCallingCode(parseIncompletePhoneNumber(formattedPhoneNumber), defaultCountry, defaultCallingCode, metadata2.metadata), countryCallingCodeSource = _extractCountryCallin.countryCallingCodeSource, countryCallingCode = _extractCountryCallin.countryCallingCode, number = _extractCountryCallin.number;
  var country;
  if (countryCallingCode) {
    metadata2.selectNumberingPlan(countryCallingCode);
  } else if (number && (defaultCountry || defaultCallingCode)) {
    metadata2.selectNumberingPlan(defaultCountry, defaultCallingCode);
    if (defaultCountry) {
      country = defaultCountry;
    }
    countryCallingCode = defaultCallingCode || getCountryCallingCode(defaultCountry, metadata2.metadata);
  } else
    return {};
  if (!number) {
    return {
      countryCallingCodeSource,
      countryCallingCode
    };
  }
  var _extractNationalNumbe = extractNationalNumber(parseIncompletePhoneNumber(number), metadata2), nationalNumber = _extractNationalNumbe.nationalNumber, carrierCode = _extractNationalNumbe.carrierCode;
  var exactCountry = getCountryByCallingCode(countryCallingCode, {
    nationalNumber,
    defaultCountry,
    metadata: metadata2
  });
  if (exactCountry) {
    country = exactCountry;
    if (exactCountry === "001")
      ;
    else {
      metadata2.country(country);
    }
  }
  return {
    country,
    countryCallingCode,
    countryCallingCodeSource,
    nationalNumber,
    carrierCode
  };
}
function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$2(Object(source), true).forEach(function(key) {
      _defineProperty$2(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function parsePhoneNumberWithError(text, options, metadata2) {
  return parse(text, _objectSpread$2(_objectSpread$2({}, options), {}, {
    v2: true
  }), metadata2);
}
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function normalizeArguments(args) {
  var _Array$prototype$slic = Array.prototype.slice.call(args), _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 4), arg_1 = _Array$prototype$slic2[0], arg_2 = _Array$prototype$slic2[1], arg_3 = _Array$prototype$slic2[2], arg_4 = _Array$prototype$slic2[3];
  var text;
  var options;
  var metadata2;
  if (typeof arg_1 === "string") {
    text = arg_1;
  } else
    throw new TypeError("A text for parsing must be a string.");
  if (!arg_2 || typeof arg_2 === "string") {
    if (arg_4) {
      options = arg_3;
      metadata2 = arg_4;
    } else {
      options = void 0;
      metadata2 = arg_3;
    }
    if (arg_2) {
      options = _objectSpread$1({
        defaultCountry: arg_2
      }, options);
    }
  } else if (isObject(arg_2)) {
    if (arg_3) {
      options = arg_2;
      metadata2 = arg_3;
    } else {
      metadata2 = arg_2;
    }
  } else
    throw new Error("Invalid second argument: ".concat(arg_2));
  return {
    text,
    options,
    metadata: metadata2
  };
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function parsePhoneNumber$2(text, options, metadata2) {
  if (options && options.defaultCountry && !isSupportedCountry(options.defaultCountry, metadata2)) {
    options = _objectSpread(_objectSpread({}, options), {}, {
      defaultCountry: void 0
    });
  }
  try {
    return parsePhoneNumberWithError(text, options, metadata2);
  } catch (error) {
    if (error instanceof ParseError)
      ;
    else {
      throw error;
    }
  }
}
function parsePhoneNumber$1() {
  var _normalizeArguments = normalizeArguments(arguments), text = _normalizeArguments.text, options = _normalizeArguments.options, metadata2 = _normalizeArguments.metadata;
  return parsePhoneNumber$2(text, options, metadata2);
}
function parsePhoneNumber() {
  return withMetadataArgument(parsePhoneNumber$1, arguments);
}
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
const sdk = new ClickToPaySDK();
const pay = async (nonce, nonceId, cardId) => {
  const orderDetails = await getOrderDetails();
  const signedData = await signData(nonce, nonceId, orderDetails.amount, orderDetails.currency);
  const dcfWindow = document.querySelector(".dcf-iframe").contentWindow;
  const transactionInformation = {
    transactionAmount: orderDetails.amount,
    transactionCurrencyCode: orderDetails.currency
  };
  const customerInformation = await getCustomerInformation();
  console.debug("Click to Pay - started paying with card");
  if (cardId) {
    return await sdk.payWithCard(signedData, transactionInformation, cardId, dcfWindow, false, customerInformation, {
      transactionAmount: {
        transactionAmount: Number(orderDetails.amount),
        transactionCurrencyCode: orderDetails.currency
      },
      dpaBillingPreference: "NONE",
      threeDsPreference: "NONE",
      confirmPayment: false
    });
  } else {
    return await sdk.payWithNewCard(signedData, transactionInformation, dcfWindow, true, customerInformation, {
      transactionAmount: {
        transactionAmount: Number(orderDetails.amount),
        transactionCurrencyCode: orderDetails.currency
      },
      dpaBillingPreference: "FULL",
      threeDsPreference: "NONE",
      confirmPayment: false
    });
  }
};
const getCustomerInformation = async () => {
  let customerInformation;
  if (clicktopay.isOnePageCheckout) {
    await $.ajax({
      type: "GET",
      url: clicktopay.customer_information_url,
      data: {
        action: "GetCustomerInformation",
        ajax: true
      }
    }).success(function(r) {
      var data = $.parseJSON(r);
      const phoneNumber2 = parsePhoneNumber(data.shippingAddress.phoneNumber);
      const isValidPhoneNumber2 = phoneNumber2 && phoneNumber2.isValid();
      customerInformation = {
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        email: data.customer.email,
        consumerMobileNumber: isValidPhoneNumber2 ? {
          countryCode: phoneNumber2.countryCallingCode,
          phoneNumber: phoneNumber2.nationalNumber
        } : null,
        billingAddress: {
          line1: data.billingAddress.line1,
          line2: data.billingAddress.line2,
          city: data.billingAddress.city,
          state: data.billingAddress.state,
          countryCode: data.billingAddress.countryCode,
          zip: data.billingAddress.zip
        },
        shippingAddress: {
          line1: data.shippingAddress.line1,
          line2: data.shippingAddress.line2,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          countryCode: data.shippingAddress.countryCode,
          zip: data.shippingAddress.zip
        }
      };
    }).error(function(error) {
      console.error(error);
      utils.displayError(clicktopay.errors.somethingWentWrong.title, clicktopay.errors.somethingWentWrong.message, clicktopay.errors.somethingWentWrong.btn, () => {
        if (clicktopay.isFallbackPage) {
          window.location.href = clicktopay.orderRedirectUrl;
        } else {
          utils.disablePaymentOption();
        }
      });
    });
    return customerInformation;
  }
  const phoneNumber = parsePhoneNumber(clicktopay.customer.phone_number);
  const isValidPhoneNumber = phoneNumber && phoneNumber.isValid();
  return {
    firstName: clicktopay.customer.firstName,
    lastName: clicktopay.customer.lastName,
    email: clicktopay.customer.email,
    consumerMobileNumber: isValidPhoneNumber ? {
      countryCode: phoneNumber.countryCallingCode,
      phoneNumber: phoneNumber.nationalNumber
    } : null,
    billingAddress: {
      line1: clicktopay.customer.billingAddress.line1,
      line2: clicktopay.customer.billingAddress.line2,
      city: clicktopay.customer.billingAddress.city,
      state: clicktopay.customer.billingAddress.state,
      countryCode: clicktopay.customer.billingAddress.countryCode,
      zip: clicktopay.customer.billingAddress.zip
    },
    shippingAddress: {
      line1: clicktopay.customer.shippingAddress.line1,
      line2: clicktopay.customer.shippingAddress.line2,
      city: clicktopay.customer.shippingAddress.city,
      state: clicktopay.customer.shippingAddress.state,
      countryCode: clicktopay.customer.shippingAddress.countryCode,
      zip: clicktopay.customer.shippingAddress.zip
    }
  };
};
const signData = async (nonce, nonceId, amount, currency) => {
  let signedData;
  await $.ajax({
    type: "POST",
    url: clicktopay.signUrl,
    data: {
      partner_id: clicktopay.partnerId,
      correlation_id: nonceId,
      amount,
      currency_code: currency,
      nonce
    }
  }).done(function(r) {
    var data = $.parseJSON(r);
    signedData = data.data.signedData;
  }).error(function(error) {
    console.log(error);
  });
  return signedData;
};
const getOrderDetails = async () => {
  let result2;
  await $.ajax({
    type: "GET",
    url: clicktopay.get_order_details_url,
    async: false,
    success: function(response) {
      result2 = JSON.parse(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
  return result2.data.order_details;
};
const checkout = { pay };
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
const create = async (cards, withCardInformation) => {
  document.getElementById("clicktopay-express-checkout-button").classList.remove("ps-hidden");
  if (!withCardInformation) {
    document.getElementById("express-checkout-button-c2p").classList.remove("ps-hidden");
    document.querySelector(".express-checkout-button-c2p-icons").classList.remove("ps-hidden");
    return;
  }
  if (cards.length > 0) {
    const text = document.createElement("span");
    text.innerHTML = " •••• " + cards[0].panLastFour;
    document.querySelector(".express-checkout-button-c2p-icons").classList.add("ps-hidden");
    document.getElementById("express-checkout-button-c2p").appendChild(text);
    document.getElementById("express-checkout-button-c2p").classList.remove("ps-hidden");
    document.getElementById("c2p-card-icon").classList.remove("ps-hidden");
    document.getElementById("c2p-card-icon").src = getCardLogoSourcePath(cards[0].paymentCardDescriptor);
  }
  if (cards.length > 1) {
    document.getElementById("express-checkout-additional-description").classList.remove("ps-hidden");
    document.getElementById("express-checkout-card-count").innerHTML = cards.length - 1;
  }
};
const getCardLogoSourcePath = (paymentCardDescriptor) => {
  switch (paymentCardDescriptor) {
    case "mastercard":
      return clicktopay.mastercardLogoPath;
    case "visa":
      return clicktopay.expressCheckoutButtonTheme === "classic" ? clicktopay.visaClassicLogoPath : clicktopay.visaDarkLogoPath;
    case "discover":
      return clicktopay.discoverLogoPath;
    case "amex":
      return clicktopay.amexLogoPath;
    default:
      console.error("Card provider logo does not exist");
  }
};
const expressCheckoutBtn = { create };
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
class Client {
  constructor() {
    __publicField(this, "showExpressCheckoutButton", async () => {
      const addressPresent = !!clicktopay.customer.shippingAddress && !!clicktopay.customer.billingAddress;
      const isRegisteredUser = !clicktopay.customer.is_guest;
      const cards = this.cards;
      const existingC2pUser = cards.length > 0 || this.isConsumerPresent;
      const browserCookiesPresent = cards.length > 0;
      const visitedShippingStep = session.get("guest_visited_shipping_step");
      console.debug("Click to Pay - Express button variables", {
        "is_registered_user": isRegisteredUser,
        "existing_c2p_user": existingC2pUser,
        "browser_cookies_present": browserCookiesPresent,
        "is_address_present": addressPresent,
        "guest_visited_shipping_step": visitedShippingStep
      });
      if (!isRegisteredUser && addressPresent && visitedShippingStep) {
        return await expressCheckoutBtn.create(cards, false);
      }
      if (isRegisteredUser && !existingC2pUser && !browserCookiesPresent && addressPresent) {
        return await expressCheckoutBtn.create(cards, false);
      }
      if (isRegisteredUser && existingC2pUser && !browserCookiesPresent && addressPresent) {
        return await expressCheckoutBtn.create(cards, false);
      }
      if (isRegisteredUser && existingC2pUser && browserCookiesPresent && addressPresent) {
        return await expressCheckoutBtn.create(cards, true);
      }
      if (isRegisteredUser && existingC2pUser && browserCookiesPresent && !addressPresent) {
        return await expressCheckoutBtn.create(cards, false);
      }
    });
    __publicField(this, "updateExpressCheckoutButton", async () => {
      const brandLogos = {
        visa: document.querySelector(".c2p-visa-logo"),
        mastercard: document.querySelector(".c2p-mastercard-logo"),
        amex: document.querySelector(".c2p-amex-logo"),
        discover: document.querySelector(".c2p-discover-logo")
      };
      Object.keys(brandLogos).forEach((brand) => {
        const logoElement = brandLogos[brand];
        if (!logoElement) {
          return;
        }
        if (!this.availableCardBrands.includes(brand)) {
          logoElement.style.display = "none";
        } else {
          logoElement.style.display = "inline";
        }
      });
    });
    this.initialized = false;
    this.cards = [];
    this.nonce = null;
    this.nonceId = null;
    this.retriedCheckout = false;
    this.isConsumerPresent = false;
    this.hasFinishedInitialization = false;
    this.isDcfScreenOpen = false;
    this.hasEnteredCardNumber = false;
    this.currentCountryCode = clicktopay.currentCountryCode;
    this.sdk = new ClickToPaySDK();
    this.disabledCards = [];
    this.hasConsent = false;
    this.isThreeDs = false;
    this.isCardEntryFormValid = false;
    this.availableCardBrands = [];
    this.isConsumerPresentFieldId = "";
  }
  async initializeCTP() {
    return new Promise(async (resolve) => {
      const intervalId = setInterval(async () => {
        var _a, _b;
        if (this.sdk.canInitialize()) {
          await this.sdk.initialize(clicktopay.merchantReferenceId, clicktopay.jwtToken, clicktopay.env, clicktopay.locale, (_b = (_a = clicktopay.customer) == null ? void 0 : _a.billingAddress) == null ? void 0 : _b.countryCode);
          utils.toggleLoader(true);
          clearInterval(intervalId);
          resolve();
        }
      }, 10);
    });
  }
  async isInitialized() {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (this.initialized) {
          clearInterval(intervalId);
          resolve(this.initialized);
        }
      }, 10);
    });
  }
  async hasPerformedLookup() {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (this.hasFinishedInitialization) {
          clearInterval(intervalId);
          resolve(this.hasFinishedInitialization);
        }
      }, 10);
    });
  }
  async getCards() {
    this.cards = await this.sdk.getCards();
    return this.cards;
  }
  async signOut() {
    this.cards = [];
    return this.sdk.signOut();
  }
  async displayState(state) {
    this.hasEnteredCardNumber = false;
    await stateMachine.setState(state, {
      [FormStates.OtpForm]: {
        otpConfig: {
          "auto-submit": false,
          "--src-btn-border-radius": "5px",
          "display-header": false,
          "locale": clicktopay.locale,
          "--src-root-container-border-color": "none",
          "--src-root-container-border-radius": "5px 5px 0 0"
        }
      },
      [FormStates.CardForm]: {
        cards: this.cards
      },
      [FormStates.CardList]: {
        cards: this.cards
      }
    });
    await this.refetchPlaceOrderState();
  }
  getPhoneInstance(element) {
    if (element && element.getAttribute("data-intl-tel-input-id")) {
      return window.intlTelInputGlobals.getInstance(element);
    }
    return intlTelInput$1(element, {
      allowDropdown: true,
      initialCountry: this.currentCountryCode,
      separateDialCode: true,
      formatOnDisplay: false,
      showFlags: false,
      useFullscreenPopup: false
    });
  }
  destroyPhoneInstance(element) {
    if (element && element.getAttribute("data-intl-tel-input-id")) {
      element.style.paddingLeft = "0.5rem";
      return window.intlTelInputGlobals.getInstance(element).destroy();
    }
  }
  async checkIsConsumerPresent(value) {
    if (utils.isEmail(value)) {
      const response = await this.sdk.idLookupWithEmail(value);
      return response && response.consumerPresent;
    }
    const phoneNumber = parsePhoneNumber(value);
    if (phoneNumber && phoneNumber.isValid()) {
      const response = await this.sdk.idLookupWithPhoneNumber(
        phoneNumber.countryCallingCode,
        phoneNumber.nationalNumber
      );
      return response && response.consumerPresent;
    }
    return false;
  }
  areBillingAddressValid(cards) {
    return cards.length !== 0 && cards.every((card) => {
      const { city, countryCode, zip, state } = card.maskedBillingAddress;
      const cityValid = !(city == null ? void 0 : city.includes("*"));
      const countryCodeValid = !(countryCode == null ? void 0 : countryCode.includes("*"));
      const zipValid = !(zip == null ? void 0 : zip.includes("*"));
      const stateValid = !state || !state.includes("*");
      return cityValid && countryCodeValid && zipValid && stateValid;
    });
  }
  async handleCustomerFormSubmit(event) {
    event.preventDefault();
    const emailField = document.querySelector(".js-customer-form input[name=email]");
    if (!emailField) {
      console.error("Email field not found");
      return;
    }
    if (!utils.isEmail(emailField.value)) {
      utils.displayError(clicktopay.errors.invalidEmail.title, clicktopay.errors.invalidEmail.message, clicktopay.errors.invalidEmail.btn);
      setTimeout(function() {
        document.getElementById("customer-form").querySelector('button[type="submit"]').classList.remove("disabled");
      }, 20);
      return;
    }
    document.getElementById("customer-form").submit();
  }
  async handleAddressFormSubmit(event, phoneElement) {
    event.preventDefault();
    if (!phoneElement) {
      document.querySelector(".js-address-form form").submit();
      return;
    }
    session.set("customer-entered-address-manually", true, 3600);
    const value = this.getPhoneInstance(phoneElement)._getFullNumber();
    const phoneNumber = parsePhoneNumber(value);
    const phoneFieldValue = phoneElement.value.trim();
    if (phoneFieldValue.length === 0) {
      document.querySelector(".js-address-form form").submit();
      return;
    }
    if (!phoneNumber || !phoneNumber.isValid()) {
      utils.displayError(clicktopay.errors.invalidPhoneNumber.title, clicktopay.errors.invalidPhoneNumber.message, clicktopay.errors.invalidPhoneNumber.btn);
      setTimeout(function() {
        document.getElementsByName("confirm-addresses")[0].form.querySelector('button[type="submit"]').classList.remove("disabled");
      }, 20);
      return;
    }
    document.querySelector(".iti__selected-flag").style.display = "none";
    phoneElement.style.paddingLeft = "0.5rem";
    phoneElement.value = this.getPhoneInstance(phoneElement)._getFullNumber();
    document.querySelector(".js-address-form form").submit();
  }
  submitPaymentForm(transactionToken, transactionTotal, gatewayTransactionId) {
    var _a;
    if (!this.canEnableOrderButton()) {
      console.error("Click To Pay - place order button was not enabled by validation.");
      return;
    }
    (_a = document.querySelector('#payment-confirmation button[type="submit"]')) == null ? void 0 : _a.setAttribute("disabled", "disabled");
    const url = new URL(clicktopay.payment_url);
    url.searchParams.append("transaction_token", transactionToken);
    url.searchParams.append("gateway_transaction_id", gatewayTransactionId);
    url.searchParams.append("transaction_amount", transactionTotal);
    window.location.href = url.href;
  }
  async handleExpressButtonClick(event) {
    var _a, _b;
    event.preventDefault();
    let address = [{}];
    if (this.areBillingAddressValid(this.cards ?? [])) {
      address = [{
        zip_code: this.cards[0].maskedBillingAddress.zip,
        state: (_a = this.cards[0].maskedBillingAddress) == null ? void 0 : _a.state,
        city: this.cards[0].maskedBillingAddress.city,
        country_code: this.cards[0].maskedBillingAddress.countryCode,
        line1: (_b = this.cards[0].maskedBillingAddress) == null ? void 0 : _b.line1
      }];
    }
    await $.ajax({
      type: "POST",
      url: clicktopay.expressCheckoutUrl,
      data: {
        ajax: true,
        address
      },
      success: function(response) {
        window.location.href = document.getElementById("express-checkout-button").getAttribute("href");
      },
      error: function(response) {
        console.error(response);
      }
    });
  }
  async handleInitialState() {
    if (this.getCurrentState()) {
      return;
    }
    if (this.cards && this.cards.length > 0) {
      await this.displayState(FormStates.CardList);
      return;
    }
    await this.displayState(this.isConsumerPresent ? FormStates.OtpForm : FormStates.CardForm);
  }
  async refetchNonce(retried = false) {
    var _a, _b, _c, _d;
    let nonceResponse = await this.sdk.getNonce(clicktopay.jwtToken);
    if (nonceResponse == null ? void 0 : nonceResponse.Errors) {
      if (((_b = (_a = nonceResponse == null ? void 0 : nonceResponse.Errors) == null ? void 0 : _a.Error[0]) == null ? void 0 : _b.ReasonCode) === "CSDK021") {
        if (retried) {
          await this.handleError((_c = nonceResponse == null ? void 0 : nonceResponse.Errors) == null ? void 0 : _c.Error[0]);
          return;
        }
        await this.refetchNonce(true);
      }
      await this.handleError((_d = nonceResponse == null ? void 0 : nonceResponse.Errors) == null ? void 0 : _d.Error[0]);
    }
    this.nonce = nonceResponse.nonce;
    this.nonceId = nonceResponse.nonceId;
  }
  async registerCardInputEventListeners() {
    document.getElementById("card-input-access-your-saved-cards-button").addEventListener("click", async (event) => {
      event.preventDefault();
      await this.displayState(FormStates.CardList);
    });
    document.getElementById("card-input-access-your-cards-button").addEventListener("click", async (event) => {
      event.preventDefault();
      await this.displayState(FormStates.IdLookupForm);
    });
  }
  async registerCardListEventListeners() {
    document.getElementById("card-list-manual-card-entry-button").addEventListener("click", async (event) => {
      event.preventDefault();
      await this.displayState(FormStates.CardForm);
    });
    document.querySelectorAll(".card-list-not-you-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        await this.signOut();
        await this.displayState(FormStates.IdLookupForm);
      });
    });
  }
  async registerLookupEventListeners() {
    document.getElementById("id-lookup-manual-card-entry-button").addEventListener("click", async (event) => {
      event.preventDefault();
      await this.displayState(FormStates.CardForm);
    });
    document.getElementById("id-lookup-continue-with-click-to-pay-button").addEventListener("click", async (event) => {
      document.querySelector(".id-lookup-form-group").classList.remove("error");
      event.preventDefault();
      document.getElementById("id-lookup-continue-with-click-to-pay-button").disabled = true;
      const value = document.getElementsByName("id-lookup-input")[0].value;
      this.isConsumerPresent = await this.checkIsConsumerPresent(value);
      if (this.isConsumerPresent) {
        await this.displayState(FormStates.OtpForm);
      } else {
        document.getElementById("id-lookup-continue-with-click-to-pay-button").disabled = false;
        document.querySelector(".id-lookup-form-group").classList.add("error");
      }
    });
    document.getElementsByName("id-lookup-input")[0].addEventListener("keyup", async (event) => {
      event.preventDefault();
      if (document.getElementsByName("id-lookup-input")[0].value.length > 0) {
        document.getElementById("id-lookup-continue-with-click-to-pay-button").disabled = false;
      } else {
        document.getElementById("id-lookup-continue-with-click-to-pay-button").disabled = true;
      }
    });
  }
  async registerPlaceOrderEventListeners() {
    if (!document.querySelector('#conditions-to-approve input[type="checkbox"], .js-conditions-to-approve input[type="checkbox"]')) {
      return;
    }
    document.querySelector('#conditions-to-approve input[type="checkbox"], .js-conditions-to-approve input[type="checkbox"]').addEventListener("change", (event) => {
      this.refetchPlaceOrderState();
    });
    const self = this;
    document.querySelectorAll('input[name="payment-option"]').forEach(function(item) {
      item.addEventListener("change", async function(event) {
        self.refetchPlaceOrderState();
      });
    });
  }
  initializePaymentOption() {
    if (!!document.getElementById("js-clicktopay-payment-form") && !clicktopay.isFallbackPage) {
      this.initializePaymentOptionLabel();
      this.createDisabledButtonClass();
      this.refetchPlaceOrderState();
      return;
    }
    if (clicktopay.isOnePageCheckout && utils.isPaymentStep() && !clicktopay.isFallbackPage) {
      new Promise(async (resolve) => {
        const intervalId = setInterval(async () => {
          if (!!document.querySelector('[data-module-name*="clicktopay"]')) {
            clearInterval(intervalId);
            resolve();
          }
        }, 10);
      }).then(() => {
        this.initializePaymentOptionLabel();
        this.updateSrcMarkLogos(this.availableCardBrands);
      });
    }
  }
  initializePaymentOptionLabel() {
    const paymentOption = document.querySelector('[data-module-name*="clicktopay"]');
    if (!paymentOption) {
      return;
    }
    const closestPaymentOption = paymentOption.closest(".payment-option");
    if (!(clicktopay.themeName !== "classic" && !clicktopay.isOnePageCheckout)) {
      closestPaymentOption.style.display = "flex";
      closestPaymentOption.style.alignItems = "center";
      closestPaymentOption.style.marginBottom = "0.25rem";
    }
    if (!clicktopay.isOnePageCheckout) {
      if (paymentOption.labels.length > 0) {
        paymentOption.labels[0].innerHTML = clicktopay.srcMark;
        paymentOption.labels[0].style = "margin-bottom: 0;";
      }
    } else {
      if (!!closestPaymentOption.querySelector(".payment_content")) {
        closestPaymentOption.querySelector(".payment_content").innerHTML = clicktopay.srcMark;
        closestPaymentOption.querySelector(".payment_content").style = "margin-bottom: 0;";
      } else {
        closestPaymentOption.querySelector("label").innerHTML = clicktopay.srcMark;
        closestPaymentOption.querySelector("label").style = "margin-bottom:5px;";
      }
    }
    if (clicktopay.isOnePageCheckout) {
      this.createPaymentFormIfMissing();
    }
  }
  createPaymentFormIfMissing() {
    const paymentOption = document.querySelector('[data-module-name*="clicktopay"]');
    paymentOption.dataset.forceDisplay = 0;
    const id = paymentOption.id.match(/payment-option-(\d+)/)[1];
    let formContainer = document.querySelector(`#pay-with-payment-option-${id}-form`);
    if (!formContainer) {
      let formContainer2 = document.createElement("div");
      formContainer2.id = `pay-with-payment-option-${id}-form`;
      formContainer2.classList.add("js-payment-option-form");
      paymentOption.parentNode.parentNode.insertAdjacentElement("afterend", formContainer2);
    }
    let formContainerForm = document.querySelector(`#pay-with-payment-option-${id}-form form`);
    if (!formContainerForm) {
      let formContainerForm2 = document.createElement("form");
      formContainerForm2.id = "payment-form";
      formContainerForm2.method = "POST";
      formContainerForm2.action = clicktopay.payment_url;
      const button = document.createElement("button");
      button.style.display = "none";
      button.id = `pay-with-payment-option-${id}`;
      button.type = "submit";
      formContainerForm2.appendChild(button);
      document.querySelector(`#pay-with-payment-option-${id}-form`).appendChild(formContainerForm2);
    }
  }
  selectPaymentOption() {
    if (utils.isPaymentStep() && !!document.querySelector('input[data-module-name*="clicktopay"]')) {
      document.querySelector('input[data-module-name*="clicktopay"]').setAttribute("checked", "checked");
      const paymentOption = document.querySelector('[data-module-name="clicktopay"]');
      const id = paymentOption.id.match(/payment-option-(\d+)/)[1];
      const target = `pay-with-payment-option-${id}-form`;
      const targetNode = document.getElementById(target);
      const config = { attributes: true };
      const callback = (mutationList, observer2) => {
        for (const mutation of mutationList) {
          if (document.getElementById(target).style.display === "none" && document.querySelector('input[name="payment-option"]:checked').dataset.moduleName === clicktopay.name) {
            document.getElementById(target).style.display = "block";
            observer2.disconnect();
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    }
  }
  selectOPCPaymentOption() {
    if (!!document.getElementById("checkout")) {
      new Promise(async (resolve) => {
        const intervalId = setInterval(async () => {
          if (!!document.querySelector('[data-module-name*="clicktopay"]')) {
            clearInterval(intervalId);
            resolve();
          }
        }, 10);
      }).then(() => {
        document.querySelector('input[data-module-name*="clicktopay"]').click();
      });
    }
  }
  async clearCardForm() {
    await this.sdk.clearCardForm();
  }
  updateSrcMarkLogos(cardBrands) {
    this.availableCardBrands = cardBrands;
    if (this.availableCardBrands.length === 0) {
      return;
    }
    const orderedCards = clicktopay.cards || [];
    this.availableCardBrands = orderedCards.filter((brand) => this.availableCardBrands.includes(brand));
    if (document.querySelector(".cart-summary #express-checkout-button") && clicktopay.isFasterCheckoutButtonActive) {
      this.updateExpressCheckoutButton();
    }
    if (utils.isPaymentStep() && !!document.querySelector('input[data-module-name*="clicktopay"]')) {
      this.updatePaymentOptionLabel();
    }
  }
  updatePaymentOptionLabel() {
    if (document.querySelectorAll("src-mark").length > 0 && this.availableCardBrands.length > 0) {
      const cardBrandsString = this.availableCardBrands.join(",");
      document.querySelectorAll("src-mark").forEach((element) => {
        element.setAttribute("card-brands", cardBrandsString);
      });
    }
  }
  getCurrentState() {
    return stateMachine.getState();
  }
  showDcfScreen() {
    document.querySelector(".card-input-main").classList.remove("card-entered");
    document.getElementById("dcf-screen").classList.add("open");
    document.getElementById("dcf-overlay").classList.add("open");
    document.body.style.overflowY = "hidden";
    this.isDcfScreenOpen = true;
  }
  hideDcfScreen() {
    document.body.style.overflowY = "";
    document.getElementById("dcf-screen").classList.remove("open");
    document.getElementById("dcf-overlay").classList.remove("open");
    this.isDcfScreenOpen = false;
  }
  initializePhoneInstances() {
    if (clicktopay.isOnePageCheckout && clicktopay.usePhoneNumberPrefix && !clicktopay.isFallbackPage) {
      if (document.querySelector("#thecheckout-address-delivery")) {
        this.getPhoneInstance(document.querySelector('#delivery-address input[name="phone"]'));
        document.querySelector('#delivery-address input[name="phone"]').parentElement.style.width = "100%";
        document.querySelector('#delivery-address input[name="phone"]').parentElement.style.display = "flex";
      }
      document.querySelectorAll("#delivery_phone_mobile").forEach((element) => {
        this.getPhoneInstance(element);
      });
    }
  }
  canEnableOrderButton() {
    var _a;
    if (!clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
      if (!document.querySelector('input[name="payment-option"]:checked')) {
        return false;
      }
      if (document.querySelector('input[name="payment-option"]:checked').dataset.moduleName !== clicktopay.name) {
        return true;
      }
      if (!((_a = document.querySelector('#conditions-to-approve input[type="checkbox"], .js-conditions-to-approve input[type="checkbox"]')) == null ? void 0 : _a.checked)) {
        return false;
      }
    }
    if (this.getCurrentState() === null) {
      return false;
    }
    if (this.getCurrentState() === FormStates.CardForm && this.hasEnteredCardNumber && this.hasConsent && this.isCardEntryFormValid) {
      return true;
    }
    if (this.getCurrentState() === FormStates.CardList) {
      return true;
    }
    return false;
  }
  refetchPlaceOrderState() {
    if (clicktopay.isOnePageCheckout || clicktopay.isFallbackPage) {
      if (this.canEnableOrderButton()) {
        document.querySelector(".pay-clicktopay").classList.remove("disabled");
        document.querySelector(".pay-clicktopay").disabled = false;
      } else {
        document.querySelector(".pay-clicktopay").classList.add("disabled");
        document.querySelector(".pay-clicktopay").disabled = true;
      }
    } else {
      if (!document.getElementById("js-clicktopay-payment-form")) {
        return;
      }
      if (!document.querySelector("#payment-confirmation .ps-shown-by-js button")) {
        return;
      }
      if (this.canEnableOrderButton()) {
        document.querySelectorAll(".clicktopay-disabled").forEach(function(button) {
          button.classList.remove("clicktopay-disabled");
        });
      } else {
        document.querySelector("#payment-confirmation .ps-shown-by-js button").classList.add("clicktopay-disabled");
      }
    }
  }
  getPhoneElement() {
    if (document.querySelector(".js-address-form input[name=phone]") && document.querySelector(".js-address-form input[name=phone_mobile]")) {
      return document.querySelector(".js-address-form input[name=phone_mobile]");
    } else if (document.querySelector(".js-address-form input[name=phone]")) {
      return document.querySelector(".js-address-form input[name=phone]");
    } else if (document.querySelector(".js-address-form input[name=phone_mobile]")) {
      return document.querySelector(".js-address-form input[name=phone_mobile]");
    }
    return document.querySelector(".js-address-form input[name=phone]");
  }
  createDisabledButtonClass() {
    if (!document.getElementById("js-clicktopay-payment-form")) {
      return;
    }
    const button = document.querySelector("#payment-confirmation button");
    if (!button) {
      return;
    }
    const buttonStyleObject = window.getComputedStyle(button);
    const buttonStyle = Array.from(buttonStyleObject).map((key) => `${key}: ${buttonStyleObject.getPropertyValue(key)}`).join(" !important; ");
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
  .clicktopay-disabled {
    ${buttonStyle};
    pointer-events: none !important;
  }
`;
    document.head.appendChild(style);
  }
  async handleError(error) {
    var _a, _b, _c;
    document.querySelector(".dcf-iframe").src = "";
    this.isThreeDs = false;
    switch (error.ReasonCode) {
      case "CSDK003":
        this.hideDcfScreen();
        utils.displayError(
          clicktopay.errors.somethingWentWrong.title,
          clicktopay.errors.somethingWentWrong.message,
          clicktopay.errors.somethingWentWrong.btn,
          () => {
            if (clicktopay.isFallbackPage) {
              window.location.href = clicktopay.orderRedirectUrl;
            } else {
              utils.disablePaymentOption();
            }
          }
        );
        break;
      case "CSDK008":
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        utils.displayError(
          clicktopay.errors.somethingWentWrongWithThisCard.title,
          clicktopay.errors.somethingWentWrongWithThisCard.message,
          clicktopay.errors.somethingWentWrongWithThisCard.btn
        );
        if (this.getCurrentState() === FormStates.CardList) {
          await this.getCards();
          const previousCardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
          this.disabledCards.push(previousCardId);
          this.cards.forEach((card) => {
            if (this.disabledCards.includes(card.srcDigitalCardId)) {
              card.digitalCardData.status = "DISABLED";
            }
          });
          await cardList.create(this.cards, null);
          (_a = document.querySelector("#payment-confirmation button")) == null ? void 0 : _a.classList.remove("disabled");
        }
        break;
      case "CSDK017":
        await this.getCards();
        if (this.getCurrentState() === FormStates.CardList) {
          this.cards.forEach((card) => {
            if (this.disabledCards.includes(card.srcDigitalCardId)) {
              card.digitalCardData.status = "DISABLED";
            }
          });
          const previousCardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
          await cardList.create(this.cards, previousCardId);
        }
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        (_b = document.querySelector("#payment-confirmation button")) == null ? void 0 : _b.classList.remove("disabled");
        break;
      case "CSDK018":
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        utils.displayError(
          clicktopay.errors.somethingWentWrongUseDifferentCard.title,
          clicktopay.errors.somethingWentWrongUseDifferentCard.message,
          clicktopay.errors.somethingWentWrongUseDifferentCard.btn
        );
        if (this.getCurrentState() === FormStates.CardList) {
          await this.getCards();
          this.cards.forEach((card) => {
            if (this.disabledCards.includes(card.srcDigitalCardId)) {
              card.digitalCardData.status = "DISABLED";
            }
          });
          const previousCardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
          await cardList.create(this.cards, previousCardId);
          (_c = document.querySelector("#payment-confirmation button")) == null ? void 0 : _c.classList.remove("disabled");
        }
        break;
      case "CSDK020":
        this.hideDcfScreen();
        utils.displayError(
          clicktopay.errors.threeDsFailed.title,
          clicktopay.errors.threeDsFailed.message,
          clicktopay.errors.threeDsFailed.btn,
          () => {
            location.reload();
          }
        );
        session.set("clicktopay-3ds-error-occurred", true);
        break;
      case "CSDK021":
        this.hideDcfScreen();
        utils.displayError(
          clicktopay.errors.somethingWentWrong.title,
          clicktopay.errors.somethingWentWrong.message,
          clicktopay.errors.somethingWentWrong.btn,
          () => {
            if (clicktopay.isFallbackPage) {
              window.location.href = clicktopay.orderRedirectUrl;
            } else {
              utils.disablePaymentOption();
            }
          }
        );
        break;
      case "CSDK024":
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        await this.displayState(FormStates.CardList);
        break;
      case "CSDK025":
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        await this.displayState(FormStates.CardForm);
        break;
      case "CSDK026":
        if (clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
          $(".clicktopay-form")[0].style.display = "block";
          $(".dcf-iframe")[0].style.display = "none";
          $("#checkout")[0].style.overflowY = "auto";
          document.getElementById("dcf-screen").classList.remove("dcf-open");
        } else {
          this.hideDcfScreen();
        }
        await this.signOut();
        await this.displayState(FormStates.IdLookupForm);
        break;
      default:
        this.hideDcfScreen();
        utils.displayError(clicktopay.errors.somethingWentWrong.title, clicktopay.errors.somethingWentWrong.message, clicktopay.errors.somethingWentWrong.btn, () => {
          if (clicktopay.isFallbackPage) {
            window.location.href = clicktopay.orderRedirectUrl;
          } else {
            utils.disablePaymentOption();
          }
        });
        break;
    }
    if (!this.isDcfScreenOpen && clicktopay.isOnePageCheckout && !clicktopay.isFallbackPage) {
      this.initializePhoneInstances();
    }
  }
}
class Fallback {
  constructor(client) {
    this.client = client;
  }
  async prerender() {
    document.querySelector(".dcf-content").style.display = "flex";
    try {
      this.client.initializeCTP();
    } catch (error) {
      window.initRejectedHandler();
    }
    this.client.isInitialized().then(async () => {
      console.debug("Click to Pay - initialized CTP");
      console.debug("Click to Pay - running getCards");
      this.client.getCards().then(async (cards) => {
        console.debug("Click to Pay - getCards returned " + cards.length + " cards");
        if (cards.length === 0) {
          let existingC2pUser = false;
          if (clicktopay.customer.email) {
            console.debug("Click to Pay - running isConsumerPresent with email");
            existingC2pUser = await this.client.checkIsConsumerPresent(clicktopay.customer.email, false);
          }
          if (clicktopay.customer.phone_number && !existingC2pUser) {
            console.debug("Click to Pay - running isConsumerPresent with phone number");
            existingC2pUser = await this.client.checkIsConsumerPresent(clicktopay.customer.phone_number, false);
          }
          this.client.isConsumerPresent = existingC2pUser;
        }
        console.debug("Click to Pay - initialization finished");
        this.client.hasFinishedInitialization = true;
      });
    });
  }
  async render() {
    if (window.innerWidth > 768) {
      document.getElementById("dcf-screen").classList.remove("action-sheet");
      document.getElementById("dcf-screen").classList.add("modal-sheet");
    } else {
      document.getElementById("dcf-screen").classList.remove("modal-sheet");
      document.getElementById("dcf-screen").classList.add("action-sheet");
    }
    window.addEventListener("resize", (event) => {
      const dropdownContent2 = document.getElementById("card-list-dropdown-content");
      const dropdownButton2 = document.getElementById("card-list-dropdown-button");
      dropdownContent2.style.width = dropdownButton2.offsetWidth + "px";
      if (window.innerWidth > 768) {
        document.getElementById("dcf-screen").classList.remove("action-sheet");
        document.getElementById("dcf-screen").classList.add("modal-sheet");
      } else {
        document.getElementById("dcf-screen").classList.remove("modal-sheet");
        document.getElementById("dcf-screen").classList.add("action-sheet");
      }
    });
    await this.client.registerCardInputEventListeners();
    await this.client.registerCardListEventListeners();
    await this.client.registerLookupEventListeners();
    await this.client.isInitialized();
    await this.client.hasPerformedLookup();
    await this.client.handleInitialState();
    const self = this;
    $(".pay-clicktopay").on("click", async function(event) {
      event.preventDefault();
      if (self.client.getCurrentState() === FormStates.CardForm) {
        await checkout.pay(self.client.nonce, self.client.nonceId);
        return;
      }
      if (self.client.getCurrentState() === FormStates.CardList) {
        await window.onDCF();
        const cardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
        await checkout.pay(self.client.nonce, self.client.nonceId, cardId);
        return;
      }
    });
  }
  // TODO add handlers for SDK.
}
class OnePageCheckout {
  constructor(client) {
    this.client = client;
    this.emailQuerySelectors = [
      '#checkout form[id="form_customer"] input[id="customer_email"]',
      '#checkout form[id="customer-form"] input[name="email"]',
      '#checkout #thecheckout-account input[name="email"]'
    ];
    this.phoneQuerySelectors = [
      '#checkout #delivery-address [name="phone"]',
      '#checkout [name="delivery_phone_mobile"]'
    ];
  }
  async prerender() {
    const self = this;
    if (!!document.querySelector("#checkout")) {
      document.querySelector(".dcf-content").style.display = "flex";
    }
    self.client.initializePaymentOption();
    if (clicktopay.isDefaultPaymentOption) {
      self.client.selectOPCPaymentOption();
      $(document).on("opc-load-review:completed", {}, () => {
        self.client.selectOPCPaymentOption();
      });
    }
    try {
      self.client.initializeCTP();
    } catch (error) {
      window.initRejectedHandler();
    }
    self.client.isInitialized().then(async () => {
      console.debug("Click to Pay - initialized CTP");
      console.debug("Click to Pay - running getCards");
      self.client.getCards().then(async (cards) => {
        console.debug("Click to Pay - getCards returned " + cards.length + " cards");
        if (cards.length === 0) {
          let existingC2pUser = false;
          if (clicktopay.customer.email) {
            console.debug("Click to Pay - running isConsumerPresent with email");
            existingC2pUser = await self.client.checkIsConsumerPresent(clicktopay.customer.email, false);
            if (existingC2pUser) {
              self.client.isConsumerPresentFieldId = "customer-email";
            }
          }
          if (clicktopay.customer.phone_number && !existingC2pUser) {
            console.debug("Click to Pay - running isConsumerPresent with phone number");
            existingC2pUser = await self.client.checkIsConsumerPresent(clicktopay.customer.phone_number, false);
            if (existingC2pUser) {
              self.client.isConsumerPresentFieldId = "customer-phone-number";
            }
          }
          self.client.isConsumerPresent = existingC2pUser;
        }
        console.debug("Click to Pay - initialization finished");
        self.client.hasFinishedInitialization = true;
      });
    });
  }
  async render() {
    const self = this;
    if (document.querySelector("#checkout")) {
      if (window.innerWidth > 768) {
        document.getElementById("dcf-screen").classList.remove("action-sheet");
        document.getElementById("dcf-screen").classList.add("modal-sheet");
      } else {
        document.getElementById("dcf-screen").classList.remove("modal-sheet");
        document.getElementById("dcf-screen").classList.add("action-sheet");
      }
      window.addEventListener("resize", (event) => {
        const dropdownContent2 = document.getElementById("card-list-dropdown-content");
        const dropdownButton2 = document.getElementById("card-list-dropdown-button");
        dropdownContent2.style.width = dropdownButton2.offsetWidth + "px";
        if (window.innerWidth > 768) {
          document.getElementById("dcf-screen").classList.remove("action-sheet");
          document.getElementById("dcf-screen").classList.add("modal-sheet");
        } else {
          document.getElementById("dcf-screen").classList.remove("modal-sheet");
          document.getElementById("dcf-screen").classList.add("action-sheet");
        }
      });
    }
    if (session.get("clicktopay-express-checkout") || session.get("clicktopay-is-default-option")) {
      self.client.selectOPCPaymentOption();
    }
    if (session.get("clicktopay-3ds-error-occurred")) {
      self.client.selectOPCPaymentOption();
      if (clicktopay.isOnePageCheckout) {
        self.client.showDcfScreen();
        if (clicktopay.usePhoneNumberPrefix) {
          self.destroyPhoneInstances();
        }
        await self.client.isInitialized();
        await self.client.hasPerformedLookup();
        await self.client.handleInitialState();
      }
      session.remove("clicktopay-3ds-error-occurred");
    }
    if (document.querySelector("#checkout")) {
      await self.client.registerCardInputEventListeners();
      await self.client.registerCardListEventListeners();
      await self.client.registerLookupEventListeners();
      await self.handleModalPayment();
    }
  }
  async handleModalPayment() {
    const self = this;
    if (clicktopay.usePhoneNumberPrefix && document.querySelector("#thecheckout-address-delivery") && document.querySelector('#delivery-address input[name="phone"]')) {
      self.client.getPhoneInstance(document.querySelector('#delivery-address input[name="phone"]'));
      const inputLabel = $('#delivery-address input[name="phone"]').parents("label")[0];
      inputLabel.style.display = "flex";
      inputLabel.style.flexDirection = "column";
      inputLabel.style.width = "100%";
    }
    [...self.emailQuerySelectors, ...self.phoneQuerySelectors].forEach((selector) => {
      self.registerInputLookupListeners(selector);
    });
    document.addEventListener("click", function(event) {
      var _a, _b, _c, _d;
      if (clicktopay.usePhoneNumberPrefix) {
        let destroyPhoneInstance = false;
        if (event.target.matches("button[id=btn_place_order]") || event.target.matches("button[id=btn-place_order]") || event.target.matches("button[id=confirm_order]")) {
          destroyPhoneInstance = true;
        }
        if (((_b = (_a = prestashop == null ? void 0 : prestashop.selectors) == null ? void 0 : _a.checkout) == null ? void 0 : _b.confirmationSelector) && $(prestashop.selectors.checkout.confirmationSelector + " button")[0] === event.target) {
          destroyPhoneInstance = true;
        }
        if (((_d = (_c = prestashop == null ? void 0 : prestashop.selectors) == null ? void 0 : _c.checkout) == null ? void 0 : _d.paymentBinary) && $(prestashop.selectors.checkout.paymentBinary + " button")[0] === event.target) {
          destroyPhoneInstance = true;
        }
        if (destroyPhoneInstance) {
          self.destroyPhoneInstances();
        }
      }
      if (event.target.id === "mc-ctp-src-mark") {
        document.querySelector('input[data-module-name="clicktopay"]').click();
      }
    }, true);
    $("body").on("submit", "[id^=pay-with-][id$=-form] form", async function(event) {
      const isPaymentOptionSelected = $('[data-module-name*="clicktopay"]:checked');
      if (isPaymentOptionSelected.length > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if ($('[data-module-name*="clicktopay"]:disabled').length) {
          return;
        }
        await self.client.displayState(null);
        await utils.toggleLoader(true);
        await self.client.showDcfScreen();
        await self.client.isInitialized();
        await self.client.hasPerformedLookup();
        if (self.client.getCurrentState() === FormStates.CardList) {
          await self.client.getCards();
          const previousCardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
          self.client.disabledCards.push(previousCardId);
          self.client.cards.forEach((card) => {
            if (self.client.disabledCards.includes(card.srcDigitalCardId)) {
              card.digitalCardData.status = "DISABLED";
            }
          });
          await cardList.create(self.client.cards, null);
        }
        await self.client.handleInitialState();
      }
    });
    $(".pay-clicktopay").on("click", async function(event) {
      await self.handlePaymentFormSubmit(event);
    });
    $(".clicktopay-form-close-button").on("click", async function(event) {
      await self.client.hideDcfScreen();
      self.client.initializePhoneInstances();
    });
  }
  async handlePaymentFormSubmit(event) {
    const self = this;
    event.preventDefault();
    if (!document.querySelector('[data-module-name*="clicktopay"]:checked')) {
      return;
    }
    if (self.client.getCurrentState() === FormStates.CardForm) {
      $(".clicktopay-form")[0].style.display = "none";
      await checkout.pay(self.client.nonce, self.client.nonceId);
      return;
    }
    if (self.client.getCurrentState() === FormStates.CardList) {
      $(".clicktopay-form")[0].style.display = "none";
      await window.onDCF();
      const cardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
      await checkout.pay(self.client.nonce, self.client.nonceId, cardId);
      return;
    }
  }
  registerInputLookupListeners(selector) {
    const self = this;
    if (!document.querySelector(selector)) {
      return;
    }
    document.querySelector(selector).addEventListener("change", async function(event) {
      if (!document.querySelector(selector)) {
        return;
      }
      if ($('[data-module-name*="clicktopay"]:disabled').length) {
        return;
      }
      let shouldRunLookup = !self.client.isConsumerPresent || self.client.isConsumerPresent && self.client.isConsumerPresentFieldId === selector;
      if (self.client.isConsumerPresent && self.emailQuerySelectors.includes(selector) && self.client.isConsumerPresentFieldId === "customer-email" && event.target.value !== clicktopay.customer.email) {
        console.debug("Click to Pay - running isConsumerPresent with email");
        shouldRunLookup = true;
      }
      let phoneNumber = "";
      if (self.phoneQuerySelectors.includes(selector)) {
        if (clicktopay.usePhoneNumberPrefix) {
          phoneNumber = self.client.getPhoneInstance(event.target)._getFullNumber();
        } else {
          phoneNumber = $(event.target).siblings(".country-call-prefix").text() + event.target.value;
        }
      }
      if (self.client.isConsumerPresent && self.phoneQuerySelectors.includes(selector) && self.client.isConsumerPresentFieldId === "customer-phone-number" && phoneNumber !== clicktopay.customer.phone_number) {
        console.debug("Click to Pay - running isConsumerPresent with phone number");
        shouldRunLookup = true;
      }
      if (shouldRunLookup) {
        await self.client.isInitialized();
        await self.client.hasPerformedLookup();
        await self.client.displayState(null);
        await utils.toggleLoader(true);
        if (self.phoneQuerySelectors.includes(selector)) {
          self.client.isConsumerPresent = await self.client.checkIsConsumerPresent(phoneNumber);
        } else {
          self.client.isConsumerPresent = await self.client.checkIsConsumerPresent(event.target.value);
        }
        if (self.client.isConsumerPresent) {
          self.client.isConsumerPresentFieldId = selector;
        }
      }
    });
  }
  destroyPhoneInstances() {
    const self = this;
    self.phoneQuerySelectors.forEach(function(selector) {
      if (!document.querySelector(selector)) {
        return;
      }
      const phoneElement = document.querySelector(selector);
      if (!phoneElement.value) {
        if ($("#thecheckout-address-delivery").length) {
          const instance = self.client.getPhoneInstance(phoneElement);
          instance.flagsContainer.style.height = document.querySelector('#delivery-address input[name="phone"]').offsetHeight + "px";
        }
        return;
      }
      phoneElement.value = self.client.getPhoneInstance(phoneElement)._getFullNumber();
      self.client.destroyPhoneInstance(phoneElement);
    });
  }
  // TODO add handlers for SDK.
}
class Embedded {
  constructor(client) {
    this.client = client;
  }
  async prerender() {
    var _a;
    const self = this;
    if (!!document.querySelector("#checkout")) {
      document.querySelector(".dcf-content").style.display = "flex";
    }
    self.client.initializePaymentOption();
    if (clicktopay.isDefaultPaymentOption || session.get("clicktopay-express-checkout")) {
      self.client.selectPaymentOption();
    }
    if (((_a = document.body) == null ? void 0 : _a.id) === "cart" || !!document.getElementById("js-clicktopay-payment-form")) {
      try {
        self.client.initializeCTP();
      } catch (error) {
        window.initRejectedHandler();
      }
      self.client.isInitialized().then(async () => {
        console.debug("Click to Pay - initialized CTP");
        console.debug("Click to Pay - running getCards");
        self.client.getCards().then(async (cards) => {
          console.debug("Click to Pay - getCards returned " + cards.length + " cards");
          if (cards.length === 0) {
            let existingC2pUser = false;
            if (clicktopay.customer.email) {
              console.debug("Click to Pay - running isConsumerPresent with email");
              existingC2pUser = await self.client.checkIsConsumerPresent(clicktopay.customer.email, false);
              if (existingC2pUser) {
                self.client.isConsumerPresentFieldId = "customer-email";
              }
            }
            if (clicktopay.customer.phone_number && !existingC2pUser) {
              console.debug("Click to Pay - running isConsumerPresent with phone number");
              existingC2pUser = await self.client.checkIsConsumerPresent(clicktopay.customer.phone_number, false);
              if (existingC2pUser) {
                self.client.isConsumerPresentFieldId = "customer-phone-number";
              }
            }
            self.client.isConsumerPresent = existingC2pUser;
          }
          console.debug("Click to Pay - initialization finished");
          self.client.hasFinishedInitialization = true;
        });
      });
    }
  }
  async render() {
    var _a;
    const self = this;
    if (document.getElementById("js-clicktopay-payment-form")) {
      if (window.innerWidth > 768) {
        document.getElementById("dcf-screen").classList.remove("action-sheet");
        document.getElementById("dcf-screen").classList.add("modal-sheet");
      } else {
        document.getElementById("dcf-screen").classList.remove("modal-sheet");
        document.getElementById("dcf-screen").classList.add("action-sheet");
      }
      window.addEventListener("resize", (event) => {
        const dropdownContent2 = document.getElementById("card-list-dropdown-content");
        const dropdownButton2 = document.getElementById("card-list-dropdown-button");
        dropdownContent2.style.width = dropdownButton2.offsetWidth + "px";
        if (window.innerWidth > 768) {
          document.getElementById("dcf-screen").classList.remove("action-sheet");
          document.getElementById("dcf-screen").classList.add("modal-sheet");
        } else {
          document.getElementById("dcf-screen").classList.remove("modal-sheet");
          document.getElementById("dcf-screen").classList.add("action-sheet");
        }
      });
    }
    if (!!document.querySelector('input[data-module-name="clicktopay"]')) {
      session.remove("clicktopay-is-default-option");
      (_a = document.getElementById("clicktopay-card-list-shipping-address")) == null ? void 0 : _a.addEventListener("click", (event) => {
        if (event.target.classList.contains("clicktopay-shipping-address-button")) {
          session.set("clicktopay-is-default-option", true);
        }
      });
    }
    if (session.get("clicktopay-express-checkout") || session.get("clicktopay-is-default-option")) {
      self.client.selectPaymentOption();
    }
    if (session.get("clicktopay-3ds-error-occurred")) {
      self.client.selectPaymentOption();
      session.remove("clicktopay-3ds-error-occurred");
    }
    if (document.getElementById("js-clicktopay-payment-form")) {
      await self.client.registerCardInputEventListeners();
      await self.client.registerCardListEventListeners();
      await self.client.registerLookupEventListeners();
    }
    await self.handleEmbeddedPayment();
  }
  async handleEmbeddedPayment() {
    const self = this;
    if (document.getElementById("customer-form")) {
      document.getElementById("customer-form").addEventListener("submit", async function(event) {
        await self.client.handleCustomerFormSubmit(event);
      });
    }
    if (document.getElementsByName("confirm-addresses").length) {
      document.getElementsByName("confirm-addresses")[0].addEventListener("click", async function() {
        await session.set("customer-entered-address-manually", true);
      });
    }
    if (document.getElementsByName("confirm-addresses").length && (document.querySelector(".js-address-form input[name=phone]") || document.querySelector(".js-address-form input[name=phone_mobile]"))) {
      self.client.getPhoneInstance(self.client.getPhoneElement());
      self.client.getPhoneElement().addEventListener("countrychange", function() {
        self.client.currentCountryCode = window.intlTelInputGlobals.getInstance(self.client.getPhoneElement()).getSelectedCountryData().iso2;
      });
      prestashop.on("updatedAddressForm", () => {
        self.client.getPhoneElement().addEventListener("countrychange", function() {
          self.client.currentCountryCode = window.intlTelInputGlobals.getInstance(self.client.getPhoneElement()).getSelectedCountryData().iso2;
        });
        self.client.getPhoneInstance(self.client.getPhoneElement());
        document.querySelector(".js-address-form form").addEventListener("submit", async function(event) {
          await self.client.handleAddressFormSubmit(event, self.client.getPhoneElement());
        });
      });
      document.querySelector(".js-address-form form").addEventListener("submit", async function(event) {
        await self.client.handleAddressFormSubmit(event, self.client.getPhoneElement());
      });
    }
    if (!document.getElementById("js-clicktopay-payment-form")) {
      return;
    }
    await self.client.registerPlaceOrderEventListeners();
    if (document.querySelector('input[data-module-name="clicktopay"]') && (session.get("clicktopay-express-checkout") || session.get("clicktopay-is-default-option"))) {
      self.client.selectPaymentOption();
    }
    if (document.getElementById("mc-ctp-src-mark")) {
      document.getElementById("mc-ctp-src-mark").addEventListener("click", function() {
        document.querySelector('input[data-module-name="clicktopay"]').click();
      });
    }
    await self.client.isInitialized();
    await self.client.hasPerformedLookup();
    await self.client.handleInitialState();
    if (document.querySelector('input[data-module-name="clicktopay"]') && document.querySelector('input[data-module-name="clicktopay"]').checked) {
      await self.client.handleInitialState();
    }
    if (document.querySelector('#payment-confirmation button[type="submit"]')) {
      document.querySelector('#payment-confirmation button[type="submit"]').addEventListener("click", async function(event) {
        if (document.querySelector('input[data-module-name="clicktopay"]').checked) {
          event.preventDefault();
          event.stopImmediatePropagation();
          document.getElementById("js-clicktopay-payment-form").querySelector('button[type="submit"]').click();
        }
      });
    }
    document.getElementById("js-clicktopay-payment-form").addEventListener("submit", (event) => {
      event.preventDefault();
      self.handlePaymentFormSubmit(this);
    });
    document.querySelectorAll('input[name="payment-option"]').forEach(function(item) {
      item.addEventListener("change", async function(event) {
        if (clicktopay.name === this.dataset.moduleName && this.checked) {
          await self.client.handleInitialState();
        } else {
          await self.client.displayState(null);
        }
        if (self.client.getCurrentState() === FormStates.CardForm) {
          await self.client.sdk.createCardEntryForm();
        }
        if (self.client.getCurrentState() === FormStates.OtpForm) {
          await self.client.displayState(FormStates.OtpForm);
        }
      });
    });
  }
  async handlePaymentFormSubmit(self) {
    if (!document.querySelector('[data-module-name*="clicktopay"]:checked')) {
      return;
    }
    if (self.client.getCurrentState() === FormStates.CardForm) {
      await checkout.pay(self.client.nonce, self.client.nonceId);
      return;
    }
    if (self.client.getCurrentState() === FormStates.CardList) {
      await window.onDCF();
      const cardId = document.querySelector(".card-list-dropdown-content-card-option.selected").getAttribute("data-id");
      await checkout.pay(self.client.nonce, self.client.nonceId, cardId);
      return;
    }
  }
  // TODO add handlers for SDK.
}
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
if (typeof clicktopay !== "undefined") {
  const client = new Client();
  const fallback = new Fallback(client);
  const onePageCheckout = new OnePageCheckout(client);
  const embedded = new Embedded(client);
  if (!!document.getElementById("js-delivery")) {
    session.set("guest_visited_shipping_step", clicktopay.customer.is_guest);
  }
  document.addEventListener("DOMContentLoaded", async function() {
    if (document.querySelector(".cart-summary #express-checkout-button") && clicktopay.isFasterCheckoutButtonActive) {
      document.getElementById("express-checkout-button").addEventListener("click", async (event) => {
        event.preventDefault();
        if (!clicktopay.customer.shippingAddress && !clicktopay.customer.billingAddress) {
          await client.isInitialized();
          await client.hasPerformedLookup();
        }
        session.set("clicktopay-express-checkout", true);
        await client.handleExpressButtonClick(event);
      });
      if (!clicktopay.customer.shippingAddress && !clicktopay.customer.billingAddress) {
        await client.isInitialized();
        await client.hasPerformedLookup();
      }
      await client.showExpressCheckoutButton();
      prestashop.on("updatedCart", () => {
        client.updateSrcMarkLogos(client.availableCardBrands);
      });
    }
    if (document.querySelector(".cart-summary .cart-detailed-actions .btn")) {
      document.querySelector(".cart-summary .cart-detailed-actions .btn").addEventListener("click", async (event) => {
        session.set("clicktopay-express-checkout", false);
      });
    }
  });
  if (clicktopay.isFallbackPage) {
    fallback.prerender();
    document.addEventListener("DOMContentLoaded", async function() {
      await fallback.render();
    });
  } else if (clicktopay.isOnePageCheckout) {
    onePageCheckout.prerender();
    document.addEventListener("DOMContentLoaded", async function() {
      await onePageCheckout.render();
    });
  } else {
    embedded.prerender();
    document.addEventListener("DOMContentLoaded", async function() {
      await embedded.render();
    });
  }
  purchaseResponseCallback = async (data) => {
    var _a;
    console.debug("Click to Pay - paying with card ended, handling response.");
    if (data == null ? void 0 : data.Errors) {
      console.error("purchaseResponseCallback", data);
      await client.handleError((_a = data == null ? void 0 : data.Errors) == null ? void 0 : _a.Error[0]);
      await client.refetchNonce();
      return;
    }
    if (client.isThreeDs) {
      document.getElementById("challenge").style.display = "none";
      document.getElementById("dcf-loading").style.display = "flex";
    }
    client.submitPaymentForm(data.purchaseTransactionToken, data.transactionAmount, data.gatewayTransactionId);
  };
  window.initRejectedHandler = async (error) => {
    console.error("initRejectedHandler", error);
    if (clicktopay.isFallbackPage) {
      window.location.href = clicktopay.orderRedirectUrl;
    } else {
      utils.disablePaymentOption();
    }
  };
  window.initResolvedHandler = async (resolvedData) => {
    client.nonce = resolvedData.nonce;
    client.nonceId = resolvedData.nonceId;
    client.initialized = true;
    client.updateSrcMarkLogos(resolvedData.availableCardBrands || []);
  };
  window.otpResolveHandler = async (srcCardList) => {
    if (srcCardList.filter((card) => ["ACTIVE", "SUSPENDED"].includes(card.digitalCardData.status)).length > 0) {
      client.cards = srcCardList;
      await client.displayState(FormStates.CardList);
      return;
    }
    await client.displayState(FormStates.CardForm);
  };
  window.otpRejectHandler = async (error) => {
    console.error("otp-rejected", error);
    client.hideDcfScreen();
    utils.displayError(clicktopay.errors.somethingWentWrong.title, clicktopay.errors.somethingWentWrong.message, clicktopay.errors.somethingWentWrong.btn, () => {
      if (clicktopay.isFallbackPage) {
        window.location.href = clicktopay.orderRedirectUrl;
      } else {
        utils.disablePaymentOption();
      }
    });
  };
  window.onGuestCheckout = async () => {
    await client.displayState(FormStates.CardForm);
  };
  window.purchaseResponseHandler = (data) => {
    console.log(data);
  };
  window.onCardNumberInputListener = (status) => {
    client.hasEnteredCardNumber = true;
    client.refetchPlaceOrderState();
    document.querySelector(".card-input-main").classList.toggle("card-entered", status);
    document.getElementById("card-input-access-your-cards-step").classList.toggle("ps-hidden", status);
  };
  window.notYouEventListener = async () => {
    await client.signOut();
    await client.displayState(FormStates.IdLookupForm);
  };
  window.onConsentChange = (consent) => {
    var _a;
    client.hasConsent = consent;
    client.refetchPlaceOrderState();
    if (!session.get("customer-entered-address-manually")) {
      (_a = document.getElementById("clicktopay-card-input-shipping-address")) == null ? void 0 : _a.classList.toggle("ps-hidden", !consent);
    }
  };
  window.onDCF = async () => {
    $(".dcf-iframe")[0].style.display = "block";
    document.getElementById("dcf-screen").classList.add("dcf-open");
    client.showDcfScreen();
  };
  window.on3DSChallenge = async () => {
    $(".dcf-iframe").hide();
    $("#device-fingerprint").show();
    $("#challenge").show();
    client.isThreeDs = true;
  };
  window.onCardEntryFormStatusListener = async (status) => {
    client.isCardEntryFormValid = status;
    client.refetchPlaceOrderState();
  };
  window.onCvvFormStatusListener = async (status) => {
  };
  $(document).on("opc-load-review:completed", function() {
    client.initializePaymentOption();
    if (document.getElementById("panel_address_delivery")) {
      document.getElementById("panel_address_delivery").style.zIndex = 10;
      client.getPhoneInstance(document.getElementById("delivery_phone_mobile"));
    }
  });
  prestashop.on("thecheckout_updatePaymentBlock", function() {
    client.initializePaymentOption();
    client.updateSrcMarkLogos(client.availableCardBrands);
  });
  $(document).on("thecheckout_Address_Modified", function() {
    if (clicktopay.usePhoneNumberPrefix) {
      client.getPhoneInstance(document.querySelector('#delivery-address input[name="phone"]'));
      const inputLabel = $('#delivery-address input[name="phone"]').parents("label")[0];
      inputLabel.style.display = "flex";
      inputLabel.style.flexDirection = "column";
      inputLabel.style.width = "100%";
    }
    onePageCheckout.phoneQuerySelectors.forEach((selector) => {
      onePageCheckout.registerInputLookupListeners(selector);
    });
  });
}
