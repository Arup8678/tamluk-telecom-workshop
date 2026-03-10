import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/auth';
import { LayoutDashboard, Wrench, FileText, Activity, Clock, Users, RefreshCw, AlertTriangle, Download } from 'lucide-react';

const isViewable = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [repairs, setRepairs] = useState([]);
    const [requisitions, setRequisitions] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [notices, setNotices] = useState([]);
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeFile, setNoticeFile] = useState(null);
    const [noticeLoading, setNoticeLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('repairs');
    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const user = getUser();
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, repairsRes, reqsRes] = await Promise.all([
                axios.get('/api/stats', config),
                axios.get('/api/repairs', config),
                axios.get('/api/requisitions', config),
            ]);
            setStats(statsRes.data);
            setRepairs(repairsRes.data);
            setRequisitions(reqsRes.data);

            try {
                const [attRes, leaveRes, noticeRes] = await Promise.all([
                    axios.get('/api/attendance/today', config),
                    axios.get('/api/leaves', config),
                    axios.get('/api/notices')
                ]);
                setAttendances(attRes.data);
                setLeaves(leaveRes.data);
                setNotices(noticeRes.data);
                if (user?.role === 'Developer -Alpha') {
                    const usersRes = await axios.get('/api/auth/users', config);
                    setAllUsers(usersRes.data);
                }
            } catch (e) { console.warn('Supplementary data error', e); }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleStatusChange = async (type, id, newStatus) => {
        try {
            if (type === 'repair') await axios.put(`/api/repairs/${id}`, { status: newStatus }, config);
            else if (type === 'requisition') await axios.put(`/api/requisitions/${id}`, { status: newStatus }, config);
            else if (type === 'leave') await axios.put(`/api/leaves/${id}`, { status: newStatus }, config);
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            if (type === 'repair') await axios.delete(`/api/repairs/${id}`, config);
            else await axios.delete(`/api/requisitions/${id}`, config);
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const handleWarn = async (attId) => {
        const msg = prompt('Enter warning message for this late staff member:');
        if (!msg) return;
        try {
            await axios.put(`/api/attendance/warn/${attId}`, { warning: msg }, config);
            fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Error sending warning'); }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', paddingTop: '6rem' }}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', color: 'var(--purple-light)', letterSpacing: '3px', animation: 'pulse-glow 1.5s infinite' }}>
                ■ LOADING COMMAND CENTER ■
            </div>
        </div>
    );
    if (error) return <div className="error-message" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>{error}</div>;

    const tabStyle = (tab) => ({
        padding: '0.6rem 1.25rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.8rem',
        letterSpacing: '1px',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s',
        background: activeTab === tab ? 'linear-gradient(135deg,var(--purple-primary),var(--purple-light))' : 'rgba(168,85,247,0.08)',
        color: activeTab === tab ? 'white' : 'var(--purple-glow)',
        border: activeTab === tab ? '1px solid transparent' : '1px solid rgba(168,85,247,0.25)',
    });

    return (
        <div style={{ paddingBottom: '3rem', animation: 'fadeInUp 0.4s ease' }}>
            {/* Header */}
            <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LayoutDashboard size={24} color="var(--purple-light)" />
                    <div>
                        <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', background: 'linear-gradient(135deg,#fff,var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>COMMAND CENTER</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{user?.username} [{user?.role}]</p>
                    </div>
                </div>
                <button onClick={fetchData} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}><RefreshCw size={14} /> Refresh</button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="glass-card stat-card" style={{ borderBottom: '3px solid var(--purple-light)' }}>
                        <Activity size={28} color="var(--purple-light)" />
                        <div className="stat-value">{stats.totalRequests}</div>
                        <div className="stat-label">Total Requests</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderBottom: '3px solid var(--warning)' }}>
                        <div className="stat-value" style={{ color: 'var(--warning)', WebkitTextFillColor: 'var(--warning)' }}>{stats.totalPending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderBottom: '3px solid var(--success)' }}>
                        <div className="stat-value" style={{ color: 'var(--success)', WebkitTextFillColor: 'var(--success)' }}>{stats.totalApproved}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderBottom: '3px solid var(--purple-accent)' }}>
                        <Users size={28} color="var(--purple-accent)" />
                        <div className="stat-value" style={{ color: 'var(--purple-glow)', WebkitTextFillColor: 'var(--purple-glow)' }}>{attendances.length}</div>
                        <div className="stat-label">Checked-In Today</div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button style={tabStyle('repairs')} onClick={() => setActiveTab('repairs')}>Repairs ({repairs.length})</button>
                <button style={tabStyle('requisitions')} onClick={() => setActiveTab('requisitions')}>Requisitions ({requisitions.length})</button>
                <button style={tabStyle('attendance')} onClick={() => setActiveTab('attendance')}>Attendance ({attendances.length})</button>
                <button style={tabStyle('leaves')} onClick={() => setActiveTab('leaves')}>Leaves ({leaves.length})</button>
                <button style={tabStyle('notices')} onClick={() => setActiveTab('notices')}>Notices ({notices.length})</button>
                {user?.role === 'Developer -Alpha' && (
                    <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users ({allUsers.length})</button>
                )}
            </div>

            {/* ── Repairs Tab ──────────────────── */}
            {activeTab === 'repairs' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <Wrench size={18} /> Repair Requests
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>ID</th><th>Location</th><th>Issue</th><th>Doc</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {repairs.slice(0, 20).map(r => (
                                    <tr key={r._id}>
                                        <td><code style={{ color: 'var(--purple-glow)', fontSize: '0.8rem' }}>{r.repairId}</code></td>
                                        <td>{r.location}</td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.issue}</td>
                                        <td>{r.fileUrl ? (
                                            <a
                                                href={`/api/files/download/${r.fileUrl.split('/').pop()}`}
                                                target={isViewable(r.fileUrl) ? "_blank" : undefined}
                                                download={!isViewable(r.fileUrl) ? r.fileUrl.split('/').pop() : undefined}
                                                rel="noreferrer"
                                                style={{ color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                {isViewable(r.fileUrl) ? 'View' : <><Download size={14} /> DL</>}
                                            </a>
                                        ) : '—'}</td>
                                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                                        <td style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                            <select className="form-control" style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }} value={r.status} onChange={e => handleStatusChange('repair', r._id, e.target.value)}>
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            {['Admin', 'Developer -Alpha'].includes(user.role) && <button onClick={() => handleDelete('repair', r._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Del</button>}
                                        </td>
                                    </tr>
                                ))}
                                {repairs.length === 0 && <tr><td colSpan="5" className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No repairs</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Requisitions Tab ─────────────── */}
            {activeTab === 'requisitions' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <FileText size={18} /> Requisitions
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>ID</th><th>Item (Qty)</th><th>Doc</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {requisitions.slice(0, 20).map(req => (
                                    <tr key={req._id}>
                                        <td><code style={{ color: 'var(--purple-glow)', fontSize: '0.8rem' }}>{req.requisitionId}</code></td>
                                        <td>{req.item} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({req.quantity})</span></td>
                                        <td>{req.fileUrl ? (
                                            <a
                                                href={`/api/files/download/${req.fileUrl.split('/').pop()}`}
                                                target={isViewable(req.fileUrl) ? "_blank" : undefined}
                                                download={!isViewable(req.fileUrl) ? req.fileUrl.split('/').pop() : undefined}
                                                rel="noreferrer"
                                                style={{ color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                {isViewable(req.fileUrl) ? 'View' : <><Download size={14} /> DL</>}
                                            </a>
                                        ) : '—'}</td>
                                        <td><span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span></td>
                                        <td style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                            <select className="form-control" style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }} value={req.status} onChange={e => handleStatusChange('requisition', req._id, e.target.value)}>
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            {['Admin', 'Developer -Alpha'].includes(user.role) && <button onClick={() => handleDelete('requisition', req._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Del</button>}
                                        </td>
                                    </tr>
                                ))}
                                {requisitions.length === 0 && <tr><td colSpan="4" className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No requisitions</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Attendance Tab ───────────────── */}
            {activeTab === 'attendance' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <Clock size={18} /> Today's Duty Attendance
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>Officer</th><th>Role</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Warning</th><th>Action</th></tr></thead>
                            <tbody>
                                {attendances.map(att => (
                                    <tr key={att._id}>
                                        <td style={{ fontWeight: 600 }}>{att.user?.username || '—'}</td>
                                        <td><span style={{ color: 'var(--purple-glow)', fontSize: '0.8rem' }}>{att.user?.role}</span></td>
                                        <td style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem' }}>{new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem' }}>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                        <td><span className={`badge ${att.status === 'On Time' ? 'badge-approved' : 'badge-rejected'}`}>{att.status}</span></td>
                                        <td style={{ fontSize: '0.8rem', color: att.warning ? 'var(--danger)' : 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.warning || '—'}</td>
                                        <td>
                                            {att.status === 'Late' && (
                                                <button onClick={() => handleWarn(att._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                                                    <AlertTriangle size={12} /> Warn
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {attendances.length === 0 && <tr><td colSpan="7" className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No attendance today</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Leaves Tab ────────────────────── */}
            {activeTab === 'leaves' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <FileText size={18} /> Leave Applications
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>Officer</th><th>Role</th><th>Type</th><th>Days</th><th>Reason</th><th>Doc</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {leaves.map(l => (
                                    <tr key={l._id}>
                                        <td style={{ fontWeight: 600 }}>{l.user?.username || '—'}</td>
                                        <td style={{ color: 'var(--purple-glow)', fontSize: '0.8rem' }}>{l.user?.role}</td>
                                        <td><span style={{ fontWeight: 600 }}>{l.leaveType}</span></td>
                                        <td style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>{l.days}</td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                                        <td>{l.fileUrl ? (
                                            <a
                                                href={`/api/files/download/${l.fileUrl.split('/').pop()}`}
                                                target={isViewable(l.fileUrl) ? "_blank" : undefined}
                                                download={!isViewable(l.fileUrl) ? l.fileUrl.split('/').pop() : undefined}
                                                rel="noreferrer"
                                                style={{ color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                {isViewable(l.fileUrl) ? 'View' : <><Download size={14} /> DL</>}
                                            </a>
                                        ) : '—'}</td>
                                        <td><span className={`badge ${l.status === 'Approved' ? 'badge-approved' : l.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>{l.status}</span></td>
                                        <td style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                            <select className="form-control" style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }} value={l.status} onChange={e => handleStatusChange('leave', l._id, e.target.value)}>
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {leaves.length === 0 && <tr><td colSpan="8" className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No leave applications</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Notices Tab ────────────────────── */}
            {activeTab === 'notices' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <FileText size={18} /> Notice Board Management
                    </h3>

                    {/* Upload Form */}
                    <div style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'white', fontSize: '0.85rem' }}>Upload New Notice</h4>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!noticeTitle || !noticeFile) return alert('Title and file are required');
                            setNoticeLoading(true);
                            try {
                                const fd = new FormData();
                                fd.append('title', noticeTitle);
                                fd.append('file', noticeFile);
                                await axios.post('/api/notices', fd, {
                                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                                });
                                setNoticeTitle('');
                                setNoticeFile(null);
                                // reset file input manually
                                e.target.reset();
                                fetchData();
                                alert('Notice uploaded successfully!');
                            } catch (err) {
                                alert(err.response?.data?.message || 'Error uploading notice');
                            } finally { setNoticeLoading(false); }
                        }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                                <label className="form-label">Notice Title</label>
                                <input type="text" className="form-control" placeholder="Enter title..." value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                                <label className="form-label">Attached File</label>
                                <input type="file" className="form-control" onChange={e => setNoticeFile(e.target.files[0])} required />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={noticeLoading} style={{ padding: '0.75rem 1.5rem', height: 'fit-content' }}>
                                {noticeLoading ? 'Uploading...' : 'Upload Notice'}
                            </button>
                        </form>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>Title</th><th>Uploaded By</th><th>Date</th><th>File</th><th>Action</th></tr></thead>
                            <tbody>
                                {notices.map(n => (
                                    <tr key={n._id}>
                                        <td style={{ fontWeight: 600 }}>{n.title}</td>
                                        <td><span style={{ color: 'var(--purple-glow)', fontSize: '0.8rem' }}>{n.uploadedBy?.username} ({n.uploadedBy?.role})</span></td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                                        <td><a
                                            href={`/api/files/download/${n.fileUrl.split('/').pop()}`}
                                            download={n.fileUrl.split('/').pop()}
                                            style={{ color: 'var(--purple-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                        >
                                            <Download size={14} /> Download
                                        </a></td>
                                        <td>
                                            <button onClick={async () => {
                                                if (!window.confirm('Delete this notice?')) return;
                                                try {
                                                    await axios.delete(`/api/notices/${n._id}`, config);
                                                    fetchData();
                                                } catch (err) { alert(err.response?.data?.message || 'Error deleting'); }
                                            }} className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {notices.length === 0 && <tr><td colSpan="5" className="text-center" style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No notices available</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Users Tab (Developer -Alpha Only) ── */}
            {activeTab === 'users' && user?.role === 'Developer -Alpha' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <Users size={18} /> User Management
                    </h3>

                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>Role</th><th>Username</th><th>New Password</th><th>Actions</th></tr></thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--purple-glow)' }}>{u.role}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ padding: '0.4rem', fontSize: '0.8rem', width: '100%' }}
                                                value={editingUser?.id === u._id ? editingUser.username : u.username}
                                                onChange={e => setEditingUser({ ...editingUser, id: u._id, username: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="(Leave blank to keep)"
                                                style={{ padding: '0.4rem', fontSize: '0.8rem', width: '100%' }}
                                                value={editingUser?.id === u._id ? editingUser.password || '' : ''}
                                                onChange={e => setEditingUser({ ...editingUser, id: u._id, password: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={async () => {
                                                    if (editingUser?.id !== u._id) return alert('Edit the fields first');
                                                    if (!window.confirm(`Update credentials for ${u.role}?`)) return;
                                                    try {
                                                        await axios.put(`/api/auth/users/${u._id}`, {
                                                            username: editingUser.username,
                                                            password: editingUser.password
                                                        }, config);
                                                        alert('User updated successfully');
                                                        setEditingUser(null);
                                                        fetchData();
                                                    } catch (err) { alert(err.response?.data?.message || 'Error updating user'); }
                                                }}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: 'auto' }}
                                                disabled={editingUser?.id !== u._id}
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
