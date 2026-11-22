# FixMate – Smart Device & Home Appliance Repair Platform

FixMate is a full-stack, role-based repair service booking platform. Verified technicians list repair services (smartphone, laptop, AC, refrigerator, TV, washing machine, electrical), customers send repair requests and track each job step by step, and they pay online **only after the job is completed**. Admins approve services, manage users, monitor every booking and track Stripe revenue.

- **Live site:** https://YOUR-CLIENT.vercel.app
- **Server API:** https://YOUR-SERVER.vercel.app
- **Client repo:** https://github.com/adnanzeros/YOUR-CLIENT-REPO
- **Server repo:** https://github.com/adnanzeros/YOUR-SERVER-REPO

## Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@fixmate.com | YOUR_SEED_PASSWORD |
| Technician | rafiq@fixmate.com | YOUR_SEED_PASSWORD |
| Technician | shumi@fixmate.com | YOUR_SEED_PASSWORD |
| Customer | nusrat@fixmate.com | YOUR_SEED_PASSWORD |
| Customer | tanvir@fixmate.com | YOUR_SEED_PASSWORD |

Stripe test card: `4242 4242 4242 4242`, any future expiry date, any CVC.

## Key features

- Role-based accounts (Customer / Technician / Admin) with BetterAuth + JWT
- Sign up with server-side role validation (nobody can register as admin)
- Browse approved services with **server-side** search, category / mode filters, sorting and pagination (MongoDB)
- Service details page and a role-restricted repair request form (duplicate active requests are blocked)
- Server-enforced job pipeline: Requested → Accepted → In Progress → Completed (or Rejected / Cancelled)
- Pay-after-service with Stripe Checkout (test mode), success-page verification and webhook, never saved twice
- Technician dashboard: add / edit / delete services, ImgBB image upload, availability toggle, manage requests
- Admin dashboard: approve / reject services, manage user roles, all bookings, transactions and total revenue
- Customer dashboard: bookings with cancel / Pay Now, payment history
- Dashboard stat cards and charts, status badges, job status history
- Custom loading, 404 and error pages, toasts, empty states and confirmation modals
- Fully responsive, collapsible dashboard sidebar

## Tech stack

**Client:** Next.js (App Router), React, BetterAuth, MongoDB driver, Sonner, Lucide React
**Server:** Node.js, Express 5, MongoDB, jose (JWT verification), Stripe, CORS, dotenv

## npm packages

Client: `next`, `react`, `react-dom`, `better-auth`, `mongodb`, `sonner`, `lucide-react`

Server: `express`, `cors`, `dotenv`, `mongodb`, `jose`, `stripe`

## Run locally

```bash
# client
cd fixmate
npm install
npm run dev

# server (new terminal)
cd fixmate-server
npm install
npm run dev
npm run seed   # once, while the client is running
```

### Client `.env.local`

```
MONGODB_URI=
MONGODB_DB=fixmate
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=
```

### Server `.env`

```
PORT=5000
MONGODB_URI=
MONGODB_DB=fixmate
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SEED_PASSWORD=
```

### Stripe webhook (local)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

For production, add `https://YOUR-SERVER.vercel.app/api/payments/webhook` in the Stripe Dashboard (test mode) and put its signing secret in the server `STRIPE_WEBHOOK_SECRET`.