# The Star Academy

A frontend-only admin dashboard for managing an academy's groups and students: create groups, enroll students, track monthly subscriptions/payments, record attendance and grades, and send payment receipts and monthly reports straight to a parent's WhatsApp. There is no backend yet — all data lives in React state (seeded from mock data) and resets on page refresh; the API surface is shaped so it can be swapped for real network calls later without touching the UI.

## 1. Installation

```bash
npm install
```

## 2. Configuration

The admin login is a temporary, frontend-only gate (no backend/API call) checked against credentials from a local `.env` file:

```bash
VITE_ADMIN_USERNAME=your-username
VITE_ADMIN_PASSWORD=your-password
```

The logged-in state is persisted to `localStorage`, so a page refresh keeps the admin signed in until they log out.

## 3. Run project

```bash
npm run dev
```

```bash
npm run build      # Build the production copy inside the dist folder
npm run preview    # Preview the production version locally
npm run lint        # Run ESLint
```

### Login

The login form validates the entered username/password against `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` and, on success, takes you to `/dashboard`.

## 4. Folder Structure

```
src/
  components/
    AddStudentModal.jsx     # Add-student form (name, phone, parent phone, price, payment method)
    AttendanceModal.jsx     # Per-student subscriptions: attendance, quiz grades, final exam grade, notes
    ConfirmDialog.jsx       # Generic confirm-before-delete dialog
    GroupCard.jsx           # Group summary card (used in the Groups list)
    Header.jsx              # Top bar (admin name, logout)
    Modal.jsx               # Base modal shell
    ProtectedRoute.jsx      # Redirects to /login when not authenticated
    Sidebar.jsx             # Dashboard side navigation
    StatCard.jsx            # Overview stat tile
    StudentTable.jsx        # Students table inside a group's page

  context/
    AuthContext.jsx         # Frontend-only admin auth (see Configuration above)
    AcademyContext.jsx      # All academy data + actions (groups, students, subscriptions, records)

  data/
    mockData.js              # Seed data used to demonstrate the UI

  layouts/
    DashboardLayout.jsx      # Sidebar + header shell wrapping every /dashboard/* page

  pages/
    Home.jsx
    Login.jsx
    DashboardOverview.jsx
    CreateGroup.jsx
    Groups.jsx
    GroupDetails.jsx

  utils/
    whatsapp.js               # Builds wa.me links for payment receipts and monthly reports

  constants.js                 # Shared constants (attendance slot count, empty month-record shape)
  App.jsx
  main.jsx
  index.css
```

## 5. Routes

| The path                  | Page                      |
| ------------------------- | ------------------------- |
| `/`                       | Home                      |
| `/login`                  | Login                     |
| `/dashboard`              | Overview (requires login) |
| `/dashboard/create-group` | Create Group              |
| `/dashboard/groups`       | All Groups                |
| `/dashboard/groups/:id`   | Group Details             |

## 6. Core Features

- **Groups & students** — create groups, add/edit/delete students (name, phone, parent phone, monthly price).
- **Monthly subscriptions** — add a subscription with a start date (end date auto-computed 30 days later) and a payment method (Cash / InstaPay / Vodafone Cash).
- **Attendance & grades per subscription** — each subscription (one month) carries its own record set: attendance toggles, quiz grades, a final exam grade, and a free-text note. Records are edited as a draft and committed together via an explicit "Save" action.
- **WhatsApp integration** (`src/utils/whatsapp.js`) — one click opens a pre-filled WhatsApp message to the student's parent for:
  - a **payment receipt** (subscription price, period, payment method), and
  - a **monthly report** (subscription/payment history, attendance summary, quiz grades, final exam grade, and notes).
- **Dashboard overview** — total groups, total students, total monthly revenue, and a "most populated groups" breakdown.

## 7. Technical Notes

- The application's general orientation is RTL (`dir="rtl"`), and the side menu is always on the right side of the screen. The font used is **Tajawal** (loaded from Google Fonts) to best support the appearance of Arabic text. All in-app UI text is in Arabic; this README is in English.
- Icons: `lucide-react`; animations and transitions: `framer-motion`.
- Styling: Tailwind CSS. The brand `primary` color scale is defined in `tailwind.config.js` (currently an amber/orange ramp anchored at `primary-600 = #FFA617` and `primary-700 = #fd9a00`).
- All data logic (groups, students, subscriptions, attendance/grade records) is isolated in `src/context/AcademyContext.jsx`, making it easy to replace later with actual API calls without modifying the other components. Data is in-memory only — nothing is persisted to a server, and a page refresh resets it to the seed data in `src/data/mockData.js`.
- Admin authentication is a temporary, frontend-only check (see Configuration) — there is no real backend verification yet.
