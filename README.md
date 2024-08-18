# Portfolio: Student Forum

An easy-to-use closed forum that makes it simple for students and teachers of Erasmushogeschool Brussel to connect, share ideas, and have their questions answered.

## Table of Contents

- [Portfolio: Student Forum](#portfolio-student-forum)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Quick Start](#quick-start)
  - [Database Schema](#database-schema)
    - [Users Table](#users-table)
    - [Threads Table](#threads-table)
    - [Replies Table](#replies-table)
  - [API Endpoints](#api-endpoints)
    - [User Endpoints](#user-endpoints)
    - [Thread Endpoints](#thread-endpoints)
    - [Reply Endpoints](#reply-endpoints)
  - [Status](#status)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [License](#license)
  - [Questions and Support](#questions-and-support)

## Purpose

The **Student Forum** API is written in Nodejs and is designed to serve as a forum where students can post questions and receive answers from teachers. Note that the feature for posting and answering questions is not yet implemented. This repository is being set up as open-source before starting with testing and full implementation.

## Quick Start

This project uses Docker for containerization and `docker-compose` for orchestration. Follow these steps to get the project up and running:

1. Copy the `.env.template` file to a new file named `.env` in the root directory of the project.

2. Run the following command to build and start the project using Docker Compose:
   ```
   docker-compose -f docker-compose.dev.yml up --build
   ```

- For production, use:

  ```
  docker-compose -f docker-compose.prod.yml up --build
  ```

- For testing, use:
  ```
  docker-compose -f docker-compose.test.yml up --build
  ```

## Database Schema

### Users Table

| Column       | Type      | Description                              |
| ------------ | --------- | ---------------------------------------- |
| `user_id`    | INTEGER   | Unique identifier for the user           |
| `username`   | TEXT      | Username of the user                     |
| `email`      | TEXT      | Email address of the user                |
| `password`   | TEXT      | Hashed password of the user              |
| `created_at` | TIMESTAMP | Timestamp when the user was created      |
| `updated_at` | TIMESTAMP | Timestamp when the user was last updated |

### Threads Table

| Column               | Type      | Description                                    |
| -------------------- | --------- | ---------------------------------------------- |
| `thread_id`          | INTEGER   | Unique identifier for the thread               |
| `user_id`            | INTEGER   | ID of the user who created the thread          |
| `title`              | TEXT      | Title of the thread                            |
| `content`            | TEXT      | Content of the thread                          |
| `posted_anonymously` | BOOLEAN   | Indicates if the thread was posted anonymously |
| `created_at`         | TIMESTAMP | Timestamp when the thread was created          |
| `updated_at`         | TIMESTAMP | Timestamp when the thread was last updated     |

### Replies Table

| Column       | Type      | Description                                 |
| ------------ | --------- | ------------------------------------------- |
| `reply_id`   | INTEGER   | Unique identifier for the reply             |
| `thread_id`  | INTEGER   | ID of the thread to which the reply belongs |
| `user_id`    | INTEGER   | ID of the user who created the reply        |
| `content`    | TEXT      | Content of the reply.                       |
| `correct`    | BOOLEAN   | Indicates if the reply is marked as correct |
| `created_at` | TIMESTAMP | Timestamp when the reply was created        |
| `updated_at` | TIMESTAMP | Timestamp when the reply was last updated   |

## API Endpoints

### User Endpoints

| HTTP Method | Endpoint             | Description                     | Request Parameters                        |
| ----------- | -------------------- | ------------------------------- | ----------------------------------------- |
| GET         | /api/users           | Retrieves all users             | N/A                                       |
| GET         | /api/users/{user_id} | Retrieves a specific user by ID | `user_id` (path)                          |
| POST        | /api/users/register  | Creates a new user              | `username`, `email`, `password` (body)    |
| POST        | /api/users/login     | Logs in a user                  | `email`, `password` (body)                |
| PUT         | /api/users/(user_id) | Updates a specific user by ID   | `user_id` (path), fields to update (body) |
| DELETE      | /api/users/(user_id) | Deletes a specific user by ID   | `user_id` (path)                          |

### Thread Endpoints

| HTTP Method | Endpoint                    | Description                                      | Request Parameters                          |
| ----------- | --------------------------- | ------------------------------------------------ | ------------------------------------------- |
| GET         | /api/threads                | Retrieves all threads                            | N/A                                         |
| GET         | /api/threads/{thread_id}    | Retrieves a specific thread by ID                | `thread_id` (path)                          |
| GET         | /api/threads/user/{user_id} | Retrieves all threads created by a specific user | `user_id` (path)                            |
| POST        | /api/threads                | Creates a new thread                             | `user_id`, `title`, `content` (body)        |
| PUT         | /api/threads/{thread_id}    | Updates a specific thread by ID                  | `thread_id` (path), fields to update (body) |
| DELETE      | /api/threads/{thread_id}    | Deletes a specific thread by ID                  | `thread_id` (path)                          |

### Reply Endpoints

| HTTP Method | Endpoint                                       | Description                                                        | Request Parameters                              |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| GET         | /api/replies                                   | Retrieves all replies                                              | N/A                                             |
| GET         | /api/replies/{reply_id}                        | Retrieves a specific reply by ID                                   | `reply_id` (path)                               |
| GET         | /api/replies/thread/{thread_id}                | Retrieves all replies associated with a specific thread            | `thread_id` (path)                              |
| GET         | /api/replies/user/{user_id}                    | Retrieves all replies made by a specific user                      | `user_id` (path)                                |
| GET         | /api/replies/thread/{thread_id}/user/{user_id} | Retrieves all replies made by a specific user in a specific thread | `thread_id`, `user_id` (path)                   |
| POST        | /api/replies/thread/{thread_id}                | Creates a new reply for a specific thread                          | `thread_id` (path), `user_id`, `content` (body) |
| PUT         | /api/replies/{reply_id}                        | Updates a specific reply's information based on the provided ID    | `reply_id` (path), fields to update (body)      |
| DELETE      | /api/replies/{reply_id}                        | Deletes a specific reply by ID                                     | `reply_id` (path)                               |

## Status

The project is currently in development.

## Changelog

See what’s new in our [Changelog](CHANGELOG.md).

## Contributing

Interested in contributing? Check out the [Contributing Guidelines](CONTRIBUTION_GUIDELINES.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Questions and Support

If you have any questions or need assistance, feel free to open a support ticket.
