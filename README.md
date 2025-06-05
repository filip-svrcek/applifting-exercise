# 📝 Blog Engine API — NestJS, Prisma, PostgreSQL

A simple single-user blogging engine built with **NestJS**, **Prisma**, and **PostgreSQL**, designed as part of a backend developer assessment. This application implements a blogging platform, featuring RESTful APIs for authentication, articles, comments, and voting and websockets for live voting. It includes Docker support, validation, testing, and API documentation.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **API Style**: REST
- **Auth**: Password-based login (JWT)
- **Validation**: class-validator
- **Testing**: Jest (unit + e2e)
- **Documentation**: Swagger (OpenAPI)
- **Realtime**: WebSockets
- **Linting**: ESLint + Prettier
- **CI-Ready**: Git hooks via Husky
- **Containerization**: Docker + Docker Compose

## 📦 Features Implemented

- ✅ REST API for articles (CRUD)
- ✅ Comments on articles
- ✅ Reddit-style voting on comments (+/-)
- ✅ Authentication with password (JWT)
- ✅ Prisma schema & seed for DB
- ✅ Swagger API documentation
- ✅ e2e and unit tests using Jest
- ✅ Code linting and formatting
- ✅ Dockerized app and services
- ✅ GraphQL API

## 🧪 Running the App

### 🔨 Requirements

- [Node.js](https://nodejs.org/) ≥ 18
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

### 📦 Setup

```bash
# Install dependencies
yarn install

# Copy env config
cp .env.example .env

```

### 🐳 Run Docker

```bash
# Build, start and seed database
yarn start:db
yarn migrate
yarn seed
```

### 🧑‍💻 Run in Development

Make sure PostgreSQL is running locally (or via Docker), and `.env` is configured correctly:

```bash
yarn start:dev
```

### 🧪 Run Tests

```bash
# Unit + e2e tests
yarn test
yarn test:e2e # not exhaustive coverage, just a showcase
```

## 📘 API Documentation

- REST API is available at:  
  **`/api`** → Swagger UI

## 📂 Seeded User

To log in:

```json
{
  "email": "alice",
  "password": "passworda"
}
```

## 🧑‍💻 Author

Filip Svrček
