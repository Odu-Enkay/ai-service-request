# AI Service Request Management

A full-stack app where users submit requests in plain English, AI handles categorization, and staff/admin manages through a dashboard.

## Features
- 🚀 Submit requests with just full name, email, description
- 🤖 AI auto-categorizes and prioritizes using Gemini
- 📧 Email notifications on status changes
- 🧑‍💼 Admin dashboard with AI-powered insights
- 🔗 Public tracking page (no login required)

## Tech Stack
- React + Tailwind
- Node.js + Express
- PostgreSQL
- Google Gemini API
- Nodemailer

## Environment Variables
The backend relies on a few environment variables. Create a `.env` file in `/backend` or configure your environment:

```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/service_requests
GMAIL_USER=yourgmailaddress@gmail.com
GMAIL_PASS=yourgmailpassword_or_app_specific_password
```

The `GMAIL_USER` and `GMAIL_PASS` variables are used by Nodemailer to send confirmation emails via Gmail. Use an [app password](https://support.google.com/accounts/answer/185833) if you have 2‑step verification enabled.


## Live Demo
[link to deployed app]

## Screenshots
[images will be here]