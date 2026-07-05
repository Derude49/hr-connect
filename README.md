# HR Connect

**HR Connect** is a modern HR management dashboard built with Next.js.

It helps HR teams and people managers centralize employee operations by providing:

- employee directory and profile management
- onboarding workflow support
- attendance tracking and dashboard visibility
- leave application and approval flows
- payroll summary and status tracking
- performance goals, reviews, and feedback management

The app is designed as a workplace HR portal that connects employee data, approvals, and reporting in a single UI.

## Project structure

- `app/`
  - `page.tsx` — public landing or entry page
  - `register/page.tsx` — user registration page
  - `(dashboardlayout)/` — protected dashboard layout and nested app pages
    - `dashboard/page.tsx` — main dashboard overview
    - `attendance/page.tsx` — attendance tracking
    - `employees/page.tsx` — employee list page
    - `employees/[id]/page.tsx` — employee detail page
    - `employees/[id]/edit/page.tsx` — edit employee profile
    - `employees/onboarding/page.tsx` — onboarding management
    - `leave/page.tsx` — leave management overview
    - `leave/apply/page.tsx` — leave application flow
    - `payroll/page.tsx` — payroll summary
    - `performance/page.tsx` — performance dashboard
    - `performance/goals/page.tsx` — goals tracking
    - `performance/review/page.tsx` — performance review page
    - `performance/reviews/page.tsx` — reviews list
    - `settings/page.tsx` — application settings
- `components/` — reusable UI components and layout helpers
- `components/ui/` — shared UI primitives like buttons, cards, dialogs, inputs, labels, selects, and badges
- `lib/` — app utilities, mock stores, and local storage helpers
- `public/` — static assets used by the application

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — build the production app
- `npm run start` — start the production server after build
- `npm run lint` — run ESLint

## Dependencies

Key dependencies in this project:

- `next` — Next.js application framework
- `react` / `react-dom` — React library
- `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot` — accessible UI primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` — styling utilities
- `lucide-react` — icon components

## Notes

- This project uses the Next.js App Router.
- UI components are organized under `components/` and `components/ui/`.
- The dashboard pages are nested under `(dashboardlayout)` to reuse a shared layout.

## Learn more

For Next.js documentation, visit https://nextjs.org/docs.
