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

# Copy env config and set variables values
cp .env.example .env

```

### 🐳🧑‍💻 Run in Development

```bash
# Build and Run Docker container that contains db, prisma-studio and the app
yarn docker:up
# Run first time around
yarn docker:seed
```

### 🧪 Run Tests

```bash
# Unit + e2e tests
yarn test
yarn test:e2e # not exhaustive coverage, just a showcase
```

## 📘 API Documentation and tools

- REST API is available at:  
  **`/api`** → Swagger UI
- GraphQL Playground is availabe at:
  **`/graphql`**
- Prisma Studio is available at:  
  **[http://localhost:5555](http://localhost:5555)**

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
