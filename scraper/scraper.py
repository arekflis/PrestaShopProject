import requests
import csv
from bs4 import BeautifulSoup

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
                
                subcategories = []
                
                # Find subcategory within main category
                subcategoryLinks = mainCategory.find_all('a', class_='nav-link')
                
                for subLink in subcategoryLinks:
                    if subLink.has_attr('title') and subLink['title'] != mainCategoryName:
                        subcategories.append(subLink['title'])
                
                categoriesDictionary[mainCategoryName] = subcategories
        
        for mainCategory, subcategories in categoriesDictionary.items():
            print(f"Kategoria główna: {mainCategory}")
            for subcategory in subcategories:
                print(f"  - Podkategoria: {subcategory}")
                
        return categoriesDictionary
    else:
        print("Nie udało się pobrać strony:", response.status_code)

def saveCategoriesToCSV(categories_dict, filename='scraper/scraping-results/categories.csv'):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["main-category", "subcategory"])
        for main_category, subcategories in categories_dict.items():
            for subcategory in subcategories:
                writer.writerow([main_category, subcategory])
    print(f'Zapisano kategorie i podkategorie do {filename}')




categories = getAllCategories('https://gnom-sklep.pl/')
saveCategoriesToCSV(categories)
