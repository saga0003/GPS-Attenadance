# SMIS PeopleOps

A Vercel-ready leave, comp-off, attendance, holiday, and employee-management system for St. Mary's institutions.

## Included

- Google Workspace sign-in restricted to verified `@smis.edu.in` accounts
- Permanent super admin: `sagar@smis.edu.in`
- Super admin, admin/approver, and employee roles
- Departments, new joiners, approver assignment, and employee status
- Leave policies, balances, half-days, approvals, rejections, cancellations, and history
- Comp-off credit, balance, and leave-against-comp-off
- Holiday calendar and weekly-off configuration
- Attendance check-in/out, late tracking, work duration, and attendance register
- Pending-approval queues and team visibility
- Multi-sheet Excel workbooks and print-to-PDF reports
- Audit log for important changes
- Responsive desktop and mobile interface

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
```

## Production environment

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-id
ALLOWED_GOOGLE_DOMAIN=smis.edu.in
SUPER_ADMIN_EMAIL=sagar@smis.edu.in
```

The production deployment currently opens in an interactive demo workspace so every workflow can be reviewed without credentials. Configure the Google variables above to activate verified Workspace login. Add a managed Postgres/Neon database when the system is moved from demo records to shared institutional data.

## Google OAuth

Create a Web OAuth client in the SMIS Google Cloud project and add the live Vercel domain to the authorised JavaScript origins. The server route validates the Google ID token, verified-email flag, hosted-domain claim, and exact email suffix before returning an application role.

## Deployment

The application is designed for Next.js deployment on Vercel. Set the project root to `smis-peopleops` when deploying this repository branch.

Live production application: https://hr-leave-tracking.vercel.app
