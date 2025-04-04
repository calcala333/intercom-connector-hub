
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
if [ "$(id -u)" -ne 0 ]; then
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
    echo "Node.js is already installed: $(which node)"
fi

# Setup PostgreSQL database
echo -e "${GREEN}Setting up PostgreSQL database...${NC}"
systemctl start postgresql || { echo -e "${RED}Failed to start PostgreSQL${NC}"; exit 1; }
systemctl enable postgresql

# Create database and user - ignoring errors if already exists
cd /tmp || { echo -e "${RED}Failed to change to /tmp directory${NC}"; exit 1; }

sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database may already exist, continuing..."
sudo -u postgres psql -c "ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" || echo "User may already exist, updating password..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Determine installation directory
INSTALL_DIR="/opt/personnel-directory"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR || { echo -e "${RED}Failed to change to installation directory${NC}"; exit 1; }

# Setup basic directory structure
echo -e "${GREEN}Creating application from scratch...${NC}"
mkdir -p src/components/ui src/hooks src/lib src/pages src/types src/data public

# Create tsconfig.json file first to address TypeScript issues
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": true,
    "esModuleInterop": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create tsconfig.node.json
cat > tsconfig.node.json << EOF
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Create main configuration files
cat > package.json << EOF
{
  "name": "personnel-directory",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.1.0",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "@vitejs/plugin-react-swc": "^3.6.0",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
EOF

# Create the database configuration file
cat > src/lib/db-config.ts << EOF
/**
 * PostgreSQL Database Configuration
 * 
 * This file provides configuration for connecting to a PostgreSQL database.
 * For production, use environment variables for sensitive information.
 */

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

/**
 * Default database configuration for development
 * In production, use environment variables
 */
export const getDbConfig = (): DbConfig => {
  return {
    host: process.env.VITE_PG_HOST || 'localhost',
    port: parseInt(process.env.VITE_PG_PORT || '5432'),
    database: process.env.VITE_PG_DATABASE || 'personnel_directory',
    user: process.env.VITE_PG_USER || 'postgres',
    password: process.env.VITE_PG_PASSWORD || 'postgres',
    ssl: process.env.VITE_PG_SSL === 'true',
  };
};
EOF

# Create vite.config.ts
cat > vite.config.ts << EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow connections from any IP address for self-hosting
    strictPort: true,
    proxy: {
      // Proxy API requests to backend server if needed
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
EOF

# Create index.html
cat > index.html << EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Personnel Directory</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create utility files
cat > src/lib/utils.ts << EOF
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create main.tsx for minimal working app
cat > src/main.tsx << EOF
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

# Create a minimal App.tsx
cat > src/App.tsx << EOF
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personnel Directory</h1>
      <Routes>
        <Route path="/" element={<div>Welcome to Personnel Directory</div>} />
      </Routes>
    </div>
  );
};

export default App;
EOF

# Create a basic CSS file
cat > src/index.css << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Create postcss.config.js
cat > postcss.config.js << EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create tailwindcss config
cat > tailwind.config.js << EOF
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF

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

# Install dependencies
echo -e "${GREEN}Installing application dependencies...${NC}"
npm install || { echo -e "${RED}Failed to install npm dependencies${NC}"; }

# Build the application 
echo -e "${GREEN}Building the application...${NC}"
npm run build || { 
  echo -e "${RED}Failed to build application, trying with development server...${NC}"
  npm run dev &
  echo -e "${GREEN}Development server started as a fallback${NC}"
}

# Setup Nginx - Fix the issue with Nginx configuration
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

# Check if internal-directory is a directory and remove it
if [ -d "/etc/nginx/sites-enabled/internal-directory" ]; then
    echo -e "${GREEN}Removing directory /etc/nginx/sites-enabled/internal-directory...${NC}"
    rm -rf /etc/nginx/sites-enabled/internal-directory
fi

# Remove any existing symlink to avoid conflicts
if [ -L "/etc/nginx/sites-enabled/personnel-directory" ]; then
    rm -f /etc/nginx/sites-enabled/personnel-directory
fi

# Create symlink and restart Nginx
ln -sf /etc/nginx/sites-available/personnel-directory /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx || { 
    echo -e "${RED}Nginx configuration failed, proceed without Nginx restart${NC}"; 
    echo -e "${RED}You may need to manually configure Nginx later${NC}";
}

# Setup firewall if installed
if command -v ufw > /dev/null; then
    echo -e "${GREEN}Configuring firewall...${NC}"
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
fi

# Set proper permissions for the installation directory
chown -R www-data:www-data $INSTALL_DIR
chmod -R 755 $INSTALL_DIR

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${GREEN}You can access the application at http://$SERVER_IP${NC}"
echo -e "${GREEN}If you experienced any build errors, you can access the development server at http://$SERVER_IP:8080${NC}"
