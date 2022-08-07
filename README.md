# TodoApp

A todo app in created in `NextJS`.

The app use [Next-Controllers](https://www.npmjs.com/package/next-controllers) a library to manage the api controllers.

## Run

For run the app you need to setup an `Auth0` account and a `MongoDB` database.

- https://auth0.com/signup
- https://mongoosejs.com/

After that rename the `.env.local.sample` to `.env.local` and add your `Auth0` credentials and `MongoDB` credentials to the file.

### Setup mongodb with Docker

You can also setup a `mongodb` container with docker using the existing `docker-compose.yml` file.

Just register the following hosts in your machine:

```bash
127.0.0.1 mongo1
127.0.0.1 mongo2
127.0.0.1 mongo3
```

In windows this is done in `System32/drivers/etc/hosts` file.

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
- [x] Tags

## Todo

- [x] CORS
- [ ] Rate limiter
- [x] Logging
- [ ] Trash can (soft delete)
- [ ] Sorting
- [ ] Multi-language
- [ ] Add custom homepage/login to change Auth0 home
- [ ] Add last modification time
- [ ] Add hook for create custom dialogs
