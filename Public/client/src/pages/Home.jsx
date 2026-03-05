import { Link } from 'react-router-dom';
import { Wrench, FileText, Search, ShieldCheck, Phone, Mail, MapPin, Users, Monitor, Radio } from 'lucide-react';

const Home = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* ── HERO ─────────────────────────────────────────── */}
            <div className="glass-card hero-section" style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'linear-gradient(rgba(10, 5, 20, 0.85), rgba(10, 5, 20, 0.95)), url("/images/cinematic-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
                {/* Visual Glows */}
                <div style={{ position: 'absolute', top: '-120px', left: '-80px', width: '350px', height: '350px', background: 'var(--purple-primary)', filter: 'blur(180px)', opacity: 0.25, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-100px', right: '-80px', width: '300px', height: '300px', background: 'var(--purple-accent)', filter: 'blur(160px)', opacity: 0.2, pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(124,58,237,0.15)', borderRadius: '50%', border: '1px solid rgba(168,85,247,0.3)', animation: 'pulse-glow 3s infinite' }}>
                        <ShieldCheck size={72} color="var(--purple-light)" />
                    </div>
                </div>

                <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '2.8rem', fontWeight: 900, letterSpacing: '6px', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff 30%, var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    TAMLUK TELECOM
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Computer Workshop Management System
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--purple-glow)', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '3rem' }}>
                    Purba Medinipur District Police
                </p>

                {/* Live Clock */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '0.75rem 1.5rem', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', color: 'var(--purple-glow)', fontWeight: 700 }}>{timeStr}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>Current Time</div>
                    </div>
                    <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '0.75rem 1.5rem', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '1rem', color: 'white', fontWeight: 500 }}>{dateStr}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>Today</div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid-2" style={{ maxWidth: '840px', margin: '0 auto', gap: '1.5rem' }}>
                    <Link to="/repair-request" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid rgba(168,85,247,0.1)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.1)'; }}>
                            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.2))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Wrench size={28} color="var(--purple-light)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>Repair Request</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Submit IT equipment repair requests.</p>
                        </div>
                    </Link>
                    <Link to="/requisition" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid rgba(168,85,247,0.1)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.1)'; }}>
                            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(16,185,129,0.15))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <FileText size={28} color="var(--success)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>Item Requisition</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Request new IT equipment or parts.</p>
                        </div>
                    </Link>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <Link to="/track-status" className="btn btn-outline" style={{ letterSpacing: '2px', fontFamily: 'Orbitron, monospace', fontSize: '0.85rem' }}>
                        <Search size={18} /> Track Status
                    </Link>
                </div>
            </div>

            {/* ── ABOUT US ────────────────────────────────────── */}
            <div id="about" className="glass-card" style={{ marginBottom: '2rem', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'var(--purple-primary)', filter: 'blur(120px)', opacity: 0.15, pointerEvents: 'none' }} />
                <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '3px', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg,#fff,var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ABOUT US
                </h2>
                <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                    <div>
                        <h3 style={{ color: 'var(--purple-glow)', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Monitor size={20} /> Our Mission
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>
                            Tamluk Telecom – Computer Workshop is the dedicated IT support unit of the Purba Medinipur District Police.
                            We maintain, repair, and manage all computer systems, networking equipment, and digital infrastructure
                            across police stations and offices throughout the district.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--purple-glow)', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} /> Our Team
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>
                            Our team consists of dedicated officers including SROs, SRTs, Wireless Operators, HG/NVF personnel,
                            RTCs, and CVs — all working under the supervision of the Inspector and SRIC to ensure
                            seamless IT operations for law enforcement across the district.
                        </p>
                    </div>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        {['SRO', 'SRT', 'Wireless Operator', 'HG/NVF', 'RTC', 'CV'].map(role => (
                            <div key={role} style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '0.5rem 1rem' }}>
                                <Radio size={14} color="var(--purple-glow)" style={{ display: 'inline', marginRight: '0.4rem' }} />
                                <span style={{ color: 'var(--purple-glow)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>{role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CONTACT ─────────────────────────────────────── */}
            <div id="contact" className="glass-card" style={{ padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'var(--purple-accent)', filter: 'blur(120px)', opacity: 0.12, pointerEvents: 'none' }} />
                <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '3px', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg,#fff,var(--purple-glow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    CONTACT US
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', flexShrink: 0 }}>
                            <Phone size={24} color="var(--purple-light)" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'white' }}>Phone</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>03228-263XXX</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Emergency: 100</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', flexShrink: 0 }}>
                            <Mail size={24} color="var(--purple-light)" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'white' }}>Email</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>tamluk.telecom@police.wb.gov.in</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', flexShrink: 0 }}>
                            <MapPin size={24} color="var(--purple-light)" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'white' }}>Address</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Tamluk Telecom, Computer Workshop<br />
                                District Police Office, Tamluk<br />
                                Purba Medinipur, West Bengal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
