# Chatify - Real-Time Chat Application

Chatify is a real-time chat application built using React, Socket.IO, and Tailwind CSS. It allows users to join a chat room, send text messages, share files, and enjoy a smooth and responsive chat experience.

## Features

- **Real-Time Messaging:** Send and receive messages in real-time.
- **File Sharing:** Share images, videos, audio, and PDFs in the chat.
- **Typing Indicator:** Shows when a user is typing.
- **Join/Leave Notifications:** Receive notifications when a user joins or leaves the chat.
- **Responsive Design:** Fully responsive UI for various screen sizes.
- **Full-Screen File Preview:** View shared files in full-screen mode.
- **User-Specific Styling:** Differentiate messages sent by the current user from others.

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Socket.IO
- **Styling:** Tailwind CSS

## Installation

### Prerequisites

- Node.js
- npm (or yarn)

### Clone the Repository

```bash
git clone https://github.com/your-username/chatify.git
cd chatify

```

## Backend Setup

1. Navigate to the server directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and add the following:

   ```makefile
   PORT=5000
   CLIENT_HOST_URL=http://localhost:3000
   ```

4. Start the backend server:

   ```bash
   node server.js
   ```

## Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory and add the following:

   ```arduino
   REACT_APP_BACKEND_HOST_URL=http://localhost:5000
   ```

4. Start the frontend development server:

   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. On the welcome page, you will see a status message indicating whether the backend server is running. This helps ensure that the backend is ready before you start chatting.
3. Enter a username and join the chat.
4. Start chatting and sharing files in real-time.

**Note:** It may take a minute for the backend server to start. If you see "Backend server is not responding" or "Error connecting to backend server", wait a moment and refresh the page.
