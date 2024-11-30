from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import Select
import time
import random
import json
from user import User
import os

MAX_NUMBER_OF_PRODUCTS__IN_CART = 3
MAIN_PAGE_URL = "https://localhost:8443"
MAX_NUMBER_OF_RANDOM_PRODUCT = 2
CART_URL = "https://localhost:8443/index.php?controller=cart&action=show"
QUANTITY_RANDOM_PRODUCT = 1
FOLDER_PATH = "C:/Users/arkad/Downloads"
FILE_NAME = "IN000013.pdf"
LANGUAGE_TO_SELECT = "Angielska"
LANGUAGE_IN_NAME = "(Wersja językowa: Angielska)"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 20)


def readJson(filePath="products.json"):
    try:
        with open(filePath, "r", encoding="utf-8") as file:
            products = json.load(file)
            return products
    except Exception as e:
        print(f"Cannot read json file: {e}")

def checkIfProductInCart(name, quantity):
    driver.get(CART_URL)
    try:
        time.sleep(1)
        productNamesInCartList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "h3.product__name > a.product__link")))
        quantityInCartList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "input.js-cart-line-product-quantity.form-control")))
        for idxProduct, productName in enumerate(productNamesInCartList):
            if productName.text.strip().lower() == name.strip().lower():
                for idxQuantity, quantityCart in enumerate(quantityInCartList):
                    if idxQuantity == idxProduct and int(quantityCart.get_attribute('value')) == quantity:
                        return
        assert 1 == 0, f"Product {name} are not in the cart or quantity={quantity} are incorrect!"
    
    except Exception as e:
        print(f"Error while checking product in cart: {e}")


def searchProduct(name):
    try:
        searchbar = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input#search-input")))
        searchbar.send_keys(name)
        searchbar.send_keys(Keys.ENTER)
    except Exception as e:
        print(f"Error while searching product: {e}")


def confirmAddingToCartWithView():
    try:
        buttonAddToCart = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn.btn-primary.add-to-cart")))
        buttonAddToCart.click()
        time.sleep(1)

        continueButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btn.btn-secondary")))
        continueButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error while adding product to cart with view: {e}")

def addWithView(quantity):
    try:
        time.sleep(1)
        previewItem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.quick-view.js-quick-view"))) # link to preview "Zobacz więcej"
        time.sleep(1)
        divProduct = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.highlighted-informations.no-variants"))) # div to show links to preview

        action = ActionChains(driver)
        action.move_to_element(divProduct).perform()
        previewItem.click()
        time.sleep(1)

        quantityField = wait.until(EC.presence_of_element_located((By.ID, "quantity_wanted")))

        quantityField.send_keys(Keys.CONTROL + "a")
        quantityField.send_keys(Keys.BACKSPACE)
        quantityField.send_keys(str(quantity))
        time.sleep(2)

        confirmAddingToCartWithView()
    except Exception as e:
        print(f"Error while adding product to cart with view: {e}")

def addToCart(name, quantity):
    driver.get(MAIN_PAGE_URL)
    try:
        searchProduct(name)
        addWithView(quantity)
        checkIfProductInCart(name, quantity)
    except Exception as e:
        print(f"Error while adding product to cart: {e}")


def testAddToCart(products):
    numberOfProductsInCart = 0
    for product in products:
        productQuantity = random.randint(1, MAX_NUMBER_OF_PRODUCTS__IN_CART)
        numberOfProductsInCart += productQuantity
        addToCart(product["productName"], productQuantity)
    
    try:
        quantityInCartList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "input.js-cart-line-product-quantity.form-control")))
        time.sleep(2)

        quantityInCart = 0
        for quantity in quantityInCartList:
            quantityInCart += int(quantity.get_attribute('value'))

        assert quantityInCart == numberOfProductsInCart, f"Expected {numberOfProductsInCart}, not {quantityInCart.text[:-6]}"     

        print("TEST A COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error while checking all products in cart: {e}")
    

def testAddToCartRandomProduct(products):
    driver.get(MAIN_PAGE_URL)
    try:
        searchProduct("Adeptus Titanicus")

        indexRandomProduct = random.randint(1, MAX_NUMBER_OF_RANDOM_PRODUCT) - 1

        time.sleep(1)
        productsList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "h2.h3.product-title > a"))) # links to product's page
        time.sleep(1)
        previewList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.quick-view.js-quick-view"))) # links to preview "Zobacz więcej"
        time.sleep(1)
        divProductsList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.highlighted-informations.no-variants"))) # divs to show links to preview

        for idxProduct, product in enumerate(productsList):
            if idxProduct == indexRandomProduct:
                for idxDiv, div in enumerate(divProductsList):
                    if idxDiv == indexRandomProduct:
                        action = ActionChains(driver)
                        action.move_to_element(div).perform()
                        for idxPreview, preview in enumerate(previewList):
                            if idxPreview == indexRandomProduct:
                                preview.click()
                                time.sleep(1)
                                selectElement = wait.until(EC.presence_of_element_located((By.ID, 'group_2')))
                                select = Select(selectElement)
                                select.select_by_visible_text(f"{LANGUAGE_TO_SELECT}")
                                time.sleep(2)
                                name = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h1.h1")))
                                randomProductName = name.text
                                randomProduct = {}
                                randomProduct['productName'] = randomProductName
                                confirmAddingToCartWithView()
                                time.sleep(2)
                                checkIfProductInCart(randomProduct["productName"], QUANTITY_RANDOM_PRODUCT)
                                randomProduct['productName'] = f"{randomProduct['productName']} {LANGUAGE_IN_NAME}"
                                products.append(randomProduct)
                                
                    
        print("TEST B COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error while adding random product to cart: {e}")


