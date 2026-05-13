# AI Video Course Platform 🚀

A modern, high-performance AI-powered video learning platform designed for a premium student experience. Master any skill with AI-enhanced notes, dual-theme support, and a sleek modern interface.

![Preview of website](https://ai-video-platform-nine.vercel.app/) 

## ✨ Recent Successes & Features

- **🤖 Gemini 3 Flash Integration**: Successfully integrated the latest **Gemini 3 Flash Preview** model for lightning-fast AI note generation and transcript cleaning.
- **🎨 Dual-Theme Design**: Professional **Dark and Light mode** support with a persistent toggle and high-contrast accessibility.
- **🚩 Font Awesome Icons**: Replaced generic symbols with a comprehensive **Font Awesome 6** icon library across the entire platform.
- **🏠 Information-Rich Home Page**: A brand-new landing page featuring platform statistics, features, and an educational "How It Works" guide.
- **⚡ Unified Workflow**: A single command `npm run dev` now launches both the **React Frontend** and **Node.js Backend** concurrently.

## 🤖 AI-Powered Learning

Our platform uses the cutting-edge **Google Gemini API** to provide:
- **Clean Subtitles**: Automated fixing of grammar and removal of filler words from YouTube transcripts.
- **Smart Study Notes**: AI-generated summaries and detailed bullet points for every video module.
- **Key Takeaways**: Instant learning points to help students retain information faster.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [React Router 7](https://reactrouter.com/), [Font Awesome 6](https://fontawesome.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **AI Integration**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
- **Video Data**: [Youtube Transcript API](https://www.npmjs.com/package/youtube-transcript)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM or Yarn
- Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-video-platform.git
   cd ai-video-platform
   ```

2. **Install all dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Variables**:
   Update the `.env` file in the `server` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_key_here
   ```

4. **Start the Platform (Unified)**:
   ```bash
   # From the root directory
   npm run dev
   ```
   *This starts React on port 3000 and Node.js on port 5000.*

## 📂 Project Structure

```text
ai-video-platform/
├── server/              # Node.js Backend
│   ├── services/        # Gemini AI logic
│   ├── controllers/     # Transcript & Notes logic
│   └── index.js         # Express entry point
├── src/                 # React Frontend
│   ├── components/      # Reusable UI (Navbar, etc.)
│   ├── pages/           # Views (Home, Dashboard, Upload)
│   └── index.css        # Global Theme System (CSS Variables)
├── README.md            # You are here
└── package.json         # Concurrent scripts & root config
```

## 📜 Scripts

- `npm run dev`: **Recommended**. Starts both frontend and backend.
- `npm start`: Starts only the React frontend.
- `npm run server`: Starts only the Node.js backend.
- `npm run build`: Builds the production bundle.

---

