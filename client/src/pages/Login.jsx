import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Shield, ChevronDown } from 'lucide-react';
import { setToken, setUser } from '../utils/auth';

const ROLES = ['Inspector', 'SRIC', 'SRO', 'SRT', 'Wireless Operator', 'HG/NVF', 'RTC', 'CV'];
const ADMIN_ROLES = ['Admin', 'Inspector', 'SRIC'];

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('Please select your role first.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/login', { username, password });

            // Verify that the logged-in user's role matches what they selected
            if (res.data.role !== selectedRole) {
                setError(`Role mismatch. Your account role is "${res.data.role}", not "${selectedRole}".`);
                setLoading(false);
                return;
            }

            setToken(res.data.token);
            setUser({ id: res.data._id, username: res.data.username, role: res.data.role });

            if (ADMIN_ROLES.includes(res.data.role)) {
                navigate('/dashboard');
            } else {
                navigate('/staff-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', animation: 'fadeInUp 0.4s ease' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '200px', height: '200px', background: 'var(--purple-primary)', filter: 'blur(120px)', opacity: 0.3, pointerEvents: 'none' }} />

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--purple-primary), var(--purple-light))', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(168,85,247,0.4)' }}>
                        <Shield size={36} color="white" />
                    </div>
                    <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '3px', marginBottom: '0.5rem', background: 'linear-gradient(135deg,#fff,var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        OFFICIAL LOGIN
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Select your designation & enter credentials
                    </p>
                </div>

                {error && <div className="error-message mb-4">{error}</div>}

                <form onSubmit={handleLogin}>
                    {/* ── Role Selector ──────────────────── */}
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ChevronDown size={14} /> Select Designation
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    style={{
                                        padding: '0.65rem 0.5rem',
                                        borderRadius: '10px',
                                        border: selectedRole === role ? '2px solid var(--purple-light)' : '1px solid rgba(168,85,247,0.2)',
                                        background: selectedRole === role ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))' : 'rgba(124,58,237,0.05)',
                                        color: selectedRole === role ? 'white' : 'var(--white-60)',
                                        cursor: 'pointer',
                                        fontWeight: selectedRole === role ? 700 : 500,
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.5px',
                                        transition: 'all 0.2s ease',
                                        fontFamily: 'Inter, sans-serif',
                                        boxShadow: selectedRole === role ? '0 0 15px rgba(168,85,247,0.3)' : 'none',
                                    }}>
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Username ────────────────────────── */}
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={14} /> Username
                        </label>
                        <input type="text" className="form-control" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    {/* ── Password ────────────────────────── */}
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Lock size={14} /> Password
                        </label>
                        <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontFamily: 'Orbitron, monospace', letterSpacing: '3px', fontSize: '0.9rem', opacity: selectedRole ? 1 : 0.5 }}
                        disabled={loading || !selectedRole}>
                        {loading ? '■■■ AUTHENTICATING ■■■' : selectedRole ? `[ LOGIN AS ${selectedRole.toUpperCase()} ]` : '[ SELECT ROLE FIRST ]'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '1.5rem', letterSpacing: '1px' }}>
                    Tamluk Telecom · Purba Medinipur District Police
                </p>
            </div>
        </div>
    );
};

export default Login;
