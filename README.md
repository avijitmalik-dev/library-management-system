# Library Management System
A RESTful API for a Library Management System (LMS) built using Node.js, Express, Sequelize, JWT, and Joi. The system supports role-based access control (RBAC) with functionalities for user management, book management, and borrowing operations. Features include user authentication, password hashing, and secure API endpoints



Step 1: Set Up the Project

Create the Project Folder and Initialize Node.js Project:
mkdir library-management-system
cd library-management-system
npm init -y

step 2: Install Dependencies:

npm install express sequelize mysql2 jsonwebtoken bcryptjs joi dotenv
npm install --save-dev nodemon


step 3:Set Up Environment Variables: 
Create a .env file to store sensitive information 
PORT = 8000
DB_NAME=library
DB_USER=root
DB_PASSWORD=
DB_PORT = 3308
DB_HOST=localhost


JWT_SECRET_KEY=qsbi1epmk1wbpz1pbqw@
JWT_EXPIRES_IN=1h

EMAIL_USER=
EMAIL_PASS=qsbiepmkwb



step 4: Create the necessary folder structure with useing mvc pattern:
mkdir config controllers routes models middleware services utils




#postman collection


