# Pocket Chat Backend

The Pocket Chat Backend powers the innovative features of the Pocket Chat platform, ensuring seamless, real-time communication across various functionalities. Developed to support the comprehensive suite of communication tools provided by the frontend, the backend is robust, scalable, and easy to integrate.

## Project structure

```
.
├── database                # Database scripts and schemas
│   └── migrations          # SQL migration scripts
├── dist                    # Compiled JavaScript files from TypeScript source
├── security                # Security configurations and certificates
├── src                     # Source code of the application
│   ├── controllers         # Controllers handle incoming requests and return responses
│   ├── middlewares         # Express middlewares for request processing
│   ├── repositories        # Data access layer: interact with the database
│   ├── routers             # Route definitions for the API endpoints
│   ├── socket              # WebSocket or socket.io configuration for real-time features
│   ├── types               # TypeScript type definitions and interfaces
│   └── utilities           # Utility functions and helper modules
└── validators              # Input validation logic for API endpoints
```


## Features

### Real-Time Communication 😊📞

Supports instant messaging, enriched with emojis 😄 and media sharing 📸.
* Manages video 📹 and voice calls 📞, including group calls 👥.
* Enables real-time updates for live sessions 🎥 and notifications 🔔.

### Scalable Groups & Live Sessions 🌐👥
* Facilitates the creation and management of user groups 👨‍👩‍👧‍👦.
* Handles live session broadcasting 📡 to a broad audience 🌎.

### Shorts & Media Management 🎬💾
* Processes and stores short videos 🎥, enabling quick sharing and viewing 👀.
* Optimizes media storage and retrieval for efficient data handling 🚀.

## Technologies Used 💻🛠️

Pocket Chat Backend is built with a powerful stack of technologies to ensure high performance, reliability, and scalability:

- **Node.js** 🟢: A JavaScript runtime built on Chrome's V8 JavaScript engine, perfect for building fast and scalable network applications.
- **TypeScript** 📘: A typed superset of JavaScript that compiles to plain JavaScript, providing optional static typing, classes, and interfaces.
- **Express.js** 🚂: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **PostgreSQL** 🐘: An open-source, powerful, and advanced relational database system known for its reliability, feature robustness, and performance.
- **Redis** 🟥: An open-source, in-memory data structure store, used as a database, cache, and message broker, enhancing performance by caching frequently accessed data.
- **WebSocket** 🌐: A communication protocol that enables interactive communication sessions between a user's browser and a server.
- **Docker** 🐳: A set of platform-as-a-service (PaaS) products that use OS-level virtualization to deliver software in packages called containers.
- **JWT (JSON Web Tokens)** 🔑: A compact, URL-safe means of representing claims to be transferred between two parties, used for secure user authentication.

## Getting Started

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/instamenta/pocket-chat-backend.git
cd pocket-chat-backend
npm install
```

### Setup
use the Make file to create and start the Postgres database and Redis as well as PG Admin.

### Contributing 🤝
As a solo developer, I welcome contributions and feedback to improve Pocket Chat.

### Support 🆘
If you encounter any issues or have questions, please file an issue on GitHub.

### License 📄
Pocket Chat is released under the MIT License. Feel free to fork, modify, and use it in your projects.
