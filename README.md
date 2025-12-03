# 🧑‍💼 Job Search App – Backend API  
A clean and scalable backend API for managing companies, job posts, HR accounts, and job applications.  
Built using **Node.js**, **Express**, **MongoDB**, **Mongoose**, and follows clean architecture + modular routing.

---

## 🚀 Features

### 👥 Company Management
- Create company profile  
- Update company details  
- Soft delete company  
- List companies  
- Handle HR accounts under each company  

### 💼 Job Management
- Create job under company  
- Update job details  
- Delete job  
- List jobs by company  
- Filter jobs  

### 🛡️ Authentication
- JWT-based auth  
- Role-based access (Company → HR → Job Posters)  
- Request validation using custom validation layers  

### ⚙️ Utilities
- Global error handling  
- Async error wrapper  
- Proper routing structure  
- Reusable validation schemas  
- Status codes standardization  

---

## 📁 Project Structure

```
Job-Search-App/
│── src/
│   ├── modules/
│   │   ├── company/
│   │   │   ├── company.controller.js
│   │   │   ├── company.routes.js
│   │   │   ├── company.validation.js
│   │   │   └── company.service.js
│   │   ├── job/
│   │   │   ├── job.controller.js
│   │   │   ├── job.routes.js
│   │   │   └── job.validation.js
│   │   └── auth/
│   │       ├── auth.controller.js
│   │       ├── auth.routes.js
│   │       └── auth.service.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── asyncErrorHandler.js
│   └── utils/
│       └── generalValidation.js
│
│── config/
│── package.json
│── README.md
```

---

## 🧪 API Examples

### 📌 Create Company
`POST /company`

```json
{
  "companyName": "Tech Solutions",
  "description": "Software company",
  "companyEmail": "info@tech.com",
  "numberOfEmployees": 120,
  "industry": "IT",
  "address": {
    "city": "Cairo",
    "street": "Nasr City"
  }
}
```

---

### 📌 Create Job
`POST /company/:companyId/jobs`

```json
{
  "jobTitle": "Backend Developer",
  "jobLocation": "Remote",
  "workingTime": "Full-time",
  "seniorityLevel": "Junior",
  "jobDescription": "Building REST APIs",
  "technicalSkills": ["Node.js", "Express", "MongoDB"],
  "softSkills": ["Teamwork", "Communication"]
}
```

---

## 🔑 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🛠️ Installation & Running

```bash
git clone https://github.com/almahdy-byte/Job-Search-App
cd Job-Search-App
npm install
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## ⚙️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run the project with nodemon |
| `npm start` | Run production build |

---

## 🧹 Error Handling

The project uses a global error handler + async wrapper:

```js
export const asyncErrorHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
```

---

## 🤝 Contributing

1. Fork the repo  
2. Make your changes  
3. Create pull request  

---

## 📄 License

This project is licensed under **MIT License**.

---

# ✨ Made by Almahdy (Backend – Node.js)
