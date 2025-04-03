
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

# Update system and install dependencies
echo -e "${GREEN}Updating system and installing dependencies...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl build-essential postgresql postgresql-contrib nginx

# Install NVM and Node.js
echo -e "${GREEN}Installing Node.js...${NC}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts

# Setup PostgreSQL database
echo -e "${GREEN}Setting up PostgreSQL database...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Clone the repository (replace with actual repo URL)
echo -e "${GREEN}Cloning application repository...${NC}"
REPO_DIR="$HOME/personnel-directory"
git clone https://github.com/yourusername/personnel-directory.git $REPO_DIR || (cd $REPO_DIR && git pull)
cd $REPO_DIR

# Install dependencies
echo -e "${GREEN}Installing application dependencies...${NC}"
npm install

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
npm run build

# Setup Nginx
echo -e "${GREEN}Setting up Nginx...${NC}"
sudo tee /etc/nginx/sites-available/personnel-directory > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_IP;
    root $REPO_DIR/dist;

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

sudo ln -sf /etc/nginx/sites-available/personnel-directory /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Setup firewall if installed
if command -v ufw > /dev/null; then
    echo -e "${GREEN}Configuring firewall...${NC}"
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
fi

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${GREEN}You can access the application at http://$SERVER_IP${NC}"
echo -e "${GREEN}For HTTPS, consider setting up SSL with Let's Encrypt${NC}"
