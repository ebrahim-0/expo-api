# Express API Routes

This repository contains a set of routes for an Express API. It includes routes for user authentication, password reset, user registration, and more.

## Setup

#### 1. Install dependencies by running `npm install`.

#### 2. Start the server by running `node index.js`.

## Routes

### POST /api/v1/auth/register

- Description: Route to create a new user.
- Body Parameters:
  - firstName: The first name of the user.
  - lastName: The last name of the user.
  - email: The email address of the user.
  - password: The password for the user.
- Response: A success message with the user's details if the user is created successfully.

### POST /api/v1/auth/login

- Description: Route to login the user.
- Body Parameters:
  - email: The email address of the user.
  - password: The password for the user.
- Response: A JWT token if the login is successful.

### GET /api/v1/auth/me

- Description: Route to get the current user's information.
- Authorization: Requires a valid JWT token in the request header.
- Response: The user's details if the token is valid.

### POST /api/v1/auth/forgotPassword

- Description: Route to initiate the password reset process.
- Body Parameters:
  - email: The email address of the user.
- Response: The server will send an email with instructions to reset the password.

### POST /api/v1/auth/verifyResetCode

- Description: Route to verify the password reset code sent to the user's email.
- Body Parameters:
  - resetCode: The reset code sent to the user's email.
- Response: A success message if the code is valid.

### PUT /api/v1/auth/resetPassword?u=userId

- Description: Route to reset the user's password.
- Body Parameters:
  - newPassword: The new password for the user.
- Query Params Parameters:
  - u: The user id of user
- Response: A success message if the password is reset successfully.

### GET /api/v1/auth/logout

- Description: Route to log out the user.
- Response: A success message indicating the user has been logged out.

### GET /

- Description: Route to test the API.
- Response: A simple message to indicate the API is running.
