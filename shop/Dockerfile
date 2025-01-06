# Użyj lżejszego obrazu bazowego z Apache i PHP
FROM php:7.4-apache

# Zainstaluj wymagane pakiety i zależności
RUN apt-get update && apt-get install -y \
    openssl \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libxml2-dev \
    libonig-dev \
    libzip-dev \
    unzip \
    wget \
    default-mysql-client \
    && docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    pdo \
    pdo_mysql \
    soap \
    zip \
    && a2enmod rewrite ssl

# Skopiuj pliki PrestaShop do obrazu
COPY --chown=www-data:www-data ./prestashop_data /var/www/html/

# Stwórz katalog na certyfikaty SSL
RUN mkdir -p /etc/apache2/ssl

# Wygeneruj samopodpisany certyfikat SSL
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/selfsigned.key \
    -out /etc/apache2/ssl/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Company/OU=Department/CN=localhost"

# Ustaw odpowiednie uprawnienia dla certyfikatów
RUN chown www-data:www-data /etc/apache2/ssl/selfsigned.crt && chown www-data:www-data /etc/apache2/ssl/selfsigned.key

# Skopiuj niestandardową konfigurację Apache
COPY ./ssl/000-default.conf /etc/apache2/sites-available/000-default.conf

# Włącz moduły SSL i Rewrite oraz nową konfigurację Apache
RUN a2ensite 000-default.conf

COPY ./scripts/dump2.sql /var/www/html/dump2.sql

COPY ./scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Otwórz porty 80 i 443
EXPOSE 80 443

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

# Uruchom Apache w trybie pierwszoplanowym
CMD ["apache2-foreground"]
