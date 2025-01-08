FROM php:7.4-apache

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

COPY --chown=www-data:www-data ./prestashop_data /var/www/html/

RUN mkdir -p /etc/apache2/ssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/selfsigned.key \
    -out /etc/apache2/ssl/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Company/OU=Department/CN=localhost"

RUN chown www-data:www-data /etc/apache2/ssl/selfsigned.crt && chown www-data:www-data /etc/apache2/ssl/selfsigned.key

COPY ./ssl/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2ensite 000-default.conf

COPY ./scripts/dump.sql /var/www/html/dump.sql

COPY ./scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80 443

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

CMD ["apache2-foreground"]
