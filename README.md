# DevOps CI/CD Pipeline Demo 🚀

[![CICD](https://github.com/theexeq/devops-ci-cd-pipeline/actions/workflows/cicd.yaml/badge.svg)](https://github.com/theexeq/devops-ci-cd-pipeline/actions/workflows/cicd.yaml)

This repository demonstrates a practical CI/CD pipeline for a containerized application backed by a relational database.

The project shows how application changes can move through an automated delivery flow that validates code quality, builds deployable artifacts, and publishes versioned container images.

## Overview

The pipeline automates key delivery steps such as:

- Installing dependencies with a locked package setup
- Running automated tests before any publish step
- Building the application into a container image
- Applying traceable image tags based on branch and commit information
- Publishing artifacts to a container registry

This keeps delivery repeatable, reduces manual release work, and helps prevent untested changes from being published.

## Application behavior

The demo application includes:

- An HTTP API for managing book records
- A health endpoint that reports overall service availability and database status
- Basic request validation for create operations
- Automatic database schema initialization when the application connects successfully
- Graceful handling of database availability issues

## Local development and runtime

The project includes a containerized local setup so the application and its database can run together in a consistent environment.

The application image is built for production-style execution and uses a minimal runtime footprint with only the dependencies needed to run the service.

## Interacting with the app

With the stack running locally via `docker compose up`, the API is exposed on port `3000`. The following `curl` commands cover the main endpoints.

Check service and database health:

```bash
curl http://localhost:3000/
```

List all books:

```bash
curl http://localhost:3000/books
```

Get a single book by id:

```bash
curl http://localhost:3000/books/1
```

Create a book:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Ulysses", "author": "James Joyce", "published_year": 1922}'
```

Create a book without a publication year:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "In Search of Lost Time", "author": "Marcel Proust"}'
```

Delete a book by id:

```bash
curl -X DELETE http://localhost:3000/books/1
```

## Testing

Automated tests cover important behavior such as:

- Health response formatting
- Request payload validation
- Database availability checks
- Recovery behavior after database initialization failures

This helps ensure the delivery pipeline validates both application logic and operational behavior.

## Goals

- Provide a clear example of CI/CD pipeline design
- Demonstrate test-gated container delivery practices
- Show how application and database concerns fit into an automated workflow
- Keep the workflow easy to extend as the project grows

## Pipeline behavior

On updates to the primary development branch, the workflow first runs the automated test suite. If validation succeeds, it builds and publishes a container image with tags that make the artifact easy to trace back to the source change that produced it.
