
#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables
DB_HOST="172.18.3.25"
DB_PORT="5432"
DB_NAME="personnel_directory"
DB_USER="postgres"
DB_PASSWORD="Welcome1"
SERVER_IP="172.18.3.25"

echo -e "${GREEN}Starting Personnel Directory installation...${NC}"

# Check if running with sudo/root permissions
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run this script with sudo or as root${NC}"
    echo "Try: sudo ./install.sh"
    exit 1
fi

# Update system and install dependencies
echo -e "${GREEN}Updating system and installing dependencies...${NC}"
apt update && apt upgrade -y || { echo -e "${RED}Failed to update system packages${NC}"; exit 1; }
apt install -y curl build-essential postgresql postgresql-contrib nginx git || { echo -e "${RED}Failed to install required packages${NC}"; exit 1; }

# Install NVM and Node.js
echo -e "${GREEN}Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
else
    echo "Node.js is already installed"
fi

# Setup PostgreSQL database
echo -e "${GREEN}Setting up PostgreSQL database...${NC}"
systemctl start postgresql || { echo -e "${RED}Failed to start PostgreSQL${NC}"; exit 1; }
systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database may already exist, continuing..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" || echo "User may already exist, continuing..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Determine installation directory
INSTALL_DIR="/opt/personnel-directory"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Clone the repository (replace with actual repo URL)
echo -e "${GREEN}Setting up application files...${NC}"
if [ -d "$INSTALL_DIR/.git" ]; then
    git pull
else
    # Replace with your actual repository URL
    git clone https://github.com/yourusername/personnel-directory.git $INSTALL_DIR || {
        echo -e "${RED}Failed to clone repository. Using local files if available.${NC}"
        # If git clone fails, check if we have the necessary files locally
        if [ ! -f "vite.config.ts" ]; then
            echo -e "${RED}No repository and no local files. Cannot proceed.${NC}"
            exit 1
        fi
    }
fi

# Install dependencies
echo -e "${GREEN}Installing application dependencies...${NC}"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm install || { echo -e "${RED}Failed to install npm dependencies${NC}"; exit 1; }

# Create environment file
echo -e "${GREEN}Creating environment configuration...${NC}"
cat > .env.local << EOF
VITE_PG_HOST=$DB_HOST
VITE_PG_PORT=$DB_PORT
VITE_PG_DATABASE=$DB_NAME
VITE_PG_USER=$DB_USER
VITE_PG_PASSWORD=$DB_PASSWORD
VITE_PG_SSL=false
EOF

# Build the application
echo -e "${GREEN}Building the application...${NC}"
npm run build || { echo -e "${RED}Failed to build application${NC}"; exit 1; }

# Setup Nginx
echo -e "${GREEN}Setting up Nginx...${NC}"
cat > /etc/nginx/sites-available/personnel-directory << EOF
server {
    listen 80;
    server_name $SERVER_IP;
    root $INSTALL_DIR/dist;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/personnel-directory /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx || { echo -e "${RED}Nginx configuration failed${NC}"; exit 1; }

# Setup firewall if installed
if command -v ufw > /dev/null; then
    echo -e "${GREEN}Configuring firewall...${NC}"
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
fi

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${GREEN}You can access the application at http://$SERVER_IP${NC}"
echo -e "${GREEN}For HTTPS, consider setting up SSL with Let's Encrypt${NC}"
