'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck, Building2, CalendarDays, Check, ChevronRight, Clock3,
  Download, FileText, Fingerprint, LayoutDashboard, LogOut, Plus,
  Settings, ShieldCheck, Users, X
} from 'lucide-react';
import * as XLSX from 'xlsx';

type Role = 'super_admin' | 'admin' | 'employee';
type User = { name: string; email: string; role: Role; department: string };
type Leave = { id: number; employee: string; email: string; type: string; from: string; to: string; days: number; reason: string; status: 'Pending' | 'Approved' | 'Rejected'; approver: string };
type Attendance = { id: number; employee: string; date: string; checkIn: string; checkOut: string; status: string };
type Employee = { id: number; name: string; email: string; department: string; role: Role; joined: string; active: boolean };
type Holiday = { id: number; name: string; date: string; type: string };
type Audit = { id: number; at: string; actor: string; action: string };

declare global { interface Window { google?: { accounts: { id: { initialize: (x: object) => void; renderButton: (el: HTMLElement, x: object) => void } } } } }

const TODAY = new Date().toISOString().slice(0, 10);
const users: User[] = [
  { name: 'Sagar', email: 'sagar@smis.edu.in', role: 'super_admin', department: 'Management' },
  { name: 'Academic Approver', email: 'principal@smis.edu.in', role: 'admin', department: 'Academics' },
  { name: 'Ananya Rao', email: 'teacher@smis.edu.in', role: 'employee', department: 'Academics' },
];
const seedEmployees: Employee[] = [
  { id: 1, name: 'Sagar', email: 'sagar@smis.edu.in', department: 'Management', role: 'super_admin', joined: '2025-01-01', active: true },
  { id: 2, name: 'Academic Approver', email: 'principal@smis.edu.in', department: 'Academics', role: 'admin', joined: '2025-04-01', active: true },
  { id: 3, name: 'Ananya Rao', email: 'teacher@smis.edu.in', department: 'Academics', role: 'employee', joined: '2025-06-12', active: true },
  { id: 4, name: 'Rahul N', email: 'rahul@smis.edu.in', department: 'Admissions', role: 'employee', joined: '2026-02-03', active: true },
];
const seedLeaves: Leave[] = [
  { id: 1, employee: 'Ananya Rao', email: 'teacher@smis.edu.in', type: 'Casual Leave', from: '2026-07-21', to: '2026-07-22', days: 2, reason: 'Family function', status: 'Pending', approver: 'Academic Approver' },
  { id: 2, employee: 'Rahul N', email: 'rahul@smis.edu.in', type: 'Comp Off', from: '2026-07-19', to: '2026-07-19', days: 1, reason: 'Weekend admission duty', status: 'Approved', approver: 'Sagar' },
];
const seedAttendance: Attendance[] = [
  { id: 1, employee: 'Ananya Rao', date: TODAY, checkIn: '08:44', checkOut: '', status: 'Present' },
  { id: 2, employee: 'Rahul N', date: TODAY, checkIn: '09:05', checkOut: '', status: 'Late' },
];
const seedHolidays: Holiday[] = [
  { id: 1, name: 'Independence Day', date: '2026-08-15', type: 'National' },
  { id: 2, name: 'Gandhi Jayanti', date: '2026-10-02', type: 'National' },
];

