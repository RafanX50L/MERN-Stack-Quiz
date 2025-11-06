```markdown
# 🎯 MERN-Stack-Quiz

A MERN (MongoDB, Express.js, React.js, Node.js) stack-based quiz application that allows users to take quizzes, view their scores, and track their performance.  
The project demonstrates **clean architecture**, **reusable services**, and **modern frontend design** using **React + Vite + TailwindCSS**.

---

## ⚙️ Features

- ✍️ **User authentication** (login/register with JWT)
- 📚 **Take quizzes and submit answers**
- 🧠 **View quiz scores and past results**
- 💌 **Email support** for verification and notifications
- 🗂️ **Modular backend structure** with service-repository pattern
- ⚡ **Fast, reactive frontend** built with Vite + React Query + Redux Toolkit
- 🎨 **ShadCN UI + TailwindCSS** for consistent design
- 📦 **Environment-based configuration**

---

---

## 🚀 Local Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/RafanX50L/MERN-Stack-Quiz.git
cd MERN-Stack-Quiz
```

### 2. Initialize the project (PowerShell)

If you're on **Windows**, run:

```bash
./start.ps1
```

Or manually:

```bash
# Redis server setup
cd  cd .\Redis-Server
.\redis-server.exe
# Backend setup
cd Backend
npm install
npm run dev

# Frontend setup
cd ../Frontend
npm install
npm run dev
```

Then open:  
🌐 **Frontend**: [http://localhost:5173](http://localhost:5173)  
⚙️ **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Environment Variables

### `Backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizapp
RESET_PASS_URL = http://localhost:5173/auth/reset-password
CLIENT_URL= http://localhost:5173
JWT_SECRET=supersecretkey
REDIS_URL=redis://localhost:6379
COOKIE_MAX_AGE =  604800000
SENDER_EMAIL=your@email.com
PASSKEY=your_app_password
RESEND_API_KEY=your_resend_api_key # this key is from Resend 
NODE_ENV = development
ERROR_LOG_RETENTION_PERIOD = 14d
#otp intervals
START_INTERVAL = 100000
END_INTERVAL = 999999
```

### `Frontend/.env` (optional)

```env
VITE_PUBLIC_DOMAIN = http://localhost:5000
```

---

## 🧠 Technical Decisions & Architecture

### Architecture Pattern

This project follows a **Layered (Clean) Architecture** pattern:

- **Controller** → handles requests and responses  
- **Service** → contains business logic  
- **Repository** → interacts with MongoDB models  
- **Model** → defines Mongoose schemas  
- **Utils/Config** → reusable helpers and environment management  

This separation ensures:
- Easier testing and debugging  
- Reusable, modular code  
- Clear responsibility boundaries  

---

### Backend (Node + Express + TypeScript)

- Uses **Express.js** for HTTP routing and middleware  
- **Mongoose** connects and manages MongoDB  
- **Redis** is used for caching and session management  
- **Resend/Nodemailer** handles emails  
- **Winston** provides daily rotating logs  
- **TypeScript** ensures type safety and scalability  

---

### Frontend (React + Vite + Tailwind + Redux Toolkit)

- **React Query** handles server state (API fetching, caching)  
- **Redux Toolkit** manages global UI and auth state  
- **TailwindCSS + ShadCN** ensures a responsive, modern UI  
- **Vite** offers fast development and optimized builds  

---

## 🧪 Scripts

### Backend

```bash
npm run dev      # Start in dev mode
npm run build    # Build TypeScript
npm start        # Run built version
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production bundle
npm run preview  # Preview built site
```

---

## 🧰 Tech Stack Summary

| Layer       | Tech Used |
|-------------|----------|
| **Frontend** | React, Vite, TypeScript, TailwindCSS, Redux Toolkit, React Query |
| **Backend**  | Node.js, Express, TypeScript, MongoDB (Mongoose), Redis |
| **Email**    | Nodemailer, Resend |
| **Logging**  | Winston, Daily Rotate File |
| **Other Tools** | dotenv, bcryptjs, jsonwebtoken |

---

## 🧑‍💻 Author

**Muhammed Rafan M**  
📧 [Your Email or GitHub Profile URL]  
🚀 MERN Stack Developer
```