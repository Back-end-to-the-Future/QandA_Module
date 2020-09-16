# Delphi System Designs - Questions and Answers Microserver

> Delphi System Designs is an e-commerce platform specializing in aftermarket automotive parts.
This repository contains the code for the questions and answers microservice of this platforms e-commerce product pages.
I inherited a legacy front-end code base to this application and was tasked with building out a scalable back-end that could handle
web traffic at a minimum of 1000 requests per second under load.

## Table of Contents

1. [Related Projects](#related-projects)
2. [Achievements and Optimizations](#achievements-and-optimizations)
3. [Technologies Used](#technologies-used)
4. [Requirements](#requirements)
5. [Development](#development)

## Related Projects

  - https://github.com/Back-end-to-the-Future/product-overview
  - https://github.com/Back-end-to-the-Future/ratings-and-reviews-module
  - https://github.com/Back-end-to-the-Future/Zach_Proxy

## Achievements and Optimizations

 - Seeded a PostgreSQL database with 35 million records
 - Optimized PostgreSQL query times from 30+ seconds to 12ms through indexing
 - Achieved a throughput of 1085 requests per second when load testing locally.
 
 ![Alt Text](https://i.imgur.com/TCD7KhS.png)
 
## Technologies Used

 - JavaScript
 - React
 - Bootstrap
 - Express
 - Node.js
 - PostgreSQL
 - Jest
 - Enzyme
 - Amazon Web Services
 - Artillery
 - New Relic

## Requirements

- Node 6.13.0 or greater
- npm

## Development

### Installing Dependencies

> The following commands will install the application dependencies, run webpack to compile the application and start the development server

    npm install
    npm run react-dev
    npm run start

From within the root directory:

```sh
npm install
```
