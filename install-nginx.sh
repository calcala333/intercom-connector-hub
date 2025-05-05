
#!/bin/bash

# Create directory for the Nginx config
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Copy the Nginx config file
sudo cp nginx.conf /etc/nginx/sites-available/personnel-directory

# Create a symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/personnel-directory /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx

echo "Nginx configuration updated successfully!"
