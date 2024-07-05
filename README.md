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

2. Install the App

   ```bash
   cd adonis-api-pg-starter
   pnpm install
   ```

3. Copy the .env.example to .env and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Set up the database:

   ```bash
   docker compose up -d
   ```

5. Run migrations:
   ```bash
   node ace migration:run
   ```

## Running the application

Start the development server:

```bash
  pnpm run dev
```

The server will start on http://localhost:3333

## Contributing

Contributions are welcome! Please create a pull request or submit an issue to discuss any changes.

## License

This project is licensed under the MIT License.
