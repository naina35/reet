APIS:
login
feed 
post of id


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

USERS
POST   /users                → create user DONE
USERS/:USERID
GET    /users/:userId        → username, pfp, bio  DONE
PUT    /users/:userId        → update bio / pfp
USERS/:USERID/POSTS
GET    /users/:userId/posts  → all posts of a user  DONE
POST   /users/:userId/posts → create a post for that user DONE
POSTS
GET    /users/:userId/posts/:postId        → get one post  DONEs




