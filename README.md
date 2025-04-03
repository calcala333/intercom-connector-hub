
# Personnel Directory Application

## Quick Installation

To install the application with a single command, download the installation script and run it:

```bash
# Option 1: Download and execute the script directly
wget -O install.sh https://raw.githubusercontent.com/yourusername/personnel-directory/main/install.sh
chmod +x install.sh
sudo ./install.sh
```

## Manual Installation

For step-by-step manual installation instructions, please refer to [SELF_HOSTING.md](./SELF_HOSTING.md)

## Configuration

The application uses these environment variables:
- `VITE_PG_HOST`: PostgreSQL host (default: localhost)
- `VITE_PG_PORT`: PostgreSQL port (default: 5432)
- `VITE_PG_DATABASE`: Database name (default: personnel_directory)
- `VITE_PG_USER`: Database user (default: postgres)
- `VITE_PG_PASSWORD`: Database password
- `VITE_PG_SSL`: Enable SSL for database connection (default: false)

## Support

If you encounter any issues, please check the troubleshooting section in [SELF_HOSTING.md](./SELF_HOSTING.md) or open an issue in the repository.

## Authentication Error Solution

If you encounter the "Authentication failed" error during installation:

1. Simply download the installation script directly instead of cloning:
   ```bash
   wget -O install.sh https://raw.githubusercontent.com/yourusername/personnel-directory/main/install.sh
   chmod +x install.sh
   sudo ./install.sh
   ```

2. The script will set up all necessary files locally without requiring repository access.
