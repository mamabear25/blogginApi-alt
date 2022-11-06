# blogginApi-alt
## Overview
This is a simple REST API, it performs CRUD operations by making HTTP requests like GET, POST, PATCH and DELETE.

This API is built using Node.JS, Express framework, mongoose and the MongoDB is the database of choice which is used for storing and retrieving data.

### THE REST API

Create a .env file to store your MongoDB database credentials and environment variables

```
MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.6m5cz.mongodb.net/Recipes?retryWrites=true&w=majority
```

### Installation
------



To run this project,

1. fork this repo
2. clone the repo to your local machine
3. Open th folder in your favourite text editor
4. cd into the directory where the project is located.
5. install it locally using npm:

`$ npm install`

```
node index.js or nodemon index.js
```

### THE ENDPOINTS
-------


| S.no   | route            | Method |  Access       | Description  |
| :---   |    :----        | ---:   |   :---:        |   :---        |
| 1      | "/signup"        | POST   | PRIVATE       |     create a new user      |
| 2      | "/login"         | POST   | PRIVATE       |      log in to the app   |
| 3      | "/blogs"         | POST   | PRIVATE       |  post a new Blog           |
| 4      | "/blogs"         | GET    | PUBLIC        |    get all published blogs on the app   |
| 5      | "/blogs/published"| GET   | PRIVATE       |   get published Blogs by current user   |
| 6      | "/blogs/draft    | GET    | PRIVATE       |  get all blogs in draft for current user  |
| 7      | "/blogs/:id      | GET    | PUBLIC        |  get Blog By Id |
| 8      | "/blogs/:id"     | DELETE | PRIVATE       |  delete Blog By Id     |
| 9      | "/blogs/user/articles"| GET |PRIVATE      |  get All Blogs By current user   |
| 10     | "/blogs/update/:id| PATCH | PRIVATE       | update Blog By Id
| 11     | "/blogs/tags/:tags"| GET   | PRIVATE      |   get Blogs by Tags    |
| 12     | "/blogs/title/:title"| GET| PRIVATE       |      get blogs by Title |


### Here is a guide to using the application.
-----

- [x] create a new user 
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "JohnDoe",
  "bio": "cool cat",
  "gender": "male",
  "email": "johnny@example.com,
  "password": "myverystrongpassword"
}
```
- [x] Log into the application

```json
{
  "email": "johnny@example.com,
  "password": "myverystrongpassword"
}
```

- [x] Post a new blog

```json
{
    title: "my new blog",
    "description": "Trying out blogging",
    "body": "lorem ipsum lorem ipsum lorem ipsum, lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    tags: ["first", "lorem", "new"]
 }
```
    
- [x] Update the state of the blog to published

```json
{
  "state": "published"
}
```
Explore the rest of the endpoints
