# 💾 Trackaholic – Fund Expense & Project Tracker

**Trackaholic** is a full-stack web application designed to help users manage project-based fund tracking, record expenses and incomes, upload receipts, and generate PDF/CSV reports — all in a visually intuitive dashboard.

Built for teams, students, and professionals handling fund-based projects (like college clubs, events, or research groups), Trackaholic offers robust financial visibility, transparency, and ease of use.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login with JWT token-based authentication
* Role-based access protection (e.g., project members vs creators)

### 📁 Project Management

* Create, update, and delete projects
* Assign multiple phases and track them individually

### 💸 Expense & Income Tracking

* Add, edit, delete expenses/incomes tied to specific projects and phases
* Upload receipts (image or PDF)
* Categorize and filter by date, phase, or type

### 📤 Receipt Handling

* Upload receipts via forms
* Securely download them when needed

### 📊 Dashboards & Reports

* View fund balance, total spent, and income per project
* Export project reports as **PDF** or **CSV** using:

  * `jspdf`
  * `html2canvas`
  * `react-csv`
* Clean charts powered by **Recharts**

---

## 🧱 Tech Stack

### 💽 Frontend – Vite + React

* React Router DOM
* Axios
* Recharts
* jsPDF + html2canvas + react-csv
* Tailwind CSS

### ⚖️ Backend – Node.js + Express

* MongoDB (via Mongoose)
* JWT for authentication
* Multer for file uploads
* RESTful API design

### 🗄️ Database

* MongoDB Atlas

---

## 📂 Folder Structure

```
/frontend/trackaholic/
├── src/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   └── utils/
└── public/

📆 Backend
/backend/
├── routes/
├── controllers/
├── models/
├── middleware/
└── uploads/     ← Stores user-uploaded receipts
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/trackaholic.git
cd trackaholic
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend/trackaholic
npm install
npm run dev
```

---

## 📦 API Routes

All backend routes are prefixed with: `/api/v1/`

| Endpoint                        | Method   | Description              |
| ------------------------------- | -------- | ------------------------ |
| `/auth/register`                | POST     | Register user            |
| `/auth/login`                   | POST     | Login user               |
| `/projects/`                    | GET/POST | Fetch or create projects |
| `/projects/:projectId/expenses` | GET/POST | Get or add expenses      |
| `/projects/:projectId/incomes`  | GET/POST | Get or add incomes       |
| `/expenses/:id/receipt`         | GET      | Download receipt         |

> Auth middleware protects all sensitive routes.

---

## 📸 Screenshots (Add if ready)

| Dashboard                          | Add Expense                        | PDF Download                   |
| ---------------------------------- | ---------------------------------- | ------------------------------ |
| ![dashboard](assets/dashboard.png) | ![expense](assets/add-expense.png) | ![pdf](assets/pdf-preview.png) |

---

## 📌 .gitignore Highlights

```gitignore
# Frontend
node_modules/
dist/
.env

# Backend
node_modules/
uploads/
.env

# System files
.DS_Store
Thumbs.db
```

---

## 📌 To-Do / Future Enhancements

* [ ] Add email verification
* [ ] Export full project summary as a zip
* [ ] Admin analytics dashboard
* [ ] Dark mode toggle 🌙

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♀️ Author

**Harinee**
Trackaholic was built as a comprehensive solution to simplify fund tracking for college events, personal projects, and team collaborations.
Let's connect on [LinkedIn](https://linkedin.com/) or [GitHub](https://github.com/YOUR_USERNAME)

---
