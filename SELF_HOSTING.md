
# Self-Hosting Guide for Personnel Directory

This guide will help you set up and run the Personnel Directory application on an Ubuntu server with PostgreSQL.

## Prerequisites

- Ubuntu 20.04 or later
- Node.js 18.x or later
- PostgreSQL 12 or later
- npm or yarn

## Step 1: System Setup

Update your system and install required dependencies:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl build-essential postgresql postgresql-contrib
```

### Install Node.js using NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

## Step 2: Database Setup

1. Start PostgreSQL service:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. Create a database and user:

```bash
sudo -u postgres psql
```

In the PostgreSQL prompt:

```sql
CREATE DATABASE personnel_directory;
CREATE USER appuser WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE personnel_directory TO appuser;
\q
```

## Step 3: Application Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
cd personnel-directory
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

Create a `.env.local` file in the project root:

```
VITE_PG_HOST=localhost
VITE_PG_PORT=5432
VITE_PG_DATABASE=personnel_directory
VITE_PG_USER=appuser
VITE_PG_PASSWORD=your_secure_password
VITE_PG_SSL=false
```

## Step 4: Building for Production

Build the application:

```bash
npm run build
```

## Step 5: Serving the Application

You can serve the application using a web server like Nginx or Apache. Here's how to set it up with Nginx:

1. Install Nginx:

```bash
sudo apt install -y nginx
```

2. Configure Nginx:

```bash
sudo nano /etc/nginx/sites-available/personnel-directory
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # If you have a backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/personnel-directory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: Database Migration

If you need to set up the database schema:

1. Create a schema.sql file with your table definitions
2. Run it against your PostgreSQL database:

```bash
psql -U appuser -d personnel_directory -f schema.sql
```

## Troubleshooting

- **Permission issues**: Ensure your application has the right permissions to connect to PostgreSQL
- **Connection refused**: Check if PostgreSQL is running and listening on the expected port
- **CORS issues**: Adjust your API server to allow requests from your frontend domain

## Maintenance

- **Backups**: Set up regular database backups:
  ```bash
  pg_dump -U appuser personnel_directory > backup_$(date +%Y%m%d).sql
  ```

- **Updates**: Regularly update your system and application dependencies

## Security Considerations

- Use HTTPS in production
- Set up a firewall (UFW)
- Use strong passwords
- Consider implementing rate limiting

For more help, please check the project documentation or open an issue on the repository.
