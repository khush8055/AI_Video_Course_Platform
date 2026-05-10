import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-center" style={{ background: 'var(--bg-subtle)' }}>
      <div className="card auth-container" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Enter your details to access your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: '600', color: "var(--text)" }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: "0.85rem", fontWeight: '600', color: "var(--text)" }}>Password</label>
              <Link to="#" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Forgot password?</Link>
            </div>
            <input 
              placeholder="••••••••" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.8rem", fontSize: "1rem" }}>Sign In</button>
        </form>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: '0.9rem', color: "var(--text-muted)" }}>
            Don't have an account? <Link to="/signup" style={{ fontWeight: "700", color: 'var(--primary)' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}