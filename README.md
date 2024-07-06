# AdonisJS V6 PostgreSQL API Starter

This project is a boilerplate for building RESTful APIs using AdonisJS with PostgreSQL. It includes authentication (register, login, logout, password reset, email verification), file management, and basic CRUD operations.

## Features

- **Authentication**: User registration, login, logout, email verification, password reset.
- **File Management**: Upload, update, delete, and retrieve files.
- **CRUD Operations**: Example CRUD operations.
- **Email**: SMTP and Resend MJML template integration for sending emails.

## Getting Started

### Prerequisites

- Node.js
- PNPM
- Docker

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:agus-darmawan/adonis-api-pg-starter.git
   ```

2. Copy the .env.example to .env and configure your environment variables:

   ```bash
   cp .env.example .
   node ace generate:key
   ```

3. Run docker to build the app

   ```bash
   docker compose up -d
   ```

4. Run migrations:
   ```bash
   node ace migration:run
   ```

## Running the application

The server will start on http://localhost:${PORT}

## API Documentation

API Documentation can be found on postman link :
https://www.postman.com/agusdarmawan/workspace/adonis-api-pg-starter/overview

## Contributing

Contributions are welcome! Please create a pull request or submit an issue to discuss any changes.
