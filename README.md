# Job-Search-App
# 💼 Job Search App - Backend (Node.js & Express)

This is the backend service for a **Job Search Application** that connects **job seekers**, **HR professionals**, and **administrators** through a secure and scalable REST & GraphQL API.

---

## 🛠️ Technologies Used

- **Node.js**  
- **Express.js**  
- **MongoDB** + **Mongoose**  
- **GraphQL**  
- **Socket.io**  
- **Cloudinary** + **Multer** (File Uploads)  
- **Bcrypt** & **Crypto** (Password Security)  
- **Nodemailer** (Emailing)  
- **JWT** (Authentication)  
- **Google OAuth** (Social Login)  
- **Pagination**  
- **Rate Limiter**, **Helmet**, **CORS** (Security Enhancements)

---

## 🌟 Features

### 👨‍💼 Job Seekers
- Browse available job listings
- Apply to jobs with uploaded CVs
- Chat with HRs in real-time

### 🧑‍💼 HRs
- Create and manage job postings
- View applicants and their CVs
- Start conversations with candidates

### 👮 Admin Panel
- Manage all users and job listings
- Monitor system usage and security

---

## 🔐 Security & Authentication

- Passwords are securely hashed using **Bcrypt**
- **JWT** for session and token-based authentication
- **Google OAuth** for seamless login
- API protected using **Rate Limiter**, **Helmet**, and **CORS**

---

## 📤 File & Media Uploads

- File uploads (e.g., CVs) handled using **Multer**
- Files stored securely in the cloud with **Cloudinary**

---

## 🚀 API Access

- RESTful API endpoints for core functionality
- **GraphQL** support for flexible and optimized data fetching
- **Pagination** included for efficient listing performance

---

## 📬 Realtime Chat

- **Socket.io** enables real-time messaging between HRs and job seekers

---

## 🧪 Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/job-search-backend.git

# 2. Install dependencies
cd job-search-backend
npm install

# 3. Create a .env file based on .env.example
# Server
PORT=3000

# Database
DB_URI=mongodb://localhost:27017/jobSearchApp

# Hashing & Encryption
HASH_ROUNDS=8
ENCRYPTION_KEY=your_encryption_key_here

# JWT Token Signatures
ADMIN_ACCESS_TOKEN=your_admin_access_token_secret
ADMIN_REFRESH_TOKEN=your_admin_refresh_token_secret

USER_ACCESS_TOKEN=your_user_access_token_secret
USER_REFRESH_TOKEN=your_user_refresh_token_secret

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google OAuth
CLIENT_ID=your_google_oauth_client_id

# Email Credentials (for sending emails)
EMAIL=your_email@example.com
PASSWORD=your_email_app_password


# 4. Start the development server
npm run dev
