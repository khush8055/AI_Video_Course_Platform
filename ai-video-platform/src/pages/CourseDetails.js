import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [activeTab, setActiveTab] = useState("notes"); // "notes" or "transcript"

  useEffect(() => {
    const fetchCourseData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const courseData = { id: docSnap.id, ...docSnap.data() };
          setCourse(courseData);
          
          const isCreator = courseData.creatorId === user.uid;
          const q = query(collection(db, "purchases"), where("userId", "==", user.uid), where("courseId", "==", id));
          const purchaseSnap = await getDocs(q);
          const unlocked = isCreator || !purchaseSnap.empty;
          setIsUnlocked(unlocked);

          if (unlocked) {
            const progressRef = doc(db, "progress", `${user.uid}_${id}`);
            const progressSnap = await getDoc(progressRef);
            if (progressSnap.exists()) {
              setCompletedModules(progressSnap.data().completed || []);
              if (progressSnap.data().lastWatched !== undefined) {
                setActiveVideoIndex(progressSnap.data().lastWatched);
              }
            }
          }
        } else {
          alert("Course not found!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, navigate]);

  const handleBuy = async () => {
    const user = auth.currentUser;
    if (course.price > 0) {
      if (!window.confirm(`Unlock "${course.title}" for ₹${course.price}?`)) return;
    }
    try {
      await setDoc(doc(db, "purchases", `${user.uid}_${course.id}`), {
        userId: user.uid,
        courseId: course.id,
        purchasedAt: new Date()
      });
      setIsUnlocked(true);
      alert("Course unlocked! 🔥");
    } catch (error) {
      alert("Purchase failed: " + error.message);
    }
  };

  const handleMarkComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const newCompleted = completedModules.includes(activeVideoIndex)
      ? completedModules.filter(index => index !== activeVideoIndex)
      : [...completedModules, activeVideoIndex];
    setCompletedModules(newCompleted);
    try {
      await setDoc(doc(db, "progress", `${user.uid}_${course.id}`), {
        userId: user.uid,
        courseId: course.id,
        completed: newCompleted,
        lastWatched: activeVideoIndex,
        lastUpdated: new Date()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving progress", error);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: "50vh" }}><div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;
  if (!course) return null;

  const videos = course.videos || [];
  const activeVideo = videos[activeVideoIndex] || {};
  const progressPercent = Math.round((completedModules.length / (videos.length || 1)) * 100);
  const isCreator = course.creatorId === auth.currentUser?.uid;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }} className="mobile-stack">
        <div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <i className="fas fa-layer-group"></i> {videos.length} Modules • {course.price > 0 ? `₹${course.price}` : 'Free Course'}
          </p>
        </div>
        {isCreator && (
          <button onClick={() => navigate(`/upload/${course.id}`)} style={{ background: 'var(--bg-subtle)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
            <i className="fas fa-edit"></i> Edit Course
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }} className="mobile-stack">
        <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
          {isUnlocked ? (
            <>
              <div style={{ background: "#000", borderRadius: "12px", overflow: "hidden", boxShadow: "var(--shadow-lg)", marginBottom: "2rem", aspectRatio: '16/9' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ display: "block" }}
                ></iframe>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", gap: '1.5rem' }} className="mobile-stack">
                <div className="card" style={{ padding: "1.25rem 1.5rem", flexGrow: 1, margin: 0 }}>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: '600' }}>
                     <span style={{ color: "var(--text-muted)" }}>Course Progress</span>
                     <span>{progressPercent}% Completed</span>
                   </div>
                   <div style={{ height: "6px", background: "var(--bg-subtle)", borderRadius: "3px", overflow: "hidden" }}>
                     <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--primary)", transition: 'width 0.5s ease' }}></div>
                   </div>
                </div>
                <button 
                  onClick={handleMarkComplete} 
                  style={{ 
                    background: completedModules.includes(activeVideoIndex) ? "var(--bg-subtle)" : "var(--primary)", 
                    border: `1px solid ${completedModules.includes(activeVideoIndex) ? "var(--border)" : "var(--primary)"}`, 
                    color: completedModules.includes(activeVideoIndex) ? "var(--text)" : "var(--bg)", 
                    padding: "0.8rem 1.5rem",
                    minWidth: '160px'
                  }}>
                  {completedModules.includes(activeVideoIndex) ? <><i className="fas fa-check-circle"></i> Completed</> : "Mark as Done"}
                </button>
              </div>

              <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: 'var(--bg-subtle)' }}>
                  <button 
                    onClick={() => setActiveTab("notes")}
                    style={{ 
                      flex: 1, padding: "1rem", background: activeTab === "notes" ? "var(--bg-card)" : "transparent",
                      border: "none", color: activeTab === "notes" ? "var(--primary)" : "var(--text-muted)",
                      borderRadius: 0, fontWeight: "700", fontSize: "0.9rem",
                      borderBottom: activeTab === "notes" ? "2px solid var(--primary)" : "none",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-book"></i> Learning Notes
                  </button>
                  <button 
                    onClick={() => setActiveTab("transcript")}
                    style={{ 
                      flex: 1, padding: "1rem", background: activeTab === "transcript" ? "var(--bg-card)" : "transparent",
                      border: "none", color: activeTab === "transcript" ? "var(--primary)" : "var(--text-muted)",
                      borderRadius: 0, fontWeight: "700", fontSize: "0.9rem",
                      borderBottom: activeTab === "transcript" ? "2px solid var(--primary)" : "none",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-closed-captioning"></i> Transcript
                  </button>
                </div>
                <div style={{ padding: "2rem", color: "var(--text)", whiteSpace: "pre-wrap", lineHeight: 1.8, minHeight: "300px", fontSize: '1rem' }}>
                  {activeTab === "notes" 
                    ? (activeVideo.notes || "No notes available for this module.") 
                    : (activeVideo.subtitles || "No transcript available for this module.")
                  }
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "5rem 2rem", background: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem", opacity: 0.5 }}><i className="fas fa-lock"></i></div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Unlock Premium Content</h2>
              <p style={{ color: "var(--text-muted)", margin: "1rem auto 2.5rem", maxWidth: '400px', fontSize: '1.1rem' }}>Get full access to all {videos.length} modules, AI-generated notes, and tracking features.</p>
              <button onClick={handleBuy} style={{ padding: "1rem 4rem", fontSize: '1.1rem' }}>
                {course.price > 0 ? `Enroll for ₹${course.price}` : "Enroll for Free"}
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 30%', minWidth: '300px' }} className="course-sidebar">
          <div className="card sidebar-inner" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800' }}>Course Content</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {videos.map((vid, i) => (
                <div 
                  key={i} 
                  onClick={() => isUnlocked && setActiveVideoIndex(i)} 
                  style={{ 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    cursor: isUnlocked ? "pointer" : "not-allowed", 
                    background: activeVideoIndex === i ? "var(--bg-subtle)" : "transparent", 
                    border: `1px solid ${activeVideoIndex === i ? "var(--primary)" : "var(--border)"}`, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "1rem",
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    width: "28px", 
                    height: "28px", 
                    borderRadius: "50%", 
                    background: activeVideoIndex === i ? "var(--primary)" : "var(--bg-subtle)", 
                    color: activeVideoIndex === i ? "var(--bg)" : "var(--text)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "0.85rem",
                    fontWeight: '700'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flexGrow: 1, fontSize: "0.95rem", fontWeight: activeVideoIndex === i ? '700' : '500' }}>
                    {vid.title}
                  </div>
                  {completedModules.includes(i) && (
                    <div style={{ color: "var(--accent)", background: 'var(--bg-subtle)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
