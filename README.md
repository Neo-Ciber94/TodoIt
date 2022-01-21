# TodoApp

A todo app in created in `NextJS`.

The app use [Next-Controllers](https://www.npmjs.com/package/next-controllers) a library to manage the api controllers.

## Run

For run the app you need to setup an `Auth0` account and a `MongoDB` database.

- https://auth0.com/signup
- https://mongoosejs.com/

After that rename the `.env.local.sample` to `.env.local` and add your `Auth0` credentials and `MongoDB` credentials to the file.

Then continue with the following steps:

### 1. Install the dependencies

- `npm install`

### 2. Run the app in development mode

- `npm run next:dev`

## Features

- [x] Authentication
- [x] List todos (with pagination)
- [x] Create todos
- [x] Update todos
- [x] Delete todos
- [x] Filtering todos by status
- [x] Full text search
- [ ] Tags

## Todo

- [ ] CORS
- [ ] Rate limiter
- [ ] Logging
- [ ] Trash can (soft delete)
- [ ] Sorting