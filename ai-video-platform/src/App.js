import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import CourseDetails from "./pages/CourseDetails";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: '50px', height: '50px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  );

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/upload" element={user ? <UploadVideo /> : <Navigate to="/login" />} />
          <Route path="/upload/:id" element={user ? <UploadVideo /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/my-courses" element={user ? <MyCourses /> : <Navigate to="/login" />} />
          <Route path="/course/:id" element={user ? <CourseDetails /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;