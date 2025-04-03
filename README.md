
# Personnel Directory Application

## Quick Installation

To install the application with a single command, download the installation script and run it:

```bash
# Option 1: Download and run in one step
curl -s https://raw.githubusercontent.com/yourusername/personnel-directory/main/install.sh | bash

# Option 2: If Option 1 fails, try this alternative method
wget https://raw.githubusercontent.com/yourusername/personnel-directory/main/install.sh
chmod +x install.sh
./install.sh
```

If you encounter a "404: command not found" error, it means the URL is not accessible. In that case:

1. Make sure you've replaced "yourusername" with your actual GitHub username
2. Verify the repository is public and accessible
3. Use the alternative manual installation method below

## Manual Installation

For step-by-step manual installation instructions, please refer to [SELF_HOSTING.md](./SELF_HOSTING.md)

## Using the Local Install Script

If you've already downloaded this repository, you can run the installation script directly:

```bash
chmod +x install.sh
./install.sh
```

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
