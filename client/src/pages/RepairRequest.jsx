import { useState } from 'react';
import axios from 'axios';
import { Wrench, Upload } from 'lucide-react';

const psOptions = ['Tamluk', 'Kolaghat', 'Panskura', 'Chandipur', 'Moyna', 'Nandakumar'];
const officeOptions = [
    'DEB', 'DIB', 'Police Office', 'Cyber Crime', 'Social Media',
    'Steno', 'Addl SP PA', 'SP PA', 'DCRB', 'DCR'
];

const RepairRequest = () => {
    const [type, setType] = useState('PS');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        location: psOptions[0],
        issue: '',
        contact: ''
    });
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        setFormData(prev => ({
            ...prev,
            location: newType === 'PS' ? psOptions[0] : officeOptions[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setSubmitting(true);

        try {
            const fd = new FormData();
            fd.append('type', type);
            fd.append('location', formData.location);
            fd.append('issue', formData.issue);
            fd.append('contact', formData.contact);
            if (file) fd.append('file', file);

            const res = await axios.post('/api/repairs', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(`Repair request submitted successfully! Your Tracking ID is: ${res.data.repairId}`);
            setFormData({ location: type === 'PS' ? psOptions[0] : officeOptions[0], issue: '', contact: '' });
            setFile(null);
            e.target.reset();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-card tracking-wrapper" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Wrench size={32} color="var(--accent)" />
                <h2>Submit Repair Request</h2>
            </div>

            {success && <div className="success-message mb-4">{success}</div>}
            {error && <div className="error-message mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-control" name="type" value={type} onChange={handleTypeChange}>
                        <option value="PS">Police Station (PS)</option>
                        <option value="Office">Office</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Location</label>
                    <select className="form-control" name="location" value={formData.location} onChange={handleChange} required>
                        {(type === 'PS' ? psOptions : officeOptions).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Issue Description</label>
                    <textarea
                        className="form-control"
                        name="issue"
                        rows="4"
                        value={formData.issue}
                        onChange={handleChange}
                        placeholder="Describe the problem..."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Official mobile number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Upload size={14} /> Upload Document / Image (Optional)
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default RepairRequest;
