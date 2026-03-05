Express.js, MySQL, node, authentication using jwts , complete secure backend for a social media app

APIS:
auth-
   login
   register
profile
patch
implement database connection and perform CRUD
=>id page - posts+ pfp + username
 get request 
input- id 
output- bio+ pfp+ username
=>feed page -
get request
input- id
output- posts of people you're following 
=> new post 
post request

USERS/:USERID
GET    /users/:userId        → username, pfp, bio  DONE
PUT    /users/:userId        → update bio / pfp
USERS/:USERID/POSTS
GET    /users/:userId/posts  → all posts of a user  DONE
POST   /users/:userId/posts → create a post for that user DONE
POSTS
GET    /users/:userId/posts/:postId        → get one post  DONEs



Folder structure:
reet
    client
    ├── dist
    │  ├── assets
    │  │  ├── index-DJ2y1AdQ.js
    │  │  └── index-DQ3P1g1z.css
    │  ├── index.html
    │  └── vite.svg
    ├── public
    │  └── vite.svg
    ├── src
    │  ├── assets
    │  ├── components
    │  │  └── ProtectedRoute.tsx
    │  ├── hooks
    │  │  └── useAppDispatch.ts
    │  ├── pages
    │  │  ├── Home.tsx
    │  │  ├── Login.tsx
    │  │  ├── Profile.tsx
    │  │  └── Register.tsx
    │  ├── redux
    │  │  ├── auth
    │  │  │  └── authSlice.ts
    │  │  └── store.ts
    │  ├── services
    │  │  └── api.ts
    │  ├── App.css
    │  ├── App.tsx
    │  ├── index.css
    │  └── main.tsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.tss
├── public
│  ├── images
│  ├── javascripts
│  └── stylesheets
│     └── style.css
├── routes
│  ├── auth
│  │  ├── login.js
│  │  ├── refreshtoken.js
│  │  └── register.js
│  ├── index.js
│  ├── rels.js
│  ├── users.js
│  └── users_posts.js
├── services
│  ├── auth.services.js
│  └── user.services.js
├── utils
│  ├── hashToken.js
│  └── jwt.js
├── views
│  ├── error.jade
│  ├── index.jade
│  └── layout.jade
├── .env
├── .gitignore
├── app.js
├── db.js
├── middleware.js
├── package-lock.json
├── package.json
├── readme.md
└── sql.sql
