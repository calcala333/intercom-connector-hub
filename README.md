
# Personnel Directory Application

## Quick Installation

To install the application with a single command, run:

```bash
curl -s https://raw.githubusercontent.com/yourusername/personnel-directory/main/install.sh | bash
```

This script will:
- Update your system
- Install required dependencies (PostgreSQL, Node.js, Nginx)
- Set up the database
- Clone the repository
- Configure environment variables
- Build the application
- Configure the web server

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
