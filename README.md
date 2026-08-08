# 📄 Intelligent Document Platform

An AI-powered document management platform that allows users to securely upload PDF documents, extract their content, generate AI-powered summaries, and interact with their documents through conversational AI.

---

## 🚀 Features

### 🔐 User Authentication

- Google authentication using Firebase Authentication
- Each user's documents are associated with their Firebase UID
- Users can access their own uploaded documents
- Secure Firebase token verification in the FastAPI backend

### 📤 PDF Document Upload

- Upload PDF documents through the web interface
- PDF files are stored using Supabase Storage
- Document metadata is stored in Supabase PostgreSQL
- Automatic processing status tracking

### 🤖 AI-Powered Summarization

After uploading a PDF:

1. The PDF is sent to the FastAPI backend.
2. Text is extracted from the PDF using PyMuPDF.
3. Document statistics are calculated.
4. The extracted text is sent to Google Gemini.
5. Gemini generates a concise summary.
6. The summary and extracted text are stored in Supabase.

### 💬 Conversational AI Document Chat

Users can ask questions about their uploaded documents.

The chat supports:

- Questions about the selected document
- Follow-up questions
- Conversational context
- AI-generated answers
- Document-specific conversations
- Persistent chat history

The AI is instructed to answer using only the information contained in the selected document.

### 🕘 Chat History

Chat conversations are stored in Supabase.

Each conversation contains:

- User ID
- Document ID
- Question
- AI answer
- Creation timestamp

Users can:

- Load previous conversations
- Continue previous conversations
- Clear the chat history for a document

### 📊 Document Statistics

The platform calculates:

- Number of documents
- Number of pages
- Number of words
- Number of characters

### 🔎 Document Search

Users can search their uploaded documents by filename.

### ⭐ Favorite Documents

Users can mark documents as favorites and filter the dashboard to display only favorite documents.

### 🌙 Dark / Light Mode

The platform supports:

- Light mode
- Dark mode
- Theme persistence using browser local storage
- Smooth theme transitions

---

# 🛠️ Technologies Used

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Backend

- Python
- FastAPI
- PyMuPDF

## Database

- Supabase PostgreSQL

## File Storage

- Supabase Storage

## Authentication

- Firebase Authentication
- Firebase Admin SDK

## Artificial Intelligence

- Google Gemini API

## Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Python Virtual Environment

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │   Vite + Tailwind   │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   Firebase   │  │   Supabase   │  │   FastAPI    │
          │     Auth     │  │  Database &  │  │    Backend   │
          │              │  │   Storage    │  │              │
          └──────────────┘  └──────────────┘  └───────┬──────┘
                                                       │
                                                       ▼
                                               ┌──────────────┐
                                               │   PyMuPDF    │
                                               │ Text Extract │
                                               └───────┬──────┘
                                                       │
                                                       ▼
                                               ┌──────────────┐
                                               │ Google Gemini│
                                               │     API      │
                                               └──────────────┘
                                   

 🔄 Document Upload Workflow   
  User
 │
 ▼
Login with Google
 │
 ▼
Dashboard
 │
 ▼
Upload PDF
 │
 ▼
Supabase Storage
 │
 ▼
Save Document Metadata
 │
 ▼
FastAPI Backend
 │
 ▼
Extract PDF Text
 │
 ├───────────────┐
 │               │
 ▼               ▼
Statistics      Gemini
 │               │
 │               ▼
 │          AI Summary
 │               │
 └───────┬───────┘
         │
         ▼
     Supabase
         │
         ▼
  Display Results

💬 AI Chat Workflow
 User selects document
          │
          ▼
     Ask a question
          │
          ▼
    React Frontend
          │
          ▼
      FastAPI API
          │
          ├───────────────┐
          │               │
          ▼               ▼
   Document Text     Conversation
          │             History
          └───────┬───────┘
                  │
                  ▼
            Gemini API
                  │
                  ▼
            AI Response
                  │
          ┌───────┴───────┐
          ▼               ▼
    Display Answer   Save Chat
                         │
                         ▼
                  Supabase Database

