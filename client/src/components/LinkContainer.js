import { useEffect, useMemo, useState } from 'react';
import './CivicPlatform.css';

const getEmptyForm = () => ({
  title: '',
  description: '',
  category: 'road',
  location_text: '',
});

const parseErrorResponse = async (response, fallback) => {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorBody = await response.json();
      return errorBody.error || fallback;
    }
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
};

const LinkContainer = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(getEmptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchReports = async ({ showLoading = false } = {}) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await fetch('/reports');
      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response, 'Failed to fetch reports');
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports({ showLoading: true });
  }, []);

  const filteredReports = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter((report) => report.status === filter);
  }, [reports, filter]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createReport = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response, 'Failed to create report');
        throw new Error(errorMessage);
      }

      setForm(getEmptyForm());
      setMessage('Report created.');
      fetchReports();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response, 'Failed to update status');
        throw new Error(errorMessage);
      }

      fetchReports();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const deleteReport = async (id) => {
    try {
      const response = await fetch(`/reports/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to delete report');
      }
      setMessage('Report deleted.');
      fetchReports();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const statusClass = (status) => `civic-status-badge civic-status-${status}`;

  return (
    <div className="civic-page">
      <header className="civic-header">
        <h1>Civic Reporting Platform</h1>
        <p>Submit and track local issues like potholes, streetlights, and trash.</p>
      </header>

      <section className="civic-card">
        <h2 className="civic-section-title">Create Report</h2>
        <form className="civic-form" onSubmit={createReport}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              placeholder="Pothole on Main St"
              value={form.title}
              onChange={onInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={onInputChange}>
              <option value="road">Road</option>
              <option value="lighting">Lighting</option>
              <option value="sanitation">Sanitation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="civic-field-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the issue"
              value={form.description}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="civic-field-full">
            <label htmlFor="location_text">Location</label>
            <input
              id="location_text"
              name="location_text"
              placeholder="Street address or intersection"
              value={form.location_text}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="civic-submit-row">
            <button type="submit" className="civic-btn civic-btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </section>

      {message && (
        <p className={`civic-message ${message.startsWith('Error:') ? 'civic-message-error' : ''}`}>
          {message}
        </p>
      )}

      <section className="civic-card">
        <h2 className="civic-section-title">Reports</h2>
        <div className="civic-filters">
          {['all', 'open', 'in_progress', 'resolved'].map((status) => (
            <button
              key={status}
              type="button"
              className={`civic-btn civic-filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="civic-empty">Loading reports...</p>
        ) : filteredReports.length === 0 ? (
          <p className="civic-empty">No reports found for this filter.</p>
        ) : (
          <ul className="civic-reports-list">
            {filteredReports.map((report) => (
              <li key={report.id} className="civic-report-card">
                <h3 className="civic-report-title">{report.title}</h3>
                <p className="civic-report-meta">
                  {report.category} · {report.location_text}{' '}
                  <span className={statusClass(report.status)}>{report.status.replace('_', ' ')}</span>
                </p>
                <p className="civic-report-description">{report.description}</p>
                <div className="civic-report-actions">
                  <label htmlFor={`status-${report.id}`}>Update status</label>
                  <select
                    id={`status-${report.id}`}
                    value={report.status}
                    onChange={(event) => updateStatus(report.id, event.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    type="button"
                    className="civic-btn civic-btn-danger"
                    onClick={() => deleteReport(report.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default LinkContainer;
