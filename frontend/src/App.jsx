import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import VerifyCertificate from "./pages/VerifyCertificate";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateCertificate from "./pages/CreateCertificate";

import ManageCertificates from "./pages/ManageCertificates";

import ProtectedRoute from "./pages/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<VerifyCertificate />} />
      <Route
        path="/verify/:certificateId"
        element={<VerifyCertificate />}
      />
      <Route path="/login" element={<Login />} />
     <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/create-certificate"
  element={
    <ProtectedRoute>
      <CreateCertificate />
    </ProtectedRoute>
  }
/>

<Route
  path="/certificates"
  element={
    <ProtectedRoute>
      <ManageCertificates />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;