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

  // update request status (e.g., from "Pending" to "In Progress" or "Resolved")
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

      <div style={{ marginTop: "20px" }}>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "12px" }}>{req.request_number}</td>
                  <td style={{ padding: "12px" }}>{req.name}</td>
                  <td style={{ padding: "12px" }}>{req.email}</td>
                  <td style={{ padding: "12px" }}>
                    {req.description.length > 50
                      ? req.description.substring(0, 50) + "..."
                      : req.description}
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
