#Company NodeJS images

## Description

NodeJS application that collects requests with images, and sends these requests to a serverless service to obtain resized images

# project structure

## configuration files Environments

**.env, .env.test, .env.local, .env.pro**: 
configuration files according to environments, include database connection string, image output folder and more configurations

## Project configuration files

**.eslintrc.js**: quality code

**package.json**: build project file config.

**tsconfig.json, tsconfig.build.json, nest-cli.json**: 
Files used when compiling typescript and javascript code. being nest-cli.json specific to the nestjs framework with other settings

## Files External services

**/mongodb**: stores docker-compose configuration to start a mongodb instance

## Files Code Coverage Report

**/coverage/index.html**: generated when executing the command: "npm run test:cov" allows to see the coverage of our tests in html format.

## Test Files

**/test**: test End to End (http).

**/*/*.spec.ts**: unit test

## App files

**/src/**: code

# data model

## example of request

```json
{
    "_id": "626805177a7ff98cb8fe7466",
    "creationDate": "2022-04-26T14:43:35.586Z",
    "priority": 3,
    "state": "created",
    "images": [
        {
            "md5": "487f7b22f68312d2c1bbc93b1aea445b",
            "filePath": "626805177a7ff98cb8fe7466/500/487f7b22f68312d2c1bbc93b1aea445b.jpg",
            "creationDate": "2022-04-26T14:43:35.586Z",
            "width": 500,
            "height": 334,
            "original": true
        }
    ],
}
```

# TECH Stack

### Main language

**NodeJS (Javascript y TypeScript)**:
Reasons for its use:
- Designed to process many requests per second
- avoids creating threads for each request speeding up the requests
- TypeScript allows you to create potentially more scalable code with fewer runtime errors than javascript

### Main Framework

**NestJS**:
Reasons for its use:
- NestJS is built on typescript, allows dependency injection,
- Combines object-oriented programming with function-oriented programming
- highly testable, scalable, loosely coupled, and easily maintainable applications
- Although it provides us with the scalability and tools of a complete framework, it does not add excessive complexity and allows us to work quickly
- Allow data validation using constraint annotations instead of for example: ifs

### DB engine

**MongoDB**:
Reasons for its use:
- Given the topology of the application, as it does not have complex relationships and does not initially need operations with transactions
MongoDB is chosen as the database engine in order to optimize the data reading speed by not having to handle relationships but rather documents.
- Greater reading speed, although the typical ACID principles of a SQL database are lost

### Data Access library

**Mongosee**:
Reasons for its use:
- Allows you to perform queries and operations on mongoDB easily and quickly

### Testing libraries

**Jest**:
Reasons for its use:
- Allows test creation in a simple way
- Allows generation of test coverage report in html format

### Testing End To End library

**supertest**:
Reasons for its use:
- Allows HTTP requests in a simple way, to later test the values ​​received

### Library Environment variables or configuration files depending on the execution environment

**env-cmd**:
Reasons for its use:
- Allows you to create several configuration files which will be loaded based on the execution environment

### Code Quality

**EsLint**:
Reasons for its use:
- Helps to unify the way of creating code in the same project.
- Helps to create code with good practices and clean.

### memory database for testing

**mongodb-memory-server**:
Reasons for its use:
- It allows performing integration tests as if it were a real database but without requiring external services that may or may not be operational.
- Non-mutable environment, that is, the tests will always attack the same data, thus avoiding errors depending on the data that exists at that moment.

### Virtualization

**docker**:
Reasons for its use:
- It allows to raise any service locally, in this way you can work on the project regardless of the configurations and Operating Systems of the members.

## Instalation

```bash
npm install
```

# Init

## IMPORTANT: it is necessary to start firebase-api before: 

```bash
cd firebase-api/functions
npm run serve
```

## Init app local

```bash
#Before starting a mongodb instance is required on localhost
cd ./mongodb && docker-compose up
# dev
npm run start
# watch mode
npm run start:dev
# producción
npm run start:prod
```

## Start Docker Application

```bash
#IMPORTANT Before starting, have the following ports free: 27017, 3000 and 9229
#debug mode
docker-compose up dev
#pro mode
docker-compose up prod
#temporal access mode
docker-compose up -d prod

#start rebuilding image
docker-compose up dev --build
```

## Test
```bash
# all tests
npm run test:all
# unit tests
npm run test 
# e2e tests
npm run test:e2e
# tests coverture
npm run test:cov
```
