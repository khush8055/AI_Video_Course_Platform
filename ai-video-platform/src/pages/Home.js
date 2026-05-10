import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const Home = () => {
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
    <div className="animate-fade-in" style={{ paddingBottom: '5rem', color: 'var(--text)' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 6rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          background: 'var(--bg-subtle)', 
          padding: '0.5rem 1.25rem', 
          borderRadius: '9999px', 
          fontSize: '0.85rem', 
          fontWeight: '600',
          marginBottom: '2.5rem',
          border: '1px solid var(--border)',
          color: 'var(--text)'
        }}>
          <i className="fas fa-magic" style={{ color: 'var(--accent)' }}></i> AI-Powered Educational Excellence
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>
          Master Any Skill.<br />Enhanced by AI.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem' }}>
          Welcome to the next generation of learning. Our platform combines expert-led video courses with advanced AI that generates subtitles and study notes automatically.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
          >
            <i className="fas fa-graduation-cap"></i> Start Learning
          </button>
          <button 
            onClick={() => navigate('/upload')}
            style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)', padding: '1rem 2.5rem', fontSize: '1.1rem' }}
          >
            <i className="fas fa-plus-circle"></i> Create Course
          </button>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="grid-responsive" style={{ maxWidth: '1000px', margin: '0 auto 6rem', padding: '0 1rem' }}>
        {[
          { label: 'AI-Powered Notes', value: '✨', icon: 'fa-brain' },
          { label: 'YouTube Integration', value: '▶', icon: 'fa-video' },
          { label: 'Progress Tracking', value: '📊', icon: 'fa-chart-line' },
          { label: 'Dark & Light Mode', value: '🌙', icon: 'fa-adjust' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '2rem', borderRight: '1px solid var(--border)' }} className="stat-card">
            <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}><i className={`fas ${stat.icon}`}></i></div>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>{stat.value}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Featured Courses Preview */}
      {!loading && courses.length > 0 && (
        <section style={{ marginBottom: '8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }} className="mobile-stack">
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Featured Courses</h2>
              <p style={{ color: 'var(--text-muted)' }}>Top-rated courses from our community.</p>
            </div>
            <Link to="/dashboard" style={{ fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="grid-responsive">
            {courses.map(course => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: '180px', background: 'var(--bg-subtle)' }}>
                  <img src={course.thumbnail || `https://img.youtube.com/vi/${course.videos?.[0]?.youtubeId}/hqdefault.jpg`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem' }}>{course.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{course.price > 0 ? `₹${course.price}` : 'Free'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>Why Choose Us?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>We combine cutting-edge technology with high-quality education to provide a seamless learning experience.</p>
        </div>
        <div className="grid-responsive">
          {[
            { title: 'AI Subtitle Magic', desc: 'No more manual transcribing. Our AI listens to your videos and creates perfect English subtitles in seconds.', icon: 'fa-closed-captioning' },
            { title: 'Smart Study Notes', desc: 'Automatically generated summaries and key takeaways help students retain information better and faster.', icon: 'fa-file-alt' },
            { title: 'Progress Guard', desc: 'Resume exactly where you left off. Our intelligent tracking keeps you on the right path to completion.', icon: 'fa-chart-line' },
            { title: 'Expert Dashboard', desc: 'Manage your courses, track earnings, and engage with students through a professional instructor suite.', icon: 'fa-desktop' }
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '2.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}><i className={`fas ${f.icon}`}></i></div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: 'var(--bg-subtle)', borderRadius: '24px', padding: '5rem 3rem', marginBottom: '6rem' }} className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem', color: 'var(--text)' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {[
            { step: '01', icon: 'fa-upload', title: 'Upload Your Knowledge', desc: 'Instructors can upload multiple video modules, set their own prices, and add detailed descriptions. It is your classroom, your rules.', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' },
            { step: '02', icon: 'fa-microchip', title: 'AI Processing', desc: 'Once uploaded, our AI engine (Gemini) analyzes the content to generate transcripts and educational notes, making it accessible to everyone.', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
            { step: '03', icon: 'fa-user-graduate', title: 'Global Learning', desc: 'Students browse through high-quality courses, enroll in seconds, and start their journey with full tracking and interactive notes.', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', flexWrap: 'wrap' }} className="mobile-stack">
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', opacity: 0.2, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.step} <i className={`fas ${item.icon}`} style={{ fontSize: '2rem' }}></i>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text)' }}>{item.title}</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>{item.desc}</p>
              </div>
              <div style={{ flex: '1 1 300px', height: '300px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>Ready to start your journey?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Join thousands of students and instructors on the platform.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }} className="mobile-stack">
          <button onClick={() => navigate('/dashboard')} style={{ padding: '1rem 3rem' }}>Explore Courses</button>
          <button onClick={() => navigate('/signup')} style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)', padding: '1rem 3rem' }}>Sign Up Now</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
