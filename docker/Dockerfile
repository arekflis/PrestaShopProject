FROM prestashop/prestashop:1.7.8

# Pobranie skryptu wait-for-it.sh
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it.sh

# Nadanie uprawnień do wykonania skryptu
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod +x /usr/local/bin/wait-for-it.sh

