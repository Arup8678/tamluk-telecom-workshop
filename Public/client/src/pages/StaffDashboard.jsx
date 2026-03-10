import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/auth';
import { Clock, LogIn, LogOut, FileText, Upload, Send, AlertCircle, CheckCircle, Download } from 'lucide-react';

const isViewable = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

const StaffDashboard = () => {
    const user = getUser();
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [attendance, setAttendance] = useState(null);
    const [attMsg, setAttMsg] = useState('');
    const [attStatus, setAttStatus] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [leaveForm, setLeaveForm] = useState({ leaveType: 'CL', days: 1, reason: '' });
    const [leaveFile, setLeaveFile] = useState(null);
    const [leaveMsg, setLeaveMsg] = useState('');
    const [leaveMsgType, setLeaveMsgType] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMyLeaves = async () => {
        try {
            const res = await axios.get('/api/leaves/my', config);
            setLeaves(res.data);
        } catch (e) { console.warn(e); }
    };

    useEffect(() => { fetchMyLeaves(); }, []);

    const handleCheckIn = async () => {
        setAttMsg(''); setAttStatus('');
        try {
            const res = await axios.post('/api/attendance/checkin', {}, config);
            setAttMsg(res.data.message);
            setAttStatus('success');
            setAttendance(res.data.attendance);
        } catch (err) {
            setAttMsg(err.response?.data?.message || 'Check-in failed');
            setAttStatus('error');
        }
    };

    const handleCheckOut = async () => {
        setAttMsg(''); setAttStatus('');
        try {
            const res = await axios.post('/api/attendance/checkout', {}, config);
            setAttMsg(res.data.message);
            setAttStatus('success');
            setAttendance(res.data.attendance);
        } catch (err) {
            setAttMsg(err.response?.data?.message || 'Check-out failed');
            setAttStatus('error');
        }
    };

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        setLeaveMsg(''); setLeaveMsgType(''); setLoading(true);
        try {
            const formData = new FormData();
            formData.append('leaveType', leaveForm.leaveType);
            formData.append('days', leaveForm.days);
            formData.append('reason', leaveForm.reason);
            if (leaveFile) formData.append('file', leaveFile);

            await axios.post('/api/leaves', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setLeaveMsg('Leave application submitted successfully!');
            setLeaveMsgType('success');
            setLeaveForm({ leaveType: 'CL', days: 1, reason: '' });
            setLeaveFile(null);
            fetchMyLeaves();
        } catch (err) {
            setLeaveMsg(err.response?.data?.message || 'Error submitting leave');
            setLeaveMsgType('error');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ animation: 'fadeInUp 0.4s ease', paddingBottom: '3rem' }}>
            {/* ── Header ──────────────────────────────── */}
            <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', background: 'linear-gradient(135deg,#fff,var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        STAFF PANEL
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Welcome, {user?.username} [{user?.role}]</p>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
                {/* ── Attendance ───────────────────────── */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <Clock size={18} /> Duty Attendance
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                        Report time: <strong style={{ color: 'white', fontFamily: 'Orbitron, monospace' }}>11:00 HRS</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <button onClick={handleCheckIn} className="btn btn-primary" style={{ flex: 1, fontFamily: 'Orbitron, monospace', letterSpacing: '2px', fontSize: '0.85rem' }}>
                            <LogIn size={16} /> CHECK IN
                        </button>
                        <button onClick={handleCheckOut} className="btn btn-outline" style={{ flex: 1, fontFamily: 'Orbitron, monospace', letterSpacing: '2px', fontSize: '0.85rem' }}>
                            <LogOut size={16} /> CHECK OUT
                        </button>
                    </div>

                    {attMsg && (
                        <div className={attStatus === 'success' ? 'success-message' : 'error-message'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {attStatus === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{attMsg}
                        </div>
                    )}

                    {attendance && (
                        <div style={{ marginTop: '1rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '1rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Status: <span className={`badge ${attendance.status === 'On Time' ? 'badge-approved' : 'badge-rejected'}`}>{attendance.status}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                In: <strong style={{ color: 'white', fontFamily: 'Orbitron, monospace' }}>{new Date(attendance.checkInTime).toLocaleTimeString()}</strong>
                                {attendance.checkOutTime && (
                                    <span> · Out: <strong style={{ color: 'white', fontFamily: 'Orbitron, monospace' }}>{new Date(attendance.checkOutTime).toLocaleTimeString()}</strong></span>
                                )}
                            </div>
                            {attendance.warning && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.8rem' }}>
                                    ⚠ Warning: {attendance.warning}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Apply for Leave ──────────────────── */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        <FileText size={18} /> Apply for Leave
                    </h3>

                    {leaveMsg && (<div className={leaveMsgType === 'success' ? 'success-message' : 'error-message'} style={{ marginBottom: '1rem' }}>{leaveMsg}</div>)}

                    <form onSubmit={handleLeaveSubmit}>
                        <div className="form-group">
                            <label className="form-label">Type of Leave</label>
                            <select className="form-control" value={leaveForm.leaveType} onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
                                <option value="CL">CL — Casual Leave</option>
                                <option value="EL">EL — Earned Leave</option>
                                <option value="ML">ML — Medical Leave</option>
                                <option value="Comp-Off">Comp-Off</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Number of Days</label>
                            <input type="number" className="form-control" min="1" max="30" value={leaveForm.days} onChange={e => setLeaveForm({ ...leaveForm, days: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reason</label>
                            <textarea className="form-control" rows="3" placeholder="State your reason..." value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Upload size={14} /> Upload Document (Optional)
                            </label>
                            <input type="file" className="form-control" onChange={e => setLeaveFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', fontFamily: 'Orbitron, monospace', letterSpacing: '2px' }} disabled={loading}>
                            <Send size={16} /> {loading ? 'SUBMITTING...' : 'SUBMIT LEAVE'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Leave History ────────────────────────── */}
            <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--purple-glow)', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    <FileText size={18} /> My Leave History
                </h3>
                <div className="table-container">
                    <table className="table">
                        <thead><tr><th>Type</th><th>Days</th><th>Reason</th><th>Document</th><th>Status</th><th>Applied</th></tr></thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l._id}>
                                    <td><span style={{ color: 'var(--purple-glow)', fontWeight: 600 }}>{l.leaveType}</span></td>
                                    <td style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>{l.days}</td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
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
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {leaves.length === 0 && <tr><td colSpan="6" className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>No leave applications yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
