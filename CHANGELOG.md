# Changelog

All notable changes to this project will be documented in this section.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial setup of the Express application.
- Docker support including `Dockerfile`, `docker-compose.yml`, and `.dockerignore` files.
- Configured the Docker setup to include a `PostgreSQL` service and environment variables for database configuration.
- Open-source documentation: `LICENSE`, `CONTRIBUTION_GUIDELINES.md`, `CODE_OF_CONDUCT.md`, `README.md`, `.env.template` and this `CHANGELOG.md`.
- Added database migrations and seed scripts for setting up and populating the database tables users, threads and replies.
- Implemented CRUD operations for users, threads, and replies with necessary error handling.
