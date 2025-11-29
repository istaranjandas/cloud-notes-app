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
        const notesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        // Sort client-side to avoid Firestore index requirement
        const sortedNotes = notesData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
          return dateB - dateA; // Descending order (newest first)
        });
        setNotes(sortedNotes);
      });

      return () => unsubscribe();
    } else {
      setNotes([]); // Clear notes on logout
    }
  }, [user]);

  // 3. Handle Login
  const handleLogin = () => signInWithPopup(auth, googleProvider);

  // State for the "Opened" note modal
  const [selectedNote, setSelectedNote] = useState(null);

  // 4. Add a Note
  const addNote = async () => {
    if (!newNote.trim()) return;
    await addDoc(collection(db, "notes"), {
      text: newNote,
      uid: user.uid,
      createdAt: new Date()
    });
    setNewNote("");
  };

  // 5. Delete a Note
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  return (
    <div className="app-container">
      {/* Login State */}
      {!user ? (
        <div className="login-container">
          <h1>Notes</h1>
          <button onClick={handleLogin} className="btn-primary">
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="top-bar">
            <h1 className="app-title">Notes</h1>
            <div className="profile-section">
              <span className="user-name">{user.displayName}</span>
              <button onClick={() => signOut(auth)} className="btn-text">
                Log Out
              </button>
            </div>
          </header>

          <main className="main-content">
            {/* Input Section */}
            <div className="input-section">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note here..."
                className="note-input"
              />
              <button onClick={addNote} className="btn-save">
                Save
              </button>
            </div>

            {/* Saved Notes List */}
            <div className="notes-list-container">
              <div className="notes-list">
                {notes.map((note) => (
                  <div key={note.id} className="note-row">
                    <span className="note-preview">
                      {note.text.length > 50 ? note.text.substring(0, 50) + "..." : note.text}
                    </span>
                    <div className="row-actions">
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="btn-open"
                      >
                        Open
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="btn-delete-small"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="empty-state">No notes saved yet.</div>
                )}
              </div>
            </div>
          </main>

          {/* Note Modal (The "Open" View) */}
          {selectedNote && (
            <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div className="modal-meta">
                    <span className="modal-label">CREATED AT</span>
                    <span className="modal-date">
                      {selectedNote.createdAt?.toDate ? selectedNote.createdAt.toDate().toLocaleString() : ""}
                    </span>
                  </div>
                  <button onClick={() => setSelectedNote(null)} className="btn-close">
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>{selectedNote.text}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
