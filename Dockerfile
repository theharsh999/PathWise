FROM php:8.2-apache

# Install PDO MySQL extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Enable .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy backend files to Apache webroot
COPY backend/ /var/www/html/

# Ensure web permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port (default 80 or provided by host dynamically)
ENV PORT=80
EXPOSE 80

# Configure Apache port dynamically for Railway / Render / Fly
CMD sed -i "s/Listen 80/Listen ${PORT:-80}/g" /etc/apache2/ports.conf && \
    sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT:-80}>/g" /etc/apache2/sites-available/000-default.conf && \
    apache2-foreground
