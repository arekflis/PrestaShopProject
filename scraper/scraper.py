from urllib.parse import urljoin

import requests
import csv
from bs4 import BeautifulSoup


def addProductsFromPage(products, soup):
    productItems = soup.find_all('a', class_='product__icon d-flex justify-content-center align-items-center')

    for product in productItems:
        if product.has_attr('title'):
            products.append(product['title'])

def getProducts(pageUrl, subcategoryUrl):
    products = []

    #pageURL - main page Gnom, subcategoryURL - first page subcategory
    response = requests.get(f"{urljoin(pageUrl,subcategoryUrl)}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        #add products from first page subcategory
        addProductsFromPage(products, soup)

        #get links to another pages of subcategory
        nextSubpages = soup.find_all('li', class_='pagination__element --item')
        #add products from another pages of subcategory
        for page in nextSubpages:
            newUrl = page.find('a', class_='pagination__link')
            if newUrl and newUrl.has_attr('href'):
                response = requests.get(f"{urljoin(pageUrl, newUrl['href'])}")

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    addProductsFromPage(products, soup)
                else:
                    print("Nie udało się pobrać strony z produktami:", response.status_code)
                    exit(-1)
    else:
        print("Nie udało się pobrać strony z produktami:", response.status_code)
        exit(-1)

    return products

def getAllCategories(url):
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Create dictionary for categories and their subcategories
        categoriesDictionary = {}
        
        # Fid main categories (li.nav-item > a.nav-link nav-gfx)
        mainCategories = soup.find_all('li', class_='nav-item')
        
        for mainCategory in mainCategories:
            mainLink = mainCategory.find('a', class_='nav-link nav-gfx')
            
            if mainLink and mainLink.has_attr('title'):
                mainCategoryName = mainLink['title']
                subcategoriesDictionary = {}

                
                # Find subcategory within main category
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

        for mainCategory, subcategories in categoriesDictionary.items():
            print(f"Kategoria główna: {mainCategory}")
            for subcategory, products in subcategories.items():
                print(f"  - Podkategoria: {subcategory}")
                for product in products:
                    print(f"      - Produkt: {product}")
                
        return categoriesDictionary
    else:
        print("Nie udało się pobrać strony:", response.status_code)

def saveCategoriesToCSV(categories_dict, filename='scraping-results/categories.csv'):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["main-category", "subcategory"])
        for main_category, subcategories in categories_dict.items():
            for subcategory, products in subcategories.items():
                for product in products:
                    writer.writerow([main_category, subcategory, product])
    print(f'Zapisano kategorie i podkategorie do {filename}')

categories = getAllCategories('https://gnom-sklep.pl/')
saveCategoriesToCSV(categories)
