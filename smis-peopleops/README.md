# SMIS PeopleOps

Leave, comp-off credit, holiday, employee-login and department-head approval management for St. Mary's Institutions.

## Included

- Manual username/password login; Google login removed
- Permanent Super Admin: `sagar@smis.edu.in`
- Add or update employee accounts manually
- Bulk employee/login import through CSV
- Dynamic department heads: assigning a department head automatically gives that employee Admin approval rights
- Leave requests routed to the employee's department head
- Dedicated comp-off workflow:
  1. Employee submits a request for work completed on a holiday, weekly off or special-duty day
  2. Department head approves or rejects the credit
  3. Approved 0.5-day or 1-day credit is added to the employee's comp-off balance
  4. Employee applies for Compensatory Off leave against the available balance
- Add, update, deactivate or delete leave policies
- Bulk leave-policy import through CSV
- Add/delete holidays and bulk holiday import through CSV
- Multi-sheet Excel exports and print/save-as-PDF reports
- Complete audit history
- Attendance check-in/check-out removed

## Demo logins

```text
sagar / Sagar@123
principal / Admin@123
teacher / Employee@123
```

The public Vercel build currently uses browser-local demo data. The complete source archive supplied with the project includes the backend-ready Postgres/manual-auth edition.

## CSV formats

### Employee and login import

```csv
employee_code,name,email,username,password,department_code,designation,role,active
SMIS100,Sample Employee,sample@smis.edu.in,sample.user,ChangeMe@123,ACAD,Faculty,employee,true
```

### Leave-policy import

```csv
code,name,annual_allowance,paid,active
CL,Casual Leave,12,true,true
```

### Holiday import

```csv
date,name,type,department_codes
2026-08-15,Independence Day,National,
2026-09-05,Teachers Day,Institution,ACAD
```

## Local validation

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Deployment

Set the Vercel project root to `smis-peopleops`.

Live application: https://hr-leave-tracking.vercel.app
