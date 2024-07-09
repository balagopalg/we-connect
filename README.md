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

Sample Input
{
	"email": "user@gmail.com",
	"username": "User",
	"password": "Abcd123@",
	"confirmPassword": "Abcd123@"
}

- POST /api/login - Login a user

Sample Input
{
	"email": "user@gmail.com",
	"password": "Abcd123@"
}

Profile

- POST /api/createProfile - Create a user profile

Sample Input
{
	"userId": "668ca540c54d5823a5fa8c3f",
	"about": {
	"displayName": "User",
		"gender": "Male",
		"birthday":"1999-01-01"
		
},
	"interests": {
	"category": ["cricket", "movies"]
}
}

- POST /api/updateProfile - Update a user profile

Sample Input
{
	"userId": "668c079d8f979cfbe3b70c8c",
	"about": {
	"displayName": "User",
		"gender": "Male",
		"birthday":"1997-04-19"
		
},
	"interests": {
	"category": ["cricket", "movies", "music"]
}
}

- GET /api/getProfile - View a user profile

Sample Input
{
	"userId": "668ca540c54d5823a5fa8c3f"
}

Chat

- POST /api/sendMessage - Send a chat message

Sample Input
{
	"receiver": "668c1d1d2d4d44d7a3cb7b73",
	"text": "Sample Message"
}

- GET /api/viewMessages/:senderId - Get the messages



Environment Variables

# JWT_SECRET
# JWT_EXPIRES = 1d
# NODE_ENV = development 
# MONGO_URI
# RABBITMQ_HOST
# RABBITMQ_PORT
# RABBITMQ_USER
# RABBITMQ_PASSWORD
# PORT = 3001

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

The application will be available at http://localhost:3001




