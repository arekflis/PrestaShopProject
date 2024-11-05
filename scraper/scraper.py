from urllib.parse import urljoin
import requests
import json
from bs4 import BeautifulSoup


def addProductsFromPage(products, soup):
    productItems = soup.find_all('a', class_='product__icon d-flex justify-content-center align-items-center')

    for product in productItems:
        if product.has_attr('title'):
            products.append(product['title'])


def getProducts(pageUrl, subcategoryUrl):
    products = []

    # Pobranie strony podkategorii
    response = requests.get(f"{urljoin(pageUrl, subcategoryUrl)}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Dodanie produktów z pierwszej strony podkategorii
        addProductsFromPage(products, soup)

        # Znalezienie linków do kolejnych stron podkategorii
        nextSubpages = soup.find_all('li', class_='pagination__element --item')
        for page in nextSubpages:
            newUrl = page.find('a', class_='pagination__link')
            if newUrl and newUrl.has_attr('href'):
                response = requests.get(f"{urljoin(pageUrl, newUrl['href'])}")

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    addProductsFromPage(products, soup)
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
        
        for mainCategory in mainCategories:
            mainLink = mainCategory.find('a', class_='nav-link nav-gfx')
            
            if mainLink and mainLink.has_attr('title'):
                mainCategoryName = mainLink['title']
                subcategoriesDictionary = {}

                # Znalezienie podkategorii w głównej kategorii
                subcategoryLinks = mainCategory.find_all('a', class_='nav-link')
                for subLink in subcategoryLinks:
                    if subLink.has_attr('title') and subLink['title'] != mainCategoryName:
                        subcategoryName = subLink['title']
                        products = getProducts(url, subLink['href'])
                        subcategoriesDictionary[subcategoryName] = products
                    elif subLink.has_attr('title') and subLink['title'] in ['Albi', 'PUZZLE']:
                        products = getProducts(url, subLink['href'])
                        subcategoriesDictionary[""] = products

                categoriesDictionary[mainCategoryName] = subcategoriesDictionary

        # Zwracanie wyników w formie słownika
        return categoriesDictionary
    else:
        print("Nie udało się pobrać strony:", response.status_code)
        return None


# Change the filename depending on which level the script is being run
def saveCategoriesToJSON(categories_dict, filename='scraper/scraping-results/categories.json'):
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(categories_dict, json_file, ensure_ascii=False, indent=4)
    print(f'Zapisano dane do pliku {filename}')


# Wywołanie funkcji i zapisanie wyników do pliku JSON
categories = getAllCategories('https://gnom-sklep.pl/')
if categories:
    saveCategoriesToJSON(categories)
