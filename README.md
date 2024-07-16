We-Connect

We-Connect is a real-time messaging application built using NestJS, Docker, RabbitMQ, MongoDB, and Socket.io. This app allows users to register, login, create profiles, update profiles, view profiles, and engage in text-based chat with other users. The chat functionality leverages RabbitMQ and Socket.io to send message notifications in real-time.

Features

- User Registration
- User Login
- Profile Creation
- Profile Update
- Profile Viewing
- Real-time Text-Based Chat between Two Users

Endpoints

Authentication

- POST /api/register - Register a new user

- POST /api/login - Login a user

Profile

- POST /api/createProfile - Create a user profile

- POST /api/updateProfile - Update a user profile

- GET /api/getProfile - View a user profile


Chat

- POST /api/sendMessage - Send a chat message

- GET /api/viewMessages/:senderId - Get the messages

**API Documentation will be available at http://localhost:3001/api-docs**



Environment Variables

### JWT_SECRET
### JWT_EXPIRES = 1d
### NODE_ENV = development 
### MONGO_URI
### RABBITMQ_HOST
### RABBITMQ_PORT
### RABBITMQ_USER
### RABBITMQ_PASSWORD
### PORT = 3001

Prerequisites

Docker and Docker Compose installed
Node.js Version 18 installed

Instructions
Clone the repository:

git clone https://github.com/balagopalg/we-connect
cd we-connect

Create a .env file in the root directory and add your environment variables.

Build and run the Docker containers:
docker-compose up --build

**The application will be available at http://localhost:3001**

**The websocket connection will be available at ws://127.0.0.1:3001 and subscribe to event 'newMessage'**




