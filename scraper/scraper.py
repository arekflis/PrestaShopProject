from urllib.parse import urljoin, urlparse
import requests
import json
from bs4 import BeautifulSoup
import os
from PIL import Image

PATH_TO_OUTPUT_CATEGORIES_FILE = 'scraping-results/categories.json'
PATH_TO_OUTPUT_MAINPAGE_FILE = 'scraping-results/mainPage.json'
MAX_PRODUCTS = 20

def convertWebpToPNG(imagePath):
    if imagePath.lower().endswith(".webp"):
        img = Image.open(imagePath)
        
        new_image_path = imagePath.replace(".webp", ".png")

        img.save(new_image_path, "PNG")
        
        return new_image_path
    return None

def processPrice(price):
    cleanPrice = price.replace(" PLN", "").replace(" ", "")
    formattedPrice = float(cleanPrice.replace(",", "."))
    nettoPrice = round(formattedPrice/1.23,2)
    return f"{nettoPrice:.2f}"


def getProductImages(productInformation, soup, urlMain):
    imgSources = soup.find_all(class_="photos__link")
    images = {}
    counter = 1
    imgFileNames = []

    for img in imgSources:
        if img and img.has_attr('href'):
            response = requests.get(urljoin(urlMain, img['href']))

            if response.status_code == 200:
                imgFileName = os.path.basename(urlparse(img['href']).path)
                if imgFileName not in imgFileNames:
                    with open(f"images/{imgFileName}", "wb") as file:
                        file.write(response.content)
                    newPath = convertWebpToPNG(f"images/{imgFileName}")
                    os.remove(f"images/{imgFileName}")
                    if newPath is not None and os.path.getsize(newPath) < 2 * 1024 * 1024:
                        images[f"Obraz {counter}"] = newPath
                        imgFileNames.append(imgFileName)
                    else:
                        os.remove(newPath)
            else:
                print("Nie udało się zapisać obrazu!")

            counter += 1
    
    if images:
        productInformation["Obrazy"] = images
    else:
        productInformation["Obrazy"] = None

def getProductAttributes(productInformation, soup):
    attributes = soup.find_all('div', class_='dictionary__param row mb-3')
    for attribute in attributes:
        if attribute:
            name = attribute.find('span', class_='dictionary__name_txt')
            value = attribute.find(class_='dictionary__value_txt')
            if name and value:
                productInformation[name.text] = value.text

def getInformationAboutProduct(soup, urlMain):
    productInformation = {}

    productName = soup.find('h1', class_='product_name__name m-0')
    if productName:
        productInformation["Nazwa"] = productName.text
    else:
        productInformation["Nazwa"] = "None"

    price = soup.find('strong', class_='projector_prices__price')
    if price:
        productInformation["Cena"] = processPrice(price.text)
    else:
        productInformation["Cena"] = "None"

    description = soup.find(id="projector_longdescription")
    if description:
        descriptionFromP = description.find('p')
        if descriptionFromP:
            productInformation["Opis"] = descriptionFromP.text
        else:
            productInformation["Opis"] = description.text
    else:
        productInformation["Opis"] = "None"

    getProductAttributes(productInformation, soup)

    getProductImages(productInformation, soup, urlMain)

    if productInformation['Obrazy'] is not None:
        return productInformation
    else:
        return None


def addProductsFromPage(products, soup, urlMain, counter):
    productItems = soup.find_all('a', class_='product__icon d-flex justify-content-center align-items-center')

    for product in productItems:
        if product.has_attr('title'):
            productName = (product['title'])
        if product and product.has_attr('href'):
            response = requests.get(product['href'])

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                productInformation = getInformationAboutProduct(soup, urlMain)
                if productInformation is not None and counter < MAX_PRODUCTS:
                    products[productName] = productInformation
                    counter += 1
                if counter >= MAX_PRODUCTS:
                    break
            
            else:
                print("Nie udało się wejść na stronę z produktu!", response.status_code)

    return counter


