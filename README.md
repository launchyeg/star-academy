# Star Academy Dashboard

Des

## 1. installation

```bash
npm install
```

## 2. run project

```bash
npm run dev
```

```bash
npm run build      # Build the production copy inside the dist folder
npm run preview    # Preview the production version locally
```

### Login (Mock)

The login page accepts any non-blank username and password (there is currently no real verification), and takes you directly to `/dashboard`.

## 3. Folder Structure

```
src/
  components/
  ...

  context/
    AuthContext.jsx
    AcademyContext.jsx

  data/
    mockData.js

  layouts/
    DashboardLayout.jsx

  pages/
    Home.jsx
    Login.jsx
    DashboardOverview.jsx
    CreateGroup.jsx
    Groups.jsx
    GroupDetails.jsx

  App.jsx
  main.jsx
  index.css
```

## 4. Routes

| The path                  | Page                      |
| ------------------------- | ------------------------- |
| `/`                       | Home                      |
| `/login`                  | Login                     |
| `/dashboard`              | Overview (requires login) |
| `/dashboard/create-group` | Create Group              |
| `/dashboard/groups`       | All Groups                |
| `/dashboard/groups/:id`   | Group Details             |

## 5. ملاحظات تقنية

- The application's general orientation is RTL (`dir="rtl"`), and the side menu is always on the right side of the screen. - The font used is **Tajawal** (loaded from Google Fonts) to best support the appearance of Arabic text.

- Icons: `lucide-react`, animations and transitions: `framer-motion`.

- All data logic (adding a group, adding/editing/deleting a student) is isolated in `src/context/AcademyContext.jsx`, making it easy to replace later with actual API calls without modifying the other components.
