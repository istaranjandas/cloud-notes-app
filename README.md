# ☁️ My Cloud Notes App

A beautiful, serverless notes application built with React, Firebase, and modern web technologies.

## 🚀 Features

- ☁️ **Cloud Storage** - Notes saved in Firebase Firestore
- 🔐 **Google Sign-In** - Secure authentication with zero password management
- 🔄 **Real-time Sync** - Notes update instantly across all your devices
- 🎨 **Beautiful UI** - Modern design with animations and glassmorphism
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- 🔒 **Private** - Each user only sees their own notes

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Backend/Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth (Google Provider)
- **Styling**: Vanilla CSS with modern effects
- **Hosting**: Vercel-ready

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account
- Firebase account (free)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication** → **Google** sign-in provider
4. Create a **Firestore Database** (start in test mode)
5. Get your Firebase config from **Project Settings** → **Your apps**
6. Update `src/firebase.js` with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/)
3. Deploy with one click (Vercel auto-detects Vite)

### Or use Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🔒 Production Security

Update Firestore security rules before deploying:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null 
                          && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

## 📁 Project Structure

```
src/
├── firebase.js      # Firebase configuration
├── App.jsx          # Main application component
├── App.css          # Application styles
├── index.css        # Global styles
└── main.jsx         # Entry point
```

## 🎨 Design Features

- Vibrant gradient backgrounds
- Glassmorphism UI elements
- Smooth animations and transitions
- Google Material icons integration
- Inter font family from Google Fonts
- Responsive grid layout

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📝 License

MIT License - feel free to use this project however you'd like.

---

Built with ❤️ using React, Firebase, and Vite
