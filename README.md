# Expense_Tracking_App

A full-stack Expense Tracker that helps users manage income and expenses with visual analytics.  
Users can log transactions, view summaries, and analyze spending with interactive charts.

---

## 🚀 Features

### 🔧 Backend (Node.js + Express + MongoDB)
- RESTful API with full CRUD for users and transactions  
- Transaction filtering by type, category, and date  
- Graph API for visual breakdowns:
  - By Category (Pie Chart)
  - Monthly Income vs Expense (Bar Chart)
- Mongoose models with validation  
- Error handling and clean JSON responses  

### 💻 Frontend (React + Vite + Tailwind CSS)
- User-friendly dashboard to add, view, and manage transactions  
- Filtering options by category and date  
- Dynamic charts using Chart.js  
- Redux Toolkit for global state management  
- Axios for API calls  
- Responsive UI built with Tailwind CSS + shadcn/ui  

---

## 🏗️ Project Structure

project-root/
├── backend/
│   ├── models/
│   │   ├── userModel.js
│   │   └── transactionModel.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── transactionController.js
│   ├── routes/
│   │   └── routers.js
│   ├── server.js
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── PieChart.jsx
│   │   │   └── BarChart.jsx
│   │   └── redux/
│   │       ├── store.js
│   │       └── transactionSlice.js
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   └── vite.config.js
│
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
git clone https://github.com/RohitDC45/Expense_Tracking_App.git
cd Expense_Tracking_App

---

### 2️⃣ Backend Setup
cd backend
npm install

Create a `.env` file:
PORT=8010
MONGO_URI=your_mongodb_connection_string

Run backend:
npm run dev
(Default: http://localhost:8010)

---

### 3️⃣ Frontend Setup
cd ../client
npm install

Run frontend:
npm run dev
(Default: http://localhost:5173)

---

## 🌐 API Endpoints

### 👤 User APIs
Method | Endpoint | Description
-------|-----------|-------------
POST | /create_user | Register new user
GET | /user/:userId | Get user details
PUT | /updateUser/:userId | Update user details
DELETE | /deleteUser/:userId | Delete user
POST | /userLogin | User login

---

### 💵 Transaction APIs
Method | Endpoint | Description
-------|-----------|-------------
POST | /addTransaction/:userId | Add new transaction
GET | /allTransactions/:userId | Get all transactions
GET | /transaction/:transactionId | Get single transaction
PUT | /updateTransaction/:transactionId | Update transaction
DELETE | /deleteTransaction/:transactionId | Delete transaction
GET | /graphData/:userId | Get graph data (category + monthly trend)

## 📈 Frontend Visuals

- Pie Chart → Spending by category  
- Bar Chart → Monthly income vs expenses  

Both charts use Chart.js with data from `/graphData/:userId`.

---

## 🧩 Tech Stack

Backend: Node.js, Express, MongoDB, Mongoose  
Frontend: React, Vite, Tailwind CSS, Redux Toolkit, Axios, Chart.js  
Others: dotenv, shadcn/ui, concurrently (optional)

---

## 🧪 Scripts

### Backend
npm run dev       # Dev mode (nodemon)
npm start         # Production mode

### Frontend
npm run dev       # Start dev server

---


## 🧰 Troubleshooting

- If Tailwind isn’t working, ensure tailwind.config.cjs & postcss.config.cjs are in project root.  
- For Vite issues, upgrade Node to ≥20.19.0.  
- For Mongo errors, verify MONGO_URI in `.env`.  