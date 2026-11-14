import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ClipboardCheck, Clock3, LayoutDashboard, ListTodo, LockKeyhole, LogOut, Menu, Pencil, Plus, Search, ShieldCheck, Sparkles, Trash2, UserCircle2, X } from 'lucide-react';
import { api } from './api';

const emptyTask = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };
const statusLabels = { pending: 'To do', 'in-progress': 'In progress', completed: 'Completed' };

function Brand({ onClick }) {
  return <button className="brand" type="button" onClick={onClick} aria-label="TaskMate home"><img src="/taskmate-mark.svg" alt="Team TaskMate logo"/><span>task<span className="brand-accent">mate</span><small>.</small></span></button>;
}
function Field({label, ...props}) { return <label className="field"><span>{label}</span><input {...props}/></label>; }
function StatusPill({ status }) { return <span className={`status-tag status-${status}`}><span className="dot"/>{statusLabels[status]}</span>; }

function Landing({ onAuth }) {
  return <div className="landing">
    <header className="site-header container">
      <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}/>
      <nav className="header-nav"><a href="#how">How it works</a><a href="#why">Why TaskMate</a></nav>
      <div className="header-actions"><button className="text-btn" onClick={() => onAuth('login')}>Log in</button><button className="btn btn-dark btn-sm" onClick={() => onAuth('register')}>Get started <ArrowRight size={16}/></button></div>
    </header>
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> YOUR DAY, SIMPLIFIED</div>
          <h1>Less juggling.<br/>More <span>getting things done.</span></h1>
          <p>From class assignments to everyday to-dos, keep what matters in one calm, organized place.</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={() => onAuth('register')}>Start organizing <ArrowRight size={18}/></button><a href="#how" className="watch-link">See how it works <ArrowRight size={16}/></a></div>
          <div className="hero-proof"><div className="proof-icon"><Check size={15}/></div> Create, track, and finish tasks in minutes</div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="preview-card" aria-label="Illustrative task dashboard preview">
            <div className="preview-heading"><div className="preview-heading-text"><span className="soft-label">MONDAY MOTIVATION</span><h3>My Tasks <span>✦</span></h3><p>You have a great day ahead!</p></div><div className="mini-avatar">TM</div></div>
            <div className="preview-stats"><div className="stat-card"><span className="stat-icon stat-violet"><ListTodo size={17}/></span><strong>08</strong><span>All tasks</span></div><div className="stat-card"><span className="stat-icon stat-mint"><CheckCircle2 size={17}/></span><strong>05</strong><span>Completed</span></div><div className="stat-card"><span className="stat-icon stat-peach"><Clock3 size={17}/></span><strong>03</strong><span>In progress</span></div></div>
            <div className="preview-list-header"><strong>Today’s focus</strong><span>VIEW ALL <ArrowRight size={13}/></span></div>
            <div className="preview-task"><div className="preview-check done"><Check size={13}/></div><span>Review project requirements<small>College project</small></span><span className="fake-label green">Done</span></div>
            <div className="preview-task"><div className="preview-check"/><span>Finish API testing<small>COMP229 assignment</small></span><span className="fake-label peach">Today</span></div>
            <div className="preview-task"><div className="preview-check"/><span>Update team task board<small>Project planning</small></span><span className="fake-label lilac">Next</span></div>
          </div>
          <div className="floating-complete"><div className="floating-icon"><Check size={17}/></div><div><strong>Looking good!</strong><small>One task at a time.</small></div></div>
          <div className="floating-star">✳</div>
          <div className="preview-caption">Sample dashboard preview</div>
        </div>
      </section>
      <section className="feature-section" id="how"><div className="container"><div className="section-label">SIMPLE BY DESIGN</div><h2>Everything you need.<br/><span>Nothing you don’t.</span></h2><div className="feature-grid"><div className="feature-card"><div className="feature-icon violet"><Plus size={23}/></div><h3>Capture it all</h3><p>Add assignments, errands, and deadlines before they slip your mind.</p></div><div className="feature-card"><div className="feature-icon mint"><CalendarDays size={23}/></div><h3>Stay on schedule</h3><p>Set due dates and priorities so you always know what comes next.</p></div><div className="feature-card"><div className="feature-icon peach"><CheckCircle2 size={23}/></div><h3>Celebrate progress</h3><p>Move tasks forward, mark them complete, and build momentum.</p></div></div></div></section>
      <section className="banner-section container" id="why"><div className="banner-copy"><span>GOODBYE, MENTAL CLUTTER</span><h2>Make room for<br/>what matters.</h2><p>A little organization can make a big difference.</p><button onClick={() => onAuth('register')} className="btn btn-white">Create your free account <ArrowRight size={17}/></button></div><div className="banner-art"><div className="banner-paper"><span>YOUR DAY</span><div className="banner-line"><CheckCircle2 size={20}/> Submit assignment</div><div className="banner-line"><CheckCircle2 size={20}/> Plan project sprint</div><div className="banner-line"><span className="empty-circle"/> Review notes</div></div></div></section>
    </main>
    <footer className="footer container"><Brand onClick={() => window.scrollTo(0,0)}/><img className="team-logo-footer" src="/team-taskmate-logo.svg" alt="Official Team TaskMate logo"/><span>Made for simpler days. COMP229 • Team TaskMate</span></footer>
  </div>;
}

