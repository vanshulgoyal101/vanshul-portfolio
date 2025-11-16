# Makefile for Vanshul Portfolio

.PHONY: dev start stop restart build preview clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  dev      - Start development server"
	@echo "  start    - Start development server (alias for dev)"
	@echo "  stop     - Stop running development server"
	@echo "  restart  - Restart development server"
	@echo "  build    - Build for production"
	@echo "  preview  - Preview production build"
	@echo "  clean    - Clean build artifacts"
	@echo "  help     - Show this help message"

# Development server
dev:
	npm run dev

# Start development server (alias)
start: dev

# Stop development server
stop:
	@echo "Stopping development server..."
	@pkill -f "vite" || echo "No Vite server running"

# Restart development server
restart: stop
	@sleep 1
	@$(MAKE) dev

# Production build
build:
	npm run build

# Preview production build
preview:
	npm run preview

# Clean build artifacts
clean:
	rm -rf dist/

# Install dependencies
install:
	npm install

# Full development workflow
setup: install dev