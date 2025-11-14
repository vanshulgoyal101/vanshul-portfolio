# Makefile for Vanshul Portfolio

.PHONY: dev build preview clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  dev     - Start development server"
	@echo "  build   - Build for production"
	@echo "  preview - Preview production build"
	@echo "  clean   - Clean build artifacts"
	@echo "  help    - Show this help message"

# Development server
dev:
	npm run dev

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