function AuthScreen({ mode, setMode, onSuccess, onBack }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const result = await api(isRegister ? '/auth/register' : '/auth/login', { method: 'POST', body: { ...(isRegister && { name }), email, password } });
      onSuccess(result);
    } catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-left"><Brand onClick={onBack}/><div><div className="auth-quote">A clear mind starts<br/>with a clear plan<span>.</span></div><p>Your daily companion for making progress.</p><div className="auth-decor"><ClipboardCheck size={112}/></div></div><span className="auth-foot">TaskMate • COMP229 Project Part 1</span></div><main className="auth-panel"><button className="back-link" onClick={onBack}>← Back to home</button><div className="auth-form"><div className="auth-welcome">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</div><h1>{isRegister ? 'Create your account' : 'Good to see you again'}</h1><p>{isRegister ? 'Organize your tasks in one friendly place.' : 'Sign in and pick up right where you left off.'}</p><form onSubmit={submit}>{isRegister && <Field label="Full name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required maxLength={80}/>}<Field label="Email address" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/><Field label="Password" type="password" autoComplete={isRegister?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder={isRegister?'At least 8 characters':'Enter your password'} required minLength={isRegister?8:1}/>{error && <div className="error-box" role="alert">{error}</div>}<button disabled={busy} type="submit" className="btn btn-primary form-submit">{busy?'Please wait…':isRegister?'Create account':'Log in'} <ArrowRight size={17}/></button></form><div className="auth-switch">{isRegister?'Already have an account?':'New to TaskMate?'} <button onClick={()=>{setMode(isRegister?'login':'register');setError('');}}>{isRegister?'Log in':'Create account'}</button></div><div className="security-note"><ShieldCheck size={16}/> Your tasks are private to your account.</div></div></main></div>;
}

