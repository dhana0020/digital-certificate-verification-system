const Certificate = require("../models/Certificate");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Helper function to generate PDF
const generateCertificatePDF = (certificateData, qrFilePath, pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
    });

    const stream = fs.createWriteStream(pdfFilePath);
    doc.pipe(stream);

    // Border
    doc
      .lineWidth(3)
      .rect(40, 40, 760, 515)
      .stroke();

    doc
      .lineWidth(1)
      .rect(55, 55, 730, 485)
      .stroke();

    // Title
    doc
      .fontSize(34)
      .font("Helvetica-Bold")
      .text("CERTIFICATE", 0, 95, {
        align: "center",
      });

    doc
      .fontSize(18)
      .font("Helvetica")
      .text("OF COMPLETION", 0, 140, {
        align: "center",
      });

    // Main text
    doc
      .fontSize(14)
      .text("This certificate is proudly presented to", 0, 195, {
        align: "center",
      });

    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .text(certificateData.studentName, 0, 230, {
        align: "center",
      });

    doc
      .fontSize(14)
      .font("Helvetica")
      .text("for successfully participating in", 0, 285, {
        align: "center",
      });

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(certificateData.eventName, 0, 315, {
        align: "center",
      });

    // Issued details
    const formattedDate = new Date(certificateData.issueDate).toLocaleDateString("en-IN");

    doc
      .fontSize(13)
      .font("Helvetica")
      .text(`Issued By: ${certificateData.issuedBy}`, 90, 390);

    doc.text(`Issue Date: ${formattedDate}`, 90, 420);

    doc.text(`Certificate ID: ${certificateData.certificateId}`, 90, 450);

    // QR Code
    if (fs.existsSync(qrFilePath)) {
      doc.image(qrFilePath, 685, 390, {
  width: 90,
  height: 90,
});

      doc
        .fontSize(9)
        .text("Scan to verify", 682, 485, {
          width: 90,
          align: "center",
        });
    }

   // Authorized signature image
const signaturePath = path.join(__dirname, "../assets/signature.png");

if (fs.existsSync(signaturePath)) {
  doc.image(signaturePath, 535, 405, {
    width: 145,
  });
}

doc
  .fontSize(11)
  .font("Helvetica")
  .text("Authorized Signature", 535, 485, {
    width: 145,
    align: "center",
  });


    // Footer
    doc
      .fontSize(9)
      .text("This certificate can be verified using the QR code or certificate ID.", 0, 525, {
        align: "center",
      });

    doc.end();

    stream.on("finish", () => {
      resolve();
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

// Create certificate
const createCertificate = async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      eventName,
      issuedBy,
      issueDate,
    } = req.body;

    // Basic validation
    if (!studentName || !studentEmail || !eventName || !issuedBy || !issueDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
// console.log("1. Request received");
    // Generate unique certificate ID
    const count = await Certificate.countDocuments();
    // console.log("2. Count fetched");
    const year = new Date().getFullYear();
    const serialNumber = String(count + 1).padStart(3, "0");

    const certificateId = `CERT-${year}-${serialNumber}`;

    // Create verification URL
   
    const verificationUrl =
  `${process.env.FRONTEND_URL}/verify/${certificateId}`;

    // Create folders if they do not exist
    const qrFolderPath = path.join(__dirname, "../uploads/qrcodes");
    const pdfFolderPath = path.join(__dirname, "../uploads/pdfs");

    if (!fs.existsSync(qrFolderPath)) {
      fs.mkdirSync(qrFolderPath, { recursive: true });
    }

    if (!fs.existsSync(pdfFolderPath)) {
      fs.mkdirSync(pdfFolderPath, { recursive: true });
    }

    // QR code file path
    const qrFileName = `${certificateId}.png`;
    const qrFilePath = path.join(qrFolderPath, qrFileName);

    // Generate QR code image
    await QRCode.toFile(qrFilePath, verificationUrl);
    // console.log("3. QR generated");

    // PDF file path
    const pdfFileName = `${certificateId}.pdf`;
    const pdfFilePath = path.join(pdfFolderPath, pdfFileName);

    const certificateData = {
      certificateId,
      studentName,
      studentEmail,
      eventName,
      issuedBy,
      issueDate,
    };

    // Generate PDF certificate
    await generateCertificatePDF(certificateData, qrFilePath, pdfFilePath);
// console.log("4. PDF generated");
    // Public paths
    const qrCodePath = `/uploads/qrcodes/${qrFileName}`;
    const pdfUrl = `/uploads/pdfs/${pdfFileName}`;

    // Create certificate in database
    const certificate = await Certificate.create({
      certificateId,
      studentName,
      studentEmail,
      eventName,
      issuedBy,
      issueDate,
      qrCode: qrCodePath,
      pdfUrl,
    });
// console.log("5. Saved to MongoDB");
    res.status(201).json({
      message: "Certificate created successfully",
      verificationUrl,
      pdfDownloadUrl: `${process.env.BACKEND_URL}${pdfUrl}`,
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating certificate",
      error: error.message,
    });
  }
};

// Get all certificates
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching certificates",
      error: error.message,
    });
  }
};

// Revoke certificate
const revokeCertificate = async (req, res) => {
  try {
    const certificateId = req.params.certificateId.trim().toUpperCase();

    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    if (certificate.status === "revoked") {
      return res.status(200).json({
        message: "Certificate is already revoked",
        certificate,
      });
    }

    certificate.status = "revoked";
    await certificate.save();

    res.status(200).json({
      message: "Certificate revoked successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error revoking certificate",
      error: error.message,
    });
  }
};

// Download certificate PDF
const downloadCertificate = async (req, res) => {
  try {
    const certificateId = req.params.certificateId.trim().toUpperCase();

    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    if (!certificate.pdfUrl) {
      return res.status(404).json({
        message: "PDF not found for this certificate",
      });
    }

    const pdfPath = path.join(__dirname, "..", certificate.pdfUrl);
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        message: "PDF file does not exist on server",
      });
    }

    res.download(pdfPath, `${certificateId}.pdf`);
  } catch (error) {
    res.status(500).json({
      message: "Error downloading certificate",
      error: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalCertificates = await Certificate.countDocuments();

    const validCertificates = await Certificate.countDocuments({
      status: "valid",
    });

    const revokedCertificates = await Certificate.countDocuments({
      status: "revoked",
    });

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const issuedThisMonth = await Certificate.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      totalCertificates,
      validCertificates,
      revokedCertificates,
      issuedThisMonth,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  createCertificate,
  getAllCertificates,
  revokeCertificate,
  downloadCertificate,
   getDashboardStats,
};