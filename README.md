#  Digital Certificate Verification System (DCVS)

A secure **MERN Stack** web application that enables educational institutions and organizations to issue, manage, and verify digital certificates. The system provides a public certificate verification portal while restricting certificate management to authorized administrators through JWT-based authentication.

---

## Features

###  Admin

* Secure Admin Login with JWT Authentication
* Dashboard with certificate statistics
* Issue new digital certificates
* View all certificates
* Search and filter certificates
* Edit certificate details
* Revoke certificates
* Delete certificates
* Protected admin routes

###  Public Users

* Verify certificates using Certificate ID
* View certificate details instantly
* Identify valid and revoked certificates
* Simple and responsive verification interface

---

##  Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* CSS3

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

### Database

* MongoDB Atlas
* Mongoose

---

## Project Structure

```
Digital-Certificate-Verification-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── package.json
│   └── server.js
│
└── README.md
```

##  Environment Variables

Create a `.env` file inside the `backend` folder and configure the following variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=1d
```

For the frontend (if applicable):

```env
VITE_API_URL=http://localhost:5000
```

---

## Run the Application

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

## Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Secure MongoDB Atlas Connection
* Environment Variable Configuration

---



This project is developed for educational and learning purposes.
