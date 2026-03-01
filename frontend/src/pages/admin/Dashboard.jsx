import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await API.get("/admin/requests", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // update request status
  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await API.patch(
        `/admin/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${admin.token}` } },
      );

      // Update local state
      setRequests(
        requests.map((req) => (req.id === requestId ? response.data : req)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Helper function to get category badge styles
  const getCategoryStyle = (category) => {
    const styles = {
      'IT': { bg: '#cfe2ff', color: '#084298' },
      'Billing': { bg: '#d1e7dd', color: '#0f5132' },
      'Bug': { bg: '#f8d7da', color: '#842029' },
      'Feature Request': { bg: '#fff3cd', color: '#664d03' },
      'Other': { bg: '#f8f9fa', color: '#333' }
    };
    return styles[category] || styles['Other'];
  };

  // Helper function to get priority badge styles
  const getPriorityStyle = (priority) => {
    const styles = {
      'High': { bg: '#f8d7da', color: '#842029' },
      'Medium': { bg: '#fff3cd', color: '#664d03' },
      'Low': { bg: '#d1e7dd', color: '#0f5132' }
    };
    return styles[priority] || { bg: '#f8f9fa', color: '#333' };
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Service Requests Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Description</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Category</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Priority</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Summary</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const categoryStyle = getCategoryStyle(req.ai_category);
                const priorityStyle = getPriorityStyle(req.ai_priority);
                
                return (
                  <tr key={req.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: "12px" }}>{req.request_number}</td>
                    <td style={{ padding: "12px" }}>{req.name}</td>
                    <td style={{ padding: "12px" }}>{req.email}</td>
                    <td style={{ padding: "12px" }}>
                      {req.description.length > 50
                        ? req.description.substring(0, 50) + "..."
                        : req.description}
                    </td>
                    
                    {/* NEW: Category Badge */}
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: categoryStyle.bg,
                        color: categoryStyle.color,
                        fontWeight: "500",
                        display: "inline-block"
                      }}>
                        {req.ai_category || "—"}
                      </span>
                    </td>
                    
                    {/* NEW: Priority Badge */}
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: priorityStyle.bg,
                        color: priorityStyle.color,
                        fontWeight: "bold",
                        display: "inline-block"
                      }}>
                        {req.ai_priority || "—"}
                      </span>
                    </td>
                    
                    {/* NEW: Summary with tooltip */}
                    <td style={{ padding: "12px", maxWidth: "200px" }} title={req.ai_summary}>
                      {req.ai_summary
                        ? (req.ai_summary.length > 60
                          ? req.ai_summary.substring(0, 60) + "..."
                          : req.ai_summary)
                        : "—"}
                    </td>
                    
                    <td style={{ padding: "12px" }}>
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                          backgroundColor:
                            req.status === "Resolved"
                              ? "#d4edda"
                              : req.status === "In Progress"
                                ? "#fff3cd"
                                : "#f8f9fa",
                          color:
                            req.status === "Resolved"
                              ? "#155724"
                              : req.status === "In Progress"
                                ? "#856404"
                                : "#333",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        <option value="New">🆕 New</option>
                        <option value="In Progress">🔄 In Progress</option>
                        <option value="Resolved">✅ Resolved</option>
                      </select>
                    </td>

                    <td style={{ padding: "12px" }}>
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;