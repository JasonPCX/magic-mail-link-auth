# Magic Mail Link Authentication

## Overview
Magic Mail Link Authentication is an API that allows users to log in using a one-time login link sent to their email address. When a user logs in, a token is generated with the user information retrieved from redis. The API is built using Node.js and uses Redis as its database.

## Installation
To install Magic Mail Link Authentication, follow these steps:

1. Clone the repository to your local machine.
2. Install Node.js and Redis if they are not already installed.
3. Run npm install to install the API's dependencies.
4. Copy the provided .env.example content and set the required environment variables in a .env file. These include:

- SERVER_PORT: the port for running the server

- SECRET_KEY: the key used for signing issued tokens

- REDIS_URI: the string that describes redis connection

- MAIL_NAME: your application name that will appear when a email is sent

5. Run npm start to start the API.


## API Routes

### `POST /api/auth/signup`
Register a user.

Input
```
{
    "name": "John Doe",
    "email": "johndoe@example.net" 
}
```
### `POST /api/auth/login`
Logs a user in using a one-time login link sent to their email address.

Input:
```
{
    "email": "johndoe@example.net" 
}
```

### `GET /api/auth/verify?token=<token>`
Retrieves information about the currently logged-in user.

## Give me a start ⭐️
If you find this repo useful, please consider giving it a star :D
