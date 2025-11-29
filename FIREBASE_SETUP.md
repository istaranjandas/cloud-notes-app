# Firebase Setup Guide

This guide will walk you through setting up Firebase for your Notes App.

## Step 1: Create Firebase Project

1. Go to https://firebase.google.com/
2. Click **"Go to Console"**
3. Click **"Add Project"**
4. Enter project name: `my-notes-app` (or your preferred name)
5. Disable Google Analytics (optional)
6. Click **"Create Project"**
7. Wait for setup to complete

## Step 2: Enable Authentication

1. In Firebase Console, click **"Build"** in sidebar
2. Click **"Authentication"**
3. Click **"Get Started"**
4. Click on **"Google"** provider
5. Toggle the **"Enable"** switch
6. Enter a support email (your email address)
7. Click **"Save"**

## Step 3: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create Database"**
3. Select a location (choose closest to your users):
   - `us-central` for North America
   - `europe-west` for Europe
   - `asia-south` for Asia
4. **Important**: Select **"Start in test mode"**
   - This allows read/write for development
   - We'll secure it later before production
5. Click **"Enable"**

## Step 4: Get Your Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project Settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>`
5. Enter app nickname: `Notes Web App`
6. **Don't** check "Set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the `firebaseConfig` object

It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-notes-app-12345.firebaseapp.com",
  projectId: "my-notes-app-12345",
  storageBucket: "my-notes-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 5: Update Your Code

1. Open `src/firebase.js` in your code editor
2. Replace the placeholder config with your actual config
3. Save the file

## Step 6: Test Your Setup

1. Run `npm run dev` (if not already running)
2. Open http://localhost:5173
3. Click **"Sign in with Google"**
4. Choose your Google account
5. You should be logged in!
6. Try creating a note

## Security Rules for Production

**Important**: Before deploying to production, update your Firestore security rules!

1. In Firebase Console, go to **Firestore Database**
2. Click the **"Rules"** tab
3. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // Allow users to read only their own notes
      allow read: if request.auth != null 
                   && request.auth.uid == resource.data.uid;
      
      // Allow users to create notes with their own UID
      allow create: if request.auth != null 
                     && request.auth.uid == request.resource.data.uid;
      
      // Allow users to update/delete only their own notes
      allow update, delete: if request.auth != null 
                              && request.auth.uid == resource.data.uid;
    }
  }
}
```

4. Click **"Publish"**

These rules ensure:
- Users must be authenticated
- Users can only access their own notes
- Notes are tied to the user's UID

## Troubleshooting

### "Permission Denied" Error
- Make sure Firestore is in "Test Mode" for development
- Or ensure security rules allow your operation
- Check if user is properly authenticated

### "Firebase Config Not Found"
- Verify you've updated `src/firebase.js`
- Check that all fields in firebaseConfig are filled
- Restart the dev server after updating config

### Sign-in Popup Blocked
- Allow popups for localhost:5173 in your browser
- Or use a different browser

### Notes Not Appearing
- Open browser DevTools (F12) and check Console for errors
- Verify Firestore database was created properly
- Check that authentication is working

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

---

Need help? Check the console logs in your browser (F12 → Console) for detailed error messages.
