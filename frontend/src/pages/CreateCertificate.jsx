import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router";
import "./CreateCertificate.css";
function CreateCertificate() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    eventName: "",
    issuedBy: "",
    issueDate: "",
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log(formData);

    const res = await api.post(
      "/api/certificates/create",
      formData
    );

    alert("Certificate created successfully!");
    console.log(res.data);

    setFormData({
      studentName: "",
      studentEmail: "",
      eventName: "",
      issuedBy: "",
      issueDate: "",
    });

    navigate("/dashboard");
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response:", error.response);
    console.log("Data:", error.response?.data);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Error creating certificate"
    );
  }
};


  

  return (
    <div className="create-page">
  <div className="create-card">

    <div className="card-header">
      <h1>Issue Certificate</h1>
      <p>Create and issue digital certificates instantly.</p>
    </div>

    <div className="form-content">
      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="form-group">
          <label>Student Email</label>
          <input
            type="email"
            name="studentEmail"
            value={formData.studentEmail}
            onChange={handleChange}
            placeholder="student@email.com"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Web Development Workshop"
            required
          />
        </div>

        <div className="form-group">
          <label>Issued By</label>
          <input
            type="text"
            name="issuedBy"
            value={formData.issuedBy}
            onChange={handleChange}
            placeholder="Organization Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Issue Date</label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <button className="create-btn" type="submit">
            Issue Certificate
          </button>
        </div>

      </form>
    </div>

  </div>
</div>
  );

}
export default CreateCertificate;