 Task Management Project

This project is a **Task Management API** built with **Node.js** and **Express.js**, using **SQLite** as the database. It features **user authentication** and **role-based authorization** implemented with **JWT** (JSON Web Token). The entire project is built **without using any ORM**, and all database operations are done through raw SQL queries.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Default Users](#default-users)
- [Postman Collection](#postman-collection)

## Features

- User Registration & Login
- JWT-based Authentication
- Role-based Authorization (Admin/User)
- Task Management: Create, Update, Delete, View Tasks
- Pagination and Sorting for Users and Tasks
- Search & Filter functionality for tasks
- Protected Routes

## Technologies

- **Node.js**
- **Express.js**
- **SQLite**
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT-based authentication
- **SQLite3** for database management

## Installation

1. cd task-manager-app

2. npm install

3. npm run start

4. npm run start:dev    # for Development 

## Project Structure

├── db                 # All the core logic and creation of bd tables and insertion of the users.
├── controllers        # Contains user and task controller logic
├── middleware         # Middleware for authentication and authorization
├── models             # Contains models with database logic (User, Task)
├── routes             # Defines routes for user and task operations
├── validators         # Input validation logic for request bodies and query parameters
└── app.js      


## Default Users

When the server is run, two default users are created:

1. **Admin User**
   - **Email**: `admin@gmail.com`
   - **Password**: `admin@123`
   - Role: Admin

2. **Regular User**
   - **Email**: `user@gmail.com`
   - **Password**: `user@123`
   - Role: User

You can perform all the tasks with these two users and check the responses for different roles (admin and user).

## Postman Collection

A Postman collection is attached that contains all the requests for both user and task functionalities. You can import this collection to Postman and use it to test the API endpoints and their responses.