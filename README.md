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
