import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/pages/Insights.css";

const Insights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    document.title = "Insights - Patent Analyst Dashboard";
    const lastNoteId = localStorage.getItem(`lastNoteId_${userId}`);
    fetchNotes(lastNoteId);
  }, []);

  const fetchNotes = async (noteIdToSelect = null) => {
    try {
      const response = await axios.get(`${API_URL}/api/notes?userId=${userId}`);
    //   const response = await axios.get(`http://localhost:3001/api/notes?userId=${userId}`);
      setNotes(response.data.data);
      if (noteIdToSelect) {
        const noteToSelect = response.data.data.find((note) => note._id === noteIdToSelect);
        if (noteToSelect) {
          setSelectedNoteId(noteToSelect._id);
          setNoteTitle(noteToSelect.title);
          setCurrentNote(noteToSelect.content);
        }
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !currentNote.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const noteData = {
      userId,
      title: noteTitle,
      content: currentNote,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${API_URL}/api/notes`, noteData);
    //   const response = await axios.post("http://localhost:3001/api/notes", noteData);

      const newNote = response.data.data;
      toast.success("Note saved successfully");
      setSelectedNoteId(newNote._id);
      setNoteTitle(newNote.title);
      setCurrentNote(newNote.content);
      localStorage.setItem(`lastNoteId_${userId}`, newNote._id);
      fetchNotes(newNote._id);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNoteId) {
      toast.error("No note selected for update");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/api/notes/${selectedNoteId}`, {
    //   const response = await axios.put(`http://localhost:3001/api/notes/${selectedNoteId}`, {
        title: noteTitle,
        content: currentNote,
      });
      const updatedNote = response.data.data;
      toast.success("Note updated successfully");
      setNoteTitle(updatedNote.title);
      setCurrentNote(updatedNote.content);
      localStorage.setItem(`lastNoteId_${userId}`, selectedNoteId);
      fetchNotes(selectedNoteId);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`${API_URL}/api/notes/${noteId}`);
    //   await axios.delete(`http://localhost:3001/api/notes/${noteId}`);
    
      toast.success("Note deleted successfully");
      if (selectedNoteId === noteId) {
        setNoteTitle("");
        setCurrentNote("");
        setSelectedNoteId(null);
        localStorage.removeItem(`lastNoteId_${userId}`);
      }
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNoteId(note._id);
    setNoteTitle(note.title);
    setCurrentNote(note.content);
    localStorage.setItem(`lastNoteId_${userId}`, note._id);
  };

  const handleNewNote = () => {
    setNoteTitle("");
    setCurrentNote("");
    setSelectedNoteId(null);
    localStorage.removeItem(`lastNoteId_${userId}`);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }], // Add alignment options (left, center, right, justify)
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align", // Include align format
    "link",
  ];

  return (
    <div className="insights-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="insights-main">
        <h1 className="insights-title">Insights</h1>
        <div className="insights-content">
          <div className="notes-sidebar">
            <h2 className="notes-sidebar-title">Notes</h2>
            {notes.length === 0 ? (
              <p className="notes-empty">No notes yet.</p>
            ) : (
              <ol className="notes-list">
                {notes.map((note) => (
                  <li
                    key={note._id}
                    className={`notes-item ${selectedNoteId === note._id ? "notes-item-selected" : ""}`}
                    onClick={() => handleSelectNote(note)}
                  >
                    <div className="notes-item-content">
                      <span className="notes-item-title">{note.title}</span>
                      <button
                        className="notes-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <p className="notes-item-date">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="notes-editor">
            <input
              type="text"
              className="notes-title-input"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <ReactQuill
              theme="snow"
              value={currentNote}
              onChange={setCurrentNote}
              modules={quillModules}
              formats={quillFormats}
              className="notes-quill-editor"
              placeholder="Start typing your note here..."
            />
            <div className="notes-actions">
              <button
                className="action-button save-button"
                onClick={selectedNoteId ? handleUpdateNote : handleSaveNote}
              >
                {selectedNoteId ? "Update" : "Save"}
              </button>
              <button
                className="action-button new-note-button"
                onClick={handleNewNote}
              >
                New Note
              </button>
              <button
                className="action-button back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;