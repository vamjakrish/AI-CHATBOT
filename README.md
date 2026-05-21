# ✦ NexusAI — MERN Stack AI Chatbot

A full-stack AI chatbot with ChatGPT-style interface, built with the MERN stack and powered by Google Gemini 1.5 Flash.

---

## 📁 Project Structure

```
mern-ai-chatbot/
├── package.json                  # Root: runs both server + client
├── .gitignore
│
├── server/                       # Express + MongoDB backend
│   ├── index.js                  # Entry point, MongoDB connection
│   ├── package.json
│   ├── .env.example              # → copy to .env and fill in values
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt password hashing)
│   │   └── Chat.js               # Chat + messages schema
│   ├── controllers/
│   │   ├── authController.js     # signup, login, getMe
│   │   └── chatController.js     # CRUD + Gemini integration
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/signup|login, GET /me
│   │   └── chat.js               # GET|POST /api/chat, message, delete
│   └── middleware/
│       └── auth.js               # JWT protect middleware
│
└── client/                       # React frontend
    ├── package.json
    ├── .env.example
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css             # Global styles + design tokens
        ├── App.js                # Router + private/public routes
        ├── context/
        │   └── AuthContext.js    # Global auth state
        ├── utils/
        │   └── api.js            # Axios instance + all API calls
        ├── pages/
        │   ├── Landing.js + .css # Marketing landing page
        │   ├── Auth.js + .css    # Login / Signup
        │   └── Chat.js + .css    # Main chat dashboard
        └── components/
            ├── Sidebar.js + .css # Chat history sidebar
            └── Message.js + .css # Message bubbles + markdown
```

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://cloud.mongodb.com))
- **Google Gemini API Key** ([Get one free](https://aistudio.google.com/app/apikey))

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd mern-ai-chatbot
npm run install-all
```

This installs dependencies for root, server, and client in one command.

---

### 2. Configure the Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-chatbot
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
GEMINI_API_KEY=AIza...your_key_here
CLIENT_URL=http://localhost:3000
```

**Getting a Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy it into your `.env`

**Using MongoDB Atlas (cloud):**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mern-chatbot
```

---

### 3. Configure the Client

```bash
cd client
cp .env.example .env
```

Edit `client/.env` (only needed if running on a different port):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 4. Run the App

From the **root** directory:

```bash
npm run dev
```

This starts both servers concurrently:
- 🔵 Backend: http://localhost:5000
- 🟢 Frontend: http://localhost:3000

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | `{name, email, password}` | Register user |
| POST | `/api/auth/login` | `{email, password}` | Login, returns JWT |
| GET | `/api/auth/me` | — (auth header) | Get current user |

### Chat (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/chat` | — | List all user's chats |
| POST | `/api/chat` | — | Create new chat |
| GET | `/api/chat/:id` | — | Get chat with messages |
| POST | `/api/chat/:id/message` | `{message}` | Send message, get AI reply |
| DELETE | `/api/chat/:id` | — | Delete a chat |
| DELETE | `/api/chat/:id/messages` | — | Clear chat messages |

---

## ✨ Features

- **ChatGPT-style UI** — clean sidebar + full-height message area
- **Dark modern design** — custom design system with CSS variables
- **User authentication** — JWT-based, passwords hashed with bcrypt
- **Persistent chat history** — stored in MongoDB per user
- **Gemini 1.5 Flash** — fast, capable AI with full conversation context
- **Markdown rendering** — headers, bold, lists, tables, blockquotes
- **Syntax highlighting** — code blocks with copy button
- **Typing indicator** — animated dots while AI responds
- **Optimistic UI** — your message appears instantly
- **Auto-generated titles** — chats named from first message
- **Grouped chat history** — Today / Yesterday / older
- **Clear chat button** — wipe messages without deleting the chat
- **Responsive** — works on mobile with slide-out sidebar
- **Error handling** — friendly messages for all error states
- **Secure** — API key never exposed to frontend

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Pure CSS with custom design system |
| Markdown | react-markdown + remark-gfm |
| Syntax | react-syntax-highlighter |
| HTTP | Axios with interceptors |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini 1.5 Flash |
| Dev | concurrently + nodemon |

---

## 🚢 Production Deployment

### Backend (Railway, Render, Fly.io)
1. Set all environment variables in your platform's dashboard
2. Set `CLIENT_URL` to your frontend domain
3. Deploy the `server/` folder

### Frontend (Vercel, Netlify)
1. Set `REACT_APP_API_URL` to your backend URL
2. Run `npm run build` in `client/`
3. Deploy the `client/build/` folder

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Make sure `mongod` is running locally, or use Atlas
- Check `MONGODB_URI` in `.env`

**Gemini API errors:**
- Verify your API key is valid and has quota
- Check you're not hitting rate limits (free tier: 15 req/min)

**CORS errors:**
- Ensure `CLIENT_URL` in `server/.env` matches your React dev URL exactly

**JWT errors after restart:**
- This is normal — tokens are invalidated if `JWT_SECRET` changes
- Users need to log in again
