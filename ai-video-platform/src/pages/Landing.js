import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const Landing = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const q = query(collection(db, "courses"), limit(3));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(list);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCourses();
  }, []);

  return (
    <div className="landing-page" style={{ backgroundColor: '#ffffff', color: '#111827', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 5%', 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <div style={{ width: '24px', height: '24px', background: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </div>
          AI Video Course Platform
        </div>
        <Link to="/login" style={{ background: '#000', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Sign In</Link>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: '#f3f4f6', 
          padding: '0.4rem 1rem', 
          borderRadius: '9999px', 
          fontSize: '0.85rem', 
          fontWeight: '500',
          marginBottom: '2rem'
        }}>
          <span role="img" aria-label="sparkles">✨</span> AI-Powered Learning Platform
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Learn from the Best.<br />Teach with AI.
        </h1>
        <p style={{ color: '#4b5563', fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          An all-in-one platform where instructors upload courses, AI generates subtitles automatically, and students learn at their own pace with progress tracking.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: '#000', color: '#fff', padding: '1rem 2rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Browse Courses
          </button>
          <button 
            onClick={() => navigate('/upload')}
            style={{ background: '#fff', color: '#000', border: '1px solid #e5e7eb', padding: '1rem 2rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Become an Instructor
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: '#f9fafb', padding: '5rem 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', marginBottom: '3rem' }}>Platform Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Video Courses', desc: 'Upload and organize multi-video courses with ease.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
              { title: 'AI Subtitles', desc: 'Automatic subtitle generation powered by AI.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M7 8h10"/><path d="M7 12h10"/></svg> },
              { title: 'Progress Tracking', desc: 'Track completion and resume where you left off.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17l-6-6-4 4-5-5"/></svg> },
              { title: 'Video Player', desc: 'Built-in player with subtitle support.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> }
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <div style={{ color: '#000', marginBottom: '1rem', background: '#f9fafb', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ padding: '5rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Featured Courses</h2>
          <Link to="/dashboard" style={{ color: '#000', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading courses...</div>
        ) : courses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {courses.map(course => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div style={{ height: '200px', background: '#eee' }}>
                  <img 
                    src={course.thumbnail || `https://img.youtube.com/vi/${course.youtubeId || (course.videos && course.videos[0]?.youtubeId)}/hqdefault.jpg`} 
                    alt={course.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{course.price > 0 ? `₹${course.price}` : 'Free'}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <p style={{ fontSize: '1.1rem' }}>No courses available yet. Be the first to create one!</p>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section style={{ background: '#fff', padding: '5rem 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4rem' }}>How It Works</h2>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { num: '1', title: 'Create Course', desc: 'Instructors upload videos, set price, and add descriptions.' },
            { num: '2', title: 'AI Enhances', desc: 'Our AI automatically generates subtitles for all videos.' },
            { num: '3', title: 'Students Learn', desc: 'Students purchase, track progress, and resume anytime.' }
          ].map((step, i) => (
            <div key={i} style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: '#000', 
                color: '#fff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.5rem',
                fontWeight: '700'
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>{step.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 5%', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          AI Video Course Platform. Built with modern web technologies.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
