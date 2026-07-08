import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageCertificates.css";

import { useNavigate } from "react-router";

function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/api/certificates");
      setCertificates(res.data.certificates);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRevoke = async (certificateId) => {
    try {
      await api.put(
        `/api/certificates/revoke/${certificateId}`
      );

      fetchCertificates();
      alert("Certificate revoked successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = (certificateId) => {
    window.open(
      `http://localhost:5000/api/certificates/download/${certificateId}`,
      "_blank"
    );

  };
const filteredCertificates = certificates.filter((cert) => {
  const matchesSearch =
    cert.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    cert.certificateId
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    cert.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    cert.status === statusFilter;

  return matchesSearch && matchesStatus;
});
  return (
    <div className="manage-page">

  <div className="manage-header">
    <div>
      <h1>Manage Certificates</h1>
      
      <p>
        View, download and revoke issued certificates
      </p>
    </div>
     <button
    className="dashboard-btn"
    onClick={() => navigate("/dashboard")}
  >
   ← Dashboard
  </button>
  </div>

  <div className="search-filter">
    <input
  type="text"
  placeholder=" Search certificate..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

   <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="all">All Status</option>
  <option value="valid">Valid</option>
  <option value="revoked">Revoked</option>
</select>
  </div>

  <div className="table-container">
      <table className="manage-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Event</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
         {filteredCertificates.map((cert) => (
            <tr key={cert._id}>
              <td>{cert.certificateId}</td>
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
                  {cert.status}
                </span>
              </td>

              <td>
  <div className="action-buttons">

    <button
  className="download-btn"
  onClick={() =>
    handleDownload(cert.certificateId)
  }
>
  Download
</button>

    {cert.status !== "revoked" ? (
      <button
        className="revoke-btn"
        onClick={() =>
          handleRevoke(cert.certificateId)
        }
      >
        Revoke
       </button>
) : (
  <div className="button-placeholder"></div>
)}

  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default ManageCertificates;