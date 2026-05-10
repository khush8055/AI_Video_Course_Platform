import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update auth profile
      await updateProfile(user, { displayName: name });

      // Save user to firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date()
      });

      alert("Signup successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-center" style={{ background: 'var(--bg-subtle)' }}>
      <div className="card auth-container" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Get Started
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Create an account to start learning or teaching</p>
        </div>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: '600', color: "var(--text)" }}>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
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
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: '600', color: "var(--text)" }}>Password</label>
            <input 
              placeholder="••••••••" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.8rem", fontSize: "1rem" }}>Create Account</button>
        </form>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: '0.9rem', color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login" style={{ fontWeight: "700", color: 'var(--primary)' }}>Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}