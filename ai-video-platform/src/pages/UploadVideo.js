import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

import { API_ENDPOINTS } from "../config";

const UploadVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState(""); 
  const [videos, setVideos] = useState([{ title: "", url: "", notes: "", subtitles: "" }]);
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "courses", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.creatorId !== auth.currentUser?.uid) {
              alert("You are not authorized to edit this course.");
              navigate("/dashboard");
              return;
            }
            setTitle(data.title || "");
            setDescription(data.description || "");
            setThumbnail(data.thumbnail || "");
            setPrice(data.price || "");
            const videoList = data.videos ? data.videos.map(v => ({
              title: v.title,
              url: v.videoUrl || `https://www.youtube.com/watch?v=${v.youtubeId}`,
              notes: v.notes || "",
              subtitles: v.subtitles || ""
            })) : [{ title: "", url: "", notes: "", subtitles: "" }];
            setVideos(videoList);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, navigate]);

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const generateAINotes = async (index) => {
    const vid = videos[index];
    if (!vid.url) {
      alert("Please enter a YouTube URL first.");
      return;
    }
    setGeneratingIndex(index);
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_NOTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: vid.url }),
      });
      const result = await response.json();
      if (result.success) {
        const { subtitles, notes, summary, keyPoints } = result.data;
        const formattedNotes = `[SUMMARY]\n${summary}\n\n[KEY TAKEAWAYS]\n${keyPoints.join("\n")}\n\n[DETAILED NOTES]\n${notes.join("\n")}`;
        handleVideoChange(index, "notes", formattedNotes);
        handleVideoChange(index, "subtitles", subtitles);
      } else {
        throw new Error(result.message || "Failed to generate notes");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Error: " + error.message);
    } finally {
      setGeneratingIndex(null);
    }
  };

  const handleAddVideo = () => {
    setVideos([...videos, { title: "", url: "", notes: "", subtitles: "" }]);
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedVideos = [];
    for (let i = 0; i < videos.length; i++) {
      const vid = videos[i];
      const videoId = getYouTubeID(vid.url);
      if (!videoId) {
        alert(`Please enter a valid YouTube URL for module ${i + 1}!`);
        return;
      }
      processedVideos.push({
        title: vid.title,
        youtubeId: videoId,
        notes: vid.notes,
        subtitles: vid.subtitles
      });
    }

    setLoading(true);
    try {
      const courseData = {
        title,
        description,
        thumbnail,
        price: Number(price) || 0,
        videos: processedVideos,
        creatorId: auth.currentUser.uid,
        updatedAt: new Date()
      };
      if (id) {
        await updateDoc(doc(db, "courses", id), courseData);
        alert("Course updated successfully! ✅");
      } else {
        courseData.createdAt = new Date();
        await addDoc(collection(db, "courses"), courseData);
        alert("Course published successfully! 🚀");
      }
      navigate("/dashboard");
    } catch (error) {
      alert("Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
            <i className="fas fa-edit" style={{ marginRight: '0.5rem', opacity: 0.5 }}></i>
            {id ? "Edit Course" : "Create New Course"}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Design and publish high-quality educational content.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--primary)' }}></i> Course Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Course Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master Advanced React" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell students what they will achieve..." rows="4" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Thumbnail URL</label>
                  <input type="text" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://unsplash.com/..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Price (INR)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0 for free" />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "2rem", fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-list-ol" style={{ color: 'var(--primary)' }}></i> Course Modules
            </h3>
            {videos.map((vid, index) => (
              <div key={index} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: index < videos.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }} className="mobile-stack">
                    <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>
                      <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>{index + 1}.</span> {vid.title || "New Module"}
                    </h4>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <button 
                        type="button" 
                        onClick={() => generateAINotes(index)} 
                        disabled={generatingIndex === index} 
                        style={{ 
                          padding: "0.5rem 1rem", 
                          fontSize: "0.85rem", 
                          background: "var(--bg-subtle)", 
                          color: "var(--primary)", 
                          fontWeight: "700",
                          border: '1px solid var(--border)'
                        }}>
                        {generatingIndex === index ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> AI Enhance</>}
                      </button>
                      {videos.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveVideo(index)} 
                          style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", width: '32px', height: '32px', padding: 0 }}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <input type="text" required value={vid.title} onChange={e => handleVideoChange(index, "title", e.target.value)} placeholder="Module Title" />
                  <input type="text" required value={vid.url} onChange={e => handleVideoChange(index, "url", e.target.value)} placeholder="YouTube Video Link" />
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: '700', color: "var(--text-muted)" }}>
                        <i className="fas fa-sticky-note"></i> Educational Notes
                      </label>
                      <textarea rows="6" value={vid.notes} onChange={e => handleVideoChange(index, "notes", e.target.value)} placeholder="AI will generate detailed notes..." style={{ fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: '700', color: "var(--text-muted)" }}>
                        <i className="fas fa-closed-captioning"></i> Video Transcript
                      </label>
                      <textarea rows="6" value={vid.subtitles} onChange={e => handleVideoChange(index, "subtitles", e.target.value)} placeholder="AI will extract the transcript..." style={{ fontSize: '0.9rem' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddVideo} 
              style={{ width: "100%", background: "var(--bg-subtle)", border: "1px dashed var(--border)", color: "var(--text)", fontWeight: '700', padding: '1rem' }}>
              <i className="fas fa-plus"></i> Add Another Module
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ padding: "1.25rem", fontSize: "1.1rem", borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-paper-plane"></i> {id ? "Update Course" : "Publish Course"}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;