# 📄 Intelligent Document Platform

An AI-powered web application that enables users to upload PDF documents, generate intelligent summaries, chat with document content, and view document statistics using Google Gemini AI.

---

## 🚀 Features

- 🔐 Google Authentication (Firebase)
- 📤 Upload PDF documents
- ☁️ Store PDFs securely using Supabase Storage
- 🗄️ Store document metadata in Supabase Database
- 🤖 AI-powered PDF summarization using Google Gemini
- 💬 Chat with uploaded documents
- 📊 Document statistics
  - Number of pages
  - Word count
  - Character count
- 📄 Recent Documents section
- 🔓 Logout functionality
- 🎨 Modern responsive UI built with React & Tailwind CSS

---

## 🏗️ System Architecture

```
React Frontend
       │
       ▼
FastAPI Backend
       │
 ├── PDF Upload
 ├── Extract Text (PyMuPDF)
 ├── Gemini AI Summary
 ├── Chat API
 └── Document Statistics
       │
       ▼
Supabase
 ├── Storage
 └── Database
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Firebase Authentication
- Lucide Icons

### Backend

- FastAPI
- Python
- Google Gemini API
- PyMuPDF (fitz)

### Database & Storage

- Supabase Database
- Supabase Storage

### Authentication

- Firebase Google Authentication

---

## 📂 Project Structure

```
intelligent-document-platform
│
├── backend
│   ├── services
│   │    ├── gemini_service.py
│   │    └── pdf_service.py
│   ├── uploads
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── src
│   │    ├── components
│   │    ├── pages
│   │    ├── lib
│   │    └── App.jsx
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/intelligent-document-platform.git

cd intelligent-document-platform
```

---

## 2️⃣ Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env`

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Run backend

```bash
python -m uvicorn main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend

```
GEMINI_API_KEY=
```

### Frontend

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

# 📸 Screenshots

## Login

_Add screenshot here_

---

## Dashboard

_Add screenshot here_

---

## AI Summary

_Add screenshot here_

---

## Chat with PDF

_Add screenshot here_

---

## Recent Documents

_Add screenshot here_

---

## 📈 Workflow

1. User logs in with Google.
2. Uploads a PDF.
3. PDF is stored in Supabase Storage.
4. Metadata is stored in Supabase Database.
5. Backend extracts text using PyMuPDF.
6. Gemini AI generates a summary.
7. User can ask questions about the uploaded document.
8. Document statistics are displayed.

---

# 📋 Functional Requirements

- User authentication
- PDF upload
- AI summary generation
- AI chat with documents
- Recent document history
- Document statistics
- Secure cloud storage

---

# 🚀 Future Enhancements

- Flashcard generation
- Quiz generation
- OCR support for scanned PDFs
- Multi-language document support
- Semantic search with vector embeddings
- Chat history
- PDF highlighting
- Export AI summary as PDF

---

# 👩‍💻 Author

**R. Jaiwanthini**

Computer Science and Engineering

Rajalakshmi Engineering College

---

# 📄 License

This project is developed for educational and hackathon purposes.
