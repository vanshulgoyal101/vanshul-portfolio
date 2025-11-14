# Configuration Documentation

## Main Config Files
- `package.json`: Project metadata, dependencies, scripts
- `vite.config.js`: Vite build and dev server configuration
- `eslint.config.js`: Linting rules and setup
- `Makefile`: Convenient shortcuts for common commands

## Environment
- No `.env` file detected, but Vite supports environment variables via `.env.*` files

## Deployment
- Uses Vite for fast builds and local dev
- `CNAME` in public/ for custom domain

## Available Commands
- `make dev` - Start development server
- `make build` - Build for production
- `make preview` - Preview production build
- `make clean` - Clean build artifacts
- `make install` - Install dependencies
- `make setup` - Install dependencies and start dev server

## Extending
Update config files to add dependencies, change build settings, or modify linting rules.