def getProducts(pageUrl, subcategoryUrl):
    products = {}
    counter = 0

    # Pobranie strony podkategorii
    response = requests.get(f"{urljoin(pageUrl, subcategoryUrl)}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Dodanie produktów z pierwszej strony podkategorii
        counter = addProductsFromPage(products, soup, pageUrl, counter)

        # Znalezienie linków do kolejnych stron podkategorii
        nextSubpages = soup.find_all('li', class_='pagination__element --item')
        for page in nextSubpages:
            newUrl = page.find('a', class_='pagination__link')
            if newUrl and newUrl.has_attr('href'):
                response = requests.get(f"{urljoin(pageUrl, newUrl['href'])}")

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    if counter < MAX_PRODUCTS:
                        counter = addProductsFromPage(products, soup, pageUrl, counter)
                else:
                    print("Nie udało się pobrać strony z produktami:", response.status_code)
    else:
        print("Nie udało się pobrać strony z produktami:", response.status_code)

    return products

def getCategoriesWithoutSubcategories(soup):
    categoriesWithoutSubcategories = []
    subcategoriesLI = soup.find_all('li', class_='nav-item empty')
    for subcategoryLI in subcategoriesLI:
        subcategoryA = subcategoryLI.find('a')
        if subcategoryA and subcategoryA.has_attr('title'):
            categoriesWithoutSubcategories.append(subcategoryA['title'])
    saveCategoriesToJSON(categoriesWithoutSubcategories, './scraping-results/categoriesWithoutSubcategories.json')

def getSubcategories(soup):
    categiersAsSubcategoriesOnly = []
    subcategoriesUL = soup.find_all('ul', class_='navbar-subsubnav')
    for subcategoryUL in subcategoriesUL:
        subcategoriesLI = subcategoryUL.find_all('li', class_='nav-item')
        for subcategoryLI in subcategoriesLI:
            subcategoryA = subcategoryLI.find('a')
            if subcategoryA and subcategoryA.has_attr('title'):
                categiersAsSubcategoriesOnly.append(subcategoryA['title'])
    saveCategoriesToJSON(categiersAsSubcategoriesOnly, './scraping-results/subcategories.json')

def getAllCategories(url):
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        #getCategoriesWithoutSubcategories(soup)
        getSubcategories(soup)
            
        
        # Tworzenie słownika dla kategorii i ich podkategorii
        categoriesDictionary = {}
        
        # Znajdź główne kategorie
        mainCategories = soup.find_all('li', class_='nav-item')

        for mainCategory in mainCategories:
            mainLink = mainCategory.find('a', class_='nav-link nav-gfx')

            if mainLink and mainLink.has_attr('title') and mainLink['title'] not in ["Herosi vs Horrory", "MidGuard RPG", "MidGuard Miniatures"]:
                mainCategoryName = mainLink['title']

                subcategoriesDictionary = {}

                # Znalezienie podkategorii w głównej kategorii
                subcategoryLinks = mainCategory.find_all('a', class_='nav-link')
                for subLink in subcategoryLinks:
                    if subLink.has_attr('title') and subLink['title'] != mainCategoryName:
                        subcategoryName = subLink['title']
                        products = getProducts(url, subLink['href'])
                        if products:
                            subcategoriesDictionary[subcategoryName] = products
                    elif subLink.has_attr('title') and subLink['title'] in ['Albi', 'PUZZLE']:
                        products = getProducts(url, subLink['href'])
                        if products:
                            subcategoriesDictionary[""] = products
                    if subcategoriesDictionary:
                        categoriesDictionary[mainCategoryName] = subcategoriesDictionary

        # Zwracanie wyników w formie słownika
        return categoriesDictionary
    else:
        print("Nie udało się pobrać strony:", response.status_code)
        return None
    
    


def getLogoImage(soup, urlMainPage, mainPageDictionary):
    divLogo = soup.find('div', id='logo')
    imgLogo = divLogo.find('img')

    if imgLogo and imgLogo.has_attr('src'):
        urlLogo = urljoin(urlMainPage, imgLogo['src'])
        response = requests.get(urlLogo)

        if response.status_code == 200:
            imgFileName = os.path.basename(urlparse(imgLogo['src']).path)
            with open(f"imagesMainPage/logo/{imgFileName}", "wb") as file:
                file.write(response.content)
            mainPageDictionary["Logo"] = f"imagesMainPage/logo/{imgFileName}"
        else:
            print("Nie udało się pobrać loga.")
    else:
        print("Nie udało się znaleźć loga.")

def getLogosCategories(soup, urlMainPage, mainPageDictionary):
    divLogosCategories = soup.find('div', id='menu_navbar')
    imgLogosCategories = divLogosCategories.find_all('img')

    categories = {}

    for img in imgLogosCategories:
        if img and img.has_attr('src') and img.has_attr('alt'):
            if img['alt'] not in ["Herosi vs Horrory", "MidGuard RPG", "MidGuard Miniatures"]:
                urlLogo = urljoin(urlMainPage, img['src'])
                response = requests.get(urlLogo)

                if response.status_code == 200:
                    imgFileName = os.path.basename(urlparse(img['src']).path)
                    imgFileName = imgFileName[:-4] + '.jpg'
                    with open(f"imagesMainPage/categoriesLogos/{imgFileName}", "wb") as file:
                        file.write(response.content)
                        categories[img['alt']] = f"imagesMainPage/categoriesLogos/{imgFileName}"
                else:
                    print("Nie udało się pobrać loga.")
        else:
            print("Nie udało się znaleźć loga.")

    mainPageDictionary["Categories"] = categories

def getBanners(soup, urlMainPage, mainPageDictionary):
    divBanners = soup.find('div', id="main_banner1")
    imgBanners = divBanners.find_all('img')
    banners = {}

    for img in imgBanners:
        if img and img.has_attr('src'):
            img_src = img.get('data-src', img.get('src', None))
            urlLogo = urljoin(urlMainPage, img_src)
            response = requests.get(urlLogo)

            if response.status_code == 200:
                imgFileName = os.path.basename(urlparse(img_src).path)
                with open(f"imagesMainPage/banners/{imgFileName}", "wb") as file:
                    file.write(response.content)
                    banners[img['alt']] = f"imagesMainPage/banners/{imgFileName}"
            else:
                print("Nie udało się pobrać loga.")
        else:
            print("Nie udało się znaleźć loga.")

    mainPageDictionary["Banners"] = banners

def scrapMainPage(url):
    response = requests.get(url)
    mainPageDictionary = {}

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        getLogoImage(soup, url, mainPageDictionary)
        getLogosCategories(soup, url, mainPageDictionary)
        getBanners(soup, url, mainPageDictionary)
    else:
        print("Nie udało się wejść na stronę główną.")

    return mainPageDictionary


# Change the filename depending on which level the script is being run
def saveCategoriesToJSON(categories_dict, filename):
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(categories_dict, json_file, ensure_ascii=False, indent=4)
    print(f'Zapisano dane do pliku {filename}')


# Wywołanie funkcji i zapisanie wyników do pliku JSON
categories = getAllCategories('https://gnom-sklep.pl/')
if categories:
    saveCategoriesToJSON(categories, PATH_TO_OUTPUT_CATEGORIES_FILE)

mainPage = scrapMainPage('https://gnom-sklep.pl/')
if mainPage:
    saveCategoriesToJSON(mainPage, PATH_TO_OUTPUT_MAINPAGE_FILE)