📁 Project Structure
intelligent-document-platform/
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── UploadCard.jsx
│   │   │
│   │   ├── layout/
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DocumentDetails.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── firebase.js
│   │   │   └── supabase.js
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── services/
│   │   ├── gemini_service.py
│   │   └── pdf_service.py
│   │
│   ├── uploads/
│   ├── firebase_config.py
│   ├── main.py
│   └── requirements.txt
│
├── Screenshot/
│   └── images/
│
├── .gitignore
└── README.md

🗄️ Database Structure
The documents table stores information about uploaded PDFs.
documents
│
├── id
├── filename
├── filepath
├── filesize
├── uploaded_by
├── summary
├── document_text
├── pages
├── words
├── characters
├── processing_status
├── is_favorite
└── uploaded_at

💬 Chat History Table

The chat_history table stores conversations.

chat_history
│
├── id
├── document_id
├── user_id
├── question
├── answer
└── created_at

🔐 Authentication

Firebase Authentication is used for Google login.

The authentication flow is:

User
  │
  ▼
Google Login
  │
  ▼
Firebase Authentication
  │
  ▼
Firebase UID
  │
  ├──► Supabase documents
  │
  └──► Chat history

🤖 Gemini AI

Google Gemini is used for two main tasks.

1. Document Summarization

The extracted PDF text is sent to Gemini with instructions to generate a simple summary.

Example:

Summarize the following PDF document in simple bullet points.
2. Document Question Answering

For chat, the backend sends Gemini:

DOCUMENT:
<document text>

PREVIOUS CONVERSATION:
<conversation history>

CURRENT QUESTION:
<user question>

The AI is instructed to:

Use only information from the document
Use conversation history for follow-up questions
Avoid inventing information
Clearly state when information cannot be found 

📊 Dashboard

The dashboard provides an overview of the user's documents.

It displays:

Documents
Pages
Words
Characters

The statistics are calculated only from documents belonging to the currently authenticated user.

Users can also:

Search documents
Filter favorites
View document details
Upload new documents

⭐ Favorites

Documents can be marked as favorites.

Users can switch between:

📁 All Documents

and

⭐ Favorites

The dashboard filters documents based on the is_favorite field.

🌙 Dark / Light Mode

The application supports both themes.

🌙 Dark Mode
☀️ Light Mode

The selected theme is stored in:

localStorage

This allows the selected theme to remain after refreshing the page.

Tailwind CSS dark mode classes are used throughout the interface.

⚙️ Installation
1. Clone the Repository
git clone https://github.com/jaiwanthinir3-code/intelligent-document-platform.git

Move into the project:

cd intelligent-document-platform
🖥️ Frontend Setup

Go to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
🐍 Backend Setup

Open a new terminal.

Go to the backend directory:

cd backend

Create a Python virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn main:app --reload

The backend will normally run at:

http://127.0.0.1:8000
🔑 Environment Variables

Create a .env file in the frontend directory.

Example:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

Replace the placeholder values with your own credentials.

🔒 Security

Sensitive files are excluded from Git using .gitignore.

The following files should never be uploaded to GitHub:

.env
.env.*
backend/firebase-service-account.json

The Firebase service account contains private credentials and must remain local.

The repository contains:

backend/firebase_config.py

which loads the service account locally, but the actual service-account JSON file is excluded from Git.

🎯 Project Objective

The main objective of the Intelligent Document Platform is to make document management and understanding easier by combining:

Document Management
        +
PDF Text Extraction
        +
Artificial Intelligence
        +
Conversational Question Answering
        +
User Authentication

This allows users to upload documents and interact with their content naturally instead of manually searching through lengthy PDFs.

👩‍💻 Author
R. Jaiwanthini

Computer Science and Engineering
Rajalakshmi Engineering College
Chennai, Tamil Nadu, India