# Personal Finance Dashboard Backend

Production-ready Node.js + Express backend API for Personal Finance Dashboard, following strict MVC architecture.

## Architecture

This backend serves as the intermediary layer between the React frontend and Supabase PostgreSQL database:

```
React Frontend (Netlify)
        ↓ Axios
Node + Express Backend (Render)
        ↓ Supabase Client
Supabase PostgreSQL Database
```

The frontend never communicates directly with Supabase. All database operations, authentication, and business logic are handled by this backend server.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT (Manual implementation)
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **CORS**: cors
- **UUID**: uuid

## Project Structure

```
backend/
│
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── transaction.controller.js
│   ├── budget.controller.js
│   ├── goal.controller.js
│   ├── bill.controller.js
│   ├── debt.controller.js
│   ├── investment.controller.js
│   └── analytics.controller.js
│
├── services/            # Business logic & database operations
│   ├── auth.service.js
│   ├── transaction.service.js
│   ├── budget.service.js
│   ├── goal.service.js
│   ├── bill.service.js
│   ├── debt.service.js
│   ├── investment.service.js
│   └── analytics.service.js
│
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── transaction.routes.js
│   ├── budget.routes.js
│   ├── goal.routes.js
│   ├── bill.routes.js
│   ├── debt.routes.js
│   ├── investment.routes.js
│   └── analytics.routes.js
│
├── middleware/          # Express middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── config/              # Configuration
│   └── supabaseClient.js
│
├── utils/               # Helper utilities
│   ├── jwt.js
│   └── asyncHandler.js
│
├── app.js              # Express app setup
├── server.js           # Server entry point
├── package.json        # Dependencies
└── .env.example        # Environment variables template
```

## MVC Architecture

The backend follows strict separation of concerns:

**Routes → Controllers → Services → Database**

- **Routes**: Define API endpoints and map them to controllers
- **Controllers**: Handle HTTP requests/responses, validate input, call services
- **Services**: Contain business logic and interact with Supabase
- **Middleware**: Handle authentication, error handling, and request processing

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:3000
```

### Where to Find Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `SUPABASE_URL`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint           | Description      | Auth Required |
|--------|--------------------|------------------|---------------|
| POST   | /api/auth/register | Register user    | No            |
| POST   | /api/auth/login    | Login user       | No            |
| GET    | /api/auth/me       | Get current user | Yes           |
| POST   | /api/auth/logout   | Logout user      | Yes           |

### Transactions

| Method | Endpoint                | Description             | Auth Required |
|--------|-------------------------|-------------------------|---------------|
| GET    | /api/transactions       | Get all transactions    | Yes           |
| POST   | /api/transactions       | Create transaction      | Yes           |
| GET    | /api/transactions/:id   | Get single transaction  | Yes           |
| PUT    | /api/transactions/:id   | Update transaction      | Yes           |
| DELETE | /api/transactions/:id   | Delete transaction      | Yes           |

**Query Filters**: `?month=2024-01&type=income&category=Salary`

### Budgets

| Method | Endpoint          | Description        | Auth Required |
|--------|-------------------|--------------------|---------------|
| GET    | /api/budgets      | Get all budgets    | Yes           |
| POST   | /api/budgets      | Create budget      | Yes           |
| PUT    | /api/budgets/:id  | Update budget      | Yes           |
| DELETE | /api/budgets/:id  | Delete budget      | Yes           |

### Goals

| Method | Endpoint             | Description      | Auth Required |
|--------|----------------------|------------------|---------------|
| GET    | /api/goals           | Get all goals    | Yes           |
| POST   | /api/goals           | Create goal      | Yes           |
| PUT    | /api/goals/:id       | Update goal      | Yes           |
| DELETE | /api/goals/:id       | Delete goal      | Yes           |
| PATCH  | /api/goals/:id/save  | Add to goal      | Yes           |

### Bills

| Method | Endpoint            | Description       | Auth Required |
|--------|---------------------|-------------------|---------------|
| GET    | /api/bills          | Get all bills     | Yes           |
| POST   | /api/bills          | Create bill       | Yes           |
| PUT    | /api/bills/:id      | Update bill       | Yes           |
| DELETE | /api/bills/:id      | Delete bill       | Yes           |
| PATCH  | /api/bills/:id/pay  | Mark bill as paid | Yes           |

### Debts

| Method | Endpoint         | Description      | Auth Required |
|--------|------------------|------------------|---------------|
| GET    | /api/debts       | Get all debts    | Yes           |
| POST   | /api/debts       | Create debt      | Yes           |
| PUT    | /api/debts/:id   | Update debt      | Yes           |
| DELETE | /api/debts/:id   | Delete debt      | Yes           |

### Investments

| Method | Endpoint              | Description           | Auth Required |
|--------|-----------------------|-----------------------|---------------|
| GET    | /api/investments      | Get all investments   | Yes           |
| POST   | /api/investments      | Create investment     | Yes           |
| PUT    | /api/investments/:id  | Update investment     | Yes           |
| DELETE | /api/investments/:id  | Delete investment     | Yes           |

### Analytics

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| GET    | /api/analytics/dashboard  | Get dashboard analytics  | Yes           |
| GET    | /api/analytics/summary    | Get overall summary      | Yes           |
| GET    | /api/analytics/monthly    | Get monthly summary      | Yes           |
| GET    | /api/analytics/categories | Get category breakdown   | Yes           |
| GET    | /api/analytics/yearly     | Get yearly analytics     | Yes           |

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

The API uses JWT Bearer token authentication.

**Login to get token**:

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Include token in requests**:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

The backend expects the following Supabase tables:

### users
- id (uuid, primary key)
- email (text, unique)
- password (text, hashed)
- name (text)
- created_at (timestamp)

### transactions
- id (uuid, primary key)
- user_id (uuid, foreign key)
- type (text: 'income' or 'expense')
- category (text)
- amount (numeric)
- description (text)
- date (date)
- created_at (timestamp)

### budgets
- id (uuid, primary key)
- user_id (uuid, foreign key)
- category (text)
- amount (numeric)
- period (text)
- created_at (timestamp)

### goals
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- target_amount (numeric)
- current_amount (numeric)
- target_date (date)
- created_at (timestamp)

### bills
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- amount (numeric)
- due_date (date)
- is_paid (boolean)
- created_at (timestamp)

### debts
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- amount (numeric)
- interest_rate (numeric)
- created_at (timestamp)

### investments
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- type (text)
- amount (numeric)
- current_value (numeric)
- created_at (timestamp)

## Deployment to Render

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: backend-finance-dashboard
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

### Step 3: Add Environment Variables

In Render dashboard, add:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `CLIENT_URL` (your frontend URL)
- `NODE_ENV=production`

### Step 4: Deploy

Click **Create Web Service**. Render will automatically deploy.

Your backend will be available at: `https://your-app-name.onrender.com`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with auth middleware
- User-specific data filtering
- Environment variable configuration
- CORS protection
- Error handling middleware

## Development

### Adding New Features

1. Create service in `services/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Import routes in `app.js`

### Code Style

- ES Modules (import/export)
- Async/await only
- No callbacks
- Modular file structure
- Clean separation of concerns

## Error Handling

All async operations use `asyncHandler` wrapper and are processed by central error handling middleware.

## Testing API

Use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code)

## Support

For issues or questions, create an issue in the repository.

## License

MIT
