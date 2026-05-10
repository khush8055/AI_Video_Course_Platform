import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8gEz58lpjuNWBVkoquEhgy14VpGba0Dk",
  authDomain: "ai-video-course-183b3.firebaseapp.com",
  projectId: "ai-video-course-183b3",
  storageBucket: "ai-video-course-183b3.appspot.com",
  messagingSenderId: "710152788482",
  appId: "1:710152788482:web:cb212b5b052f9e05bfe51b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);