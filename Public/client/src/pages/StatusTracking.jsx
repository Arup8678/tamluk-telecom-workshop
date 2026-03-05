import { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const StatusTracking = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingId) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Determine if it's REQ or REP from prefix
            const prefix = trackingId.substring(0, 3).toUpperCase();
            let endpoint = '';

            if (prefix === 'REP') {
                endpoint = `/api/repairs/status/${trackingId}`;
            } else if (prefix === 'REQ') {
                endpoint = `/api/requisitions/status/${trackingId}`;
            } else {
                throw new Error('Invalid Tracking ID Format (Must start with REP- or REQ-)');
            }

            const res = await axios.get(endpoint);
            setResult({ ...res.data, type: prefix === 'REP' ? 'Repair' : 'Requisition' });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Tracking ID not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card tracking-wrapper" style={{ marginTop: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Search size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                <h2>Track Request Status</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Enter your Repair ID or Requisition ID to check current status</p>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    className="form-control"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                    placeholder="e.g. REP-123456-78 or REQ-123456-78"
                    style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Track'}
                </button>
            </form>

            {error && <div className="error-message text-center mt-4">{error}</div>}

            {result && (
                <div className="glass-card tracking-result mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        {result.type} Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <p className="form-label">Tracking ID</p>
                            <p className="font-bold">{result.repairId || result.requisitionId}</p>
                        </div>
                        <div>
                            <p className="form-label">Current Status</p>
                            <span className={`badge badge-${result.status.toLowerCase()}`}>
                                {result.status}
                            </span>
                        </div>
                        <div>
                            <p className="form-label">Location</p>
                            <p>{result.location} ({result.type})</p>
                        </div>
                        <div>
                            <p className="form-label">Submitted On</p>
                            <p>{new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p className="form-label">{result.type === 'Repair' ? 'Issue reported' : 'Item requested'}</p>
                            <p>{result.issue || `${result.quantity}x ${result.item}`}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusTracking;