def checkIfProductNotInCart(name):
    try:
        time.sleep(2)
        productNamesInCartList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.product__link")))
        for productName in productNamesInCartList:
            if productName.text.strip().lower() == name.strip().lower():
                assert 1 == 0, f"Product {name} are in the cart! It should not be there!"
        return
    except Exception as e:
        print(f"Error while checking is product not in cart: {e}")

def removeProductFromCart(name):
    try:
        time.sleep(1)
        productNamesInCartList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.product__link")))
        time.sleep(1)
        buttonToRemoveList = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.remove-from-cart")))
        for idxProduct, product in enumerate(productNamesInCartList):
            if product.text.strip().lower() == name.strip().lower():
                for idxButton, button in enumerate(buttonToRemoveList):
                    if idxProduct == idxButton:
                        button.click()
                        time.sleep(1)
                        driver.get(CART_URL)
                        checkIfProductNotInCart(name)
                        return
    except Exception as e:
        print(f"Error while removing products from cart: {e}")

def testRemoveProductsFromCart(products):
    driver.get(CART_URL)
    productsToRemove = [products[0], products[1], products[2]]
    for product in productsToRemove:
        removeProductFromCart(product['productName'])
        products.remove(product)
    print("TEST C COMPLETED SUCCESSFULLY")


def fillNameAndSurnameInForm(user):
    nameBox = wait.until(EC.presence_of_element_located((By.ID, "field-firstname")))
    nameBox.send_keys(user.name)
    time.sleep(1)

    surnameBox = wait.until(EC.presence_of_element_located((By.ID, "field-lastname")))
    surnameBox.send_keys(user.surname)
    time.sleep(1)


def doRegistrationForm(user):
    try:
        genderBox = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "label[for='field-id_gender-1']")))
        genderBox.click()
        time.sleep(1)

        fillNameAndSurnameInForm(user)

        mailBox = wait.until(EC.presence_of_element_located((By.ID, "field-email")))
        mailBox.send_keys(user.mail)
        time.sleep(1)

        passwordBox = wait.until(EC.presence_of_element_located((By.ID, "field-password")))
        passwordBox.send_keys(user.password)
        time.sleep(1)

        dateBox = wait.until(EC.presence_of_element_located((By.ID, "field-birthday")))
        dateBox.send_keys(user.dateBirth)
        time.sleep(1)

        ofertButton = wait.until(EC.element_to_be_clickable((By.XPATH, "//label[contains(., 'Otrzymuj oferty od naszych partnerów')]")))
        ofertButton.click()
        time.sleep(1)

        personalDataButton = wait.until(EC.element_to_be_clickable((By.XPATH, "//label[contains(., 'Wiadomość o przetwarzaniu danych osobowych')]")))
        personalDataButton.click()
        time.sleep(1)

        privacyButton = wait.until(EC.element_to_be_clickable((By.XPATH, "//label[contains(., 'Akceptuję ogólne warunki użytkowania i politykę prywatności')]")))
        privacyButton.click()
        time.sleep(1)

        createAccountButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.btn.btn-primary.form-control-submit.float-xs-right')))
        createAccountButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error while registration form: {e}")


def testRegistration(user):
    try:
        driver.get(MAIN_PAGE_URL)
        loginButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.user-info.text-underlined > a")))
        loginButton.click()
        time.sleep(1)

        noAccountButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.no-account > a")))
        noAccountButton.click()
        time.sleep(1)

        doRegistrationForm(user)

        time.sleep(1)
        logoutButton = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a.logout.hidden-sm-down.text-underlined')))
        time.sleep(1)

        assert logoutButton.text == "Wyloguj się", f"Expected Wyloguj się, not {loginButton.text}"

        print("TEST D COMPLETED SUCCESSFULLY")

    except Exception as e:
        print(f"Error while registration: {e}")


def doOrderForm(user):
    try:
        addressBox = wait.until(EC.presence_of_element_located((By.ID, "field-address1")))
        addressBox.send_keys(user.address)
        time.sleep(1)

        postcodeBox = wait.until(EC.presence_of_element_located((By.ID, "field-postcode")))
        postcodeBox.send_keys(user.postcode)
        time.sleep(1)

        cityBox = wait.until(EC.presence_of_element_located((By.ID, "field-city")))
        cityBox.send_keys(user.city)
        time.sleep(1)

        phoneBox = wait.until(EC.presence_of_element_located((By.ID, "field-phone")))
        phoneBox.send_keys(user.phone)
        time.sleep(1)

        continueButton = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'footer.form-footer.clearfix > button.continue.btn.btn-primary.float-xs-right')))
        continueButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error while doing order form: {e}")

