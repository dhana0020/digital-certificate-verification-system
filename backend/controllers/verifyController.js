const Certificate = require("../models/Certificate");

// Verify certificate by certificate ID
const verifyCertificate = async (req, res) => {
  try {
    const certificateId = req.params.certificateId
      .trim()
      .toUpperCase();

    const certificate = await Certificate.findOne({
      certificateId,
    });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        status: "invalid",
        message: "Certificate not found",
      });
    }

    if (certificate.status === "revoked") {
      return res.status(200).json({
        valid: false,
        status: "revoked",
        message: "Certificate has been revoked",
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          studentEmail: certificate.studentEmail,
          eventName: certificate.eventName,
          issuedBy: certificate.issuedBy,
          issueDate: certificate.issueDate,
          status: certificate.status,
        },
      });
    }

    return res.status(200).json({
      valid: true,
      status: "valid",
      message: "Certificate is valid",
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        studentEmail: certificate.studentEmail,
        eventName: certificate.eventName,
        issuedBy: certificate.issuedBy,
        issueDate: certificate.issueDate,
        status: certificate.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying certificate",
      error: error.message,
    });
  }
};

module.exports = {
  verifyCertificate,
};