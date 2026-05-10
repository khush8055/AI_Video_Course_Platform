import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList);
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mobile-stack">
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
            Explore Courses
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            <i className="fas fa-search"></i> Learn from the best AI-powered courses available today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border)' }}>
            <i className="fas fa-video"></i> {courses.length} Available
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", opacity: 0.3 }}><i className="fas fa-chalkboard-teacher"></i></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Courses Yet</h2>
          <p style={{ color: "var(--text-muted)", margin: '1rem auto 2.5rem', maxWidth: '350px' }}>Be the first to create a course on this platform!</p>
          <button onClick={() => navigate('/upload')} style={{ padding: '0.8rem 2.5rem' }}>
            <i className="fas fa-plus-circle"></i> Create First Course
          </button>
        </div>
      ) : (
        <div className="grid-responsive">
          {courses.map((course, i) => {
            const firstVideoId = course.videos ? course.videos[0]?.youtubeId : course.youtubeId;
            const fallbackThumb = firstVideoId 
              ? `https://img.youtube.com/vi/${firstVideoId}/hqdefault.jpg` 
              : "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
            const thumbnailUrl = course.thumbnail || fallbackThumb;

            return (
              <div 
                key={course.id} 
                className="card" 
                onClick={() => navigate(`/course/${course.id}`)}
                style={{ 
                  padding: "0", display: "flex", flexDirection: "column", animationDelay: `${i * 0.05}s`, 
                  cursor: "pointer", border: '1px solid var(--border)', overflow: 'hidden'
                }}
              >
                <div style={{ position: "relative", height: "180px", background: "var(--bg-subtle)" }}>
                  <img 
                    src={thumbnailUrl} 
                    alt={course.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.8)", color: '#fff', padding: "0.4rem 0.8rem", borderRadius: "6px", fontWeight: "800", fontSize: '0.85rem', backdropFilter: "blur(4px)" }}>
                    <i className="fas fa-tag"></i> {course.price > 0 ? `₹${course.price}` : "Free"}
                  </div>
                </div>

                <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.25rem", fontWeight: '800' }}>{course.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", flexGrow: 1, marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: '1.6' }}>
                    {course.description || "Learn the latest concepts and advance your career with this comprehensive video course."}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: "800", background: 'var(--bg-subtle)', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <i className="fas fa-book"></i> {course.videos ? `${course.videos.length} Modules` : "1 Module"}
                    </span>
                    <div style={{ color: "var(--primary)", fontWeight: "800", fontSize: '0.9rem', display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      Start <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;