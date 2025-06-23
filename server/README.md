# Teachmate - Server

The server of this project was built with Express working in Node with using Mongoose to manage the MongoDB.

## Folder structure

The following are the folders used to organize this part of the project and what they contain.

`package.json` contains essential information about the project, including commands and dependencies

`.env` contains the environment variables

`src` contains the main source code for this part of the project

**_Here are subfolders within the `src` folder_**

`configs` contains the backend configuration files and settings

`controllers` contains the functions handling the logic for various routes

`middlewares` contains the middleware functions

`models` contains code to define the data structure and interact with the database

`routes` contains the code that defines the routes for the API and their handlers

`services` contains the code that handles complex interactions and operations

`utils` contains helper functions and general purpose modules

## How To Run

To start the server, make sure you are in the server directory and run these commands in the shell

```sh
npm install
```

```sh
npm run start
```

### Note

The server will not connect to the database if your IP is not granted permission to access the database in MongoDB Atlas.

If this is an error, reach out to the author to grant you access to it.

<!-- CONTACT -->

## Author

**James Kanin** - [@kaninnoothep](https://github.com/kaninnoothep) - [kaninnoothep@gmail.com](mailto:kaninnoothep@gmail.com)
