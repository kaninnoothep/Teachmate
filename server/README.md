# Teachmate - Server

This is the server-side of the Teachmate project, built with **Node.js** using **Express** and **Mongoose** to manage data in **MongoDB**.

## 📁 Folder structure

The following folders are used to organize the server:

`package.json` contains essential information about the project, including commands and dependencies

`.env` contains the environment variables

`src` contains the main source code for the backend logic of the project

**_Here are subfolders within the `src` folder_**

`configs` contains the backend configuration files and settings

`controllers` contains the functions handling the logic for various routes

`middlewares` contains the middleware functions

`models` contains code to define the Mongoose schemas and database models

`routes` contains the code that defines the routes for the API and their handlers

`services` contains the code that handles complex interactions and operations

`utils` contains helper functions and general purpose modules

---

## Prerequisites

To run the server locally, make sure the following are installed:

- [Node.js](https://nodejs.org/)
- `.env` file in the root of the `server` directory
- Access granted to the MongoDB Atlas database

---

## How To Run

To start the server, make sure you are in the `server` directory and run these commands in the shell

```sh
npm install
```

```sh
npm run start
```

### Note

The server will not connect to the database if your IP is not granted permission to access the database in MongoDB Atlas.

If this is an error, reach out to the author to grant you access to it.

---

<!-- CONTACT -->

## Author

**Kanin Noothep**
GitHub: [@kaninnoothep](https://github.com/kaninnoothep)
Email: [kaninnoothep@gmail.com](mailto:kaninnoothep@gmail.com)
