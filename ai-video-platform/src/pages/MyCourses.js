import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const qPurchases = query(collection(db, "purchases"), where("userId", "==", user.uid));
        const purchaseSnapshot = await getDocs(qPurchases);
        const purchasedIds = purchaseSnapshot.docs.map(doc => doc.data().courseId);

        const unlockedCourses = allCourses.filter(course => 
          purchasedIds.includes(course.id) || course.creatorId === user.uid
        );
        
        setMyCourses(unlockedCourses);
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
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', opacity: 0.5 }}></i> My Learning
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Courses you've enrolled in or created yourself.
        </p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "40vh" }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : myCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", opacity: 0.3 }}><i className="fas fa-box-open"></i></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Courses Yet</h2>
          <p style={{ color: "var(--text-muted)", margin: '1rem auto 2.5rem', maxWidth: '350px' }}>Your learning dashboard is currently empty. Start exploring our world-class courses!</p>
          <button onClick={() => navigate("/dashboard")} style={{ padding: '0.8rem 2.5rem' }}>
            <i className="fas fa-search"></i> Explore Courses
          </button>
        </div>
      ) : (
        <div className="grid-responsive">
          {myCourses.map((course, i) => {
            const firstVideoId = course.videos ? course.videos[0]?.youtubeId : course.youtubeId;
            const fallbackThumb = firstVideoId 
              ? `https://img.youtube.com/vi/${firstVideoId}/hqdefault.jpg` 
              : "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
            const thumbnailUrl = course.thumbnail || fallbackThumb;
            const isCreator = course.creatorId === auth.currentUser?.uid;

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
                  <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: isCreator ? "var(--primary)" : "#10b981", color: "var(--bg)", padding: "0.3rem 0.8rem", borderRadius: "6px", fontWeight: "800", fontSize: "0.75rem", backdropFilter: 'blur(4px)' }}>
                    <i className={isCreator ? "fas fa-user-edit" : "fas fa-user-graduate"}></i> {isCreator ? "Author" : "Student"}
                  </div>
                </div>

                <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.25rem", fontWeight: '800' }}>{course.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    <i className="fas fa-layer-group"></i> {course.videos ? `${course.videos.length} Modules` : "0 Modules"}
                  </p>
                  
                  <div style={{ marginTop: "auto", color: "var(--primary)", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    {isCreator ? "Manage Content" : "Continue Learning"} <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
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

export default MyCourses;
