import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function TrackRequest() {
  const { trackingId: urlTrackingId } = useParams();
  const [trackingId, setTrackingId] = useState(urlTrackingId || '');
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto-search if tracking ID is in URL
  useEffect(() => {
    if (urlTrackingId) {
      handleSearchWithId(urlTrackingId);
    }
  }, [urlTrackingId]);

  const handleSearchWithId = async (id) => {
    setLoading(true);
    setError('');
    setRequest(null);
    setSearched(true);

    try {
      const response = await API.get(`/requests/track/${id.trim()}`);
      setRequest(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Request not found. Please check your tracking ID.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    await handleSearchWithId(trackingId);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'New': { bg: '#f8f9fa', color: '#333', icon: '🆕' },
      'In Progress': { bg: '#fff3cd', color: '#856404', icon: '🔄' },
      'Resolved': { bg: '#d4edda', color: '#155724', icon: '✅' }
    };
    
    const style = styles[status] || { bg: '#f8f9fa', color: '#333', icon: '📋' };
    
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {style.icon} {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Track Your Request
      </h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID (e.g., REQ-2026-7598)"
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {searched && !loading && !error && !request && (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No request found. Please check your tracking ID.
        </div>
      )}

      {request && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>{request.request_number}</h2>
            {getStatusBadge(request.status)}
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#555' }}>Name:</strong>
              <p style={{ margin: '5px 0 0 0' }}>{request.name}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#555' }}>Description:</strong>
              <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>
                {request.description}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              marginTop: '20px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Submitted:</strong> {formatDate(request.created_at)}
              </div>
              
              {request.updated_at && request.updated_at !== request.created_at && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Last Updated:</strong> {formatDate(request.updated_at)}
                </div>
              )}
              
              {request.resolved_at && (
                <div>
                  <strong>Resolved:</strong> {formatDate(request.resolved_at)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
        <p>
          <small>
            Need help? Contact support at{' '}
            <a href="mailto:support@example.com">support@example.com</a>
          </small>
        </p>
      </div>
    </div>
  );
}

export default TrackRequest;