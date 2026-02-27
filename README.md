# DevOps CI/CD Pipeline Demo 🚀

[![CICD](https://github.com/theexeq/devops-ci-cd-pipeline/actions/workflows/cicd.yaml/badge.svg)](https://github.com/theexeq/devops-ci-cd-pipeline/actions/workflows/cicd.yaml)

This repository demonstrates a practical CI/CD pipeline for a containerized application.

The project is intended to show how source code changes can move through an automated delivery flow, from build to publish, using common DevOps tooling.

## Overview ⚙️

The pipeline automates key delivery steps such as:
- Building the application
- Packaging the application as a container image
- Applying traceable image tagging
- Publishing artifacts to a container registry

This keeps delivery repeatable and reduces manual deployment work.

## Goals 🎯

- Provide a clear example of CI/CD pipeline design
- Demonstrate container-based delivery practices
- Keep the workflow easy to extend as the project grows

## Pipeline behavior 🔄

On updates to the main development branch, the workflow builds and publishes a container image with tags that make the artifact easy to track back to source changes.
