const express = require("express");
const {
  createCertificate,
  getAllCertificates,
  revokeCertificate,
  downloadCertificate,
  getDashboardStats,
} = require("../controllers/certificateController");

const router = express.Router();

router.post("/create", createCertificate);
router.get("/stats", getDashboardStats);
router.get("/", getAllCertificates);
router.put("/revoke/:certificateId", revokeCertificate);
router.get("/download/:certificateId", downloadCertificate);


module.exports = router;