# ITX Frontend challenge

This is the frontend challenge required for Inditex.

It is an app, made with React, that consumes a REST API to display a list of phones and their details.

## How to run

There are 5 scripts available:

| Script   | Description                        |
|----------|------------------------------------|
| start    | Starts the app in development mode |
| build    | Builds the app for production      |
| test     | Runs the tests                     |
| lint     | Runs the linter                    |
| lint:fix | Runs the linter and fixes issues   |


## Project structure

The solution is a small React SPA app that has the following two routes, via React Router:

| Route      | Description                    |
|------------|--------------------------------|
| /          | List of phones                 |
| /phone/:id | Phone details for the given ID |

It has been architected following clean architecture principles

- Shared React Query client instance
- Route components (main pages) where data loading happens
- Services, used by React Query, to fetch data
- Reusable components, either at Route level (i.e., Control component) or emulating a shared UI library (i.e., card component)

## Technologies used

The app was built with React, TypeScript and plain CSS.

It uses the following libraries:

- React Router: for routing capabilities and to make use of its data fetching capabilities
- Tanstack React Query: to manage data fetching and caching

## Notes

### FetchWithRetry

I've noticed that the API can take a while to respond until it warms up, so I've added fetchWithRetry to handle
errors/timeouts and retry the request with backpressure.

### Devices filtering

I've added debouncing to the filter input to avoid unnecessary rerenders whilst the user is typing.
