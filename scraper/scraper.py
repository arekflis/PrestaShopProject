from urllib.parse import urljoin
import requests
import json
from bs4 import BeautifulSoup


PATH_TO_OUTPUT_FILE = 'scraping-results/categories.json'


def getProductImages(productInformation, soup, urlMain):
    imgSources = soup.find_all(class_="photos__link")
    images = {}
    counter = 1
    for img in imgSources:
        if img and img.has_attr('href'):
            images[f"Obraz {counter}"] = f"{urljoin(urlMain, img['href'])}"
            counter += 1

    productInformation["Obrazy"] = images

def getProductAttributes(productInformation, soup):
    attributes = soup.find_all('div', class_='dictionary__param row mb-3')
    for attribute in attributes:
        if attribute:
            name = attribute.find('span', class_='dictionary__name_txt')
            value = attribute.find(class_='dictionary__value_txt')
            if name and value:
                productInformation[name.text] = value.text

def getInformationAboutProduct(products, soup, urlMain):
    productInformation = {}

    productName = soup.find('h1', class_='product_name__name m-0')
    if productName:
        productInformation["Nazwa"] = productName.text
    else:
        productInformation["Nazwa"] = "None"

    price = soup.find('strong', class_='projector_prices__price')
    if price:
        productInformation["Cena"] = price.text
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

    products.append(productInformation)


def addProductsFromPage(products, soup, licznikProduktów, urlMain):
    productItems = soup.find_all('a', class_='product__icon d-flex justify-content-center align-items-center')

    for product in productItems:
        if licznikProduktów < 1:
            if product.has_attr('title'):
                products.append(product['title'])
            if product and product.has_attr('href'):
                response = requests.get(product['href'])

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    getInformationAboutProduct(products, soup, urlMain)
                else:
                    print("Nie udało się wejść na stronę z produktu!", response.status_code)
            licznikProduktów += 1


def getProducts(pageUrl, subcategoryUrl, licznikProduktów):
    products = []

    # Pobranie strony podkategorii
    response = requests.get(f"{urljoin(pageUrl, subcategoryUrl)}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Dodanie produktów z pierwszej strony podkategorii
        addProductsFromPage(products, soup, licznikProduktów, pageUrl)

        # Znalezienie linków do kolejnych stron podkategorii
        nextSubpages = soup.find_all('li', class_='pagination__element --item')
        for page in nextSubpages:
            newUrl = page.find('a', class_='pagination__link')
            if newUrl and newUrl.has_attr('href'):
                response = requests.get(f"{urljoin(pageUrl, newUrl['href'])}")

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    addProductsFromPage(products, soup, licznikProduktów, pageUrl)
                else:
                    print("Nie udało się pobrać strony z produktami:", response.status_code)
    else:
        print("Nie udało się pobrać strony z produktami:", response.status_code)

    return products


def getAllCategories(url):
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tworzenie słownika dla kategorii i ich podkategorii
        categoriesDictionary = {}
        
        # Znajdź główne kategorie
        mainCategories = soup.find_all('li', class_='nav-item')

        licznikKategorii = 0
        licznikPodkategorii = 0
        licznikProduktów = 0
        for mainCategory in mainCategories:
            if licznikKategorii < 1:
                mainLink = mainCategory.find('a', class_='nav-link nav-gfx')

                if mainLink and mainLink.has_attr('title') and mainLink['title'] not in ["Herosi vs Horrory", "MidGuard RPG", "MidGuard Miniatures"]:
                    mainCategoryName = mainLink['title']

                    subcategoriesDictionary = {}

                    # Znalezienie podkategorii w głównej kategorii
                    subcategoryLinks = mainCategory.find_all('a', class_='nav-link')
                    for subLink in subcategoryLinks:
                        if licznikPodkategorii < 1:
                            if subLink.has_attr('title') and subLink['title'] != mainCategoryName:
                                subcategoryName = subLink['title']
                                products = getProducts(url, subLink['href'], licznikProduktów)
                                subcategoriesDictionary[subcategoryName] = products
                                licznikPodkategorii += 1
                            elif subLink.has_attr('title') and subLink['title'] in ['Albi', 'PUZZLE']:
                                products = getProducts(url, subLink['href'], licznikProduktów)
                                subcategoriesDictionary[""] = products
                        else:
                            break
                    categoriesDictionary[mainCategoryName] = subcategoriesDictionary
                licznikKategorii += 1
        # Zwracanie wyników w formie słownika
        return categoriesDictionary
    else:
        print("Nie udało się pobrać strony:", response.status_code)
        return None


# Change the filename depending on which level the script is being run
def saveCategoriesToJSON(categories_dict, filename=PATH_TO_OUTPUT_FILE):
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(categories_dict, json_file, ensure_ascii=False, indent=4)
    print(f'Zapisano dane do pliku {filename}')


# Wywołanie funkcji i zapisanie wyników do pliku JSON
categories = getAllCategories('https://gnom-sklep.pl/')
if categories:
    saveCategoriesToJSON(categories)