function TaskForm({ task, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(task ? { title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.slice(0,10) : '' } : emptyTask);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  return <form onSubmit={e=>{ e.preventDefault(); onSubmit({ ...form, dueDate: form.dueDate || null }); }} className="task-form"><Field label="Task title *" value={form.title} onChange={e=>update('title',e.target.value)} placeholder="e.g. Finish project report" maxLength={120} required/><label className="field"><span>Description</span><textarea rows={3} maxLength={1000} value={form.description} placeholder="Add a few details…" onChange={e=>update('description',e.target.value)}/></label><div className="form-grid"><label className="field"><span>Priority</span><select value={form.priority} onChange={e=>update('priority',e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="field"><span>Status</span><select value={form.status} onChange={e=>update('status',e.target.value)}><option value="pending">To do</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label></div><Field label="Due date (optional)" type="date" value={form.dueDate} onChange={e=>update('dueDate',e.target.value)}/><div className="modal-actions"><button className="btn btn-outline" type="button" onClick={onCancel}>Cancel</button><button className="btn btn-primary" type="submit" disabled={busy}>{busy?'Saving…':task?'Save changes':'Create task'}</button></div></form>;
}

function Dashboard({ session, onLogout, onUpdateSession }) {
  const { token, user } = session;
  const [tasks, setTasks] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); const [busy, setBusy] = useState(false); const [profileName, setProfileName] = useState(user.name); const [profileEmail, setProfileEmail] = useState(user.email);
  const [mobileNav, setMobileNav] = useState(false);
  async function refresh() { setLoading(true); try { const data = await api('/tasks', {token}); setTasks(data.tasks); setError(''); } catch(e){ setError(e.message); if (e.message.includes('token') || e.message.includes('Authentication')) onLogout(); } finally {setLoading(false);} }
  useEffect(()=>{ refresh(); }, [token]);
  const counts = useMemo(()=>({total:tasks.length, complete:tasks.filter(t=>t.status==='completed').length, active:tasks.filter(t=>t.status==='in-progress').length}),[tasks]);
  const visible = useMemo(()=>tasks.filter(t=>(filter==='all'||t.status===filter) && `${t.title} ${t.description||''}`.toLowerCase().includes(search.toLowerCase())),[tasks,filter,search]);
  async function saveTask(payload) { setBusy(true); try { await api(modal?.task?`/tasks/${modal.task._id}`:'/tasks', {method:modal?.task?'PUT':'POST',body:payload,token}); setModal(null); await refresh(); } catch(e){setError(e.message);} finally {setBusy(false);} }
  async function removeTask(task) { if (!window.confirm(`Delete "${task.title}"?`)) return; try {await api(`/tasks/${task._id}`,{method:'DELETE',token});await refresh();}catch(e){setError(e.message);} }
  async function completeTask(task) { try{await api(`/tasks/${task._id}`,{method:'PUT',token,body:{status:task.status==='completed'?'pending':'completed'}});await refresh();}catch(e){setError(e.message);} }
  async function saveProfile(e) {e.preventDefault();setBusy(true);try{const data=await api('/users/me',{method:'PUT',token,body:{name:profileName,email:profileEmail}});onUpdateSession({...session,user:data.user});setModal(null);setError('');}catch(e){setError(e.message);}finally{setBusy(false);}}
  async function deleteAccount() {if (!window.confirm('Permanently delete your account AND all tasks? This cannot be undone.')) return;try{await api('/users/me',{method:'DELETE',token});onLogout();}catch(e){setError(e.message);}}
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}><div className="sidebar-top"><Brand onClick={()=>setMobileNav(false)}/><p>YOUR WORKSPACE</p><button className="nav-item active" onClick={()=>{setModal(null);setMobileNav(false);}}><LayoutDashboard size={19}/> Dashboard</button><button className="nav-item" onClick={()=>{setModal({type:'profile'});setMobileNav(false);}}><UserCircle2 size={19}/> My profile</button></div><div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={20}/><strong>Keep moving forward</strong><span>Every finished task is a small win.</span></div><div className="sidebar-user"><div className="avatar">{user.name?.slice(0,1).toUpperCase()||'U'}</div><div className="sidebar-user-name"><strong>{user.name}</strong><small>{user.email}</small></div><button title="Log out" aria-label="Log out" onClick={onLogout}><LogOut size={18}/></button></div></div></aside>
    <main className="dashboard-main"><div className="dashboard-topbar"><button className="mobile-menu" onClick={()=>setMobileNav(x=>!x)} aria-label="Menu"><Menu size={22}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div><div className="top-user">Hello, {user.name?.split(' ')[0]} <span>👋</span></div></div><div className="dashboard-content"><div className="dash-intro"><div><div className="eyebrow">LET'S MAKE TODAY COUNT</div><h1>My task dashboard<span>.</span></h1><p>Organize what matters, and enjoy checking things off.</p></div><button className="btn btn-primary" onClick={()=>setModal({type:'task'})}><Plus size={18}/> New task</button></div><div className="dash-stats"><div className="dash-stat"><span className="dash-stat-icon lavender"><ListTodo size={21}/></span><div><strong>{counts.total}</strong><span>Total tasks</span></div></div><div className="dash-stat"><span className="dash-stat-icon peach"><Clock3 size={21}/></span><div><strong>{counts.active}</strong><span>In progress</span></div></div><div className="dash-stat"><span className="dash-stat-icon green"><CheckCircle2 size={21}/></span><div><strong>{counts.complete}</strong><span>Completed</span></div></div></div><section className="task-section"><div className="task-section-heading"><div><h2>Your tasks</h2><p>A clear view of everything on your plate.</p></div><div className="search-box"><Search size={17}/><input aria-label="Search tasks" placeholder="Search tasks…" value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="filter-row"><div className="filter-pills">{[['all','All tasks'],['pending','To do'],['in-progress','In progress'],['completed','Completed']].map(([val,label])=><button key={val} className={filter===val?'selected':''} onClick={()=>setFilter(val)}>{label}</button>)}</div><span className="task-count">{visible.length} {visible.length===1?'task':'tasks'}</span></div>{error && <div role="alert" className="error-box">{error}</div>}{loading ? <div className="empty-tasks">Loading tasks…</div> : visible.length===0 ? <div className="empty-tasks"><div className="empty-icon"><ClipboardCheck size={39}/></div><h3>{tasks.length?'No matching tasks':'Your fresh start begins here'}</h3><p>{tasks.length?'Try another search or filter.':'Add your first task to get things moving.'}</p><button className="btn btn-primary" onClick={()=>setModal({type:'task'})}><Plus size={17}/> Add a task</button></div> : <div className="task-list">{visible.map(task=><div className="task-row" key={task._id}><button className={`task-check ${task.status==='completed'?'checked':''}`} onClick={()=>completeTask(task)} aria-label={`Toggle completion for ${task.title}`}>{task.status==='completed'&&<Check size={16}/>}</button><div className="task-primary"><strong className={task.status==='completed'?'completed-title':''}>{task.title}</strong>{task.description && <p>{task.description}</p>}<div className="task-meta"><StatusPill status={task.status}/><span className={`priority priority-${task.priority}`}>{task.priority} priority</span>{task.dueDate && <span className="due"><CalendarDays size={14}/>{new Date(task.dueDate).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'})}</span>}</div></div><div className="task-actions"><button onClick={()=>setModal({type:'task',task})} aria-label={`Edit ${task.title}`}><Pencil size={17}/></button><button onClick={()=>removeTask(task)} aria-label={`Delete ${task.title}`}><Trash2 size={17}/></button></div></div>)}</div>}</section></div></main>
    {modal && <div className="modal-backdrop" onClick={()=>{setModal(null);setError('');}}><div className="modal" role="dialog" aria-modal="true" aria-label={modal.type==='profile'?'Edit profile':modal.task?'Edit task':'Create task'} onClick={e=>e.stopPropagation()}><div className="modal-title"><div><span className="eyebrow">{modal.type==='profile'?'ACCOUNT SETTINGS':'TASK DETAILS'}</span><h2>{modal.type==='profile'?'My profile':modal.task?'Edit task':'Create a new task'}</h2></div><button className="modal-close" onClick={()=>{setModal(null);setError('');}} aria-label="Close"><X size={22}/></button></div>{error&&<div role="alert" className="error-box">{error}</div>}{modal.type==='profile' ? <form onSubmit={saveProfile} className="task-form"><Field label="Name" value={profileName} onChange={e=>setProfileName(e.target.value)} required/><Field label="Email" type="email" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} required/><div className="modal-actions"><button type="button" className="delete-link" onClick={deleteAccount}>Delete my account</button><button disabled={busy} className="btn btn-primary" type="submit">Save profile</button></div></form>:<TaskForm key={modal.task?modal.task._id:'new'} task={modal.task} onSubmit={saveTask} busy={busy} onCancel={()=>{setModal(null);setError('');}}/>}</div></div>}
  </div>;
}

export default function App() {
  const [session, setSession] = useState(()=>{try{return JSON.parse(localStorage.getItem('taskmate_session')||'null');}catch{return null;}});
  const [screen, setScreen] = useState('landing');
  function login(result) {const value={user:result.user,token:result.token};localStorage.setItem('taskmate_session',JSON.stringify(value));setSession(value);}
  function logout() {localStorage.removeItem('taskmate_session');setSession(null);setScreen('landing');}
  function updateSession(value) {localStorage.setItem('taskmate_session',JSON.stringify(value));setSession(value);}
  if (session) return <Dashboard session={session} onLogout={logout} onUpdateSession={updateSession}/>;
  if (screen==='login'||screen==='register') return <AuthScreen mode={screen} setMode={setScreen} onBack={()=>setScreen('landing')} onSuccess={login}/>;
  return <Landing onAuth={setScreen}/>;
}
