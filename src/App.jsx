import { useState, useEffect } from 'react';
import { auth, googleProvider, db, signInWithPopup, signOut } from './firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // 1. Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch notes ONLY for the logged-in user (real-time updates)
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "notes"),
        where("uid", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      return () => unsubscribe();
    } else {
      setNotes([]); // Clear notes on logout
    }
  }, [user]);

  // 3. Handle Login
  const handleLogin = () => signInWithPopup(auth, googleProvider);

  // 4. Add a Note
  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    await addDoc(collection(db, "notes"), {
      text: newNote,
      uid: user.uid
    });
    setNewNote("");
  };

  // 5. Delete a Note
  const deleteNote = (id) => deleteDoc(doc(db, "notes", id));

  return (
    <div className="container">
      <header className="header">
        <h1>☁️ My Cloud Notes</h1>
        <p className="subtitle">Your notes, everywhere you go</p>
      </header>

      {/* Login State */}
      {!user ? (
        <div className="login-section">
          <div className="login-card">
            <h2>Welcome!</h2>
            <p>Sign in with Google to access your notes from anywhere</p>
            <button onClick={handleLogin} className="login-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4" />
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853" />
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05" />
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="user-bar">
            <div className="user-info">
              {user.photoURL && (
                <img src={user.photoURL} alt="Profile" className="user-avatar" />
              )}
              <span className="user-name">{user.displayName}</span>
            </div>
            <button onClick={() => signOut(auth)} className="logout-button">
              Logout
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={addNote} className="note-form">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note and press Enter..."
              className="note-input"
            />
          </form>

          {/* List of Notes */}
          <div className="notes-container">
            {notes.length === 0 ? (
              <div className="empty-state">
                <p>📝 No notes yet. Start writing!</p>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <div key={note.id} className="note-card">
                    <p className="note-text">{note.text}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="delete-button"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
