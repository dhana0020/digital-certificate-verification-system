const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    eventName: {
      type: String,
      required: true,
    },

    issuedBy: {
      type: String,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["valid", "revoked"],
      default: "valid",
    },

    qrCode: {
      type: String,
      default: "",
    },

    pdfUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);