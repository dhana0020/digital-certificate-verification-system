import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../services/api";
import "./VerifyCertificate.css";

import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router";

function VerifyCertificate() {
  const { certificateId: certificateIdFromUrl } = useParams();
  const [showScanner, setShowScanner] = useState(false);
  const [certificateId, setCertificateId] = useState(
    certificateIdFromUrl || ""
  );

  const [mode, setMode] = useState(null);
  // null | "scan" | "manual"
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!showScanner) return;

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        const scannedId = decodedText
          .split("/")
          .pop()
          .trim()
          .toUpperCase();

         setCertificateId(scannedId);

  setShowScanner(false);

  setMode("manual");

  verifyCertificateById(scannedId);
      }
    );

    return () => {
      html5QrCode.stop().catch(() => { });
    };
  }, [showScanner]);

  const startScanner = () => {
    setShowScanner(true);
  };

  const verifyCertificateById = useCallback(async (id) => {
    const cleanedId = String(id || "")
      .trim()
      .toUpperCase();

    if (!cleanedId) {
      setResult(null);
      setErrorMessage("Please enter a certificate ID.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setErrorMessage("");

      const response = await api.get(
        `/api/verify/${encodeURIComponent(cleanedId)}`
      );

      setResult(response.data);
    } catch (error) {
      if (error.response?.data) {
        setResult(error.response.data);
      } else {
        setErrorMessage(
          "Unable to connect to the server. Make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (certificateIdFromUrl) {
      const cleanedUrlId = certificateIdFromUrl
        .trim()
        .toUpperCase();

      setCertificateId(cleanedUrlId);
      verifyCertificateById(cleanedUrlId);
    }
  }, [certificateIdFromUrl, verifyCertificateById]);

  const handleVerify = async (event) => {
    event.preventDefault();
    await verifyCertificateById(certificateId);
  };

  return (
    <main className="verify-page">
      <section className="verify-container">
        <div className="top-actions">
  {mode ? (
  <Link
    
    className="back-link" to="/verify"
    onClick={() => {
      setMode(null);
      setCertificateId("");
      setResult(null);
      setErrorMessage("");
      setShowScanner(false);
    }}
  >
    ← Choose Another Verification Method
  </Link>
) : (
  <Link className="back-link" to="/">
    ← Back to Home
  </Link>
)}
</div>

        <div className="verify-header">
          <h1>Certificate Verification Portal</h1>

          <p>
            Verify the authenticity of digital certificates instantly.
          </p>
        </div>
        {mode === null && (
          <div className="verify-options">

            <div
              className="option-card"
              onClick={() => {
                setMode("scan");
                setShowScanner(true);
              }}
            >
              <h3>📷 Scan QR</h3>
              <p>Scan certificate QR code</p>
            </div>

            <div
              className="option-card"
              onClick={() => {
                setMode("manual");
                setShowScanner(false);
              }}
            >
              <h3>📝 Enter ID</h3>
              <p>Verify manually using certificate ID</p>
            </div>

          </div>)}
        {mode === "scan" && showScanner && (
          <div className="scanner-container">
            <h3>Scan QR Code</h3>
            <div id="reader"></div>
          </div>
        )}



        {(mode === "manual" || certificateId) && (
          <form className="verify-form" onSubmit={handleVerify}>
            <label htmlFor="certificateId">Certificate ID</label>

            <input
              id="certificateId"
              type="text"
              value={certificateId}
              onChange={(event) => {
                setCertificateId(event.target.value);
                setResult(null);
                setErrorMessage("");
              }}
              placeholder="Example: CERT-2026-011"
              autoComplete="off"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>)}
          

        {errorMessage && (
          <div className="result-card error-card">
            <h2>Connection Error</h2>
            <p>{errorMessage}</p>
          </div>
        )}

        {result?.status === "valid" && (
          <div className="result-card valid-card">


            <div className="status-icon">✓</div>

            <h2>Valid Certificate</h2>
            <p className="result-message">{result.message}</p>
            <div className="certificate-details">
              <p>
                <strong>Certificate ID:</strong>
                {result.certificate.certificateId}
              </p>

              <p>
                <strong>Student Name:</strong>
                {result.certificate.studentName}
              </p>

              <p>
                <strong>Event Name:</strong>
                {result.certificate.eventName}
              </p>

              <p>
                <strong>Issued By:</strong>
                {result.certificate.issuedBy}
              </p>

              <p>
                <strong>Issue Date:</strong>
                {new Date(
                  result.certificate.issueDate
                ).toLocaleDateString("en-IN")}
              </p>

              <p>
                <strong>Status:</strong>
                <span className="status-valid">
                  {result.certificate.status.toUpperCase()}
                </span>
              </p>

              <a
                href={`http://localhost:5000/api/certificates/download/${result.certificate.certificateId}`}
                className="download--btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Certificate PDF
              </a>
            </div>
            {/* <div className="certificate-details">
              <p>
                <strong>Certificate ID:</strong>{" "}
                {result.certificate.certificateId}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {result.certificate.studentName}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {result.certificate.eventName}
              </p>

              <p>
                <strong>Issued By:</strong>{" "}
                {result.certificate.issuedBy}
              </p>

              <p>
                <strong>Issue Date:</strong>{" "}
                {new Date(
                  result.certificate.issueDate
                ).toLocaleDateString("en-IN")}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {result.certificate.status.toUpperCase()}
              </p>
            </div> */}
          </div>
        )}

        {result?.status === "invalid" && (
          <div className="result-card invalid-card">
            <div className="status-icon">×</div>
            <h2>Invalid Certificate</h2>
            <p>{result.message}</p>
          </div>
        )}

        {result?.status === "revoked" && (
          <div className="result-card revoked-card">
            <div className="status-icon">!</div>

            <h2>Certificate Revoked</h2>
            <p>{result.message}</p>

            {result.certificate && (
              <div className="certificate-details">
                <p>
                  <strong>Certificate ID:</strong>{" "}
                  {result.certificate.certificateId}
                </p>

                <p>
                  <strong>Student Name:</strong>{" "}
                  {result.certificate.studentName}
                </p>

                <p>
                  <strong>Event:</strong>{" "}
                  {result.certificate.eventName}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default VerifyCertificate;