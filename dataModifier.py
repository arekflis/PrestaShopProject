import json
import os
import shutil
import re
from PIL import Image

def convert_webp_to_png(imagePath):
    if imagePath.lower().endswith(".webp"):
        img = Image.open(imagePath)
        
        new_image_path = imagePath.replace(".webp", ".png")

        img.save(new_image_path, "PNG")
        
        return new_image_path
    return imagePath

def processJsonImages(data):
    for category, subcategories in data.items():
        for subcategory, products in subcategories.items():
            for product, attributes in products.items():
                if "Obrazy" in attributes:
                    for image_key, image_path in attributes["Obrazy"].items():
                        new_image_path = convert_webp_to_png(image_path)
                        attributes["Obrazy"][image_key] = new_image_path

def processJsonPrice(data):
    for category, subcategories in data.items():
        for subcategory, products in subcategories.items():
            for product, attributes in products.items():
                if "Cena" in attributes:
                    print("zmieniam cene")
                    price = attributes["Cena"]
                    cleanPrice = price.replace(" PLN", "").replace(" ", "")
                    formattedPrice = float(cleanPrice.replace(",", "."))
                    nettoPrice = round(formattedPrice/1.23,2)
                    attributes["Cena"] = f"{nettoPrice:.2f}"

def main():
    originalFile = "scraping-results/categories.json"
    backupFile = "scraping-results/categories-modified.json"
    
    shutil.copyfile(originalFile, backupFile)
    
    with open(backupFile, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    processJsonImages(data)
    processJsonPrice(data)
    
    with open(backupFile, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
