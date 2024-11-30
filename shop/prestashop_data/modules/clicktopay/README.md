# Click to Pay Module Installation Guide

This guide will help you manually install the module and installing necessary dependencies.

## Prerequisites

Before you begin, make sure you have the following:

- A PrestaShop store.
- The ZIP file containing the module.
- [Composer](https://getcomposer.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

## Installation Steps

1. Locate your PrestaShop installation directory on your server.
2. Inside the PrestaShop installation directory, navigate to the `modules` directory. The path should look something like this:
`/path/to/your/prestashop.com/modules/`
3. Upload the module ZIP file to the `modules` directory.
4. Unzip the module inside the `modules` directory:
5. Navigate to the `module` `/path/to/your/prestashop/public_html/modules/clicktopay`
6. Install PHP dependencies
```bash
composer install 
```
7. Install and build JS
```bash
make build-js 
```
8. Navigate to shop admin panel `module manager` tab and install the module.

## CS-fixer

Run command to have latest CS fixer rules as dependency requires minimum 7.4 PHP and our lowest is 7.1:

```bash
docker run -v $(pwd):/code ghcr.io/php-cs-fixer/php-cs-fixer:${FIXER_VERSION:-3.47.0-php7.4} fix src
```
