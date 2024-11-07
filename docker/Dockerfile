# Dockerfile
FROM prestashop/prestashop:1.7.8

# Install OpenSSL if it's not already in the image (usually it is)
RUN apt-get update && apt-get install -y openssl

# Change permissions 
#RUN chmod -R 777 /var/www/html

# Create directory for SSL certificates
RUN mkdir -p /etc/apache2/ssl

# Generate a self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/selfsigned.key \
    -out /etc/apache2/ssl/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Company/OU=Department/CN=localhost"

RUN chown www-data:www-data /etc/apache2/ssl/selfsigned.crt && chown www-data:www-data /etc/apache2/ssl/selfsigned.key

# Copy custom Apache configuration file
COPY ./ssl/000-default.conf /etc/apache2/sites-available/000-default.conf

# Enable SSL module and site configuration
RUN a2enmod ssl && service apache2 restart && a2ensite 000-default.conf && service apache2 restart

# Restart Apache to apply the changes
CMD ["apache2-foreground"]