export type Role='super_admin'|'admin'|'employee'; export type Status='Pending'|'Approved'|'Rejected';
export type Employee={id:number;code:string;name:string;email:string;username:string;password:string;department:string;designation:string;role:Role;active:boolean};
export type Department={code:string;name:string;headUsername:string};
export type Policy={code:string;name:string;allowance:number;paid:boolean;active:boolean};
export type Holiday={id:number;date:string;name:string;type:string;departments:string};
export type Credit={id:number;employee:string;username:string;department:string;workedDate:string;hours:number;days:number;reason:string;status:Status;decidedBy?:string};
export type Leave={id:number;employee:string;username:string;department:string;policy:string;from:string;to:string;days:number;reason:string;status:Status;useCompOff:boolean;decidedBy?:string};
export type Audit={id:number;at:string;actor:string;action:string};
export type DB={employees:Employee[];departments:Department[];policies:Policy[];holidays:Holiday[];credits:Credit[];leaves:Leave[];compBalances:Record<string,number>;audit:Audit[]};
export const today=new Date().toISOString().slice(0,10), key='smis-peopleops-v2';
export const seed:DB={employees:[
{id:1,code:'SMIS001',name:'Sagar',email:'sagar@smis.edu.in',username:'sagar',password:'Sagar@123',department:'MGMT',designation:'Super Admin',role:'super_admin',active:true},
{id:2,code:'SMIS002',name:'Academic Head',email:'principal@smis.edu.in',username:'principal',password:'Admin@123',department:'ACAD',designation:'Principal',role:'admin',active:true},
{id:3,code:'SMIS003',name:'Ananya Rao',email:'teacher@smis.edu.in',username:'teacher',password:'Employee@123',department:'ACAD',designation:'Faculty',role:'employee',active:true}],
departments:[{code:'MGMT',name:'Management',headUsername:'sagar'},{code:'ACAD',name:'Academics',headUsername:'principal'}],
policies:[{code:'CL',name:'Casual Leave',allowance:12,paid:true,active:true},{code:'SL',name:'Sick Leave',allowance:10,paid:true,active:true},{code:'EL',name:'Earned Leave',allowance:15,paid:true,active:true},{code:'CO',name:'Compensatory Off',allowance:0,paid:true,active:true}],
holidays:[{id:1,date:'2026-08-15',name:'Independence Day',type:'National',departments:''}],credits:[],leaves:[],compBalances:{teacher:0},audit:[{id:1,at:new Date().toLocaleString(),actor:'System',action:'Workspace prepared'}]};
export const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)); export const daysBetween=(a:string,b:string)=>Math.max(1,Math.floor((new Date(b).getTime()-new Date(a).getTime())/86400000)+1);
export const csv=(text:string)=>{const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean);if(!lines.length)return[];const split=(s:string)=>{const out:string[]=[];let q=false,x='';for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&s[i+1]==='"'){x+='"';i++}else if(c==='"')q=!q;else if(c===','&&!q){out.push(x.trim());x=''}else x+=c}out.push(x.trim());return out};const h=split(lines[0]).map(x=>x.toLowerCase());return lines.slice(1).map(l=>Object.fromEntries(split(l).map((v,i)=>[h[i],v])))};