const nav = [
  ['dashboard', 'Overview', LayoutDashboard], ['leaves', 'Leave management', CalendarDays],
  ['attendance', 'Attendance', Fingerprint], ['people', 'People', Users],
  ['setup', 'Policies & holidays', Settings], ['reports', 'Reports', FileText],
] as const;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [leaves, setLeaves] = useState<Leave[]>(seedLeaves);
  const [attendance, setAttendance] = useState<Attendance[]>(seedAttendance);
  const [holidays, setHolidays] = useState<Holiday[]>(seedHolidays);
  const [departments, setDepartments] = useState(['Management', 'Academics', 'Admissions', 'Accounts', 'Operations']);
  const [audit, setAudit] = useState<Audit[]>([{ id: 1, at: new Date().toLocaleString(), actor: 'System', action: 'Demo workspace prepared' }]);
  const googleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('smis-peopleops');
    if (raw) try {
      const d = JSON.parse(raw);
      setEmployees(d.employees || seedEmployees); setLeaves(d.leaves || seedLeaves);
      setAttendance(d.attendance || seedAttendance); setHolidays(d.holidays || seedHolidays);
      setDepartments(d.departments || departments); setAudit(d.audit || audit);
    } catch { /* keep seed */ }
  }, []);
  useEffect(() => {
    localStorage.setItem('smis-peopleops', JSON.stringify({ employees, leaves, attendance, holidays, departments, audit }));
  }, [employees, leaves, attendance, holidays, departments, audit]);
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || user) return;
    const start = () => window.google?.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }: { credential: string }) => {
      const r = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
      const d = await r.json(); if (d.user) setUser({ ...d.user, department: 'Unassigned' }); else alert(d.error);
    } });
    const render = () => { start(); if (googleRef.current && window.google) window.google.accounts.id.renderButton(googleRef.current, { theme: 'outline', size: 'large', width: 330 }); };
    if (window.google) render(); else { const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = render; document.head.appendChild(s); }
  }, [user]);

  const canApprove = user?.role !== 'employee';
  const isSuper = user?.role === 'super_admin';
  const ownLeaves = user?.role === 'employee' ? leaves.filter(l => l.email === user.email) : leaves;
  const pending = leaves.filter(l => l.status === 'Pending').length;
  const present = attendance.filter(a => a.date === TODAY && ['Present', 'Late'].includes(a.status)).length;
  const compUsed = leaves.filter(l => l.email === user?.email && l.type === 'Comp Off' && l.status === 'Approved').reduce((n, l) => n + l.days, 0);
  const balances = useMemo(() => ({ Casual: 12 - ownLeaves.filter(l => l.type === 'Casual Leave' && l.status === 'Approved').reduce((n,l)=>n+l.days,0), Sick: 10, Earned: 15, Comp: Math.max(0, 3 - compUsed) }), [ownLeaves, compUsed]);

  const log = (action: string) => setAudit(v => [{ id: Date.now(), at: new Date().toLocaleString(), actor: user?.email || 'System', action }, ...v]);
  const decide = (id: number, status: 'Approved' | 'Rejected') => { setLeaves(v => v.map(l => l.id === id ? { ...l, status, approver: user?.name || '' } : l)); log(`${status} leave request #${id}`); };
  const applyLeave = (form: FormData) => {
    if (!user) return; const from = String(form.get('from')); const to = String(form.get('to'));
    const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
    const type = String(form.get('type')); if (type === 'Comp Off' && days > balances.Comp) return alert('Insufficient comp-off balance.');
    setLeaves(v => [{ id: Date.now(), employee: user.name, email: user.email, type, from, to, days, reason: String(form.get('reason')), status: 'Pending', approver: 'Department approver' }, ...v]);
    log(`Applied ${days} day(s) of ${type}`); setTab('leaves');
  };
  const check = () => {
    if (!user) return; const row = attendance.find(a => a.employee === user.name && a.date === TODAY);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (row && !row.checkOut) { setAttendance(v => v.map(a => a.id === row.id ? { ...a, checkOut: time } : a)); log('Checked out'); }
    else if (!row) { setAttendance(v => [{ id: Date.now(), employee: user.name, date: TODAY, checkIn: time, checkOut: '', status: time > '09:00' ? 'Late' : 'Present' }, ...v]); log('Checked in'); }
  };
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leaves), 'Leaves');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(attendance), 'Attendance');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employees), 'Employees');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(holidays), 'Holidays');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(audit), 'Audit');
    XLSX.writeFile(wb, `SMIS-PeopleOps-${TODAY}.xlsx`); log('Exported management workbook');
  };

  if (!user) return <main className="login">
    <section className="loginHero">
      <div className="brand"><span>SM</span><b>SMIS PeopleOps</b></div>
      <div><p className="eyebrow"><ShieldCheck size={17}/> Verified workspace access</p><h1>Leaves and attendance, managed with clarity.</h1><p>One audit-ready system for leave balances, comp-offs, holidays, approvals, departments, new joiners and daily attendance.</p></div>
      <div className="loginFeatures"><span><CalendarDays/> Policy-driven leave</span><span><Fingerprint/> Reliable attendance</span><span><FileText/> Excel and PDF reports</span></div>
    </section>
    <section className="loginPanel"><div className="loginCard"><p className="eyebrow">St. Mary&apos;s institutions</p><h2>Sign in</h2><p>Only verified <b>@smis.edu.in</b> Google accounts are accepted.</p><div ref={googleRef} className="googleButton"/><div className="divider"><span>interactive demo</span></div>{users.map(u => <button className="demoUser" key={u.email} onClick={() => setUser(u)}><span className="avatar">{u.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><span><b>{u.name}</b><small>{u.role.replace('_',' ')} · {u.email}</small></span><ChevronRight/></button>)}<p className="secure"><BadgeCheck/> Domain and email verification happen server-side.</p></div></section>
  </main>;

  return <main className="app">
    <aside><div className="brand"><span>SM</span><b>PeopleOps</b></div><nav>{nav.map(([id,label,Icon]) => <button className={tab===id?'active':''} key={id} onClick={()=>setTab(id)}><Icon/>{label}{id==='leaves'&&pending>0?<em>{pending}</em>:null}</button>)}</nav><div className="account"><span className="avatar">{user.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><b>{user.name}</b><small>{user.role.replace('_',' ')}</small></div><button onClick={()=>setUser(null)}><LogOut/></button></div></aside>
    <section className="content"><header><div><p>{user.department}</p><h1>{nav.find(x=>x[0]===tab)?.[1]}</h1></div><div className="headerActions"><button className="ghost" onClick={()=>window.print()}><FileText/> PDF</button><button onClick={exportExcel}><Download/> Excel</button></div></header>

      {tab==='dashboard' && <><div className="stats"><Stat label="Active employees" value={employees.filter(e=>e.active).length} note={`${departments.length} departments`} icon={Users}/><Stat label="Present today" value={present} note={`${Math.round(present/employees.length*100)}% attendance`} icon={Fingerprint}/><Stat label="Pending approvals" value={pending} note="Needs action" icon={Clock3}/><Stat label="Upcoming holidays" value={holidays.length} note={holidays[0]?.name} icon={CalendarDays}/></div><div className="grid2"><Card title="Pending decisions" action={()=>setTab('leaves')}>{leaves.filter(l=>l.status==='Pending').slice(0,4).map(l=><LeaveRow key={l.id} leave={l} canApprove={!!canApprove} decide={decide}/>)}</Card><Card title="Today&apos;s attendance" action={()=>setTab('attendance')}>{attendance.filter(a=>a.date===TODAY).map(a=><div className="row" key={a.id}><span className="avatar">{a.employee.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><b>{a.employee}</b><small>{a.checkIn} {a.checkOut?`– ${a.checkOut}`:'– working'}</small></div><i className={a.status==='Late'?'warning':'success'}>{a.status}</i></div>)}</Card></div><Card title="Quick actions"><div className="quick"><button onClick={()=>setTab('leaves')}><Plus/> Apply leave</button><button onClick={check}><Clock3/> Check in / out</button>{isSuper&&<button onClick={()=>setTab('people')}><Users/> Add employee</button>}<button onClick={exportExcel}><Download/> Download workbook</button></div></Card></>}

      {tab==='leaves' && <><div className="balanceGrid">{Object.entries(balances).map(([k,v])=><div className="balance" key={k}><small>{k}</small><strong>{v}</strong><span>days available</span></div>)}</div><div className="grid2"><Card title="Apply for leave"><form action={applyLeave} className="form"><label>Leave type<select name="type"><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Comp Off</option><option>Loss of Pay</option></select></label><div className="split"><label>From<input required name="from" type="date" defaultValue={TODAY}/></label><label>To<input required name="to" type="date" defaultValue={TODAY}/></label></div><label>Reason<textarea required name="reason" placeholder="Brief reason and handover notes"/></label><button type="submit"><Plus/> Submit request</button></form></Card><Card title={canApprove?'Approval queue':'My requests'}>{ownLeaves.map(l=><LeaveRow key={l.id} leave={l} canApprove={!!canApprove&&l.status==='Pending'} decide={decide}/>)}</Card></div></>}

      {tab==='attendance' && <><div className="toolbar"><button onClick={check}><Clock3/> Check in / out</button><span>Shift: 8:45 AM – 4:45 PM · Grace: 15 minutes</span></div><Card title="Attendance register"><div className="table"><div className="tr head"><span>Employee</span><span>Date</span><span>Check-in</span><span>Check-out</span><span>Status</span></div>{attendance.map(a=><div className="tr" key={a.id}><span><b>{a.employee}</b></span><span>{a.date}</span><span>{a.checkIn||'—'}</span><span>{a.checkOut||'Working'}</span><span><i className={a.status==='Late'?'warning':'success'}>{a.status}</i></span></div>)}</div></Card></>}

      {tab==='people' && <><div className="grid2">{isSuper&&<Card title="Add new joinee"><form className="form" action={f=>{const e={id:Date.now(),name:String(f.get('name')),email:String(f.get('email')).toLowerCase(),department:String(f.get('department')),role:String(f.get('role')) as Role,joined:String(f.get('joined')),active:true};if(!e.email.endsWith('@smis.edu.in'))return alert('Use an @smis.edu.in email.');setEmployees(v=>[e,...v]);log(`Added employee ${e.email}`)}}><label>Full name<input required name="name"/></label><label>Official email<input required type="email" name="email" placeholder="name@smis.edu.in"/></label><div className="split"><label>Department<select name="department">{departments.map(d=><option key={d}>{d}</option>)}</select></label><label>Access role<select name="role"><option value="employee">Employee</option><option value="admin">Admin / approver</option></select></label></div><label>Joining date<input required name="joined" type="date" defaultValue={TODAY}/></label><button><Plus/> Add employee</button></form></Card>}<Card title="Departments">{departments.map(d=><div className="row" key={d}><span className="iconBox"><Building2/></span><div><b>{d}</b><small>{employees.filter(e=>e.department===d).length} employees</small></div></div>)}{isSuper&&<form className="inline" action={f=>{const d=String(f.get('department')).trim();if(d&&!departments.includes(d)){setDepartments(v=>[...v,d]);log(`Added department ${d}`)}}}><input name="department" placeholder="New department"/><button><Plus/></button></form>}</Card></div><Card title="Employee directory"><div className="table"><div className="tr head"><span>Employee</span><span>Email</span><span>Department</span><span>Role</span><span>Status</span></div>{employees.map(e=><div className="tr" key={e.id}><span><b>{e.name}</b></span><span>{e.email}</span><span>{e.department}</span><span>{e.role.replace('_',' ')}</span><span><i className={e.active?'success':'warning'}>{e.active?'Active':'Inactive'}</i></span></div>)}</div></Card></>}

      {tab==='setup' && <div className="grid2"><Card title="Leave policy"><div className="policy"><b>Casual Leave</b><span>12 days · yearly · no carry forward</span></div><div className="policy"><b>Sick Leave</b><span>10 days · medical proof configurable</span></div><div className="policy"><b>Earned Leave</b><span>15 days · carry-forward configurable</span></div><div className="policy"><b>Comp Off</b><span>3 active credits · expiry configurable</span></div></Card><Card title="Holiday calendar">{holidays.map(h=><div className="row" key={h.id}><span className="dateTile"><b>{new Date(h.date).getDate()}</b><small>{new Date(h.date).toLocaleString('en',{month:'short'})}</small></span><div><b>{h.name}</b><small>{h.date} · {h.type}</small></div></div>)}{isSuper&&<form className="inline stacked" action={f=>{const h={id:Date.now(),name:String(f.get('name')),date:String(f.get('date')),type:'Institution'};setHolidays(v=>[...v,h]);log(`Added holiday ${h.name}`)}}><input required name="name" placeholder="Holiday name"/><input required name="date" type="date"/><button><Plus/> Add</button></form>}</Card></div>}

      {tab==='reports' && <><div className="reportHero"><div><p className="eyebrow">Audit-ready exports</p><h2>Management reporting centre</h2><p>Download one Excel workbook containing leave, attendance, employee, holiday and audit sheets, or use the print layout for PDF.</p></div><div><button onClick={exportExcel}><Download/> Download Excel</button><button className="ghost" onClick={()=>window.print()}><FileText/> Print / PDF</button></div></div><Card title="Audit trail">{audit.map(a=><div className="audit" key={a.id}><span/><div><b>{a.action}</b><small>{a.actor} · {a.at}</small></div></div>)}</Card></>}
    </section>
  </main>;
}

function Stat({label,value,note,icon:Icon}:{label:string;value:number;note?:string;icon:typeof Users}){return <div className="stat"><span className="iconBox"><Icon/></span><small>{label}</small><strong>{value}</strong><p>{note}</p></div>}
function Card({title,children,action}:{title:string;children:React.ReactNode;action?:()=>void}){return <section className="card"><header><h3>{title}</h3>{action&&<button className="link" onClick={action}>View all <ChevronRight/></button>}</header><div>{children}</div></section>}
function LeaveRow({leave,canApprove,decide}:{leave:Leave;canApprove:boolean;decide:(id:number,s:'Approved'|'Rejected')=>void}){return <div className="leaveRow"><span className="avatar">{leave.employee.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><b>{leave.employee}</b><small>{leave.type} · {leave.from} to {leave.to} · {leave.days} day(s)</small><p>{leave.reason}</p></div>{canApprove?<span className="decisions"><button onClick={()=>decide(leave.id,'Approved')}><Check/></button><button className="danger" onClick={()=>decide(leave.id,'Rejected')}><X/></button></span>:<i className={leave.status==='Approved'?'success':leave.status==='Rejected'?'dangerText':'warning'}>{leave.status}</i>}</div>}
