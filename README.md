# Job Ads Coding Challenge by Slavko Pekaric

A coding challenge for managing job ads. 

## Running the app

The app consumes data from a small NodeJS mock data server written with ExpressJS.

### Local

Install dependencies:

```sh
npm install
```

Run the Angular app and the mock data server at the same time:

```sh
npm run start:app:server
```

After command run the app will be available on localhost via port 4200.

### Docker

Build and run Docker images for both the Angular app and the mock data server. After command run the app will be available on localhost via port 3001. 

```sh
npm run docker-quickstart
```

## Tests

```sh
npm run test
```

## Linting

```sh
npm run lint:watch
```
