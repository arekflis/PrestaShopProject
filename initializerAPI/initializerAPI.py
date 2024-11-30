import json
import requests
from urllib.parse import quote
from requests.auth import HTTPBasicAuth
import xml.etree.ElementTree as ET
from prestapyt import PrestaShopWebService
import re
import os
import time
import random

PATH_TO_INPUT_CATEGORY_FILE = './scraping-results/categories.json'
PATH_TO_INPUT_SUBCATEGORY_FILE = './scraping-results/subcategories.json'
PATH_TO_INPUT_CATEGORIES_WITHOUT_SUBCATEGORIES_FILE = './scraping-results/categoriesWithoutSubcategories.json'
apiURL = "https://localhost:8443/api"
apiKEY = "74E67Q2F6W1S2IQUP795G4Y63IEWBGC8"

def readJSON(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def sendToPrestashop(dataToSend, resource):
    response = requests.post(f"{apiURL}/{resource}", data=dataToSend, auth=(apiKEY, ''), verify=False)

    if response.status_code == 201:
        print(f"{resource} został wysłany pomyślnie.")
    else:
        print(f"Błąd wysyłania {resource}.")

def sendStockToPrestashop(dataToSend, stockID):
    response = requests.put(f"{apiURL}/stock_availables/{stockID}", data=dataToSend, auth=(apiKEY, ''), verify=False)

    if response.status_code == 200:
        print(f"Stock został wysłany pomyślnie.")
    else:
        print(f"Błąd: {response.status_code}, {response.text}")


def getIDFromPrestashop(name, resource, element):
    encodedName = quote(name)
    url = f"{apiURL}/{resource}?filter[name]={encodedName}"

    response = requests.get(url, auth=(apiKEY, ''), verify=False)

    if response.status_code == 200:
        root = ET.fromstring(response.content)  
        element = root.find(f".//{element}")
        if element is not None:
            return element.get('id') 
        else:
            return None
    else:
        print(f"Błąd: {response.status_code}, {response.text}")

def getIDStockFromPrestashop(productID):
    url = f"{apiURL}/products/{productID}"

    response = requests.get(url, auth=(apiKEY, ''), verify=False)

    if response.status_code == 200:
        root = ET.fromstring(response.content)
        stock = root.find(".//associations//stock_availables//stock_available")
        if stock is not None:
            return stock.find('id').text 
        else:
            return None
    else:
        print(f"Błąd: {response.status_code}, {response.text}")

def deleteFromPrestashop(categoryID, resource):
    url = f"{apiURL}/{resource}/{categoryID}"

    response = requests.delete(url, auth=(apiKEY, ''), verify=False)
    if response.status_code == 200:
        print(f"Usunięto obiekt: {resource}")
    else:
        print(f"Nie usunięto obiekt: {resource}")


def deleteProducts(data):
    for category, subcategories in data.items():
        for subcategory, products in subcategories.items():
            for product_name, attributes in products.items(): 
                productID = getIDFromPrestashop(product_name, 'products', 'product')
                deleteFromPrestashop(productID, 'products')

def deleteCategories(categoryDictionary):
    for category, subcategories in categoryDictionary.items():
        categoryID = getIDFromPrestashop(category, 'categories', 'category')
        deleteFromPrestashop(categoryID, 'categories')


def getAttributes(data):
    attributeDictionary = {}
    for category, subcategories in data.items():
        for subcategory, products in subcategories.items():
            for product_name, attributes in products.items():
                for attribute, value in attributes.items():
                    if attribute not in ["Obrazy", "Nazwa", "Opis", "Cena"]:
                        if attribute.endswith("Więcej"):
                            attribute = attribute[:-6].strip()
                        
                        if isinstance(value, str) and value.endswith("Więcej"):
                            value = value[:-6].strip()

                        if attribute not in attributeDictionary:
                            attributeDictionary[attribute] = []
                        
                        if value not in attributeDictionary[attribute]:
                            attributeDictionary[attribute].append(value)
    return attributeDictionary

def generate_link_rewrite(name):
    name = name.lower()
    name = name.replace(" ", "-")
    name = re.sub(r'[ąćęłńóśźżśĄĆĘŁŃÓŚŹŻŚ]', '', name)
    name = re.sub(r'[^a-z0-9\-]', '', name)
    return name

def sendCategory(name, parentID):
    root = ET.Element("prestashop")
    
    category = ET.SubElement(root, "category")

    idParent = ET.SubElement(category, "id_parent")
    idParent.text = str(parentID)
    
    active = ET.SubElement(category, "active")
    active.text = "1" 
    
    nameElement = ET.SubElement(category, "name")
    nameLang = ET.SubElement(nameElement, "language", attrib={"id": "1"})  
    nameLang.text = name
    
    isLinkRewrite = ET.SubElement(category, "link_rewrite")
    isLinkRewriteLang = ET.SubElement(isLinkRewrite, "language", attrib={"id": "1"}) 
    isLinkRewriteLang.text = generate_link_rewrite(name)

    categoryXML = ET.tostring(root, encoding="utf-8", method="xml")

    sendToPrestashop(categoryXML, 'categories')


def sendOneProduct(productName, productAttributes, idCategories, attributesDictionary, mainCategoryName):
    sendProduct(productName, productAttributes, idCategories, attributesDictionary, mainCategoryName)
    idProduct = getIDFromPrestashop(productName, "products", "product")
    idStock = getIDStockFromPrestashop(idProduct)
    sendStock(idProduct, idStock)
    images = productAttributes['Obrazy']
    for img, src in images.items():
        sendProductImage(src, idProduct)

def sendCategoriesWithProducts(categoryDictionary, subCategories, attributesDictionary):
    for category, subcategories in categoryDictionary.items():
        if category in ["Gry bitewne"]:
            sendCategory(category, "2")
            idCategory = getIDFromPrestashop(category, 'categories', 'category')
            idSubcategory = None
            for subcategory, products in subcategories.items():
                if subcategory in subCategories:
                    sendCategory(subcategory, str(idSubcategory))
                    idCurrentCategory = getIDFromPrestashop(subcategory, 'categories', 'category')
                    for productName, productAttributes in products.items():
                        sendOneProduct(productName, productAttributes, ["2", str(idCategory), str(idSubcategory), str(idCurrentCategory)], attributesDictionary, subcategory)
                else:
                    if subcategory != "":
                        sendCategory(subcategory, str(idCategory))
                        idSubcategory = getIDFromPrestashop(subcategory, 'categories', 'category')
                    for productName, productAttributes in products.items():
                        sendOneProduct(productName, productAttributes, ["2", str(idCategory), str(idSubcategory)], attributesDictionary, subcategory)


def sendAttribute(name):
    root = ET.Element('prestashop')
    
    productFeature = ET.SubElement(root, 'product_feature')
    
    nameElement = ET.SubElement(productFeature, "name")
    nameLang = ET.SubElement(nameElement, "language", attrib={"id": "1"})  
    nameLang.text = name

    featureXML = ET.tostring(root, encoding="utf-8", method="xml")
    
    sendToPrestashop(featureXML, 'product_features')


def sendAttributeValue(value, idFeature):
    root = ET.Element('prestashop')
    
    productFeature = ET.SubElement(root, 'product_feature_value')
    
    valueElement = ET.SubElement(productFeature, "value")
    valueLang = ET.SubElement(valueElement, "language", attrib={"id": "1"})  
    valueLang.text = value

    idFeatureElement = ET.SubElement(productFeature, "id_feature")
    idFeatureElement.text = idFeature

    featureXML = ET.tostring(root, encoding="utf-8", method="xml")

    sendToPrestashop(featureXML, 'product_feature_values')


def sendAttributes(attributesDictionary):
    for attribute, valueList in attributesDictionary.items():
        sendAttribute(attribute)
        attributeID = getIDFromPrestashop(attribute, 'product_features', 'product_feature')
        for value in valueList:
            sendAttributeValue(value, attributeID)


def sendStock(idProduct, idStock):
    root = ET.Element('prestashop')
    
    stockAvailable = ET.SubElement(root, 'stock_available')
    
    stockID = ET.SubElement(stockAvailable, 'id')
    stockID.text = str(idStock)

    productElement = ET.SubElement(stockAvailable, 'id_product')
    productElement.text = str(idProduct)

    quantityElement = ET.SubElement(stockAvailable, 'quantity')
    quantityElement.text = str(random.randint(0,10))

    idProductAttributeElement = ET.SubElement(stockAvailable, 'id_product_attribute')
    idProductAttributeElement.text = str(0) 

    dependsOnStockElement = ET.SubElement(stockAvailable, 'depends_on_stock')
    dependsOnStockElement.text = '0' 

    outOfStockElement = ET.SubElement(stockAvailable, 'out_of_stock')
    outOfStockElement.text = '0'

    shopElement = ET.SubElement(stockAvailable, 'id_shop')
    shopElement.text = '1'

    stockAvailabilityXML = ET.tostring(root, encoding='utf-8', method='xml')

    sendStockToPrestashop(stockAvailabilityXML, idStock)


def getIDFeatureValue(searchValue, featureName, idFeature, attributesDictionary):
    url = f"{apiURL}/product_feature_values?filter[id_feature]={idFeature}"

    response = requests.get(url, auth=(apiKEY, ''), verify=False)

    if response.status_code == 200:
        root = ET.fromstring(response.content)
        productFeatureValuesXML = root.findall(".//product_feature_value")
        if productFeatureValuesXML is not None:
            index = -1
            for valueName in attributesDictionary[f"{featureName}"]:
                index += 1
                if valueName == searchValue:
                    return productFeatureValuesXML[index].get('id')
        else:
            return None
    else:
        print(f"Błąd: {response.status_code}, {response.text}")

def sendProduct(productName, productAttributes, idCategories, attributesDictionary, mainCategoryName):
    root = ET.Element('prestashop')
    
    product = ET.SubElement(root, 'product')

    nameElement = ET.SubElement(product, 'name')
    languageName = ET.SubElement(nameElement, 'language', attrib={'id': '1'})
    languageName.text = str(productName)

    priceElement = ET.SubElement(product, 'price')
    priceElement.text = str(productAttributes['Cena'])

    showPriceElement = ET.SubElement(product, 'show_price')
    showPriceElement.text = '1'

    descriptionElement = ET.SubElement(product, 'description')
    languageDescription = ET.SubElement(descriptionElement, 'language', attrib={'id': '1'})
    languageDescription.text = str(productAttributes['Opis'])

    associationsElement = ET.SubElement(product, 'associations')
    categoriesElement = ET.SubElement(associationsElement, 'categories')
    for idCategory in idCategories:
        if idCategory is not None:
            category = ET.SubElement(categoriesElement, 'category')
            categoryIdXML = ET.SubElement(category, 'id')
            categoryIdXML.text = str(idCategory)

    mainCategoryNameElement = ET.SubElement(product, 'main_category_name')
    mainCategoryNameElement.text = mainCategoryName

    idCategoryDefault = ET.SubElement(product, 'id_category_default')
    idCategoryDefault.text = str(idCategories[-1])

    activeElement = ET.SubElement(product, 'active')
    activeElement.text = '1'

    stateElement = ET.SubElement(product, 'state')
    stateElement.text = '1'

    weightElement = ET.SubElement(product, 'weight')
    weightElement.text = str(random.randint(1, 5))

    redirectElement = ET.SubElement(product, 'redirect_type')
    redirectElement.text = '301-category'

    visibilityElement = ET.SubElement(product, 'visibility')
    visibilityElement.text = 'both'

    orderElement = ET.SubElement(product, 'available_for_order')
    orderElement.text = '1'

    taxElement = ET.SubElement(product, 'id_tax_rules_group')
    taxElement.text = '1'

    isLinkRewrite = ET.SubElement(product, "link_rewrite")
    isLinkRewriteLang = ET.SubElement(isLinkRewrite, "language", attrib={"id": "1"}) 
    isLinkRewriteLang.text = generate_link_rewrite(productName)

    productFeaturesElement = ET.SubElement(associationsElement, 'product_features')
    for attribute, value in productAttributes.items():
        if attribute not in ['Nazwa', 'Opis', 'Cena', 'Obrazy']:
            if attribute.endswith("Więcej"):
                attribute = attribute[:-6].strip()
            if isinstance(value, str) and value.endswith("Więcej"):
                value = value[:-6].strip()
            idFeature = getIDFromPrestashop(attribute, 'product_features', 'product_feature')
            idFeatureValue = getIDFeatureValue(value, attribute, idFeature, attributesDictionary)
            productFeatureElement = ET.SubElement(productFeaturesElement, 'product_feature')
            productIdXML = ET.SubElement(productFeatureElement, 'id')
            productIdXML.text = str(idFeature)
            valueIDXML = ET.SubElement(productFeatureElement, 'id_feature_value')
            valueIDXML.text = str(idFeatureValue)

    productXML = ET.tostring(root, encoding='utf-8', method='xml')

    sendToPrestashop(productXML, 'products')


def sendProductImage(imagePath, productID):
    url = f"{apiURL}/images/products/{productID}"

    if not os.path.isfile(imagePath):
        print(f"Plik {imagePath} nie istnieje.")
        return

    with open(imagePath, 'rb') as file:
        files = {
            'image': (os.path.basename(imagePath), file, 'image/png')
        }

        response = requests.post(url, auth=(apiKEY, ''), files=files, verify=False)
        time.sleep(2)

        if response.status_code == 200:
            print("Wysłano zdjęcie!")
        else:
            print(f"Błąd: {response.status_code}, {response.text}")
            

categoryDictionary = readJSON(PATH_TO_INPUT_CATEGORY_FILE)
subcategories = readJSON(PATH_TO_INPUT_SUBCATEGORY_FILE)
if categoryDictionary and subcategories:
    
    #deleteCategories(categoryDictionary)
    #deleteProducts(categoryDictionary)
    
    attributesDictionary = getAttributes(categoryDictionary)
    #sendAttributes(attributesDictionary)
    sendCategoriesWithProducts(categoryDictionary, subcategories, attributesDictionary)