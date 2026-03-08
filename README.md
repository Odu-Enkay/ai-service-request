# AI-Powered Service Request System

An intelligent full-stack application that uses AI to automatically categorize, prioritize, and respond to customer support requests. Users submit requests in plain English, and Google Gemini AI handles intelligent classification while admins manage everything through a modern dashboard.

## 🎯 Test It Live in 2 Minutes

| Page | URL | What You Can Do |
|------|-----|-----------------|
| 📝 **Submit a Request** | [https://ai-service-request.vercel.app/](https://ai-service-request.vercel.app/) | Test the user form – submit a request and get email confirmation |
| 👤 **Track Your Request** | [https://ai-service-request.vercel.app/track](https://ai-service-request.vercel.app/track) | Enter your tracking ID to see real-time status |
| 👑 **Admin Registration** | [https://ai-service-request.vercel.app/admin/register](https://ai-service-request.vercel.app/admin/register) | Create the first admin account (one-time setup) |
| 🔐 **Admin Login** | [https://ai-service-request.vercel.app/admin/login](https://ai-service-request.vercel.app/admin/login) | Access the admin dashboard |
| 📊 **Admin Dashboard** | [https://ai-service-request.vercel.app/admin/dashboard](https://ai-service-request.vercel.app/admin/dashboard) | View/manage requests with AI insights (after login) |

### 📋 Quick Test Flow

1. **Submit a request** using the form above (use your real email)
2. **Check your inbox** for confirmation email with tracking ID
3. **Track your request** using the tracking page
4. **Create an admin account** (first time only)
5. **Login to dashboard** – see AI categorization in action
6. **Change request status** – watch status update emails arrive


**Live Demo:** [click to view live demo](https://drive.google.com/file/d/1A9uUg-22CdmD7rofMMIOqGxn8Pa5vpIK/view?usp=drive_link)  


---

## ✨ Features

### For Users
- 📝 **Simple Request Submission** – Submit support requests with just your name, email, and description
- 📧 **Instant Confirmation Email** – Receive confirmation with your unique tracking ID via Resend
- 🔍 **Public Request Tracking** – Check your request status anytime without authentication using your tracking ID
- ⏱️ **Real-time Updates** – Get notified via email when your request status changes

### For Admins
- 🤖 **AI-Powered Categorization** – Requests are automatically classified as: IT, Billing, Bug, Feature Request, or Other
- ⚡ **Smart Priority Detection** – AI assigns priority levels (High, Medium, Low) based on urgency cues in the description
- 📋 **AI-Generated Summaries** – One-sentence summaries created automatically for quick scanning
- 💬 **Draft Responses** – AI generates empathetic first responses to help admins reply faster
- 🔐 **Secure Admin Dashboard** – JWT-authenticated access with email/password login
- 📊 **Request Management** – View all requests with color-coded priority badges and AI insights
- 👤 **First-Time Setup** – One-command admin registration on first deployment

---


## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-06B6D4?logo=tailwindcss&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000)

**Frontend:** React 18 + Vite + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** PostgreSQL  
**AI:** Google Generative AI (Gemini 2.5 Flash)  
**Email:** Resend  
**Authentication:** JWT  
**Deployment:** Vercel (frontend) + Render (backend)

---

## 📸 Screenshots

### Request Form
![Request Form](docs/images/userpage.png)
Users can submit requests with a simple, intuitive form. The form validates input and provides instant feedback.

### Admin Dashboard
![Admin Dashboard](docs/images/admin-dasboard.png)
Admins see all requests with AI-generated categories, priorities, summaries, and draft responses. Color-coded badges make it easy to spot high-priority issues at a glance.

### Public Tracking Page
![Tracking Page](docs/images/service tracking-page.png)
Users can check their request status anytime by entering their tracking ID – no login required.

### Email Confirmation
![Email Example](docs/images/email-notification.png)
Users receive a professional confirmation email with their tracking ID and request summary immediately after submission.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Google Gemini API key
- Resend API key

### Local Development Setup

#### 1. Clone and Install

```bash
git clone https://github.com/yourusername/ai-service-request.git
cd ai-service-request

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure Environment Variables

**Backend (`backend/.env`)**
```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/service_requests
GEMINI_API_KEY=your_google_gemini_api_key
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_secret_key_here_min_32_chars
```

**Frontend (`frontend/.env.local`)**
```env
VITE_API_URL=http://localhost:3000/api
```

#### 3. Initialize the Database

```bash
# Create PostgreSQL database
createdb service_requests

# Run schema to create tables
psql service_requests -f backend/db/schema.sql
```

#### 4. Create First Admin

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"securepassword"}'
```

#### 5. Start Development Servers

```bash
# Terminal 1: Backend (runs on port 3000)
cd backend
npm run dev

# Terminal 2: Frontend (runs on port 5173)
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

### Public Routes
- `POST /api/requests` – Submit a new support request
- `GET /api/requests/track/:requestNumber` – Track request status

### Admin Routes (Requires JWT)
- `POST /api/admin/setup` – Create first admin account
- `POST /api/admin/login` – Admin login
- `GET /api/admin/verify` – Verify admin session
- `GET /api/admin/requests` – Get all requests with AI data
- `PATCH /api/admin/requests/:id/status` – Update request status

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Push to GitHub; Vercel auto-deploys main branch
```

**Environment Variables on Vercel:**
```
VITE_API_URL=https://ai-service-request.onrender.com/api
```

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `GEMINI_API_KEY` (Google Gemini API key)
   - `RESEND_API_KEY` (Resend email API key)
   - `JWT_SECRET` (random secure string)
5. Run migrations: `psql $DATABASE_URL -f backend/db/schema.sql`
6. Deploy and test

---

## 🔑 Key Features Explained

### AI Categorization
Google Gemini 2.5 Flash analyzes request text and classifies it into one of five categories. The AI considers:
- **IT** – Technical issues (computers, email, software, network)
- **Billing** – Payments, invoices, charges, refunds
- **Bug** – Broken features, errors, crashes
- **Feature Request** – Enhancement suggestions
- **Other** – Miscellaneous issues

### Smart Priority Detection
The AI reads urgency cues in the description (e.g., "urgent," "ASAP," "blocking workflow") to assign priority levels that help admins triage effectively.

### AI Draft Responses
Admins get pre-written, empathetic first responses from the AI, saving time while ensuring professional communication. Admins can edit before sending.

### Email Notifications
Built on Resend for reliable delivery:
- **User confirmation** immediately after submission
- **Status updates** when admins change request status
- **Tracking links** so users can check progress anytime

---

## 📝 Code Standards

### Frontend
- Functional components with React hooks
- Components in `src/components/`
- API calls in `src/services/api.js`
- Tailwind CSS for styling

### Backend
- Routes in `backend/routes/`
- Database queries in `backend/db/`
- Business logic in `backend/services/`
- Async/await for all async operations
- Proper error handling with try/catch

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Submit a request with various descriptions (IT, Billing, Bug, etc.)
- [ ] Verify AI categorization in admin dashboard
- [ ] Check email confirmation arrives
- [ ] Update request status and confirm status email sent
- [ ] Use tracking page to view request status
- [ ] Admin login/logout flows work
- [ ] No console errors in browser or server logs

### Example Test Descriptions
```
"My laptop won't turn on and I have a client presentation in 2 hours"  → High priority IT
"Can you add dark mode to the dashboard?"  → Feature Request
"I was charged twice on my last invoice"  → Billing, High priority
"The upload button doesn't work"  → Bug
```
---

## 🎯 Future Enhancements

- [ ] Advanced filtering and search on admin dashboard
- [ ] Request history and analytics
- [ ] Custom AI categorization rules per account
- [ ] Slack integration for notifications
- [ ] Mobile app for request tracking
- [ ] Auto-response system triggered by AI priority

---

## 🙏 Acknowledgments

- **Google Gemini AI** – For intelligent request categorization
- **Resend** – For reliable email delivery
- **Render & Vercel** – For seamless deployment
- **React, Node.js, PostgreSQL** – The awesome open-source stack

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built by [Nkiruka Odu](https://github.com/Odu-Enkay/ai-service-request)

**Questions or feedback?** Feel free to open an issue or reach out!

---

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!