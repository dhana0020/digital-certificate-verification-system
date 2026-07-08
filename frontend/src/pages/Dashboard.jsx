import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";



function Dashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    validCertificates: 0,
    revokedCertificates: 0,
    issuedThisMonth: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chartData = [
    {
      name: "Valid",
      value: stats.validCertificates
    },
    {
      name: "Revoked",
      value: stats.revokedCertificates
    }
  ];

  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCertificates();
  }, []);
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
  const fetchStats = async () => {
    try {
      const res = await api.get("/api/certificates/stats");
      console.log("Certificates Response:", res.data);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/api/certificates");
      console.log("Certificates:", res.data);
      setCertificates(res.data.certificates);

    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  return (
    <div className="dashboard-layout">

      <aside
        className={`sidebar ${sidebarOpen ? "active" : "collapsed"
          }`}
      >

        <div className="sidebar-header">
          <h2 style={{
            marginTop: "50px ",
            marginLeft: "30px",
            color: "#fff",
          }}>ToCertify</h2>
        </div>

        <nav>
          <button
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/create-certificate");
              setSidebarOpen(false);
            }}
          >
            Issue Certificate
          </button>

          <button
            onClick={() => {
              navigate("/certificates");
              setSidebarOpen(false);
            }}
          >
            Certificates
          </button>
        </nav>
        <div className="sidebar-footer">
    <button
      className="sidebar-logout"
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      Logout
    </button>
  </div>
      </aside>
      {/* Overlay */}
      {/* {sidebarOpen && window.innerWidth <= 768 && (
  <div
    className="overlay"
    onClick={() => setSidebarOpen(false)}
  />
)} */}

      <main
  className={`dashboard-main ${
    sidebarOpen ? "sidebar-open" : ""
  }`}
>
        <button
          className={`menu-btn ${sidebarOpen ? "menu-open" : ""
            }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <div className="dashboard-page">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          <div className="bg-shape shape3"></div>
          <div className="dashboard-header">

  <div>
    <h1>Welcome Back!</h1>
    <h4>Admin</h4>
  </div>

<div className="profile-container">
  <div
    className="profile-box"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <div className="avatar">A</div>
  
  </div>

  {showProfileMenu && (
    <div style={{
      background: "#3c3c3cd3",
    }}
    className="profile-dropdown">
      <div className="dropdown-user">
        <strong style={{color:"white"}}>Admin</strong>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  )}
</div>

</div>

          <div className="stats-grid">

            <div className="stat-card total">
              <h3>Total Certificates</h3>
              <h2>{stats.totalCertificates}</h2>
            </div>

            <div className="stat-card valid">
              <h3>Valid Certificates</h3>
              <h2>{stats.validCertificates}</h2>
            </div>

            <div className="stat-card revoked">
              <h3>Revoked Certificates</h3>
              <h2>{stats.revokedCertificates}</h2>
            </div>

            <div className="stat-card monthly">
              <h3>Issued This Month</h3>
              <h2>{stats.issuedThisMonth}</h2>
            </div>

          </div>

          <div className="dashboard-content">

            <div className="recent-certificates">
              <h2>Recent Certificates</h2>

              <table className="cert-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Certificate</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(certificates) &&
                    certificates.slice(0, 5).map((cert) => (
                      <tr key={cert._id}>
                        <td>{cert.studentName}</td>

                        <td>{cert.eventName}</td>

                        <td>
                          <span
                            className={
                              cert.status === "revoked"
                                ? "badge revoked"
                                : "badge active"
                            }
                          >
                            {cert.status === "revoked"
                              ? "Revoked"
                              : "Valid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="chart-card">


              {/* <div className="chart-placeholder">
          <div>
            <h3>✅ Active: {stats.validCertificates}</h3>
            <h3>❌ Revoked: {stats.revokedCertificates}</h3>
          </div>
        </div> */}

              <h2>Status Overview</h2>

              <PieChart width={300} height={250}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>

                <Tooltip />
              </PieChart>

            </div>

          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>

            <div className="quick-action-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/create-certificate")}
              >
                Issue Certificate
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/certificates")}
              >
                Manage Certificates
              </button>

              <button
                className="secondary-btn"
                onClick={() => window.print()}
              >
                Export Report
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>

  );
}

export default Dashboard;