def chooseDeliveryOption():
    try:
        inPostDeliveryMethodButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "label[for='delivery_option_23']")))
        inPostDeliveryMethodButton.click()
        time.sleep(1)

        continueButton = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'form.clearfix > button.continue.btn.btn-primary.float-xs-right')))
        continueButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error while choosing delivery option: {e}")    

def choosePaymentMethod():
    try:
        transferOption = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "label[for='payment-option-2']")))
        transferOption.click()
        time.sleep(1)

        acceptTermsCheckbox = wait.until(EC.presence_of_element_located((By.ID, 'conditions_to_approve[terms-and-conditions]')))
        time.sleep(1)
        ActionChains(driver).move_to_element(acceptTermsCheckbox).click().perform()
        time.sleep(1)

        continueButton = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'button.btn.btn-primary.center-block')))
        continueButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error while choosing payment method: {e}")


def testConfirmOrder():
    try:
        time.sleep(1)
        confirmOrderText = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'h3.h1.card-title')))
        confirmText = confirmOrderText.text.replace("\ue876","")
        
        assert confirmText == "TWOJE ZAMÓWIENIE ZOSTAŁO POTWIERDZONE", f"Expected TWOJE ZAMÓWIENIE ZOSTAŁO POTWIERDZONE, not {confirmText}"
        print("TEST H COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error while testing confirm order: {e}")

def testOrderComplete(products):
    try:
        time.sleep(1)
        productsInCart = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.col-sm-4.col-xs-9.details > span')))
        for idx, productInCart in enumerate(productsInCart):
            if productInCart.text.strip().lower() != products[idx]['productName'].strip().lower():
                assert 1 == 0, f"Cart is not complete!"
                return
        
        print("TEST E COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error while testing order complete: {e}")

def testPaymentMethodAndDeliveryOption():
    try:
        time.sleep(1)
        paymentMethod = wait.until(EC.presence_of_element_located((By.XPATH, "//li[contains(., 'Metoda płatności:')]")))
        paymentMethodText = paymentMethod.text[18:]
        assert paymentMethodText == "Płatność przy odbiorze", f"Expected Płatność przy odbiorze, not {paymentMethodText}"

        print("TEST F COMPLETED SUCCESSFULLY")
        
        time.sleep(1)
        deliveryOption = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.col-md-4 > ul > li > em')))
        assert deliveryOption.text == "Dostawa do paczkomatu", f"Expected Dostawa do paczkomatu, not {deliveryOption.text}"

        print("TEST G COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"Error while testing payment and delivery: {e}")

def testOrder(products, user):
    try:
        driver.get(CART_URL)

        startOrderButton = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a.btn.btn-primary.checkout-button')))
        startOrderButton.click()
        time.sleep(1)

        doOrderForm(user)
        chooseDeliveryOption()
        choosePaymentMethod()
        
       
        testOrderComplete(products)
        time.sleep(1)
        testPaymentMethodAndDeliveryOption()
        time.sleep(1)
        testConfirmOrder()
        time.sleep(1)
    except Exception as e:
        print(f"Error while doing order: {e}")

def testCheckOrderStatus():
    try:
        time.sleep(1)
        orderStatusPage = wait.until(EC.presence_of_element_located((By.LINK_TEXT, 'Status zamówienia')))
        orderStatusPage.click()
        time.sleep(2)

        orderDetailsPage = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'td.text-sm-center.order-actions > a')))
        orderDetailsPage.click()
        time.sleep(2)

        orderStatus = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'td > span.label.label-pill.bright')))
        
        assert orderStatus.text == "Awaiting Cash On Delivery validation", f"Expected Awaiting Cash On Delivery validation, not {orderStatus.text}"

        print("TEST I COMPLETED SUCCESSFULLY")
        time.sleep(2)
    except Exception as e:
        print(f"Error while checking order status: {e}")

def testDownloadingVAT():
    try:
        orderStatusPage = wait.until(EC.presence_of_element_located((By.LINK_TEXT, 'Status zamówienia')))
        orderStatusPage.click()
        time.sleep(2)

        downloadingButton = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR,'td.text-sm-center.hidden-md-down > a')))
        downloadingButton.click()
        time.sleep(5)

        
        filePath = os.path.join(FOLDER_PATH, FILE_NAME)

        if os.path.exists(filePath):
            print("TEST J COMPLETED SUCCESSFULLY")
        else:
            assert 1 == 0; f"Downloading VAT facture failed"

    except Exception as e:
        print(f"Error while downloading VAT facture: {e}")

def tests():
    products = readJson() 
    driver.get(MAIN_PAGE_URL)
    time.sleep(1)
    testAddToCart(products)
    time.sleep(1)
    testAddToCartRandomProduct(products)
    time.sleep(1)
    testRemoveProductsFromCart(products)
    time.sleep(1)
    user = User()
    testRegistration(user)
    time.sleep(1)
    testOrder(products, user)
    testCheckOrderStatus()
    time.sleep(1)
    testDownloadingVAT()
    driver.close()


tests()
