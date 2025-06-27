# 📇 Contact Management App

This repository contains a full-stack **Contact Management** application built with **React** and **Tailwind CSS** on the client-side, and **Express.js** for the server-side API.

## 🔍 Overview

This application allows users to manage their personal contact list through a simple and intuitive interface. Users can **add**, **view**, **update**, and **delete** contacts.

The frontend communicates with a RESTful API built with Express.js. It follows a modular file structure and supports responsive design for different screen sizes.

---

## ✨ Features

- ➕ **Add Contact** – Create new contact entries  
- 📄 **View Contacts** – Display a list of saved contacts  
- ✏️ **Update Contact** – Modify existing contact information  
- 🗑 **Delete Contact** – Remove contacts from the list  

---

## ⚙️ Technologies Used

### 🔸 Client (Frontend)

- **React** – JavaScript library for building UI  
- **Tailwind CSS** – Utility-first CSS framework  

### 🔹 Server (Backend)

- **Node.js** – JavaScript runtime  
- **Express.js** – Web framework for Node.js  
- **MySQL** – Relational database  
- **Socket.IO** – Real-time communication  

---

## 🚀 Getting Started

Follow these steps to run the project locally for development and testing.

### ✅ Prerequisites

- Node.js (LTS version recommended)  
- npm or yarn package manager  
- MySQL database (e.g. XAMPP, TiDB, or remote MySQL server)

---

### 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/contact-management-app.git
    cd contact-management-app
    ```

2. **Install backend dependencies**

    ```bash
    cd server
    npm install
    ```

3. **Install frontend dependencies**

    ```bash
    cd client
    npm install
    ```

---

### ▶️ Running the Application

Once dependencies are installed, follow these steps to run the app locally:

#### 🖥️ Server

1. Go to the `server` directory:

    ```bash
    cd server
    ```

2. Start the backend server:

    ```bash
    npm run dev
    ```

> Server runs on: `http://localhost:5000`

---

#### 💻 Client

1. Open a new terminal and navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Start the frontend development server:

    ```bash
    npm run dev
    ```

> App will open at: `http://localhost:3000`

---