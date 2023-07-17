# Eventon - Back-end

This repository contains the back-end code for Eventon, a comprehensive event management solution.

## Overview

Eventon is a web-based application that allows you to manage all aspects of your event, from planning to execution.

## Running the Development Environment

To run the development environment, follow these steps:

1. Clone this repository to your local machine.
2. Install all required dependencies by running `npm i`.
3. Create a PostgreSQL database with a name of your choice.
4. Configure the `.env.development` file using the provided `.env.example` file as a template.
5. Run all database migrations by executing `npm run dev:migration:run`.
6. Seed the database with initial data by running `npm run dev:seed`.
7. Start the back-end in development mode by executing `npm run dev`.

## Running Tests

To run tests, follow these steps:

1. Complete the steps in the previous section to set up the development environment.
2. Configure the `.env.test` file using the provided `.env.example` file as a template.
3. Run all database migrations for the test environment by executing `npm run test:migration:run`.
4. Run tests by executing `npm run test`.

## Building and Starting for Production

To build and start the application for production, execute the following commands:

```bash
npm run build
npm start
```

## Managing Database Migrations and Prisma Clients

Before running database migrations, ensure that you have a running PostgreSQL instance configured according to the settings in either the `.env.development` or `.env.test` file, depending on your target environment. You can start a PostgreSQL instance by executing `npm run dev:postgres` or `npm run test:postgres`.

You can perform database operations for different environments by populating the appropriate environment variables first. To do so, use the following commands:

- `npm run dev:migration:run`: Runs database migrations for the development environment using settings from the `.env.development` file.
- `npm run test:migration:run`: Runs database migrations for the test environment using settings from the `.env.test` file.

- `npm run dev:migration:generate -- --name ATOMIC_OPERATION_NAME`: Generates and runs a new migration and updates the Prisma client for the development environment using settings from the `.env.development` file. Replace `ATOMIC_OPERATION_NAME` with a descriptive name for your migration.

## Adding New Environment Variables

When adding new environment variables, follow these steps:

1. Add them to the `.env.example` file as a reference for other developers.
2. Add them to your local `.env.development` and `.env.test` files with appropriate values for each environment.
