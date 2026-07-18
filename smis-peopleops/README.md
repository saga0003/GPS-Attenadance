# SMIS PeopleOps

Production-ready leave, comp-off, attendance, holiday, and employee-management system for St. Mary's institutions.

## Included

- Google Workspace sign-in restricted to verified `@smis.edu.in` accounts
- Permanent super admin: `sagar@smis.edu.in`
- Super admin, admin/approver, and employee roles
- Departments, new joiners, reporting managers, shifts, and employee status
- Leave policies, balances, half-days, approvals, cancellations, and audit history
- Comp-off earning, approval, expiry, balance, and leave-against-comp-off
- Holiday calendar and weekly-off configuration
- Attendance check-in/out, late arrival, work duration, overtime, and biometric CSV import
- Team leave calendar and pending-approval queues
- Excel workbook and print/PDF reports
- Responsive mobile/desktop UI and dark mode

## Run

```bash
npm install
npm run dev
```

The build bootstrap expands the checked-in source bundle before `next build`. The normal, extracted source archive is also supplied with the project handoff.

## Production environment

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-id
SESSION_SECRET=a-long-random-secret
DATABASE_URL=your-neon-or-postgres-url
ALLOWED_GOOGLE_DOMAIN=smis.edu.in
SUPER_ADMIN_EMAIL=sagar@smis.edu.in
```

Without these credentials the deployed application runs in demo mode with browser-local data, allowing the complete interface and workflows to be tested immediately.

## Biometric CSV format

```csv
employee_email,date,check_in,check_out,status
teacher@smis.edu.in,2026-07-18,08:42,16:55,present
```

Status values: `present`, `absent`, `half_day`, `on_leave`, `holiday`, `weekly_off`.
