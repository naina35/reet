# Minimal Social Media Backend (Express + MySQL)

A secure backend API for a minimal social media application built using **Node.js, Express.js, and MySQL**.
The project implements authentication, user profiles, posts, and relationship management (follow, block, remove connection).

This backend focuses on **clean architecture, modular routing, and secure authentication using JWT tokens**.

---

# Tech Stack:

* **Node.js**
* **Express.js**
* **MySQL**

---

# Features

### Authentication

* User registration
* User login
* Secure password hashing
* JWT access token generation
* Refresh token support

### User Profiles

* Read profile data
* Update profile information

### Posts

* Create posts
* Read posts
* Update posts
* Delete posts

### User Relationships

Users can interact with other users through relationship APIs:

* Follow a user
* Block a user
* Remove connection

---

# Project Structure

```
reet
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
│
├── routes
│   ├── auth
│   │   ├── login.js
│   │   ├── refreshtoken.js
│   │   └── register.js
│   │
│   ├── index.js
│   ├── rels.js
│   ├── users.js
│   └── users_posts.js
│
├── services
│   ├── auth.services.js
│   └── user.services.js
│
├── utils
│   ├── hashToken.js
│   └── jwt.js
│
├── views
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
│
├── .env
├── .gitignore
├── app.js
├── db.js
├── middleware.js
├── package.json
├── package-lock.json
├── sql.sql
└── readme.md
```

---

# Architecture Overview

The project follows a **layered backend architecture**:

### Routes Layer

Handles HTTP requests and maps them to appropriate service functions.

### Services Layer

Contains core business logic and database queries.

### Utils Layer

Helper utilities for:

* JWT generation and verification
* Refresh token hashing

### Middleware

Centralized middleware for:

* Authentication verification
* Error handling
* Request validation

### Database

MySQL database storing:

* users
* posts
* relationships

---

# Database Setup

1. Create a MySQL database.

2. Import schema:

```
mysql -u username -p database_name < sql.sql
```

3. Configure environment variables.

---

# Environment Variables

Create a `.env` file:

```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=social_media

JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

---

# Installation

Clone the repository:

```
git clone https://github.com/naina35/reet.git
cd reet
```

Install dependencies:

```
npm install
```

Run the server:

```
npm start
```

For development:

```
npm run dev
```

---

# Security Features

* Password hashing using bcrypt
* JWT authentication
* Refresh token rotation
* Token hashing before storing
* Environment variable protection

---

# Future Improvements

* Feed API (timeline generation)
* Pagination for posts
* Input validation middleware
* Image upload support
* Notifications system
* WebSocket based real-time updates

---


