import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Home, LogOut, LayoutDashboard, Zap, Info, Phone } from 'lucide-react';
import { isAuthenticated, removeToken, removeUser, getUser } from '../utils/auth';

const ADMIN_ROLES = ['Admin', 'Inspector', 'SRIC'];

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getUser();

    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;
    const dashPath = user && ADMIN_ROLES.includes(user.role) ? '/dashboard' : '/staff-dashboard';

    const navIcon = (path, icon, title) => (
        <Link to={path} style={{ textDecoration: 'none' }}>
            <div title={title} style={{ padding: '0.5rem', borderRadius: '8px', background: isActive(path) ? 'rgba(168,85,247,0.2)' : 'transparent', color: isActive(path) ? 'var(--purple-glow)' : 'var(--white-60)', transition: 'all 0.2s', display: 'flex' }}>
                {icon}
            </div>
        </Link>
    );

    return (
        <div style={{ minHeight: '100vh' }}>
            <div className="container" style={{ paddingBottom: 0 }}>
                <header className="header glass-card" style={{ marginBottom: 0 }}>
                    <div className="logo-container">
                        <div className="logo-icon">
                            <Shield color="white" size={22} />
                        </div>
                        <div className="title-group">
                            <h1>TAMLUK TELECOM</h1>
                            <p>Computer Workshop · Purba Medinipur Police</p>
                        </div>
                    </div>

                    <nav className="nav-links">
                        {navIcon('/', <Home size={20} />, 'Home')}

                        {/* About & Contact anchor links (only on home) */}
                        <a href="/#about" style={{ textDecoration: 'none', padding: '0.5rem', borderRadius: '8px', display: 'flex', color: 'var(--white-60)', transition: 'all 0.2s' }} title="About Us">
                            <Info size={20} />
                        </a>
                        <a href="/#contact" style={{ textDecoration: 'none', padding: '0.5rem', borderRadius: '8px', display: 'flex', color: 'var(--white-60)', transition: 'all 0.2s' }} title="Contact">
                            <Phone size={20} />
                        </a>

                        {isAuth ? (
                            <>
                                {navIcon(dashPath, <LayoutDashboard size={20} />, 'Dashboard')}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(168,85,247,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--purple-glow)', fontWeight: 600 }}>{user?.role}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--white-60)' }}>· {user?.username}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                <Zap size={16} /> Login
                            </Link>
                        )}
                    </nav>
                </header>
            </div>

            <main className="container" style={{ paddingTop: '2rem' }}>
                {children}
            </main>

            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.75rem', borderTop: '1px solid rgba(168,85,247,0.1)', marginTop: '2rem', letterSpacing: '1px' }}>
                © 2025 TAMLUK TELECOM · Computer Workshop Management · Purba Medinipur District Police
            </footer>
        </div>
    );
};

export default Layout;
