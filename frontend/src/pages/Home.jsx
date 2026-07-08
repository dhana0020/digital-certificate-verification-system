import { Link } from "react-router";
import "./Home.css";
function Home() {
  return (
    <main className="home-page">
     <header className="home-header">
        <Link className="admin-btn" to="/login">
          👤 Admin Login
        </Link>
      </header>
      <section className="hero-section">
        <h1>Digital Certificate Verification System</h1>

        <p>
          Securely issue, manage, and verify digital certificates using unique Certificate IDs and QR Codes.
        </p>

        <Link className="verify-link-button" to="/verify">
          Verify Certificate
        </Link>
        
      </section>
      <footer class="footer">
    © 2026 Digital Certificate Verification System.</footer>
    </main>
    
  );
}

export default Home;